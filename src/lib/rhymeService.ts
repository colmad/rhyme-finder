import axios from 'axios';

// Using the Datamuse API which is a free public rhyming word API
const API_URL = 'https://api.datamuse.com/words';

export interface RhymeWord {
  word: string;
  score: number;
  numSyllables?: number;
  stressPattern?: string; // Added field for stress pattern
  rhymeStrength?: number; // Added field for rhyme strength (0-100)
}

/**
 * Calculate the rhyme strength as a percentage value
 *
 * @param originalWord - The original word for which we're finding rhymes
 * @param rhymeWord - The rhyming word to check strength against
 * @param apiScore - The score returned by the Datamuse API
 * @returns A number between 0-100 indicating rhyme strength
 */
export const calculateRhymeStrength = (
  originalWord: string,
  rhymeWord: string,
  apiScore: number
): number => {
  // Normalize the words for comparison (lowercase)
  const orig = originalWord.toLowerCase();
  const rhyme = rhymeWord.toLowerCase();

  // Perfect match gets 100%
  if (orig === rhyme) return 100;

  // Start with a base score from the API (normalized to max 70%)
  // Datamuse scores vary widely, so we'll use it as one factor only
  const apiScoreNormalized = Math.min(70, Math.round((apiScore / 1000) * 30) + 40);

  // Calculate suffix similarity by finding the longest common ending
  let commonSuffixLength = 0;
  for (let i = 1; i <= Math.min(orig.length, rhyme.length); i++) {
    if (orig.slice(-i) === rhyme.slice(-i)) {
      commonSuffixLength = i;
    } else {
      break;
    }
  }

  // Calculate similarity of ending sounds (weight this heavily for rhyming)
  const suffixScore = Math.round((commonSuffixLength / Math.min(orig.length, rhyme.length)) * 40);

  // Check if the endings have the same vowel sounds
  // This is a simplified approach - ideally would use phoneme data
  const origVowels = getVowelSounds(orig);
  const rhymeVowels = getVowelSounds(rhyme);

  let vowelScore = 0;
  if (origVowels.length > 0 && rhymeVowels.length > 0) {
    // Compare the last vowel sound
    if (origVowels[origVowels.length - 1] === rhymeVowels[rhymeVowels.length - 1]) {
      vowelScore += 15;
    }

    // If both have multiple vowel sounds, compare the second-to-last
    if (origVowels.length > 1 && rhymeVowels.length > 1 &&
        origVowels[origVowels.length - 2] === rhymeVowels[rhymeVowels.length - 2]) {
      vowelScore += 5;
    }
  }

  // Perfect rhymes often end with the same consonant sound
  const consonantBonus = endsWithSameConsonantSound(orig, rhyme) ? 10 : 0;

  // Calculate final score, capping at 100
  const totalScore = Math.min(100, apiScoreNormalized + suffixScore + vowelScore + consonantBonus);

  // Round to nearest 5 for cleaner display
  return Math.round(totalScore / 5) * 5;
};

// Helper function to extract vowel sounds from a word
const getVowelSounds = (word: string): string[] => {
  const vowelGroups = word.match(/[aeiouy]+/g) || [];
  return vowelGroups;
};

// Helper function to check if words end with the same consonant sound
const endsWithSameConsonantSound = (word1: string, word2: string): boolean => {
  const consonantPattern = /[bcdfghjklmnpqrstvwxz]+$/i;
  const word1Match = word1.match(consonantPattern);
  const word2Match = word2.match(consonantPattern);

  if (word1Match && word2Match) {
    return word1Match[0].toLowerCase() === word2Match[0].toLowerCase();
  }

  return false;
};

/**
 * Get CSS classes to display rhyme strength visually
 *
 * @param strength - Rhyme strength (0-100)
 * @returns Object with classes for different themes
 */
export const getRhymeStrengthClasses = (strength: number): {
  bgClass: string;
  textClass: string;
  label: string;
} => {
  // Default classes (medium strength)
  let bgClass = 'bg-yellow-100 dark:bg-yellow-900/40';
  let textClass = 'text-yellow-800 dark:text-yellow-300';
  let label = 'Medium';

  if (strength >= 80) {
    bgClass = 'bg-green-100 dark:bg-green-900/40';
    textClass = 'text-green-800 dark:text-green-300';
    label = 'Strong';
  } else if (strength >= 60) {
    bgClass = 'bg-lime-100 dark:bg-lime-900/40';
    textClass = 'text-lime-800 dark:text-lime-300';
    label = 'Good';
  } else if (strength <= 40) {
    bgClass = 'bg-red-100 dark:bg-red-900/40';
    textClass = 'text-red-800 dark:text-red-300';
    label = 'Weak';
  }

  return { bgClass, textClass, label };
};

