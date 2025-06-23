import React, { useState, useEffect } from 'react';
import { generateQuestion, generateConsequence, calculateSurvival } from '../utils/aiService';

const Game = () => {
  const [gameState, setGameState] = useState('loading'); // loading, playing, consequence, gameOver
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState('');
  const [consequence, setConsequence] = useState('');
  const [dangerLevel, setDangerLevel] = useState(0);
  const [survived, setSurvived] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the game
  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = async () => {
    setIsLoading(true);
    setGameState('loading');
    
    try {
      const question = await generateQuestion();
      setCurrentQuestion(question);
      
      // Parse the question to extract options
      const optionsMatch = question.match(/Would you rather (.+?) or (.+?)\?/);
      if (optionsMatch) {
        setOptions([optionsMatch[1].trim(), optionsMatch[2].trim()]);
      } else {
        // Fallback if parsing fails
        setOptions(['Option A', 'Option B']);
      }
      
      setGameState('playing');
    } catch (error) {
      console.error('Error starting new round:', error);
      // Use fallback question
      setCurrentQuestion("Would you rather fight a bear with a spoon or a shark with a toothpick?");
      setOptions(['Fight a bear with a spoon', 'Fight a shark with a toothpick']);
      setGameState('playing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (choice) => {
    setSelectedChoice(choice);
    setIsLoading(true);
    setGameState('loading');
    
    try {
      const result = await generateConsequence(choice, 'medium', 'balanced', currentRound);
      setConsequence(result.consequence);
      setDangerLevel(result.dangerLevel);
      
      // Calculate survival
      const survivedRound = calculateSurvival(result.dangerLevel, currentRound);
      setSurvived(survivedRound);
      
      setGameState('consequence');
    } catch (error) {
      console.error('Error generating consequence:', error);
      // Use fallback consequence
      setConsequence("Something unexpected happens! The universe seems to be testing you.");
      setDangerLevel(Math.floor(Math.random() * 10) + 1);
      setSurvived(Math.random() > 0.5);
      setGameState('consequence');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!survived) {
      // Game over - player died
      setGameWon(false);
      setGameState('gameOver');
    } else if (currentRound >= 10) {
      // Game won - survived all 10 rounds
      setGameWon(true);
      setGameState('gameOver');
    } else {
      // Continue to next round
      setCurrentRound(prev => prev + 1);
      startNewRound();
    }
  };

  const restartGame = () => {
    setCurrentRound(1);
    setGameState('loading');
    setSelectedChoice('');
    setConsequence('');
    setDangerLevel(0);
    setSurvived(true);
    setGameWon(false);
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
        </div>
        <button className="restart-button" onClick={restartGame}>
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

export default Game; 