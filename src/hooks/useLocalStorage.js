import { useState, useEffect, useCallback, useRef } from 'react';
import storageManager from '../utils/storageManager';

export const useLocalStorage = (key, initialValue, options = {}) => {
  const { 
    debounce = true, 
    validate = true, 
    sync = true,
    onError = null 
  } = options;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      return storageManager.get(key, initialValue);
    } catch (error) {
      console.error(`Error initializing localStorage for key "${key}":`, error);
      if (onError) onError(error);
      return initialValue;
    }
  });

  const isInitialized = useRef(false);
  const lastSavedValue = useRef(initialValue);

  // Sync with other tabs/windows
  useEffect(() => {
    if (!sync) return;

    const handleStorageChange = (e) => {
      if (e.key === storageManager.storagePrefix + key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, sync]);

  // Enhanced setter with better error handling and performance
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Prevent unnecessary saves
      if (JSON.stringify(valueToStore) === JSON.stringify(lastSavedValue.current)) {
        return;
      }

      setStoredValue(valueToStore);
      lastSavedValue.current = valueToStore;

      // Use storage manager for better performance and error handling
      const success = storageManager.set(key, valueToStore, { debounce, validate });
      
      if (!success && onError) {
        onError(new Error(`Failed to save data for key "${key}"`));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      if (onError) onError(error);
    }
  }, [storedValue, key, debounce, validate, onError]);

  // Force immediate save
  const forceSave = useCallback(() => {
    storageManager.set(key, storedValue, { debounce: false, validate });
  }, [key, storedValue, validate]);

  // Reset to initial value
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [setValue, initialValue]);

  // Get storage usage info
  const getStorageInfo = useCallback(() => {
    return storageManager.getStorageUsage();
  }, []);

  return [storedValue, setValue, { forceSave, reset, getStorageInfo }];
};

// Specific hooks for game data
export const useGameStats = () => {
  const [stats, setStats] = useLocalStorage('gameStats', {
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
    highestScore: 0,
    longestSurvival: 0,
    averageRoundsSurvived: 0,
    lastUpdated: null,
    version: '1.0.0'
  }, { debounce: true, validate: true });

  const updateStats = useCallback((gameResult) => {
    setStats(prevStats => {
      const newStats = {
        gamesPlayed: prevStats.gamesPlayed + 1,
        gamesWon: prevStats.gamesWon + (gameResult.won ? 1 : 0),
        totalScore: prevStats.totalScore + gameResult.score,
        highestScore: Math.max(prevStats.highestScore, gameResult.score),
        longestSurvival: Math.max(prevStats.longestSurvival, gameResult.roundsSurvived),
        averageRoundsSurvived: Math.round(
          (prevStats.averageRoundsSurvived * prevStats.gamesPlayed + gameResult.roundsSurvived) / 
          (prevStats.gamesPlayed + 1)
        ),
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      };
      return newStats;
    });
  }, [setStats]);

  const resetStats = useCallback(() => {
    setStats({
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      highestScore: 0,
      longestSurvival: 0,
      averageRoundsSurvived: 0,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    });
  }, [setStats]);

  const getWinRate = useCallback(() => {
    return stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed * 100).toFixed(1) : 0;
  }, [stats]);

  const getAverageScore = useCallback(() => {
    return stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0;
  }, [stats]);

  return { 
    stats, 
    updateStats, 
    resetStats, 
    getWinRate, 
    getAverageScore 
  };
};

export const useHighScores = () => {
  const [highScores, setHighScores] = useLocalStorage('highScores', [], {
    debounce: true,
    validate: true
  });

  const addHighScore = useCallback((score, roundsSurvived, date = new Date().toISOString()) => {
    const newScore = {
      score,
      roundsSurvived,
      date,
      id: Date.now(),
      version: '1.0.0'
    };

    setHighScores(prevScores => {
      const updatedScores = [...prevScores, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Keep only top 10
      return updatedScores;
    });
  }, [setHighScores]);

  const clearHighScores = useCallback(() => {
    setHighScores([]);
  }, [setHighScores]);

  const isHighScore = useCallback((score) => {
    if (highScores.length < 10) return true;
    return score > highScores[highScores.length - 1]?.score;
  }, [highScores]);

  const getRank = useCallback((score) => {
    const rank = highScores.findIndex(scoreData => scoreData.score <= score);
    return rank === -1 ? highScores.length + 1 : rank + 1;
  }, [highScores]);

  return { 
    highScores, 
    addHighScore, 
    clearHighScores, 
    isHighScore, 
    getRank 
  };
};

// New hook for settings with validation
export const useGameSettings = () => {
  const [settings, setSettings] = useLocalStorage('gameSettings', {
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'normal',
    autoSave: true,
    theme: 'default',
    notifications: true,
    performanceMode: false,
    lastUpdated: null,
    version: '1.0.0'
  }, { debounce: true, validate: true });

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
      lastUpdated: new Date().toISOString()
    }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings({
      soundEnabled: true,
      musicEnabled: true,
      difficulty: 'normal',
      autoSave: true,
      theme: 'default',
      notifications: true,
      performanceMode: false,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    });
  }, [setSettings]);

  return { settings, updateSetting, resetSettings };
};

