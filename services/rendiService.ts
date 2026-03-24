
import { SpotAssets } from './audioProductionService.js';

export interface SpotPlayer {
  play: () => void;
  stop: () => void;
  onEnded: (cb: () => void) => void;
}

/**
 * Maakt een <audio> element van een blob URL.
 * Probeert te wachten op canplaythrough, valt terug op een timeout.
 */
const createAudioEl = (blobUrl: string, volume: number): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const el = new Audio();
    el.preload = 'auto';
    el.crossOrigin = 'anonymous';
    el.volume = Math.min(1, Math.max(0, volume));
    let resolved = false;

    const done = () => {
      if (resolved) return;
      resolved = true;
      console.log(`[Rendi] ✅ Audio klaar: readyState=${el.readyState}, duration=${el.duration}, src=${blobUrl.substring(0, 60)}`);
      resolve(el);
    };

    const fail = (reason: string) => {
      if (resolved) return;
      resolved = true;
      console.error(`[Rendi] ❌ Audio fout (${reason}): src=${blobUrl.substring(0, 60)}`);
      reject(new Error(reason));
    };

    el.addEventListener('canplaythrough', done, { once: true });
    el.addEventListener('canplay', done, { once: true });
    el.addEventListener('loadeddata', () => {
      // Geef het nog 100ms na loadeddata
      setTimeout(done, 100);
    }, { once: true });
    el.addEventListener('error', () => fail(`MediaError code=${el.error?.code}`), { once: true });

    // Fallback: als na 5s nog geen event gevuurd is
    setTimeout(() => {
      if (!resolved) {
        if (el.readyState >= 2) {
          done(); // readyState HAVE_CURRENT_DATA of hoger → goed genoeg
        } else {
          fail('Timeout (5s)');
        }
      }
    }, 5000);

    el.src = blobUrl;
    el.load();
  });
};

/**
 * Speelt een radiospot af als multi-track sequence:
 * 1. Intro pingel
 * 2. 0.5s pauze
 * 3. Muziekbed + spraak tegelijk
 * 4. 1.5s na spraak einde → stop
 */
export const createSpotPlayer = (assets: SpotAssets, playbackRate: number = 1.0): SpotPlayer => {
  let stopped = false;
  let endCb: (() => void) | null = null;
  const els: HTMLAudioElement[] = [];
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  const cleanup = () => {
    timeouts.forEach(clearTimeout);
    els.forEach(el => { el.pause(); el.currentTime = 0; });
  };

  const play = async () => {
    try {
      console.log(`[Rendi] Loading assets...`);
      console.log(`[Rendi]   intro: ${assets.introBlobUrl?.substring(0, 50) || 'none'}`);
      console.log(`[Rendi]   music: ${assets.musicBlobUrl?.substring(0, 50) || 'none'}`);
      console.log(`[Rendi]   speech: ${assets.speechBlobUrl.substring(0, 50)}`);

      const results = await Promise.allSettled([
        assets.introBlobUrl ? createAudioEl(assets.introBlobUrl, 1.0) : Promise.reject('no url'),
        assets.musicBlobUrl ? createAudioEl(assets.musicBlobUrl, assets.musicVolume) : Promise.reject('no url'),
        createAudioEl(assets.speechBlobUrl, 1.0),
      ]);

      const introEl = results[0].status === 'fulfilled' ? results[0].value : null;
      const musicEl = results[1].status === 'fulfilled' ? results[1].value : null;
      const speechEl = results[2].status === 'fulfilled' ? results[2].value : null;

      if (results[0].status === 'rejected' && assets.introBlobUrl) console.warn('[Rendi] Intro load failed:', results[0].reason);
      if (results[1].status === 'rejected' && assets.musicBlobUrl) console.warn('[Rendi] Music load failed:', results[1].reason);
      if (results[2].status === 'rejected') console.error('[Rendi] Speech load failed:', results[2].reason);

      console.log(`[Rendi] Geladen: intro=${!!introEl}, music=${!!musicEl}, speech=${!!speechEl}`);

      if (stopped || !speechEl) {
        if (!speechEl) console.error('[Rendi] Geen spraak geladen, kan niet afspelen');
        return;
      }

      if (introEl) els.push(introEl);
      if (musicEl) els.push(musicEl);
      els.push(speechEl);

      speechEl.playbackRate = playbackRate;

      const startMainContent = () => {
        if (stopped) return;
        console.log("[Rendi] ▶ Muziekbed + spraak");
        if (musicEl) musicEl.play().catch(e => console.warn("[Rendi] Music play:", e.message));
        speechEl.play().catch(e => console.error("[Rendi] Speech play:", e.message));

        speechEl.onended = () => {
          if (stopped) return;
          console.log("[Rendi] ✅ Spraak klaar");
          const t = setTimeout(() => {
            if (stopped) return;
            cleanup();
            if (endCb) endCb();
          }, 1500);
          timeouts.push(t);
        };
      };

      if (introEl) {
        console.log("[Rendi] ▶ Intro pingel");
        introEl.onended = () => {
          if (stopped) return;
          const t = setTimeout(startMainContent, 500);
          timeouts.push(t);
        };
        await introEl.play();
      } else {
        startMainContent();
      }
    } catch (e: any) {
      console.error("[Rendi] Fout:", e.message);
      cleanup();
      if (endCb) endCb();
    }
  };

  return {
    play,
    stop: () => { stopped = true; cleanup(); },
    onEnded: (cb) => { endCb = cb; },
  };
};
