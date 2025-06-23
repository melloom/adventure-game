import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Specific hooks for game data
export const useGameStats = () => {
  const [stats, setStats] = useLocalStorage('gameStats', {
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
    highestScore: 0,
    longestSurvival: 0,
    averageRoundsSurvived: 0
  });

  const updateStats = (gameResult) => {
    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (gameResult.won ? 1 : 0),
      totalScore: stats.totalScore + gameResult.score,
      highestScore: Math.max(stats.highestScore, gameResult.score),
      longestSurvival: Math.max(stats.longestSurvival, gameResult.roundsSurvived),
      averageRoundsSurvived: Math.round(
        (stats.averageRoundsSurvived * stats.gamesPlayed + gameResult.roundsSurvived) / 
        (stats.gamesPlayed + 1)
      )
    };
    setStats(newStats);
  };

  const resetStats = () => {
    setStats({
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      highestScore: 0,
      longestSurvival: 0,
      averageRoundsSurvived: 0
    });
  };

  return { stats, updateStats, resetStats };
};

export const useHighScores = () => {
  const [highScores, setHighScores] = useLocalStorage('highScores', []);

  const addHighScore = (score, roundsSurvived, date = new Date().toISOString()) => {
    const newScore = {
      score,
      roundsSurvived,
      date,
      id: Date.now()
    };

    const updatedScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10

    setHighScores(updatedScores);
  };

  const clearHighScores = () => {
    setHighScores([]);
  };

  return { highScores, addHighScore, clearHighScores };
}; 