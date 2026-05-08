
import { generateSpeech } from './elevenLabsService.js';
import { Duration, MusicCategory, VoiceId } from '../types.js';

const RADIO_INTRO_PATH = '/audio/06-Pingel.wav';

/**
 * Mapping van categorie → base filename per duur.
 * Bestandsnamen komen exact overeen met public/audio/.
 */
const MUSIC_BEDS: Record<string, Record<string, string>> = {
  "calm": {
    "5s":  "/audio/01_CALM _SLEEPY_(05).mp3",
    "10s": "/audio/01_CALM _SLEEPY_(10).mp3",
    "15s": "/audio/01_CALM _SLEEPY_(15).mp3",
    "20s": "/audio/01_CALM _SLEEPY_(20).mp3",
  },
  "inspirational": {
    "5s":  "/audio/02_INSPIRATIONAL_(5).mp3",
    "10s": "/audio/02_INSPIRATIONAL_(10).mp3",
    "15s": "/audio/02_INSPIRATIONAL_(15).mp3",
    "20s": "/audio/02_INSPIRATIONAL_(20).mp3",
  },
  "regular": {
    "5s":  "/audio/03_REGULAR_HOLIDAY_(5).mp3",
    "10s": "/audio/03_REGULAR_HOLIDAY_(10).mp3",
    "15s": "/audio/03_REGULAR_HOLIDAY_(15).mp3",
    "20s": "/audio/03_REGULAR_HOLIDAY_(20).mp3",
  },
  "happy": {
    "5s":  "/audio/04_HAPPY_KLEDING_(5).mp3",
    "10s": "/audio/04_HAPPY_KLEDING_(10).mp3",
    "15s": "/audio/04_HAPPY_KLEDING_(15).mp3",
    "20s": "/audio/04_HAPPY_KLEDING_(20).mp3",
  },
  "stoer": {
    "5s":  "/audio/05 _STOER _AUTO_(5).mp3",
    "10s": "/audio/05 _STOER _AUTO_(10).mp3",
    "15s": "/audio/05 _STOER _AUTO_(15).mp3",
    "20s": "/audio/05 _STOER _AUTO_(20).mp3",
  },
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
    duration: Duration,
    toneOfVoice: string = "",
    authToken?: string | null
): Promise<SpotAssets> => {
  const normalizedCategory = (musicCategory || 'Regular').toLowerCase().trim();
  const categoryBeds = MUSIC_BEDS[normalizedCategory] || MUSIC_BEDS["regular"];
  const musicPath = categoryBeds[duration] || categoryBeds["10s"];
  console.log(`[RadioProduction] 🎵 Bed: ${normalizedCategory} @ ${duration} → ${musicPath}`);

  const cleanText = scriptContent
    .replace(/^(?:VO:|Voice-Over:)/i, '')
    .replace(/\[(SFX|FX|MUSIC):.*?\]/gi, '')
    .trim();

  // Parallel: fetch music bed + generate speech (pingel overgeslagen)
  const [musicBlobUrl, speechBlob] = await Promise.all([
    fetchAsBlobUrl(musicPath, `Muziekbedje: ${normalizedCategory}`),
    generateSpeech(cleanText, voiceId, toneOfVoice, authToken)
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

