import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchForm from './components/SearchForm';
import RhymeResult from './components/RhymeResult';
import WordHistory from './components/WordHistory';
import SyllableFilter from './components/SyllableFilter';
import WordOfDay from './components/WordOfDay';
import HowToUse from './components/HowToUse';
import { useTheme } from './lib/themeContext';
import {
  fetchRhymingWords,
  fetchSoundAlikeWords,
  fetchNearRhymes,
  fetchRelatedWords,
  type RhymeWord
} from './lib/rhymeService';
import { MdErrorOutline } from 'react-icons/md';

function App() {
  const { isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState<'search' | 'howto'>('search');
  const [searchWord, setSearchWord] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rhymes, setRhymes] = useState<RhymeWord[]>([]);
  const [nearRhymes, setNearRhymes] = useState<RhymeWord[]>([]);
  const [soundAlikes, setSoundAlikes] = useState<RhymeWord[]>([]);
  const [relatedWords, setRelatedWords] = useState<RhymeWord[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [syllableFilter, setSyllableFilter] = useState<number | null>(null);

  // Get all unique syllable counts from all word types
  const allSyllableCounts = useMemo(() => {
    const allWords = [...rhymes, ...nearRhymes, ...soundAlikes, ...relatedWords];
    return allWords
      .filter(word => word.numSyllables !== undefined)
      .map(word => word.numSyllables as number);
  }, [rhymes, nearRhymes, soundAlikes, relatedWords]);

  // Filter words by syllable count if a filter is applied
  const filterWordsBySyllables = useCallback((words: RhymeWord[]) => {
    if (syllableFilter === null) return words;
    return words.filter(word => word.numSyllables === syllableFilter);
  }, [syllableFilter]);

  // Filtered results
  const filteredRhymes = useMemo(() =>
    filterWordsBySyllables(rhymes), [rhymes, filterWordsBySyllables]);

  const filteredNearRhymes = useMemo(() =>
    filterWordsBySyllables(nearRhymes), [nearRhymes, filterWordsBySyllables]);

  const filteredSoundAlikes = useMemo(() =>
    filterWordsBySyllables(soundAlikes), [soundAlikes, filterWordsBySyllables]);

  const filteredRelatedWords = useMemo(() =>
    filterWordsBySyllables(relatedWords), [relatedWords, filterWordsBySyllables]);

  // Handle search submission
  const handleSearch = async (word: string) => {
    if (!word.trim()) return;

    setSearchWord(word);
    setIsLoading(true);
    setError('');
    setSyllableFilter(null); // Reset syllable filter on new search

    try {
      // Fetch all word types in parallel
      const [rhymesData, nearRhymesData, soundAlikesData, relatedWordsData] = await Promise.all([
        fetchRhymingWords(word),
        fetchNearRhymes(word),
        fetchSoundAlikeWords(word),
        fetchRelatedWords(word)
      ]);

      setRhymes(rhymesData);
      setNearRhymes(nearRhymesData);
      setSoundAlikes(soundAlikesData);
      setRelatedWords(relatedWordsData);

      // Add word to search history if not already there
      if (!searchHistory.includes(word)) {
        setSearchHistory(prevHistory => [word, ...prevHistory.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Error searching for rhymes:', error);
      setError('Failed to fetch rhyming words. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clicking a word from results or history
  const handleWordClick = (word: string) => {
    handleSearch(word);
  };

  // Handle syllable filter change
  const handleSyllableFilterChange = (count: number | null) => {
    setSyllableFilter(count);
  };

  // Initial animation for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Count for total results with syllable filter applied
  const totalFilteredResults =
    filteredRhymes.length +
    filteredNearRhymes.length +
    filteredSoundAlikes.length +
    filteredRelatedWords.length;

  // Check if we have any results at all (before filtering)
  const hasTotalResults =
    rhymes.length +
    nearRhymes.length +
    soundAlikes.length +
    relatedWords.length > 0;

  return (
    <div className={`min-h-screen flex flex-col ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200'
        : 'bg-gradient-to-br from-gray-50 to-purple-50 text-gray-800'
    }`}>
      <motion.div
        className="max-w-5xl w-full mx-auto px-4 py-8 flex-grow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header onPageChange={setCurrentPage} currentPage={currentPage} />

        <main className="w-full">
          {currentPage === 'search' ? (
            <>
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />

              {/* Word History */}
              <WordHistory
                words={searchHistory}
                onWordClick={handleWordClick}
                currentWord={searchWord}
              />

              {/* Syllable Filter - show only when we have search results */}
              {searchWord && !isLoading && hasTotalResults && (
                <SyllableFilter
                  syllableCounts={allSyllableCounts}
                  onFilterChange={handleSyllableFilterChange}
                  currentFilter={syllableFilter}
                />
              )}

              {/* Error message if needed */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className={`w-full p-4 ${
                      isDark
                        ? 'bg-red-900/30 border-red-800'
                        : 'bg-red-50 border-red-200'
                    } border rounded-lg mb-6 flex items-center ${
                      isDark ? 'text-red-300' : 'text-red-700'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <MdErrorOutline className="mr-2 flex-shrink-0" size={20} />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results section */}
              {searchWord && !isLoading && hasTotalResults && (
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Show message if syllable filter applied but no results */}
                  {syllableFilter !== null && totalFilteredResults === 0 && (
                    <motion.div
                      className={`text-center py-6 mb-6 ${
                        isDark
                          ? 'bg-purple-900/30 border-purple-800 text-purple-200'
                          : 'bg-purple-50 border-purple-100 text-purple-800'
                      } rounded-lg border`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="font-medium">No {syllableFilter}-syllable words found</p>
                      <p className="text-sm mt-1">Try a different syllable count or remove the filter</p>
                    </motion.div>
                  )}

                  {/* Perfect Rhymes */}
                  {(syllableFilter === null || filteredRhymes.length > 0) && (
                    <RhymeResult
                      words={filteredRhymes}
                      title="Perfect Rhymes"
                      onWordClick={handleWordClick}
                      colorClass="bg-purple-600"
                      showRhymeStrength={true}
                    />
                  )}

                  {/* Near Rhymes */}
                  {(syllableFilter === null || filteredNearRhymes.length > 0) && (
                    <RhymeResult
                      words={filteredNearRhymes}
                      title="Near Rhymes"
                      onWordClick={handleWordClick}
                      colorClass="bg-pink-500"
                      showRhymeStrength={true}
                    />
                  )}

                  {/* Sound-Alikes */}
                  {(syllableFilter === null || filteredSoundAlikes.length > 0) && (
                    <RhymeResult
                      words={filteredSoundAlikes}
                      title="Sound-Alike Words"
                      onWordClick={handleWordClick}
                      colorClass="bg-indigo-500"
                      showRhymeStrength={true}
                    />
                  )}

                  {/* Related Words */}
                  {(syllableFilter === null || filteredRelatedWords.length > 0) && (
                    <RhymeResult
                      words={filteredRelatedWords}
                      title="Related Words"
                      onWordClick={handleWordClick}
                      colorClass="bg-blue-500"
                      showRhymeStrength={false} // Disable for related words as they're not rhymes
                    />
                  )}
                </motion.div>
              )}

              {/* Show message if no results found */}
              {searchWord && !isLoading && !hasTotalResults && (
                <motion.div
                  className={`text-center py-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xl font-medium mb-2">No results found for "{searchWord}"</p>
                  <p>Try a different word or check your spelling</p>
                </motion.div>
              )}

              {/* Initial state - show Word of Day component when no search has been made */}
              {!searchWord && !isLoading && (
                <motion.div
                  className={`flex flex-col items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-full max-w-2xl mx-auto">
                    <WordOfDay onSearchWord={handleSearch} />
                  </div>

                  <p className="text-xl font-medium mb-4 mt-4">Enter a word to find rhymes</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                    <div className={`p-4 backdrop-blur-sm rounded-lg shadow-sm border ${
                      isDark
                        ? 'bg-gray-800/70 border-gray-700'
                        : 'bg-white/70 border-purple-100'
                    }`}>
                      <h3 className={`font-medium ${
                        isDark ? 'text-purple-300' : 'text-purple-700'
                      } mb-2`}>Perfect for Songwriters</h3>
                      <p className="text-sm">Find the perfect rhyming words for your lyrics, discover near rhymes for creative flexibility, and explore related words to inspire your songwriting.</p>
                    </div>
                    <div className={`p-4 backdrop-blur-sm rounded-lg shadow-sm border ${
                      isDark
                        ? 'bg-gray-800/70 border-gray-700'
                        : 'bg-white/70 border-purple-100'
                    }`}>
                      <h3 className={`font-medium ${
                        isDark ? 'text-purple-300' : 'text-purple-700'
                      } mb-2`}>Ideal for Poets</h3>
                      <p className="text-sm">Enhance your poetry with a variety of rhyme types, from perfect matches to near rhymes. Explore sound-alike words and related concepts to deepen your verse.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <HowToUse />
          )}
        </main>
      </motion.div>

      <Footer />
    </div>
  );
}

export default App;
