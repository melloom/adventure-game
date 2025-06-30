import React, { useState, useEffect, useCallback } from 'react';
import horrorSystem from '../utils/horrorSystem';
import './MiniGames.css';

const MiniGames = ({ 
  gameType = null, 
  difficulty = 'medium',
  onComplete = null,
  onFail = null 
}) => {
  const [gameState, setGameState] = useState('waiting');
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [hidingSpots, setHidingSpots] = useState([]);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    if (gameType) {
      startGame();
    }
  }, [gameType, difficulty]);

  useEffect(() => {
    let timer;
    if (gameState === 'active' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameFail();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    switch (gameType) {
      case 'quick_time':
        startQuickTimeEvent();
        break;
      case 'hiding':
        startHidingMechanic();
        break;
      case 'stealth':
        startStealthSequence();
        break;
      default:
        break;
    }
  };

  const startQuickTimeEvent = () => {
    const duration = difficulty === 'easy' ? 5000 : difficulty === 'medium' ? 3000 : 2000;
    setTimeLeft(duration / 1000);
    setGameState('active');
    setScore(0);
  };

  const startHidingMechanic = () => {
    const safeSpots = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 3 : 2;
    const timeLimit = difficulty === 'easy' ? 15000 : difficulty === 'medium' ? 10000 : 8000;
    
    // Generate hiding spots with some being safe and some dangerous
    const spots = [];
    const safeSpotIndex = Math.floor(Math.random() * safeSpots);
    
    for (let i = 0; i < safeSpots; i++) {
      spots.push({
        id: i,
        isSafe: i === safeSpotIndex,
        isRevealed: false
      });
    }
    
    setHidingSpots(spots);
    setTimeLeft(timeLimit / 1000);
    setGameState('active');
  };

  const startStealthSequence = () => {
    const maxNoise = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 7;
    setNoiseLevel(0);
    setTimeLeft(30); // 30 seconds
    setGameState('active');
  };

  const handleQuickTimeClick = useCallback(() => {
    if (gameState === 'active') {
      setScore(prev => prev + 1);
      // Trigger horror effect
      horrorSystem.triggerJumpScare(0.3, 100);
    }
  }, [gameState]);

  const handleHidingSpotClick = useCallback((spot) => {
    if (gameState === 'active' && !spot.isRevealed) {
      const updatedSpots = hidingSpots.map(s => 
        s.id === spot.id ? { ...s, isRevealed: true } : s
      );
      setHidingSpots(updatedSpots);
      setSelectedSpot(spot);

      if (spot.isSafe) {
        handleGameSuccess();
      } else {
        handleGameFail();
      }
    }
  }, [gameState, hidingSpots]);

  const handleStealthAction = useCallback((action) => {
    if (gameState === 'active') {
      let noiseIncrease = 0;
      
      switch (action) {
        case 'move_slow':
          noiseIncrease = 1;
          break;
        case 'move_fast':
          noiseIncrease = 3;
          break;
        case 'use_item':
          noiseIncrease = 2;
          break;
        case 'wait':
          noiseIncrease = -0.5; // Reduce noise by waiting
          break;
        default:
          break;
      }

      setNoiseLevel(prev => {
        const newLevel = Math.max(0, Math.min(10, prev + noiseIncrease));
        if (newLevel >= 8) {
          handleGameFail();
        }
        return newLevel;
      });
    }
  }, [gameState]);

  const handleGameSuccess = () => {
    setGameState('success');
    if (onComplete) {
      onComplete({ type: gameType, score, timeLeft });
    }
  };

  const handleGameFail = () => {
    setGameState('failed');
    // Trigger horror effect
    horrorSystem.triggerJumpScare(0.8, 0);
    if (onFail) {
      onFail({ type: gameType, score, timeLeft });
    }
  };

  const renderQuickTimeEvent = () => (
    <div className="mini-game-overlay">
      <div className="quick-time-event">
        <h2>Quick Time Event!</h2>
        <p>Click the button as fast as you can!</p>
        <div className="time-display">Time: {timeLeft}s</div>
        <div className="score-display">Score: {score}</div>
        <button 
          className="quick-time-button"
          onClick={handleQuickTimeClick}
          disabled={gameState !== 'active'}
        >
          CLICK ME!
        </button>
        <div className="difficulty-indicator">
          Difficulty: {difficulty.toUpperCase()}
        </div>
      </div>
    </div>
  );

  const renderHidingMechanic = () => (
    <div className="mini-game-overlay">
      <div className="hiding-mechanic">
        <h2>Find a Safe Hiding Spot!</h2>
        <p>Choose wisely - some spots are dangerous!</p>
        <div className="time-display">Time: {timeLeft}s</div>
        <div className="hiding-spots">
          {hidingSpots.map(spot => (
            <div
              key={spot.id}
              className={`hiding-spot ${spot.isRevealed ? (spot.isSafe ? 'safe' : 'dangerous') : ''}`}
              onClick={() => handleHidingSpotClick(spot)}
            >
              {spot.isRevealed ? (
                spot.isSafe ? '✅ Safe' : '❌ Dangerous'
              ) : (
                '?'
              )}
            </div>
          ))}
        </div>
        <div className="difficulty-indicator">
          Difficulty: {difficulty.toUpperCase()}
        </div>
      </div>
    </div>
  );

  const renderStealthSequence = () => (
    <div className="mini-game-overlay">
      <div className="stealth-sequence">
        <h2>Stealth Mission</h2>
        <p>Stay quiet! Don't let the noise level get too high.</p>
        <div className="time-display">Time: {timeLeft}s</div>
        <div className="noise-meter">
          <div 
            className="noise-fill" 
            style={{ width: `${(noiseLevel / 10) * 100}%` }}
          />
          <div className="noise-level">{noiseLevel}/10</div>
        </div>
        <div className="stealth-actions">
          <button 
            onClick={() => handleStealthAction('move_slow')}
            disabled={gameState !== 'active'}
          >
            Move Slowly
          </button>
          <button 
            onClick={() => handleStealthAction('move_fast')}
            disabled={gameState !== 'active'}
          >
            Move Fast
          </button>
          <button 
            onClick={() => handleStealthAction('use_item')}
            disabled={gameState !== 'active'}
          >
            Use Item
          </button>
          <button 
            onClick={() => handleStealthAction('wait')}
            disabled={gameState !== 'active'}
          >
            Wait
          </button>
        </div>
        <div className="difficulty-indicator">
          Difficulty: {difficulty.toUpperCase()}
        </div>
      </div>
    </div>
  );

  const renderGameResult = () => (
    <div className="mini-game-overlay">
      <div className={`game-result ${gameState}`}>
        <h2>{gameState === 'success' ? 'Success!' : 'Failed!'}</h2>
        <p>
          {gameState === 'success' 
            ? 'You survived the challenge!' 
            : 'The horror has claimed another victim...'
          }
        </p>
        <div className="result-stats">
          <div>Final Score: {score}</div>
          <div>Time Remaining: {timeLeft}s</div>
        </div>
        <button 
          onClick={() => setGameState('waiting')}
          className="continue-btn"
        >
          Continue
        </button>
      </div>
    </div>
  );

  if (!gameType || gameState === 'waiting') {
    return null;
  }

  if (gameState === 'success' || gameState === 'failed') {
    return renderGameResult();
  }

  switch (gameType) {
    case 'quick_time':
      return renderQuickTimeEvent();
    case 'hiding':
      return renderHidingMechanic();
    case 'stealth':
      return renderStealthSequence();
    default:
      return null;
  }
};

export default MiniGames; 