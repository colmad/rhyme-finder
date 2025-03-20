import { motion } from 'framer-motion';
import { useTheme } from '../lib/themeContext';

interface StressPatternDisplayProps {
  pattern: string;
  word: string;
}

const StressPatternDisplay = ({ pattern, word }: StressPatternDisplayProps) => {
  const { isDark } = useTheme();
  const syllables = pattern.length;

  // Split the word into syllables (this is approximate)
  const syllableBreakdown = splitIntoSyllables(word, syllables);

  return (
    <div className="flex flex-col items-center mt-1 w-full">
      <div className="flex space-x-1 text-xs">
        {pattern.split('').map((mark, index) => (
          <motion.div
            key={index}
            className={`inline-flex items-center justify-center px-1 rounded ${
              mark === 'ˈ'
                ? isDark
                  ? 'bg-purple-900/60 text-purple-300 font-semibold border border-purple-800'
                  : 'bg-purple-100 text-purple-800 font-semibold border border-purple-200'
                : isDark
                  ? 'bg-gray-700 text-gray-300 border border-gray-600'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            {mark === 'ˈ' ? 'STR' : 'un'}
          </motion.div>
        ))}
      </div>

      {/* Render approximate syllable breakdown */}
      {syllableBreakdown.length > 0 && (
        <div className="flex space-x-1 text-xs mt-1">
          {syllableBreakdown.map((syllable, index) => (
            <motion.div
              key={`syl-${index}`}
              className={isDark ? "text-gray-400" : "text-gray-500"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.2 }}
            >
              {syllable}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Attempt to split a word into syllables. This is an approximation.
 *
 * @param word - The word to split
 * @param expectedSyllables - The expected number of syllables
 * @returns An array of syllables
 */
function splitIntoSyllables(word: string, expectedSyllables: number): string[] {
  if (expectedSyllables <= 1) return [word];
  if (!word || word.length <= 1) return [word];

  const lowercaseWord = word.toLowerCase();

  // Find vowel groups in the word
  const vowelMatches = [...lowercaseWord.matchAll(/[aeiouy]+/g)];

  // If we don't have enough vowel groups, return the whole word
  if (vowelMatches.length < expectedSyllables) {
    // Simple fallback - just split the word evenly
    const chunkSize = Math.ceil(word.length / expectedSyllables);
    const syllables = [];

    for (let i = 0; i < word.length; i += chunkSize) {
      syllables.push(word.slice(i, Math.min(i + chunkSize, word.length)));
    }

    return syllables;
  }

  // Try to split the word by vowel groups
  const syllables: string[] = [];
  let currentSyllable = "";
  let consonantQueue = "";
  let syllableCounter = 0;

  // Simple pattern-based syllable breakdown
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const lowerChar = char.toLowerCase();

    // If the character is a vowel
    if ('aeiouy'.includes(lowerChar)) {
      currentSyllable += consonantQueue + char;
      consonantQueue = "";

      // Check if next character is a consonant or end of word
      if (i + 1 === word.length || !'aeiouy'.includes(word[i+1].toLowerCase())) {
        syllableCounter++;

        // If we have a consonant after the vowel, it usually goes with the vowel
        if (i + 1 < word.length) {
          currentSyllable += word[i+1];
          i++;
        }

        syllables.push(currentSyllable);
        currentSyllable = "";
      }
    } else {
      // Consonant - queue it up
      consonantQueue += char;

      // Special case: if we have a consonant cluster that's hard to pronounce,
      // and we're not at the beginning of the word, split after the first consonant
      if (consonantQueue.length > 1 && syllables.length > 0) {
        currentSyllable += consonantQueue[0];
        syllables.push(currentSyllable);
        currentSyllable = "";
        consonantQueue = consonantQueue.slice(1);
      }
    }
  }

  // Add any remaining parts
  if (currentSyllable || consonantQueue) {
    syllables.push(currentSyllable + consonantQueue);
  }

  // If we got too few syllables, try a simpler approach
  if (syllables.length < expectedSyllables) {
    // Simple fallback - just split the word evenly
    const chunkSize = Math.ceil(word.length / expectedSyllables);
    const evenSyllables = [];

    for (let i = 0; i < word.length; i += chunkSize) {
      evenSyllables.push(word.slice(i, Math.min(i + chunkSize, word.length)));
    }

    return evenSyllables;
  }

  // If we got too many syllables, combine some
  if (syllables.length > expectedSyllables) {
    // Calculate the number of merges needed
    const mergesToDo = syllables.length - expectedSyllables;

    // Start by merging the shortest syllables
    for (let m = 0; m < mergesToDo; m++) {
      // Find the shortest syllable
      let shortestIndex = 0;
      let shortestLength = syllables[0].length;

      for (let i = 1; i < syllables.length; i++) {
        if (syllables[i].length < shortestLength) {
          shortestIndex = i;
          shortestLength = syllables[i].length;
        }
      }

      // Merge with adjacent syllable (prefer the one after)
      if (shortestIndex < syllables.length - 1) {
        syllables[shortestIndex] += syllables[shortestIndex + 1];
        syllables.splice(shortestIndex + 1, 1);
      } else if (shortestIndex > 0) {
        syllables[shortestIndex - 1] += syllables[shortestIndex];
        syllables.splice(shortestIndex, 1);
      }
    }
  }

  return syllables;
}

export default StressPatternDisplay;
