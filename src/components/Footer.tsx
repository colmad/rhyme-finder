import { motion } from 'framer-motion';
import { MdFavorite } from 'react-icons/md';
import { useTheme } from '../lib/themeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <motion.footer
      className={`w-full py-6 mt-8 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>
              Powered by{' '}
              <a
                href="https://www.datamuse.com/api/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isDark
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-purple-600 hover:underline'
                }`}
              >
                Datamuse API
              </a>
            </p>
          </div>

          <div className="flex items-center">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center`}>
              Made with{' '}
              <motion.span
                className="inline-block mx-1 text-pink-500"
                animate={{
                  scale: [1, 1.2, 1],
                  transition: {
                    repeat: Infinity,
                    duration: 1.5,
                    repeatType: 'loop'
                  }
                }}
              >
                <MdFavorite />
              </motion.span>{' '}
              for songwriters & poets
            </p>
          </div>

          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>
              &copy; {new Date().getFullYear()} Rhyme Finder
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
