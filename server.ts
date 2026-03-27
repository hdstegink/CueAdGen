import 'dotenv/config';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import crypto from "crypto";
import { supabase } from "./services/supabaseClient.js";
import { enhanceBriefing, runResearcherAgent, retrieveRelevantExamples, runCopywriterAgent } from "./services/geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// --- Signed token auth (stateless, works on serverless) ---
// Use a stable secret — must be the same across all serverless invocations
const TOKEN_SECRET = process.env.APP_PASSWORD || process.env.SUPABASE_KEY || process.env.OPENAI_API_KEY || 'fallback-replace-me';
if (TOKEN_SECRET === 'fallback-replace-me') {
  console.warn('[Auth] WARNING: No stable env var found for TOKEN_SECRET. Set APP_PASSWORD in environment.');
}

function signToken(): string {
  const payload = Buffer.from(JSON.stringify({ iat: Date.now() })).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  if (signature !== expected) return false;
  // Check token age (max 24 hours)
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return Date.now() - data.iat < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

// --- Security: Helmet-style headers ---
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// --- Security: Restrict CORS ---
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [`http://localhost:${PORT}`];
// On Vercel, also allow the auto-generated deployment URLs
if (process.env.VERCEL_URL && !allowedOrigins.includes(`https://${process.env.VERCEL_URL}`)) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}
if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  const prodUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (!allowedOrigins.includes(prodUrl)) allowedOrigins.push(prodUrl);
}
app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin requests (no origin header) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Reject but don't crash — return false instead of Error
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

// --- Security: Rate limiting (in-memory, per IP) ---
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 100;

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Te veel verzoeken. Probeer het later opnieuw.' });
  }
  next();
}

// Clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetTime) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

app.use('/api/', rateLimit);

// --- Auth middleware ---
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Niet geautoriseerd. Log opnieuw in.' });
  }
  next();
}

// Serve audio files explicitly (before Vite middleware)
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp3')) res.setHeader('Content-Type', 'audio/mpeg');
    if (filePath.endsWith('.wav')) res.setHeader('Content-Type', 'audio/wav');
  }
}));

// Password Verification Route (public — no auth required)
app.post("/api/verify-password", (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.APP_PASSWORD;
  const guestPassword = process.env.APP_PASSWORD_GUEST;
  
  if (!correctPassword) {
    const token = signToken();
    return res.json({ success: true, token });
  }

  const validPasswords = [correctPassword, guestPassword].filter(Boolean);
  
  if (validPasswords.includes(password)) {
    const token = signToken();
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "Onjuist wachtwoord" });
  }
});

// API Routes — all require auth
app.get("/api/briefings", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("briefings")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      // If table doesn't exist, return empty array instead of 500
      if (
        error.code === 'PGRST116' || 
        error.message?.includes('relation "briefings" does not exist') ||
        error.message?.includes("Could not find the table 'public.briefings'")
      ) {
        console.warn("Table 'briefings' does not exist in Supabase. Returning empty list.");
        return res.json([]);
      }
      console.error("Supabase error fetching briefings:", JSON.stringify(error, null, 2));
      throw error;
    }

    res.json(data.map(row => ({
      ...row,
      input_data: typeof row.input_data === 'string' ? JSON.parse(row.input_data) : row.input_data,
      passport: typeof row.passport === 'string' ? JSON.parse(row.passport) : row.passport,
      scripts: typeof row.scripts === 'string' ? JSON.parse(row.scripts) : row.scripts
    })));
  } catch (error: any) {
    console.error("Error fetching briefings:", error.message || error);
    res.status(500).json({ error: "Failed to fetch briefings" });
  }
});

app.post("/api/briefings", requireAuth, async (req, res) => {
  const { id, input_data, passport, scripts } = req.body;
  try {
    const { error } = await supabase
      .from("briefings")
      .upsert({
        id,
        input_data,
        passport,
        scripts,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error("Supabase error saving briefing:", JSON.stringify(error, null, 2));
      throw error;
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error saving briefing:", error.message || error);
    res.status(500).json({ error: "Failed to save briefing" });
  }
});

app.delete("/api/briefings/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from("briefings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error deleting briefing:", JSON.stringify(error, null, 2));
      throw error;
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting briefing:", error.message || error);
    res.status(500).json({ error: "Failed to delete briefing" });
  }
});

