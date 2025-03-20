import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdInfoOutline, MdClose } from 'react-icons/md';
import { useTheme } from '../lib/themeContext';
import RhymeStrengthIndicator from './RhymeStrengthIndicator';

const RhymeStrengthInfo = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleInfo = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleInfo}
        className={`${
          isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-500 hover:text-purple-600'
        } rounded-full p-1 transition-colors focus:outline-none`}
        aria-label="Rhyme strength information"
      >
        <MdInfoOutline size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 top-full right-0 mt-2 w-80 rounded-lg shadow-lg p-4 ${
              isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className={`font-semibold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>Rhyme Strength</h3>
              <button
                onClick={toggleInfo}
                className={`${
                  isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                } p-1`}
                aria-label="Close information"
              >
                <MdClose size={16} />
              </button>
            </div>

            <div className={`space-y-3 text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <p>
                The rhyme strength indicator shows how closely words rhyme with your search term.
              </p>

              {/* Examples of different strength indicators */}
              <div className={`flex flex-col gap-3 p-3 rounded border ${
                isDark ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span>Strong match (80-100%)</span>
                  <RhymeStrengthIndicator strength={85} size="sm" />
                </div>

                <div className="flex items-center justify-between">
                  <span>Good match (60-75%)</span>
                  <RhymeStrengthIndicator strength={65} size="sm" />
                </div>

                <div className="flex items-center justify-between">
                  <span>Medium match (45-55%)</span>
                  <RhymeStrengthIndicator strength={50} size="sm" />
                </div>

                <div className="flex items-center justify-between">
                  <span>Weak match (0-40%)</span>
                  <RhymeStrengthIndicator strength={35} size="sm" />
                </div>
              </div>

              <h4 className={`font-medium ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              } mt-2`}>
                How it works
              </h4>

              <p className="text-xs">
                Rhyme strength is calculated based on:
              </p>

              <ul className="list-disc pl-5 text-xs space-y-1">
                <li>Similarity of ending sounds</li>
                <li>Matching vowel patterns</li>
                <li>Similarity of consonant sounds</li>
                <li>Word structure analysis</li>
              </ul>

              <p className={`text-xs italic mt-2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                This helps you find the most effective rhymes for your poetry and lyrics.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RhymeStrengthInfo;
