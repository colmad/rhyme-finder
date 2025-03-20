import { motion } from 'framer-motion';
import { MdMusicNote, MdOutlineLibraryMusic } from 'react-icons/md';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onPageChange: (page: 'search' | 'howto') => void;
  currentPage: 'search' | 'howto';
}

const Header: React.FC<HeaderProps> = ({ onPageChange, currentPage }) => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#6366F1] opacity-5" />
      
      {/* Navigation */}
      <header className="relative w-full max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-[#7C3AED] to-[#6366F1] p-2.5 rounded-xl shadow-lg">
              <MdOutlineLibraryMusic className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-transparent bg-clip-text">
              Rhyme Finder
            </span>
          </motion.div>

          {/* Navigation Links */}
          <motion.div 
            className="flex items-center gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => onPageChange(currentPage === 'search' ? 'howto' : 'search')}
              className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all
                bg-white/10 hover:bg-white/20 text-[#7C3AED] border border-[#7C3AED]/20
                hover:shadow-lg hover:shadow-[#7C3AED]/10"
            >
              {currentPage === 'search' ? 'How To Use' : 'Back to Search'}
            </button>
            <ThemeToggle />
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.div 
        className="relative max-w-4xl mx-auto px-4 py-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#6366F1] text-transparent bg-clip-text">
          Find Perfect Rhymes
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8">
          Elevate your lyrics and poetry with our intelligent rhyming assistant
        </p>
        
        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {['Perfect Rhymes', 'Near Rhymes', 'Sound-Alikes', 'Audio Pronunciation'].map((feature) => (
            <span
              key={feature}
              className="px-4 py-2 rounded-full text-sm bg-[#7C3AED]/5 
                text-[#7C3AED] border border-[#7C3AED]/10"
            >
              {feature}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div 
        className="absolute top-0 right-0 text-[#7C3AED]/5 -z-10"
        animate={{ 
          rotate: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <MdMusicNote className="w-32 h-32" />
      </motion.div>
    </div>
  );
};

export default Header;