// Templates Routes
app.get("/api/templates", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      // If table doesn't exist, return empty array instead of 500
      if (
        error.code === 'PGRST116' || 
        error.message?.includes('relation "templates" does not exist') ||
        error.message?.includes("Could not find the table 'public.templates'")
      ) {
        console.warn("Table 'templates' does not exist in Supabase. Returning empty list.");
        return res.json([]);
      }
      console.error("Supabase error fetching templates:", JSON.stringify(error, null, 2));
      throw error;
    }
    res.json(data);
  } catch (error: any) {
    console.error("Error fetching templates:", error.message || error);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

app.post("/api/templates", requireAuth, async (req, res) => {
  const { id, label, data } = req.body;
  try {
    const { error } = await supabase
      .from("templates")
      .upsert({ id, label, data, timestamp: new Date().toISOString() });

    if (error) {
      console.error("Supabase error saving template:", JSON.stringify(error, null, 2));
      throw error;
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error saving template:", error.message || error);
    res.status(500).json({ error: "Failed to save template" });
  }
});

app.delete("/api/templates/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from("templates")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error deleting template:", JSON.stringify(error, null, 2));
      throw error;
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting template:", error.message || error);
    res.status(500).json({ error: "Failed to delete template" });
  }
});

// Email Proxy — keeps Postmark API key server-side
app.post("/api/email", requireAuth, async (req, res) => {
  try {
    const { to, subject, htmlBody, bcc } = req.body;
    if (!to || !subject || !htmlBody) {
      return res.status(400).json({ error: 'Missing to, subject, or htmlBody' });
    }
    const apiKey = process.env.POSTMARK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'POSTMARK_API_KEY not configured' });
    }
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': apiKey,
      },
      body: JSON.stringify({
        From: 'almer@sokkenmakers.nl',
        To: to,
        Bcc: bcc || undefined,
        Subject: subject,
        HtmlBody: htmlBody,
        MessageStream: 'broadcast',
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Postmark Error]', errorData);
      return res.status(response.status).json({ error: errorData.Message || 'Postmark error', details: errorData });
    }
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Email proxy error:', error.message || error);
    res.status(500).json({ error: 'Email sending failed' });
  }
});

// TTS Proxy — keeps ElevenLabs API key server-side
app.post("/api/tts", requireAuth, async (req, res) => {
  try {
    const { text, voiceId, modelId, voiceSettings } = req.body;
    if (!text || !voiceId) {
      return res.status(400).json({ error: 'Missing text or voiceId' });
    }
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'ELEVENLABS_API_KEY not configured' });
    }
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: modelId || 'eleven_multilingual_v2',
        voice_settings: voiceSettings || { stability: 0.5, similarity_boost: 0.75, use_speaker_boost: true },
      }),
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error('[TTS Proxy] ElevenLabs error:', response.status, errorData);
      return res.status(response.status).json({ error: 'ElevenLabs API error', details: errorData });
    }
    const arrayBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('TTS proxy error:', error.message || error);
    res.status(500).json({ error: 'TTS generation failed' });
  }
});

// AI Enhance Briefing
app.post("/api/enhance", requireAuth, async (req, res) => {
  try {
    const improved = await enhanceBriefing(req.body);
    res.json(improved);
  } catch (error: any) {
    console.error("Error enhancing briefing:", error.message || error);
    res.status(500).json({ error: "Failed to enhance briefing" });
  }
});

// AI Researcher Agent — runs server-side, no key exposed to client
app.post("/api/researcher", requireAuth, async (req, res) => {
  try {
    const passport = await runResearcherAgent(req.body);
    res.json(passport);
  } catch (error: any) {
    console.error("Error in researcher agent:", error.message || error);
    res.status(500).json({ error: "Researcher agent failed" });
  }
});

// AI Copywriter Agent — runs server-side, no key exposed to client
app.post("/api/copywriter", requireAuth, async (req, res) => {
  try {
    const { input, passport, examples } = req.body;
    const scripts = await runCopywriterAgent(input, passport, examples);
    res.json(scripts);
  } catch (error: any) {
    console.error("Error in copywriter agent:", error.message || error);
    res.status(500).json({ error: "Copywriter agent failed" });
  }
});

// RAG retrieval (lightweight, but still auth-protected)
app.post("/api/retrieve-examples", requireAuth, (req, res) => {
  try {
    const examples = retrieveRelevantExamples(req.body);
    res.json(examples);
  } catch (error: any) {
    console.error("Error retrieving examples:", error.message || error);
    res.status(500).json({ error: "Failed to retrieve examples" });
  }
});

async function setupVite() {
  if (process.env.VERCEL) return;
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    // Only serve static files if NOT on Vercel (e.g. local production test)
    // Vercel handles static files via rewrites in vercel.json
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite();

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
