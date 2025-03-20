import React from 'react';

const HowToUse: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">How to Use the Rhyme Finder</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <p className="mb-4">
          The Rhyme Finder is a powerful tool designed to help poets, songwriters, and anyone looking for perfect rhymes. 
          Simply enter a word in the search box and discover a variety of rhyming options.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium mb-2">Word Search</h3>
            <p>Enter any word to find its rhymes. The app will show both exact and near rhymes.</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Syllable Filter</h3>
            <p>Use the syllable filter to find rhymes that match the syllable count of your original word.</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Stress Pattern Display</h3>
            <p>See the stress pattern of each word to ensure perfect rhythm in your writing.</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Pronunciation</h3>
            <p>Click the speaker icon to hear how each word is pronounced.</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Word History</h3>
            <p>Access your recent searches to quickly find previously discovered rhymes.</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Theme Toggle</h3>
            <p>Switch between light and dark themes for comfortable viewing in any lighting condition.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Best Results</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Start with simple, common words for the most results</li>
          <li>Use the syllable filter to match the rhythm of your writing</li>
          <li>Check the stress patterns to ensure natural flow</li>
          <li>Listen to pronunciations to verify the rhyme quality</li>
          <li>Save your favorite rhymes using the copy feature</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium mb-2">What's the difference between exact and near rhymes?</h3>
            <p>Exact rhymes share the same ending sound, while near rhymes have similar but not identical ending sounds.</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">How do I copy a word to use in my writing?</h3>
            <p>Simply click on any rhyming word to copy it to your clipboard.</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">How accurate are the pronunciations?</h3>
            <p>We use high-quality text-to-speech technology for accurate pronunciations.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToUse; 