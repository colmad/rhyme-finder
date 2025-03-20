import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MdVolumeUp, MdError } from 'react-icons/md';
import { speakText, getPreferredVoice, isSpeechSynthesisSupported } from '../lib/speechService';

interface PronunciationButtonProps {
  word: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PronunciationButton = ({
  word,
  size = 'md',
  className = ''
}: PronunciationButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [preferredVoice, setPreferredVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Get the preferred voice on component mount
  useEffect(() => {
    const checkSupport = () => {
      const supported = isSpeechSynthesisSupported();
      setIsSupported(supported);

      if (supported) {
        getPreferredVoice().then(voice => {
          setPreferredVoice(voice);
        });
      }
    };

    checkSupport();
  }, []);

  // Play pronunciation handler
  const handlePlayPronunciation = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements

    if (isPlaying || !isSupported) return;

    try {
      setIsPlaying(true);
      setHasError(false);

      // Speech options
      const options = {
        rate: 0.9, // Slightly slower for better clarity
        pitch: 1,
        volume: 1,
        lang: 'en-US'
      };

      // Add voice if we found a preferred one
      if (preferredVoice) {
        Object.assign(options, { voiceURI: preferredVoice.voiceURI });
      }

      await speakText(word, options);
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setHasError(true);
    } finally {
      setIsPlaying(false);
    }
  }, [word, isPlaying, isSupported, preferredVoice]);

  // If speech synthesis is not supported, don't render the button
  if (!isSupported) return null;

  // Size variations
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  return (
    <motion.button
      className={`rounded-full flex items-center justify-center ${sizeClasses[size]} ${
        isPlaying
          ? 'bg-purple-600 text-white'
          : hasError
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
      } transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${className}`}
      onClick={handlePlayPronunciation}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      title={hasError ? 'Error playing pronunciation' : `Pronounce ${word}`}
      aria-label={hasError ? 'Error playing pronunciation' : `Pronounce ${word}`}
      disabled={isPlaying}
    >
      {hasError ? (
        <MdError
          size={size === 'sm' ? 14 : size === 'md' ? 18 : 22}
          className="animate-pulse"
        />
      ) : (
        <MdVolumeUp
          size={size === 'sm' ? 14 : size === 'md' ? 18 : 22}
          className={isPlaying ? 'animate-pulse' : ''}
        />
      )}
    </motion.button>
  );
};

export default PronunciationButton;
