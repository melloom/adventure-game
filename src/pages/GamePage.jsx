import React, { useEffect, useState } from 'react';
import { useOpenAI } from '../hooks/useOpenAI';
import { useGameStats, useHighScores } from '../hooks/useLocalStorage';
import HorrorEffects from '../components/HorrorEffects';
import MiniGames from '../components/MiniGames';
import horrorSystem from '../utils/horrorSystem';

const GamePage = ({ 
  onGameEnd, 
  difficulty = 'medium', 
  personality = 'balanced',
  currentRound,
  currentGameQuestion,
  selectedOption,
  consequence,
  showConsequence,
  score,
  dangerScore,
  gameOver,
  onOptionSelect,
  onNextRound,
  onRestartGame,
  isLoading
}) => {

  const { fetchQuestion, fetchConsequence } = useOpenAI();
  const { updateStats } = useGameStats();
  const { addHighScore } = useHighScores();

  const [fearLevel, setFearLevel] = useState(0);
  const [atmosphere, setAtmosphere] = useState('normal');
  const [showEnvItems, setShowEnvItems] = useState(false);
  const [miniGame, setMiniGame] = useState(null);
  const [miniGameDifficulty, setMiniGameDifficulty] = useState('medium');

  // Example: update horror system on game state changes
  useEffect(() => {
    horrorSystem.setAtmosphere(atmosphere, dangerScore);
  }, [atmosphere, dangerScore]);

  // Example: trigger mini-game on high danger
  useEffect(() => {
    if (dangerScore >= 70 && !miniGame) {
      setMiniGame('quick_time');
      setMiniGameDifficulty('hard');
    }
  }, [dangerScore, miniGame]);

  const handleChoice = async (option) => {
    if (onOptionSelect) {
      onOptionSelect(option);
    }
  };

  const handleNext = () => {
    if (onNextRound) {
      onNextRound();
    }
  };

  const handleRestart = () => {
    if (onRestartGame) {
      onRestartGame();
    }
  };

  // Example: show environmental items on certain events
  const handleShowEnvItems = () => {
    setShowEnvItems(true);
  };

  // Example: handle mini-game completion
  const handleMiniGameComplete = (result) => {
    setMiniGame(null);
    if (result && result.type === 'quick_time' && result.score < 5) {
      setFearLevel(fearLevel + 2);
      horrorSystem.triggerJumpScare(0.7, 0);
    } else {
      setFearLevel(Math.max(0, fearLevel - 1));
    }
  };

  // Example: handle mini-game fail
  const handleMiniGameFail = (result) => {
    setMiniGame(null);
    setFearLevel(fearLevel + 3);
    horrorSystem.triggerJumpScare(1.0, 0);
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

  if (gameOver) {
    return (
      <div className="game-container">
        <h1 className="game-title">Would You Rather Survival</h1>
        <div className={`game-over ${dangerScore <= 100 ? 'win' : 'lose'}`}>
          {dangerScore <= 100 
            ? "🎉 CONGRATULATIONS! You survived all 10 rounds and won the game! 🎉"
            : "💀 GAME OVER! You didn't survive the challenge. Better luck next time! 💀"
          }
          <div className="final-score">
            <p>Final Score: {score}</p>
            <p>Danger Score: {dangerScore}/100</p>
          </div>
        </div>
        <button className="restart-button" onClick={handleRestart}>
          Play Again
        </button>
      </div>
    );
  }

  if (showConsequence) {
    return (
      <div className="game-container">
        <h1 className="game-title">Would You Rather Survival</h1>
        <div className="round-info">
          Round {currentRound} of 10
        </div>
        
        <div className="consequence">
          <div className="danger-level">
            Danger Score: {dangerScore}/100
          </div>
          <p>{consequence}</p>
          {dangerScore > 100 && <p style={{fontWeight: 'bold', marginTop: '10px'}}>💀 You didn't survive this round!</p>}
        </div>
        
        <button className="next-button" onClick={handleNext}>
          {dangerScore > 100 ? 'See Results' : currentRound >= 10 ? 'Finish Game' : 'Continue'}
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
        <h2 className="question">{currentGameQuestion?.question || "Loading question..."}</h2>
        
        <div className="options-container">
          <button
            className="option-button"
            onClick={() => handleChoice('A')}
          >
            {currentGameQuestion?.optionA || "Option A"}
          </button>
          <button
            className="option-button"
            onClick={() => handleChoice('B')}
          >
            {currentGameQuestion?.optionB || "Option B"}
          </button>
        </div>
      </div>
      <HorrorEffects 
        atmosphere={atmosphere}
        dangerLevel={dangerScore}
        fearLevel={fearLevel}
        showEnvironmentalItems={showEnvItems}
        onEnvironmentalItemFound={() => setShowEnvItems(false)}
      />
      <MiniGames 
        gameType={miniGame}
        difficulty={miniGameDifficulty}
        onComplete={handleMiniGameComplete}
        onFail={handleMiniGameFail}
      />
    </div>
  );
};

export default GamePage; 