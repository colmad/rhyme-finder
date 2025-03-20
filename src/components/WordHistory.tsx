import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useTheme } from '../lib/themeContext';

interface WordHistoryProps {
  words: string[];
  onWordClick: (word: string) => void;
  currentWord: string;
}

const WordHistory = ({ words, onWordClick, currentWord }: WordHistoryProps) => {
  const { isDark } = useTheme();

  if (words.length === 0) return null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="mb-6">
      <h3 className={`text-sm font-semibold mb-2 ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>Recent Searches</h3>
      <motion.div
        className="flex flex-wrap gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {words.slice(0, 10).map((word, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            className={cn(
              "px-3 py-1 rounded-full text-sm cursor-pointer transition-colors",
              word === currentWord
                ? "bg-purple-600 text-white font-medium"
                : isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            )}
            onClick={() => onWordClick(word)}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default WordHistory;
