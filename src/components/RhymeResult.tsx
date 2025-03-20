import { motion } from 'framer-motion';
import { useState } from 'react';
import { RhymeWord } from '../lib/rhymeService';
import { cn } from '../lib/utils';
import StressPatternDisplay from './StressPatternDisplay';
import StressPatternInfo from './StressPatternInfo';
import PronunciationButton from './PronunciationButton';
import AudioFeatureInfo from './AudioFeatureInfo';
import RhymeStrengthIndicator from './RhymeStrengthIndicator';
import RhymeStrengthInfo from './RhymeStrengthInfo';
import { useTheme } from '../lib/themeContext';

interface RhymeResultProps {
  words: RhymeWord[];
  title: string;
  onWordClick: (word: string) => void;
  colorClass: string;
  showRhymeStrength?: boolean; // New prop to control if rhyme strength is shown
}

const RhymeResult = ({
  words,
  title,
  onWordClick,
  colorClass,
  showRhymeStrength = true // Default to true for Perfect/Near Rhymes, can be disabled for Related
}: RhymeResultProps) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showStressPatterns, setShowStressPatterns] = useState(false);
  const [showStrengthIndicators, setShowStrengthIndicators] = useState(true);

  // Group words by syllable count for better organization
  const groupedBySyllables = words.reduce((acc, word) => {
    const syllables = word.numSyllables || 0;
    if (!acc[syllables]) {
      acc[syllables] = [];
    }
    acc[syllables].push(word);
    return acc;
  }, {} as Record<number, RhymeWord[]>);

  // Sort syllable groups by count
  const sortedSyllableCounts = Object.keys(groupedBySyllables)
    .map(Number)
    .sort((a, b) => a - b);

  // Animations for the container
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
        duration: 0.3
      }
    }
  };

  // Animations for individual word items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Animations for syllable group headers
  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Only show the strength toggle if we have rhyme strength data
  const hasRhymeStrengthData = showRhymeStrength && words.some(word => word.rhymeStrength !== undefined);

  return (
    <div className="w-full mb-6">
      <div
        className={cn(
          "flex justify-between items-center mb-2 p-3 rounded-lg cursor-pointer",
          colorClass,
          "bg-opacity-90 hover:bg-opacity-100 transition-all"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <span className="text-white">
          {isExpanded ? '▼' : '▶'} {words.length} words
        </span>
      </div>

      {isExpanded && (
        <div className="flex flex-col space-y-2">
          {/* Features toggle row */}
          <div className="flex justify-end items-center gap-2">
            <AudioFeatureInfo />

            {hasRhymeStrengthData && <RhymeStrengthInfo />}

            <StressPatternInfo />

            {hasRhymeStrengthData && (
              <button
                className={cn(
                  "text-xs py-1 px-2 rounded-md transition-colors flex items-center",
                  showStrengthIndicators
                    ? isDark
                      ? "bg-purple-900/60 text-purple-300 border border-purple-800"
                      : "bg-purple-100 text-purple-700 border border-purple-200"
                    : isDark
                      ? "bg-gray-700 text-gray-300 border border-gray-600"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStrengthIndicators(!showStrengthIndicators);
                }}
              >
                <span className="mr-1">{showStrengthIndicators ? '✓' : ''}</span>
                Show Rhyme Strength
              </button>
            )}

            <button
              className={cn(
                "text-xs py-1 px-2 rounded-md transition-colors flex items-center",
                showStressPatterns
                  ? isDark
                    ? "bg-purple-900/60 text-purple-300 border border-purple-800"
                    : "bg-purple-100 text-purple-700 border border-purple-200"
                  : isDark
                    ? "bg-gray-700 text-gray-300 border border-gray-600"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setShowStressPatterns(!showStressPatterns);
              }}
            >
              <span className="mr-1">{showStressPatterns ? '✓' : ''}</span>
              Show Stress Patterns
            </button>
          </div>

          <motion.div
            className="mt-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {words.length > 0 ? (
              sortedSyllableCounts.length > 0 ? (
                // Display words grouped by syllable count
                sortedSyllableCounts.map(syllableCount => (
                  <div key={syllableCount} className="mb-4">
                    <motion.div
                      className={`mb-2 pl-2 border-l-4 ${
                        isDark ? 'border-gray-600' : 'border-gray-300'
                      }`}
                      variants={headerVariants}
                    >
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {syllableCount} {syllableCount === 1 ? 'syllable' : 'syllables'}
                      </span>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {groupedBySyllables[syllableCount].map((word, index) => (
                        <motion.div
                          key={`${syllableCount}-${index}`}
                          variants={itemVariants}
                          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                          className={cn(
                            "p-2 rounded-md border text-center cursor-pointer",
                            colorClass.replace('bg-', 'border-'),
                            isDark
                              ? "bg-gray-800 hover:bg-gray-700 border-opacity-50 text-gray-200 transition-colors"
                              : "bg-white hover:bg-gray-50 transition-colors"
                          )}
                          onClick={() => onWordClick(word.word)}
                        >
                          {/* Top section with word, pronunciation, and rhyme strength */}
                          <div className="mb-2">
                            {/* Word and pronunciation */}
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium flex-grow">{word.word}</span>
                              <PronunciationButton word={word.word} size="sm" className="ml-1" />
                            </div>

                            {/* Rhyme strength indicator (if available and enabled) */}
                            {showRhymeStrength && showStrengthIndicators && word.rhymeStrength !== undefined && (
                              <div className="mt-1 flex justify-center">
                                <RhymeStrengthIndicator
                                  strength={word.rhymeStrength}
                                  size="sm"
                                  showLabel={false}
                                  showPercentage={true}
                                />
                              </div>
                            )}
                          </div>

                          {/* Stress pattern (if enabled) */}
                          {showStressPatterns && word.stressPattern && (
                            <StressPatternDisplay
                              pattern={word.stressPattern}
                              word={word.word}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Display words without syllable organization (fallback for words without syllable data)
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {words.map((word, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      className={cn(
                        "p-2 rounded-md border text-center cursor-pointer",
                        colorClass.replace('bg-', 'border-'),
                        isDark
                          ? "bg-gray-800 hover:bg-gray-700 border-opacity-50 text-gray-200 transition-colors"
                          : "bg-white hover:bg-gray-50 transition-colors"
                      )}
                      onClick={() => onWordClick(word.word)}
                    >
                      {/* Top section with word, pronunciation, and rhyme strength */}
                      <div className="mb-2">
                        {/* Word and pronunciation */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium flex-grow">{word.word}</span>
                          <PronunciationButton word={word.word} size="sm" className="ml-1" />
                        </div>

                        {/* Rhyme strength indicator (if available and enabled) */}
                        {showRhymeStrength && showStrengthIndicators && word.rhymeStrength !== undefined && (
                          <div className="mt-1 flex justify-center">
                            <RhymeStrengthIndicator
                              strength={word.rhymeStrength}
                              size="sm"
                              showLabel={false}
                              showPercentage={true}
                            />
                          </div>
                        )}
                      </div>

                      {/* Stress pattern (if enabled) */}
                      {showStressPatterns && word.stressPattern && (
                        <StressPatternDisplay
                          pattern={word.stressPattern}
                          word={word.word}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              <motion.div
                variants={itemVariants}
                className={`col-span-full text-center ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                } py-4`}
              >
                No results found
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RhymeResult;
