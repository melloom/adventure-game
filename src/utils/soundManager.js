// Sound Manager for handling audio effects
class SoundManager {
  constructor() {
    this.clickSound = null;
    this.isInitialized = false;
    this.soundEnabled = true;
    this.init();
  }

  async init() {
    try {
      // Create audio element for click sound
      this.clickSound = new Audio('/click-buttons-ui-menu-sounds-effects-button-7-203601.mp3');
      
      // Set properties for the click sound
      this.clickSound.volume = 0.3;
      this.clickSound.preload = 'auto';
      
      // Handle audio loading and trimming
      this.clickSound.addEventListener('loadedmetadata', () => {
        console.log('Click sound loaded, duration:', this.clickSound.duration);
      });
      
      this.clickSound.addEventListener('canplaythrough', () => {
        console.log('Click sound ready to play');
      });
      
      this.isInitialized = true;
      console.log('Sound manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize sound manager:', error);
    }
  }

  playClickSound() {
    if (!this.isInitialized || !this.soundEnabled || !this.clickSound) {
      return;
    }

    try {
      // Reset the audio to the beginning
      this.clickSound.currentTime = 0;
      
      // Play the sound
      this.clickSound.play().catch(error => {
        console.log('Click sound play blocked:', error);
      });
      
      // Stop the sound after 1 second to trim it
      setTimeout(() => {
        if (this.clickSound && !this.clickSound.paused) {
          this.clickSound.pause();
          this.clickSound.currentTime = 0;
        }
      }, 1000);
    } catch (error) {
      console.error('Error playing click sound:', error);
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    if (this.clickSound) {
      this.clickSound.muted = !enabled;
    }
  }

  setVolume(volume) {
    if (this.clickSound) {
      this.clickSound.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

// Create a singleton instance
const soundManager = new SoundManager();

// Export the singleton instance
export default soundManager;

// Export a convenience function for playing click sounds
export const playClickSound = () => {
  soundManager.playClickSound();
};

// Export functions for managing sound settings
export const setSoundEnabled = (enabled) => {
  soundManager.setSoundEnabled(enabled);
};

export const setSoundVolume = (volume) => {
  soundManager.setVolume(volume);
}; 