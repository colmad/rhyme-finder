import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdInfoOutline, MdClose, MdVolumeUp } from 'react-icons/md';
import { useTheme } from '../lib/themeContext';

const AudioFeatureInfo = () => {
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
        } rounded-full p-1 transition-colors focus:outline-none flex items-center`}
        aria-label="Audio pronunciation information"
      >
        <MdVolumeUp size={18} className="mr-1" />
        <MdInfoOutline size={16} />
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
              }`}>Word Pronunciation</h3>
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
                Click the <MdVolumeUp className="inline" size={16} /> button next to any word to hear its pronunciation.
              </p>

              <div className={`${
                isDark
                  ? 'bg-purple-900/30 border-purple-800'
                  : 'bg-purple-50 border-purple-100'
              } border rounded-md p-3`}>
                <h4 className={`font-medium mb-1 ${
                  isDark ? 'text-purple-300' : 'text-purple-700'
                }`}>Features:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Clear audio pronunciation of each word</li>
                  <li>Hear the correct stress patterns</li>
                  <li>Improve your pronunciation for poetry readings</li>
                  <li>Useful for non-native speakers</li>
                </ul>
              </div>

              <p className={`text-xs italic ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Note: This feature uses your device's text-to-speech capabilities. Quality and voice may vary depending on your browser and system settings.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioFeatureInfo;
