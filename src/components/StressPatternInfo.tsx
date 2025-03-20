import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdInfoOutline, MdClose } from 'react-icons/md';
import { useTheme } from '../lib/themeContext';

const StressPatternInfo = () => {
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
        aria-label="Stress pattern information"
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
              }`}>Understanding Stress Patterns</h3>
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
                Stress patterns show which syllables in a word are emphasized when spoken.
              </p>

              <div className={`flex items-center gap-2 border-t border-b py-2 ${
                isDark ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className={`font-medium px-2 py-0.5 rounded border ${
                  isDark
                    ? 'bg-purple-900/60 text-purple-300 border-purple-800'
                    : 'bg-purple-100 text-purple-800 border-purple-200'
                }`}>
                  STR
                </div>
                <span>= Stressed syllable (emphasized when spoken)</span>
              </div>

              <div className={`flex items-center gap-2 border-b py-2 ${
                isDark ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className={`px-2 py-0.5 rounded border ${
                  isDark
                    ? 'bg-gray-700 text-gray-300 border-gray-600'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  un
                </div>
                <span>= Unstressed syllable (not emphasized)</span>
              </div>

              <p>
                <strong>Examples:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>po-TA-to</strong>: un-STR-un</li>
                <li><strong>EL-e-phant</strong>: STR-un-un</li>
                <li><strong>un-der-STAND</strong>: un-un-STR</li>
              </ul>

              <p className={`text-xs italic ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Note: These are approximate patterns generated algorithmically and may not be 100% accurate for all words.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StressPatternInfo;