// Function to fetch rhyming words
export const fetchRhymingWords = async (word: string): Promise<RhymeWord[]> => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: {
        rel_rhy: word, // Relation: rhymes
        max: 100,      // Maximum number of results
      }
    });

    // Add stress patterns and rhyme strength to the results
    const enhancedWords = response.data.map((rhymeWord: RhymeWord) => {
      // Calculate rhyme strength
      const rhymeStrength = calculateRhymeStrength(word, rhymeWord.word, rhymeWord.score);

      return {
        ...rhymeWord,
        stressPattern: generateStressPattern(rhymeWord.word, rhymeWord.numSyllables),
        rhymeStrength
      };
    });

    return enhancedWords;
  } catch (error) {
    console.error('Error fetching rhyming words:', error);
    return [];
  }
};

// Function to fetch words that sound like the input
export const fetchSoundAlikeWords = async (word: string): Promise<RhymeWord[]> => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: {
        sl: word,  // Sounds like
        max: 100,
      }
    });

    // Add stress patterns and rhyme strength to the results
    const enhancedWords = response.data.map((rhymeWord: RhymeWord) => {
      // Calculate rhyme strength (slightly different for sound-alikes)
      const rhymeStrength = calculateRhymeStrength(word, rhymeWord.word, rhymeWord.score * 0.8);

      return {
        ...rhymeWord,
        stressPattern: generateStressPattern(rhymeWord.word, rhymeWord.numSyllables),
        rhymeStrength
      };
    });

    return enhancedWords;
  } catch (error) {
    console.error('Error fetching sound-alike words:', error);
    return [];
  }
};

// Function to fetch near rhymes
export const fetchNearRhymes = async (word: string): Promise<RhymeWord[]> => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: {
        rel_nry: word, // Near rhymes
        max: 100,
      }
    });

    // Add stress patterns and rhyme strength to the results
    const enhancedWords = response.data.map((rhymeWord: RhymeWord) => {
      // Calculate rhyme strength (slightly different approach for near rhymes)
      const rhymeStrength = calculateRhymeStrength(word, rhymeWord.word, rhymeWord.score * 0.9);

      return {
        ...rhymeWord,
        stressPattern: generateStressPattern(rhymeWord.word, rhymeWord.numSyllables),
        rhymeStrength
      };
    });

    return enhancedWords;
  } catch (error) {
    console.error('Error fetching near rhymes:', error);
    return [];
  }
};

// Function to fetch words that are associated with the input word
export const fetchRelatedWords = async (word: string): Promise<RhymeWord[]> => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: {
        ml: word,  // Meaning like (similar meaning)
        max: 100,
      }
    });

    // For related words, don't calculate rhyme strength as it's more about meaning
    // But we'll still add stress patterns
    const wordsWithStress = response.data.map((word: RhymeWord) => ({
      ...word,
      stressPattern: generateStressPattern(word.word, word.numSyllables)
    }));

    return wordsWithStress;
  } catch (error) {
    console.error('Error fetching related words:', error);
    return [];
  }
};

// Common stress patterns for English words by syllable count
// This is a simplified approach - in reality, stress patterns can be more complex
const commonStressPatterns: Record<number, string[]> = {
  1: ['ˈ'], // Single syllable words are typically stressed
  2: ['ˈ-', '-ˈ'], // Either first or second syllable stressed
  3: ['ˈ--', '-ˈ-', '--ˈ'], // Stress on first, second, or third syllable
  4: ['ˈ---', '-ˈ--', '--ˈ-', '---ˈ'], // Various patterns for 4 syllables
  5: ['ˈ----', '-ˈ---', '--ˈ--', '---ˈ-', '----ˈ'],
  6: ['ˈ-----', '-ˈ----', '--ˈ---', '---ˈ--', '----ˈ-', '-----ˈ'],
};

// Common prefixes and their typical stress patterns
const prefixes: Record<string, string> = {
  'un': 'ˈ',
  're': '-',
  'in': '-',
  'de': '-',
  'dis': '-',
  'pre': '-',
  'pro': '-',
  'con': '-',
  'sub': '-',
};

