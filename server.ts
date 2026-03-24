import 'dotenv/config';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { supabase } from "./services/supabaseClient.js";
import { enhanceBriefing } from "./services/geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve audio files explicitly (before Vite middleware)
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp3')) res.setHeader('Content-Type', 'audio/mpeg');
    if (filePath.endsWith('.wav')) res.setHeader('Content-Type', 'audio/wav');
  }
}));

// Password Verification Route
app.post("/api/verify-password", (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.APP_PASSWORD;
  const guestPassword = process.env.APP_PASSWORD_GUEST;
  
  if (!correctPassword) {
    // If no password is set in .env, allow access (or you could deny it)
    return res.json({ success: true });
  }

  const validPasswords = [correctPassword, guestPassword].filter(Boolean);
  
  if (validPasswords.includes(password)) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Onjuist wachtwoord" });
  }
});

// API Routes
app.get("/api/briefings", async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch briefings", details: error.message });
  }
});

app.post("/api/briefings", async (req, res) => {
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
    res.status(500).json({ error: "Failed to save briefing", details: error.message });
  }
});

app.delete("/api/briefings/:id", async (req, res) => {
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
    res.status(500).json({ error: "Failed to delete briefing", details: error.message });
  }
});

// Templates Routes
app.get("/api/templates", async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch templates", details: error.message });
  }
});

app.post("/api/templates", async (req, res) => {
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
    res.status(500).json({ error: "Failed to save template", details: error.message });
  }
});

app.delete("/api/templates/:id", async (req, res) => {
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
    res.status(500).json({ error: "Failed to delete template", details: error.message });
  }
});

// AI Enhance Briefing
app.post("/api/enhance", async (req, res) => {
  try {
    const improved = await enhanceBriefing(req.body);
    res.json(improved);
  } catch (error: any) {
    console.error("Error enhancing briefing:", error.message || error);
    res.status(500).json({ error: "Failed to enhance briefing", details: error.message });
  }
});

async function setupVite() {
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
