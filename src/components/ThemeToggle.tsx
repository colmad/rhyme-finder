import { motion } from 'framer-motion';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '../lib/themeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      className={`rounded-full p-2 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
        isDark
          ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      }`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isDark ? (
        <MdLightMode className="w-5 h-5" />
      ) : (
        <MdDarkMode className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
