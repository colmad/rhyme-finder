import axios from 'axios';

// Interface for Word of the Day data
export interface WordOfDay {
  word: string;
  definition: string;
  example?: string;
  date: string; // ISO date string
  partOfSpeech?: string;
  syllables?: number;
}

// Cache key for localStorage
const WORD_OF_DAY_CACHE_KEY = 'rhyme-finder-word-of-day';

// List of interesting words for Word of the Day
// These are relatively uncommon but useful words with rich meanings
// that would be interesting for poets and songwriters
const WORD_LIST = [
  'ephemeral', 'serendipity', 'mellifluous', 'resplendent', 'luminous',
  'ineffable', 'sonder', 'petrichor', 'solitude', 'eternity',
  'nostalgia', 'pristine', 'eloquent', 'lustrous', 'melancholy',
  'tranquil', 'zenith', 'aurora', 'halcyon', 'ethereal',
  'effervescent', 'nebulous', 'sublime', 'serene', 'reverie',
  'sonorous', 'aplomb', 'felicity', 'loquacious', 'pensive',
  'labyrinth', 'cascade', 'gossamer', 'efflorescent', 'incandescent',
  'evanescent', 'resonance', 'epiphany', 'quintessence', 'synchronicity',
  'jubilant', 'ebullient', 'elysian', 'paradigm', 'phenomenon',
  'whimsical', 'quixotic', 'beguile', 'rhapsody', 'illustrious'
];

/**
 * Generate a pseudo-random word based on the date
 * This ensures everyone gets the same word on the same day
 */
function getWordForDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Create a simple hash from the date
  const dateHash = (day * month * year) % WORD_LIST.length;

  return WORD_LIST[dateHash];
}

/**
 * Get the current date in ISO format, but truncated to just the date part
 */
function getCurrentDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Fetch the Word of the Day
 * First checks localStorage cache, and only fetches new data if needed
 */
export async function getWordOfDay(): Promise<WordOfDay> {
  // Check if we have a cached word for today
  const cachedData = localStorage.getItem(WORD_OF_DAY_CACHE_KEY);

  if (cachedData) {
    const parsed = JSON.parse(cachedData) as WordOfDay;
    const currentDate = getCurrentDateString();

    // If the cached word is from today, use it
    if (parsed.date === currentDate) {
      return parsed;
    }
  }

  // If no cached word or it's outdated, generate a new one
  const today = new Date();
  const wordOfDay = getWordForDate(today);

  try {
    // Fetch word data from API
    const wordData = await fetchWordData(wordOfDay);

    // Create the Word of the Day object
    const result: WordOfDay = {
      word: wordOfDay,
      definition: wordData.definition,
      example: wordData.example,
      partOfSpeech: wordData.partOfSpeech,
      syllables: wordData.syllables,
      date: getCurrentDateString()
    };

    // Cache the result
    localStorage.setItem(WORD_OF_DAY_CACHE_KEY, JSON.stringify(result));

    return result;
  } catch (error) {
    // If API fails, use a fallback approach
    console.error('Failed to fetch word data:', error);

    // Create a minimal Word of the Day object without API data
    const fallback: WordOfDay = {
      word: wordOfDay,
      definition: "Definition unavailable",
      date: getCurrentDateString()
    };

    // Cache the fallback result
    localStorage.setItem(WORD_OF_DAY_CACHE_KEY, JSON.stringify(fallback));

    return fallback;
  }
}

/**
 * Fetch word data from a dictionary API
 * Note: In a real app with API keys, this would be done server-side
 * For this example, we'll use a more basic approach
 */
async function fetchWordData(word: string) {
  try {
    // Simple Dictionary API (free and no auth required)
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (response.data && response.data.length > 0) {
      const entry = response.data[0];
      const meaning = entry.meanings && entry.meanings.length > 0 ? entry.meanings[0] : null;

      return {
        definition: meaning?.definitions?.[0]?.definition || "Definition unavailable",
        example: meaning?.definitions?.[0]?.example || undefined,
        partOfSpeech: meaning?.partOfSpeech || undefined,
        syllables: estimateSyllables(word)
      };
    }

    throw new Error('No word data found');
  } catch (error) {
    console.error(`Error fetching data for word "${word}":`, error);

    // Return fallback data
    return {
      definition: "A fascinating word worthy of exploration.",
      syllables: estimateSyllables(word)
    };
  }
}

/**
 * Estimate syllable count for a word
 * This is a simple approximation
 */
function estimateSyllables(word: string): number {
  // Count vowel groups
  const vowelGroups = word.toLowerCase().match(/[aeiouy]+/g) || [];
  let count = vowelGroups.length;

  // Adjust for silent e at end
  if (word.toLowerCase().endsWith('e') && count > 1) {
    count--;
  }

  // Adjust for consecutive vowels
  for (const vowelGroup of vowelGroups) {
    if (vowelGroup.length > 1) {
      count--;
    }
  }

  return Math.max(1, count);
}