// New hook for user profile with validation
export const useUserProfile = () => {
  const [profile, setProfile] = useLocalStorage('userProfile', {
    name: '',
    age: '',
    interests: '',
    difficulty: 'medium',
    personality: 'balanced',
    createdAt: null,
    lastUpdated: null,
    version: '1.0.0'
  }, { debounce: true, validate: true });

  const updateProfile = useCallback((updates) => {
    setProfile(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString()
    }));
  }, [setProfile]);

  const isValidProfile = useCallback(() => {
    // Check if name exists and is at least 2 characters
    if (!profile.name || profile.name.trim().length < 2) {
      return false;
    }
    
    // Check if age exists and is a valid number between 13-100
    if (!profile.age || profile.age.toString().trim() === '') {
      return false;
    }
    
    const age = parseInt(profile.age);
    if (isNaN(age) || age < 13 || age > 100) {
      return false;
    }
    
    // Check if required fields are filled
    if (!profile.difficulty || !profile.personality) {
      return false;
    }
    
    return true;
  }, [profile]);

  const resetProfile = useCallback(() => {
    setProfile({
      name: '',
      age: '',
      interests: '',
      difficulty: 'medium',
      personality: 'balanced',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    });
  }, [setProfile]);

  return { profile, updateProfile, isValidProfile, resetProfile };
};

// New hook for auto-saving game state
export const useGameState = () => {
  const [gameState, setGameState] = useLocalStorage('currentGameState', {
    gameStarted: false,
    currentRound: 1,
    score: 0,
    dangerScore: 0,
    gameOver: false,
    showConsequence: false,
    consequence: '',
    selectedOption: null,
    survivalStatus: 'safe',
    selectedChapter: null,
    gameMode: 'classic',
    gameHistory: [],
    gameChoices: [],
    points: {
      survival: 0,
      bravery: 0,
      wisdom: 0,
      chaos: 0,
      heroism: 0,
      villainy: 0,
      luck: 0,
      skill: 0,
      total: 0
    },
    achievements: [],
    bonuses: [],
    storyArc: {
      protagonist: '',
      setting: '',
      currentSituation: '',
      allies: [],
      enemies: [],
      powers: [],
      weaknesses: [],
      worldState: '',
      narrative: []
    },
    currentGameQuestion: null,
    lastSaved: null,
    version: '1.0.0'
  }, { debounce: true, validate: true });

  const saveGameState = useCallback((newState, autoSave = true) => {
    if (autoSave) {
      setGameState(prev => ({
        ...prev,
        ...newState,
        lastSaved: new Date().toISOString()
      }));
    }
  }, [setGameState]);

  const loadGameState = useCallback(() => {
    return gameState;
  }, [gameState]);

  const clearGameState = useCallback(() => {
    setGameState({
      gameStarted: false,
      currentRound: 1,
      score: 0,
      dangerScore: 0,
      gameOver: false,
      showConsequence: false,
      consequence: '',
      selectedOption: null,
      survivalStatus: 'safe',
      selectedChapter: null,
      gameMode: 'classic',
      gameHistory: [],
      gameChoices: [],
      points: {
        survival: 0,
        bravery: 0,
        wisdom: 0,
        chaos: 0,
        heroism: 0,
        villainy: 0,
        luck: 0,
        skill: 0,
        total: 0
      },
      achievements: [],
      bonuses: [],
      storyArc: {
        protagonist: '',
        setting: '',
        currentSituation: '',
        allies: [],
        enemies: [],
        powers: [],
        weaknesses: [],
        worldState: '',
        narrative: []
      },
      currentGameQuestion: null,
      lastSaved: new Date().toISOString(),
      version: '1.0.0'
    });
  }, [setGameState]);

  const hasSavedGame = useCallback(() => {
    return gameState.gameStarted && !gameState.gameOver && gameState.lastSaved;
  }, [gameState]);

  return { 
    gameState, 
    saveGameState, 
    loadGameState, 
    clearGameState, 
    hasSavedGame 
  };
}; 