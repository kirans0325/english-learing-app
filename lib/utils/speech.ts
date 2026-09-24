/**
 * Audio Synthesis Utility: The Philosopher Android AI Voice
 *
 * Emulates the signature "The Philosopher Android" AI persona:
 * - Velvety, smooth baritone timbre (pitch calibrated to 0.88 - 0.90)
 * - Cultured, deliberate, contemplative articulation
 * - Intelligent voice selection prioritizing Android / Google neural & cultured male voices
 */

let cachedVoice: SpeechSynthesisVoice | null = null;
let voiceResolvingPromise: Promise<SpeechSynthesisVoice | null> | null = null;

/**
 * Searches and ranks available system voices to find the best match for
 * "The Philosopher Android AI voice" across Android, Chrome, Edge, Safari, and Windows/Mac.
 */
export function getPhilosopherAndroidVoice(): Promise<SpeechSynthesisVoice | null> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve(null);
  }

  if (cachedVoice) {
    return Promise.resolve(cachedVoice);
  }

  if (voiceResolvingPromise) {
    return voiceResolvingPromise;
  }

  voiceResolvingPromise = new Promise((resolve) => {
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return null;

      // 1. Exact match for explicit Philosopher or Android custom voice profiles
      const philosopherCustom = voices.find((v) =>
        /philosopher/i.test(v.name)
      );
      if (philosopherCustom) return philosopherCustom;

      const androidAiVoice = voices.find((v) =>
        /android/i.test(v.name) && (/male/i.test(v.name) || /en/i.test(v.lang))
      );
      if (androidAiVoice) return androidAiVoice;

      // 2. Google / Android Neural Baritone voices (high-fidelity synthesis on Android & Chrome)
      const googleMale = voices.find(
        (v) =>
          (/google/i.test(v.name) || /network/i.test(v.name)) &&
          (/uk english male/i.test(v.name) ||
            /us english male/i.test(v.name) ||
            /en-us-x-sfg/i.test(v.name) ||
            /en-us-x-iom/i.test(v.name) ||
            /en-gb-x-rjs/i.test(v.name))
      );
      if (googleMale) return googleMale;

      // 3. Microsoft Natural / Neural Deep Male voices (Edge / Windows)
      const msNaturalMale = voices.find(
        (v) =>
          /natural/i.test(v.name) &&
          (/guy/i.test(v.name) ||
            /christopher/i.test(v.name) ||
            /ryan/i.test(v.name) ||
            /male/i.test(v.name))
      );
      if (msNaturalMale) return msNaturalMale;

      // 4. Cultured UK / US Academic Male voices (Daniel, Alex, Oliver, Arthur)
      const academicMale = voices.find((v) =>
        /(daniel|alex|oliver|arthur|david|george)/i.test(v.name)
      );
      if (academicMale) return academicMale;

      // 5. Any English Male voice
      const anyEnglishMale = voices.find(
        (v) => v.lang.startsWith('en') && /male/i.test(v.name)
      );
      if (anyEnglishMale) return anyEnglishMale;

      // 6. Default English voice fallback
      const defaultEnglish = voices.find((v) => v.lang.startsWith('en'));
      return defaultEnglish || voices[0] || null;
    };

    const immediate = pickVoice();
    if (immediate) {
      cachedVoice = immediate;
      resolve(immediate);
      return;
    }

    // Wait for voices to load asynchronously if not immediately ready
    const handleVoicesChanged = () => {
      const selected = pickVoice();
      if (selected) {
        cachedVoice = selected;
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        resolve(selected);
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    // Timeout safety fallback after 1.5s
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      const fallback = pickVoice();
      cachedVoice = fallback;
      resolve(fallback);
    }, 1500);
  });

  return voiceResolvingPromise;
}

export interface SpeechOptions {
  rate?: number; // 0.7 (Slow), 1.0 (Normal), 1.3 (Speed)
  pitch?: number; // 0.88 - 0.90 for Philosopher baritone
  onEnd?: () => void;
  onError?: () => void;
}

/**
 * Strips markdown and special symbols so the AI voice sounds completely natural and articulate.
 */
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/###\s+/g, '')
    .replace(/####\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/[-*]\s+/g, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[—–]/g, ', ')
    .trim();
}

/**
 * Speaks the given text using "The Philosopher Android AI Voice" settings.
 */
export async function speakWithPhilosopherVoice(
  text: string,
  options: SpeechOptions = {}
): Promise<SpeechSynthesisUtterance | null> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText) return null;

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  const voice = await getPhilosopherAndroidVoice();

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || 'en-US';
  } else {
    utterance.lang = 'en-US';
  }

  // Signature Philosopher Android parameters:
  // - Velvety, smooth, contemplative baritone: pitch 0.89
  // - Controlled, articulate cadence: base rate ~0.95
  utterance.pitch = options.pitch ?? 0.89;
  utterance.rate = options.rate ?? 0.95;
  utterance.volume = 1.0;

  if (options.onEnd) {
    utterance.onend = options.onEnd;
  }
  if (options.onError) {
    utterance.onerror = options.onError;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Immediately cancels all active speech synthesis playback.
 */
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
