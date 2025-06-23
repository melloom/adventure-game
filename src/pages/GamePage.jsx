import React, { useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useOpenRouter } from '../hooks/useOpenRouter';
import { useGameStats, useHighScores } from '../hooks/useLocalStorage';

const GamePage = ({ onGameEnd, difficulty = 'medium', personality = 'balanced' }) => {
  const {
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
    resetGame,
    updateGameState,
    setLoading,
    updateQuestion,
    updateConsequence,
    nextRound,
    selectChoice
  } = useGameState();

  const { fetchQuestion, fetchConsequence } = useOpenRouter();
  const { updateStats } = useGameStats();
  const { addHighScore } = useHighScores();

  // Initialize the game
  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = async () => {
    setLoading(true);
    updateGameState('loading');
    
    try {
      const questionData = await fetchQuestion(difficulty, personality);
      updateQuestion(questionData.question, questionData.options);
      updateGameState('playing');
    } catch (error) {
      console.error('Error starting new round:', error);
      updateQuestion(
        "Would you rather fight a bear with a spoon or a shark with a toothpick?",
        ['Fight a bear with a spoon', 'Fight a shark with a toothpick']
      );
      updateGameState('playing');
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (choice) => {
    selectChoice(choice);
    setLoading(true);
    updateGameState('loading');
    
    try {
      const consequenceData = await fetchConsequence(choice, difficulty, personality, currentRound);
      updateConsequence(consequenceData);
      updateGameState('consequence');
    } catch (error) {
      console.error('Error generating consequence:', error);
      updateConsequence({
        consequence: "Something unexpected happens! The universe seems to be testing you.",
        dangerLevel: Math.floor(Math.random() * 10) + 1,
        survived: Math.random() > 0.5
      });
      updateGameState('consequence');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!survived) {
      // Game over - player died
      const gameResult = {
        won: false,
        score,
        roundsSurvived: totalRoundsSurvived
      };
      updateStats(gameResult);
      addHighScore(score, totalRoundsSurvived);
      onGameEnd(gameResult);
    } else if (currentRound >= 10) {
      // Game won - survived all 10 rounds
      const gameResult = {
        won: true,
        score: score + 50, // Bonus for winning
        roundsSurvived: 10
      };
      updateStats(gameResult);
      addHighScore(gameResult.score, 10);
      onGameEnd(gameResult);
    } else {
      // Continue to next round
      nextRound();
      startNewRound();
    }
  };

  const handleRestart = () => {
    resetGame();
    startNewRound();
  };

  if (isLoading) {
    return (
      <div className="game-container">
        <div className="loading">
          <div className="spinner"></div>
          <span>Generating your fate...</span>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="game-container">
        <h1 className="game-title">Would You Rather Survival</h1>
        <div className={`game-over ${gameWon ? 'win' : 'lose'}`}>
          {gameWon 
            ? "🎉 CONGRATULATIONS! You survived all 10 rounds and won the game! 🎉"
            : "💀 GAME OVER! You didn't survive the challenge. Better luck next time! 💀"
          }
          <div className="final-score">
            <p>Final Score: {score}</p>
            <p>Rounds Survived: {totalRoundsSurvived}</p>
          </div>
        </div>
        <button className="restart-button" onClick={handleRestart}>
          Play Again
        </button>
      </div>
    );
  }

  if (gameState === 'consequence') {
    return (
      <div className="game-container">
        <h1 className="game-title">Would You Rather Survival</h1>
        <div className="round-info">
          Round {currentRound} of 10
        </div>
        
        <div className="consequence">
          <div className="danger-level">
            Danger Level: {dangerLevel}/10
          </div>
          <p>{consequence}</p>
          {!survived && <p style={{fontWeight: 'bold', marginTop: '10px'}}>💀 You didn't survive this round!</p>}
        </div>
        
        <button className="next-button" onClick={handleNext}>
          {!survived ? 'See Results' : currentRound >= 10 ? 'Finish Game' : 'Continue'}
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1 className="game-title">Would You Rather Survival</h1>
      <p className="game-subtitle">Survive 10 rounds of impossible choices!</p>
      
      <div className="round-info">
        Round {currentRound} of 10
      </div>
      
      <div className="question-container">
        <h2 className="question">{currentQuestion}</h2>
        
        <div className="options-container">
          {options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => handleChoice(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePage; 