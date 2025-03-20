/**
 * Speech Service for text-to-speech functionality
 * Uses the Web Speech API which is built into modern browsers
 */

interface SpeechOptions {
  rate?: number;       // Speech rate (0.1 to 10), default 1
  pitch?: number;      // Speech pitch (0 to 2), default 1
  volume?: number;     // Speech volume (0 to 1), default 1
  voiceURI?: string;   // Specific voice to use (if available)
  lang?: string;       // Language code (e.g., 'en-US')
}

// Default options for speech synthesis
const defaultOptions: SpeechOptions = {
  rate: 1,
  pitch: 1,
  volume: 1,
  lang: 'en-US'
};

/**
 * Speaks the given text using speech synthesis
 * @param text - The text to speak
 * @param options - Optional speech options
 * @returns A promise that resolves when the speech is done or rejects on error
 */
export const speakText = (text: string, options: SpeechOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech not supported in this browser');
      reject(new Error('Text-to-speech not supported'));
      return;
    }

    // Merge default options with provided options
    const mergedOptions = { ...defaultOptions, ...options };

    // Create utterance with the text
    const utterance = new SpeechSynthesisUtterance(text);

    // Set options
    utterance.rate = mergedOptions.rate || 1;
    utterance.pitch = mergedOptions.pitch || 1;
    utterance.volume = mergedOptions.volume || 1;

    // Set language
    if (mergedOptions.lang) {
      utterance.lang = mergedOptions.lang;
    }

    // Handle events
    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      // Don't reject for interruption errors as they're expected when user cancels
      if (event.error === 'interrupted') {
        resolve();
      } else {
        reject(new Error(`Speech synthesis error: ${event.error}`));
      }
    };

    // Set voice if specified
    if (mergedOptions.voiceURI) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.voiceURI === mergedOptions.voiceURI);
      if (voice) {
        utterance.voice = voice;
      }
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Speak the text
    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Gets available voices for speech synthesis
 * @returns A promise that resolves with an array of available voices
 */
export const getAvailableVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech not supported in this browser');
      resolve([]);
      return;
    }

    // Function to get voices
    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };

    // Some browsers need a slight delay to get voices
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      // Wait for voices to be loaded
      window.speechSynthesis.onvoiceschanged = getVoices;
    }
  });
};

/**
 * Returns a preferred English voice from the available voices
 * @returns A promise that resolves with a preferred voice or null if none found
 */
export const getPreferredVoice = async (): Promise<SpeechSynthesisVoice | null> => {
  const voices = await getAvailableVoices();

  // Filter English voices
  const englishVoices = voices.filter(voice =>
    voice.lang.includes('en-') || voice.lang === 'en'
  );

  if (englishVoices.length === 0) {
    return null;
  }

  // Try to find a good quality voice
  // First preference: Google voices (usually good quality)
  const googleVoice = englishVoices.find(voice =>
    voice.voiceURI.includes('Google') || voice.name.includes('Google')
  );

  if (googleVoice) {
    return googleVoice;
  }

  // Second preference: Look for voices with "premium", "enhanced" or similar in the name
  const premiumVoice = englishVoices.find(voice =>
    voice.name.includes('Premium') ||
    voice.name.includes('Enhanced') ||
    voice.name.includes('Natural')
  );

  if (premiumVoice) {
    return premiumVoice;
  }

  // Fallback to first available English voice
  return englishVoices[0] || null;
};

/**
 * Check if speech synthesis is supported in the current browser
 * @returns True if supported, false otherwise
 */
export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};
