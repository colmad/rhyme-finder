import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useTheme } from '../lib/themeContext';

interface SyllableFilterProps {
  onFilterChange: (syllableCount: number | null) => void;
  syllableCounts: number[];
  currentFilter: number | null;
}

const SyllableFilter = ({
  onFilterChange,
  syllableCounts,
  currentFilter
}: SyllableFilterProps) => {
  const { isDark } = useTheme();

  // Remove duplicates and sort syllable counts
  const uniqueCounts = [...new Set(syllableCounts)].sort((a, b) => a - b);

  // Animation variants for the filter container
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        staggerChildren: 0.05
      }
    }
  };

  // Animation variants for individual filter options
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  if (syllableCounts.length === 0) return null;

  // Get the button styles based on theme and selection state
  const getButtonStyles = (isSelected: boolean) => {
    if (isSelected) {
      return "bg-purple-600 text-white font-medium";
    }

    return isDark
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
      : "bg-gray-200 hover:bg-gray-300 text-gray-800";
  };

  return (
    <div className="mb-6">
      <h3 className={`text-sm font-semibold mb-2 ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>Filter by Syllables</h3>
      <motion.div
        className="flex flex-wrap gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          key="all"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(null)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm transition-colors",
            getButtonStyles(currentFilter === null)
          )}
        >
          All
        </motion.button>

        {uniqueCounts.map((count) => (
          <motion.button
            key={count}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(count)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm transition-colors",
              getButtonStyles(currentFilter === count)
            )}
          >
            {count} {count === 1 ? 'syllable' : 'syllables'}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default SyllableFilter;
