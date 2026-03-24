
import { VoiceId } from '../types.js';


/**
 * Stem configuratie mapping naar ElevenLabs IDs
 */
const VOICE_MAPPING: Record<VoiceId, string> = {
  erik: '60CwgZt94Yf7yYIXMDDe',      // Heel rustig en veilig
  samuel: 'DUhjXXCXHQWckglMUnOv',    // Fris en jong
  rolf: 'lyMhRNSScIYS9YRQitfK',      // Radiocommercial stem
  emma: 'yO6w2xlECAQRFP6pX7Hw',      // Warm en zakelijk
  marjan: 'tfweP7lGJyLeNV9dH1Rm',    // Heldere vrouwenstem
};

const getSettingsForTone = (tone: string = "", gender: 'Male' | 'Female' = 'Male') => {
  const t = tone.toLowerCase();
  let settings;
  
  if (t.includes('luid') || t.includes('energiek') || t.includes('krachtig') || t.includes('enthousiast')) {
    settings = { stability: 0.35, style: 0.60, similarity_boost: 0.80 };
  } else if (t.includes('serieus') || t.includes('rustig') || t.includes('kalm')) {
    settings = { stability: 0.75, style: 0.10, similarity_boost: 0.75 };
  } else {
    settings = { stability: 0.50, style: 0.35, similarity_boost: 0.75 };
  }

  // Vrouwenstem correctie
  if (gender === 'Female') {
    settings.stability = Math.min(settings.stability + 0.20, 0.85);
    settings.style = Math.max(settings.style - 0.15, 0.05);
  }

  return settings;
};

export const generateSpeech = async (
  text: string, 
  voiceId: VoiceId, 
  tone: string = ""
) => {
  const elevenId = VOICE_MAPPING[voiceId];
  const gender = (voiceId === 'emma' || voiceId === 'marjan') ? 'Female' : 'Male';
  
  const settings = getSettingsForTone(tone, gender);

  // Specifieke stem-aanpassingen o.b.v. feedback
  if (voiceId === 'erik') {
    settings.stability = 0.85; // Extra veilig/rustig
  }
  if (voiceId === 'samuel') {
    settings.stability = 0.45; // Iets meer variatie voor "fris en jong"
  }
  if (voiceId === 'rolf') {
    settings.stability = 0.65; // Rustiger, meer gemeten delivery — niet gehaast
    settings.similarity_boost = 0.90; // Karaktervastheid en volume-indruk
  }
  if (voiceId === 'marjan') {
    settings.similarity_boost = 0.90; // Meer karaktervastheid en volume-indruk
  }
  
  // Tekst verrijking
  let processedText = text;
  
  if (tone.toLowerCase().includes('luid')) {
    processedText = processedText.replace(/\./g, '!');
  }

  if (gender === 'Female') {
    processedText = processedText
      .replace(/\. /g, '... ')
      .replace(/\? /g, '?... ')
      .replace(/! /g, '!... ');
  }

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: processedText,
        voiceId: elevenId,
        modelId: 'eleven_multilingual_v2',
        voiceSettings: { ...settings, use_speaker_boost: true },
      }),
    });

    
    if (!response.ok) throw new Error("Fout bij spraakgeneratie");
    return await response.blob();
  } catch (e: any) {
    console.error(`[ElevenLabs] Error:`, e.message);
    throw e;
  }
};
