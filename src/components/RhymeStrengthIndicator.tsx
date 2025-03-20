import { motion } from 'framer-motion';
import { getRhymeStrengthClasses } from '../lib/rhymeService';

interface RhymeStrengthIndicatorProps {
  strength: number;
  showLabel?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Component to display rhyme strength as a visual indicator
 */
const RhymeStrengthIndicator = ({
  strength,
  showLabel = true,
  showPercentage = false,
  size = 'md',
  className = '',
}: RhymeStrengthIndicatorProps) => {
  // Get styling classes based on strength
  const { bgClass, textClass, label } = getRhymeStrengthClasses(strength);

  // Determine size-based classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 rounded',
    md: 'text-sm px-2 py-1 rounded-md',
    lg: 'text-base px-3 py-1.5 rounded-lg',
  };

  return (
    <motion.div
      className={`inline-flex items-center ${sizeClasses[size]} ${bgClass} border ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Strength label */}
      <div className={`font-medium ${textClass} flex items-center gap-1`}>
        {showLabel && <span>{label}</span>}
        {showPercentage && (
          <>
            {showLabel && <span className="opacity-60">•</span>}
            <span>{strength}%</span>
          </>
        )}
      </div>

      {/* Visual indicator dot */}
      <div
        className={`ml-1 h-2 w-2 rounded-full ${
          strength >= 80
            ? 'bg-green-500 dark:bg-green-400'
            : strength >= 60
              ? 'bg-lime-500 dark:bg-lime-400'
              : strength <= 40
                ? 'bg-red-500 dark:bg-red-400'
                : 'bg-yellow-500 dark:bg-yellow-400'
        }`}
      ></div>
    </motion.div>
  );
};

export default RhymeStrengthIndicator;
