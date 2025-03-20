import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdAutorenew, MdMood, MdStyle, MdContentCopy, MdCheck, MdWarning } from 'react-icons/md';
import { initializeAI, generateRhymingLines, analyzeLine, getUsageStats } from '../lib/aiService';
import UsageDashboard from './UsageDashboard';

interface SearchFormProps {
  onSearch: (word: string, rhymes: string[]) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLineMode, setIsLineMode] = useState(false);
  const [suggestedLines, setSuggestedLines] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mood, setMood] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize OpenAI with API key from environment variable
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log('API Key status:', apiKey ? 'Present (length: ' + apiKey.length + ')' : 'Missing');
    
    if (!apiKey) {
      console.error('OpenAI API key not found in environment variables');
      return;
    }
    try {
      initializeAI(apiKey);
      console.log('AI service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
    }
  }, []);

  const getLastWord = (line: string) => {
    return line.trim().split(/\s+/).pop() || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const lastWord = getLastWord(searchTerm);
    setApiError(null);
    setUsageError(null);
    
    try {
      setIsGenerating(true);

      if (isLineMode) {
        // In Line Mode, only get AI suggestions
        try {
          const analysis = await analyzeLine(searchTerm);
          setMood(analysis.mood);
          setStyle(analysis.style);

          const suggestions = await generateRhymingLines(searchTerm, {
            mood: analysis.mood,
            style: analysis.style,
          });
          setSuggestedLines(suggestions);
        } catch (error: any) {
          console.error('AI Service Error:', error);
          if (error.message.includes('limit reached')) {
            setUsageError(error.message);
          } else if (error.message.includes('insufficient_quota')) {
            setApiError('OpenAI API credits required. Please set up billing at platform.openai.com');
          } else {
            setApiError('Unable to generate AI suggestions. Please try again later.');
          }
          setSuggestedLines([]);
          setMood('');
          setStyle('');
        }
      } else {
        // In Word Mode, only get rhyming words
        const response = await fetch(`https://api.datamuse.com/words?rel_rhy=${lastWord}`);
        const rhymingWords = await response.json();
        const rhymes = rhymingWords.map((word: any) => word.word).slice(0, 10);
        onSearch(lastWord, rhymes);
      }
    } catch (error) {
      console.error('Error:', error);
      setSuggestedLines([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLine = (line: string, index: number) => {
    navigator.clipboard.writeText(line);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-12">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-6 border border-[#7C3AED]/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isLineMode ? "Enter a line of poetry..." : "Enter a word to find rhymes..."}
              className="w-full px-6 py-4 text-lg rounded-xl border-2 border-[#7C3AED]/20 
                focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 
                transition-all outline-none pr-12
                placeholder:text-gray-400"
              disabled={isLoading || isGenerating}
            />
            <MdSearch className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#7C3AED]" />
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white 
                px-8 py-4 rounded-xl font-medium text-lg shadow-lg 
                shadow-[#7C3AED]/25 hover:shadow-[#7C3AED]/40 
                transition-all hover:-translate-y-0.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || isGenerating}
            >
              {(isLoading || isGenerating) ? (
                <span className="flex items-center gap-2">
                  <MdAutorenew className="animate-spin" />
                  {isGenerating ? 'Generating...' : 'Searching...'}
                </span>
              ) : (
                isLineMode ? 'Generate Lines' : 'Find Rhymes'
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setIsLineMode(!isLineMode)}
              className={`px-4 py-4 rounded-xl border-2 transition-all ${
                isLineMode 
                  ? 'border-[#7C3AED] bg-[#7C3AED]/5 text-[#7C3AED]' 
                  : 'border-[#7C3AED]/20 hover:bg-[#7C3AED]/5 text-[#7C3AED]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isLineMode ? "Switch to Word Mode" : "Switch to Line Mode"}
            >
              {isLineMode ? "Line Mode" : "Word Mode"}
            </motion.button>
          </div>
        </form>

        {/* Line Analysis */}
        {isLineMode && (mood || style) && (
          <motion.div 
            className="mt-8 flex gap-4 flex-wrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {mood && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C3AED]/5 text-sm text-gray-700 border border-[#7C3AED]/10">
                <MdMood className="text-[#7C3AED]" />
                <span>Mood: {mood}</span>
              </div>
            )}
            {style && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C3AED]/5 text-sm text-gray-700 border border-[#7C3AED]/10">
                <MdStyle className="text-[#7C3AED]" />
                <span>Style: {style}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Suggested Lines */}
        {isLineMode && suggestedLines.length > 0 && (
          <motion.div 
            className="mt-10 space-y-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Suggestions</h3>
            {suggestedLines.map((line, index) => (
              <motion.div
                key={index}
                className="group relative p-7 rounded-xl bg-gradient-to-r from-[#7C3AED]/5 via-[#6366F1]/5 to-[#7C3AED]/5 
                  border border-[#7C3AED]/10 hover:border-[#7C3AED]/20 transition-all
                  hover:shadow-lg hover:shadow-[#7C3AED]/5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <p className="text-gray-700 text-lg font-medium pr-12">{line}</p>
                <motion.button
                  onClick={() => handleCopyLine(line, index)}
                  className="absolute top-5 right-5 p-2.5 rounded-lg 
                    bg-white/90 backdrop-blur-sm shadow-sm
                    hover:bg-white hover:shadow-md transition-all
                    text-gray-600 hover:text-[#7C3AED]
                    border border-[#7C3AED]/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedIndex === index ? (
                    <MdCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <MdContentCopy className="w-5 h-5" />
                  )}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* API Error Message */}
        {apiError && (
          <motion.div
            className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MdWarning className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">AI Service Unavailable</p>
              <p className="text-sm mt-1">{apiError}</p>
              <a
                href="https://platform.openai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-800 underline hover:text-amber-900 mt-2 inline-block"
              >
                Set up OpenAI API credits →
              </a>
            </div>
          </motion.div>
        )}

        {/* Usage Error Message */}
        {usageError && (
          <motion.div
            className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MdWarning className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Usage Limit Reached</p>
              <p className="text-sm mt-1">{usageError}</p>
            </div>
          </motion.div>
        )}

        {/* Usage Dashboard */}
        {isLineMode && (
          <div className="mt-6">
            <UsageDashboard usageStats={getUsageStats()} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SearchForm;