// Common suffixes and how they affect stress
const suffixes: Record<string, string> = {
  'tion': 'ˈ',    // usually stressed
  'sion': 'ˈ',    // usually stressed
  'ity': 'ˈ',     // usually stressed
  'ment': '-',    // doesn't usually affect stress
  'ness': '-',    // doesn't usually affect stress
  'ly': '-',      // doesn't usually affect stress
  'ful': '-',     // doesn't usually affect stress
  'less': '-',    // doesn't usually affect stress
  'ing': '-',     // doesn't usually affect stress
  'er': '-',      // usually unstressed
  'or': '-',      // usually unstressed
  'al': '-',      // usually unstressed
};

/**
 * Generate a likely stress pattern for a word based on syllable count and word structure
 * This is a best-guess approach as accurate stress patterns require a dictionary
 *
 * @param word - The word to analyze
 * @param syllables - Number of syllables (if known)
 * @returns A string representing the stress pattern (e.g., "ˈ--" for 3 syllables with stress on first)
 */
export const generateStressPattern = (word: string, syllables?: number): string => {
  if (!syllables || syllables <= 0) {
    // If syllables are unknown, make a guess based on vowel groups
    const vowelGroups = word.toLowerCase().match(/[aeiouy]+/g) || [];
    syllables = vowelGroups.length;

    // Special case for words ending in 'e' (silent e)
    if (word.toLowerCase().endsWith('e') && vowelGroups.length > 1) {
      syllables = Math.max(1, syllables - 1);
    }

    // Special case for consecutive vowels often forming one syllable
    for (let i = 0; i < vowelGroups.length - 1; i++) {
      if (vowelGroups[i].length > 1 || vowelGroups[i+1].length > 1) {
        syllables = Math.max(1, syllables - 1);
        break;
      }
    }
  }

  // Default pattern based on syllable count
  const defaultPatterns = commonStressPatterns[syllables] ||
    Array(syllables).fill('-').map((_, i) => i === 0 ? 'ˈ' : '-');

  // Determine stress pattern - simplified approach
  const lowercasedWord = word.toLowerCase();

  // Check for prefixes and suffixes to make a more educated guess
  for (const [prefix, stress] of Object.entries(prefixes)) {
    if (lowercasedWord.startsWith(prefix) && syllables > 1) {
      // If word starts with this prefix, assign stress pattern accordingly
      if (stress === 'ˈ') {
        return 'ˈ' + '-'.repeat(syllables - 1);
      }
    }
  }

  for (const [suffix, stress] of Object.entries(suffixes)) {
    if (lowercasedWord.endsWith(suffix) && syllables > 1) {
      // If word ends with this suffix, assign stress pattern accordingly
      if (stress === 'ˈ') {
        const pattern = Array(syllables).fill('-');
        pattern[syllables - 1] = 'ˈ';
        return pattern.join('');
      }
    }
  }

  // Words ending in "ity", "tion", "sion" often have the stress on the syllable before
  if ((lowercasedWord.endsWith('ity') ||
       lowercasedWord.endsWith('tion') ||
       lowercasedWord.endsWith('sion')) &&
      syllables > 2) {
    const pattern = Array(syllables).fill('-');
    pattern[syllables - 2] = 'ˈ';
    return pattern.join('');
  }

  // For two-syllable words, common pattern is stress on first syllable
  if (syllables === 2) {
    return 'ˈ-';
  }

  // For three-syllable words, common pattern is stress on first syllable
  if (syllables === 3) {
    return 'ˈ--';
  }

  // Return first default pattern as fallback
  return defaultPatterns[0] || 'ˈ' + '-'.repeat(Math.max(0, syllables - 1));
};

/**
 * This function checks if two words have compatible stress patterns
 * for rhyming in poetry or lyrics
 */
export const areStressPatternsCompatible = (pattern1: string, pattern2: string): boolean => {
  // Remove any stress marks and just compare the final syllable positions
  const normalized1 = pattern1.replace(/ˈ/g, '');
  const normalized2 = pattern2.replace(/ˈ/g, '');

  // If the words have different lengths, only compare the last syllables
  const minLength = Math.min(normalized1.length, normalized2.length);
  const lastSyllables = Math.min(2, minLength); // Usually the last 1-2 syllables matter most for rhyming

  return normalized1.slice(-lastSyllables) === normalized2.slice(-lastSyllables);
};

/**
 * Format a stress pattern for display
 * @param pattern The raw stress pattern (e.g., "ˈ--")
 * @returns Formatted pattern for display (e.g., "STR-ess-un")
 */
export const formatStressPattern = (pattern: string): string => {
  return pattern
    .split('')
    .map(mark => mark === 'ˈ' ? 'STR' : 'un')
    .join('-');
};
