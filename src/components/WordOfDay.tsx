import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdCalendarToday, MdSearch } from 'react-icons/md';
import { Button } from './ui/button';
import { useTheme } from '../lib/themeContext';
import { WordOfDay as WordOfDayType, getWordOfDay } from '../lib/wordOfDayService';
import PronunciationButton from './PronunciationButton';

interface WordOfDayProps {
  onSearchWord: (word: string) => void;
}

const WordOfDay = ({ onSearchWord }: WordOfDayProps) => {
  const { isDark } = useTheme();
  const [wordData, setWordData] = useState<WordOfDayType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch word of the day on component mount
  useEffect(() => {
    const fetchWordOfDay = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getWordOfDay();
        setWordData(data);
      } catch (error) {
        console.error('Error fetching word of the day:', error);
        setError('Could not load the word of the day. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWordOfDay();
  }, []);

  // Format current date for display
  const formattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearchClick = () => {
    if (wordData) {
      onSearchWord(wordData.word);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={`rounded-xl overflow-hidden shadow-lg ${
        isDark
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-purple-100'
      } mb-8`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with date */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Word of the Day</h2>
          <div className="flex items-center text-sm opacity-90">
            <MdCalendarToday className="mr-1" />
            {formattedDate()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : wordData ? (
          <div className="space-y-4">
            {/* Word and pronunciation */}
            <div className="flex items-center justify-between">
              <motion.h3
                className="text-2xl font-bold text-purple-600 dark:text-purple-400"
                variants={itemVariants}
              >
                {wordData.word}
              </motion.h3>
              <PronunciationButton word={wordData.word} size="md" />
            </div>

            {/* Part of speech and syllables */}
            <motion.div
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              variants={itemVariants}
            >
              {wordData.partOfSpeech && (
                <span className="italic mr-3">{wordData.partOfSpeech}</span>
              )}
              {wordData.syllables && (
                <span>{wordData.syllables} syllable{wordData.syllables !== 1 ? 's' : ''}</span>
              )}
            </motion.div>

            {/* Definition */}
            <motion.p
              className={isDark ? 'text-gray-300' : 'text-gray-700'}
              variants={itemVariants}
            >
              {wordData.definition}
            </motion.p>

            {/* Example usage */}
            {wordData.example && (
              <motion.div variants={itemVariants}>
                <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Example:
                </h4>
                <p className={`italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  "{wordData.example}"
                </p>
              </motion.div>
            )}

            {/* Search button */}
            <motion.div
              className="pt-2"
              variants={itemVariants}
            >
              <Button
                onClick={handleSearchClick}
                variant="gradient"
                className="w-full flex items-center justify-center gap-2"
              >
                <MdSearch size={18} />
                Find rhymes for "{wordData.word}"
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="text-center p-4">No word of the day available</div>
        )}
      </div>
    </motion.div>
  );
};

export default WordOfDay;
