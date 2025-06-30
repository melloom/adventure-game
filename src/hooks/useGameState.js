import { useState, useCallback } from 'react';

export const useGameState = () => {
  const [gameState, setGameState] = useState('loading');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState('');
  const [consequence, setConsequence] = useState('');
  const [dangerLevel, setDangerLevel] = useState(0);
  const [survived, setSurvived] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [totalRoundsSurvived, setTotalRoundsSurvived] = useState(0);

  const resetGame = useCallback(() => {
    setGameState('loading');
    setCurrentRound(1);
    setCurrentQuestion('');
    setOptions([]);
    setSelectedChoice('');
    setConsequence('');
    setDangerLevel(0);
    setSurvived(true);
    setGameWon(false);
    setIsLoading(false);
    setScore(0);
    setTotalRoundsSurvived(0);
  }, []);

  const updateGameState = useCallback((newState) => {
    setGameState(newState);
  }, []);

  const setLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  const updateQuestion = useCallback((question, questionOptions) => {
    setCurrentQuestion(question);
    setOptions(questionOptions);
  }, []);

  const updateConsequence = useCallback((consequenceData) => {
    setConsequence(consequenceData.consequence);
    setDangerLevel(consequenceData.dangerLevel);
    setSurvived(consequenceData.survived);
  }, []);

  const nextRound = useCallback(() => {
    if (!survived) {
      setGameWon(false);
      setGameState('gameOver');
    } else if (currentRound >= 10) {
      setGameWon(true);
      setGameState('gameOver');
    } else {
      setCurrentRound(prev => prev + 1);
      setTotalRoundsSurvived(prev => prev + 1);
      setScore(prev => prev + (10 - dangerLevel)); // Higher danger = lower score
    }
  }, [survived, currentRound, dangerLevel]);

  const selectChoice = useCallback((choice) => {
    setSelectedChoice(choice);
  }, []);

  return {
    // State
    gameState,
    currentRound,
    currentQuestion,
    options,
    selectedChoice,
    consequence,
    dangerLevel,
    survived,
    gameWon,
    isLoading,
    score,
    totalRoundsSurvived,
    
    // Actions
    resetGame,
    updateGameState,
    setLoading,
    updateQuestion,
    updateConsequence,
    nextRound,
    selectChoice
  };
}; 