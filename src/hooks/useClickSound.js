import { useCallback } from 'react';
import { playClickSound, setSoundEnabled } from '../utils/soundManager';

// Custom hook for adding click sounds to buttons
export const useClickSound = () => {
  // Function to wrap button click handlers with sound
  const withClickSound = useCallback((handler) => {
    return (...args) => {
      // Play the click sound
      playClickSound();
      
      // Call the original handler
      if (handler) {
        handler(...args);
      }
    };
  }, []);

  // Function to update sound settings
  const updateSoundSettings = useCallback((enabled) => {
    setSoundEnabled(enabled);
  }, []);

  return {
    withClickSound,
    updateSoundSettings,
    playClickSound
  };
};

export default useClickSound; 