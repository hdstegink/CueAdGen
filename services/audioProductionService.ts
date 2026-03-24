
import { generateSpeech } from './elevenLabsService';
import { MusicCategory, VoiceId } from '../types';

const RADIO_INTRO_PATH = '/audio/06-Pingel.wav';

const MUSIC_BEDS: Record<string, string> = {
  "calm": "/audio/01_CALM_SLEEPY.mp3",
  "inspirational": "/audio/02_INSPIRATIONAL.mp3",
  "regular": "/audio/03_REGULAR_HOLIDAY.mp3",
  "happy": "/audio/04_HAPPY_KLEDING.mp3",
  "stoer": "/audio/05_STOER_AUTO.mp3"
};

const blobUrlCache: Record<string, string> = {};

/**
 * Haalt een audiobestand op via fetch() en maakt er een blob URL van.
 * Blob URLs werken wél met <audio> in Simple Browser, directe paden niet.
 */
const fetchAsBlobUrl = async (path: string, label: string): Promise<string | null> => {
  if (blobUrlCache[path]) return blobUrlCache[path];

  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`[AudioFetch] ⚠️ '${label}' HTTP ${response.status}`);
      return null;
    }
    const rawBlob = await response.blob();
    if (rawBlob.size < 1000) {
      console.warn(`[AudioFetch] ⚠️ '${label}' overgeslagen (${rawBlob.size}B)`);
      return null;
    }
    // Forceer correct MIME type
    const mimeType = path.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg';
    const blob = new Blob([rawBlob], { type: mimeType });
    const url = URL.createObjectURL(blob);
    console.log(`[AudioFetch] ✅ '${label}': ${(blob.size/1024).toFixed(1)}KB → ${url}`);
    blobUrlCache[path] = url;
    return url;
  } catch (e: any) {
    console.error(`[AudioFetch] ❌ '${label}':`, e.message);
    return null;
  }
};

export interface SpotAssets {
  introBlobUrl: string | null;
  musicBlobUrl: string | null;
  speechBlobUrl: string;
  musicVolume: number;
}

export const produceRadioSpot = async (
    scriptContent: string, 
    voiceId: VoiceId, 
    musicCategory: MusicCategory,
    toneOfVoice: string = ""
): Promise<SpotAssets> => {
  const normalizedCategory = (musicCategory || 'Regular').toLowerCase().trim();
  const musicPath = MUSIC_BEDS[normalizedCategory] || MUSIC_BEDS["regular"];

  const cleanText = scriptContent
    .replace(/^(?:VO:|Voice-Over:)/i, '')
    .replace(/\[(SFX|FX|MUSIC):.*?\]/gi, '')
    .trim();

  // Parallel: fetch music bed + generate speech (pingel overgeslagen)
  const [musicBlobUrl, speechBlob] = await Promise.all([
    fetchAsBlobUrl(musicPath, `Muziekbedje: ${normalizedCategory}`),
    generateSpeech(cleanText, voiceId, toneOfVoice)
  ]);

  const speechBlobUrl = URL.createObjectURL(speechBlob);
  console.log(`[RadioProduction] ✅ Speech: ${(speechBlob.size/1024).toFixed(1)}KB`);

  return {
    introBlobUrl: null,
    musicBlobUrl,
    speechBlobUrl,
    musicVolume: 0.09,
  };
};

