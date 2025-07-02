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
    // Trigger success effect
    horrorSystem.triggerJumpScare(0.2, 200); // Gentle success effect
    if (onComplete) {
      onComplete({ 
        type: gameType, 
        score, 
        timeLeft, 
        success: true,
        message: getSuccessMessage(gameType)
      });
    }
  };

  const handleGameFail = () => {
    setGameState('failed');
    // Trigger intense horror effect
    horrorSystem.triggerJumpScare(0.9, 0);
    if (onFail) {
      onFail({ 
        type: gameType, 
        score, 
        timeLeft, 
        success: false,
        message: getFailureMessage(gameType)
      });
    }
  };

  const getSuccessMessage = (type) => {
    const messages = {
      quick_time: "You maintained control! The AI's intrusion attempt was blocked.",
      hiding: "You found the safe route! The AI lost track of your location.",
      stealth: "You remained undetected! The AI's surveillance failed to detect you."
    };
    return messages[type] || "Challenge completed successfully!";
  };

  const getFailureMessage = (type) => {
    const messages = {
      quick_time: "The AI gained control! Your system is now compromised.",
      hiding: "You fell into the AI's trap! It now knows your location.",
      stealth: "You were detected! The AI is now tracking your movements."
    };
    return messages[type] || "Challenge failed! The AI has gained an advantage.";
  };

  const renderQuickTimeEvent = () => (
    <div className="mini-game-overlay">
      <div className="quick-time-event">
        <h2>🚨 SYSTEM BREACH DETECTED 🚨</h2>
        <p>The AI is attempting to override your controls! Click rapidly to maintain system access!</p>
        <div className="time-display">⏱️ Time Remaining: {timeLeft}s</div>
        <div className="score-display">🛡️ Security Level: {score}</div>
        <button 
          className="quick-time-button"
          onClick={handleQuickTimeClick}
          disabled={gameState !== 'active'}
        >
          {gameState === 'active' ? 'MAINTAIN CONTROL!' : 'SYSTEM LOCKED'}
        </button>
        <div className="difficulty-indicator">
          🔥 Threat Level: {difficulty.toUpperCase()}
        </div>
      </div>
    </div>
  );

  const renderHidingMechanic = () => (
    <div className="mini-game-overlay">
      <div className="hiding-mechanic">
        <h2>🏃‍♂️ ESCAPE ROUTE SELECTION 🏃‍♂️</h2>
        <p>The AI is scanning your location! Choose a safe escape route before it finds you!</p>
        <div className="time-display">⏱️ Time Remaining: {timeLeft}s</div>
        <div className="hiding-spots">
          {hidingSpots.map(spot => (
            <div
              key={spot.id}
              className={`hiding-spot ${spot.isRevealed ? (spot.isSafe ? 'safe' : 'dangerous') : ''}`}
              onClick={() => handleHidingSpotClick(spot)}
            >
              {spot.isRevealed ? (
                spot.isSafe ? '✅ SAFE ROUTE' : '❌ AI TRAP'
              ) : (
                '🚪'
              )}
            </div>
          ))}
        </div>
        <div className="difficulty-indicator">
          🔥 AI Scan Intensity: {difficulty.toUpperCase()}
        </div>
      </div>
    </div>
  );

  const renderStealthSequence = () => (
    <div className="mini-game-overlay">
      <div className="stealth-sequence">
        <h2>🥷 STEALTH INFILTRATION 🥷</h2>
        <p>The AI's surveillance system is active! Stay undetected by managing your digital footprint.</p>
        <div className="time-display">⏱️ Time Remaining: {timeLeft}s</div>
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
            🐌 Stealth Mode
          </button>
          <button 
            onClick={() => handleStealthAction('move_fast')}
            disabled={gameState !== 'active'}
          >
            🏃‍♂️ Rush Mode
          </button>
          <button 
            onClick={() => handleStealthAction('use_item')}
            disabled={gameState !== 'active'}
          >
            🛠️ Use Tool
          </button>
          <button 
            onClick={() => handleStealthAction('wait')}
            disabled={gameState !== 'active'}
          >
            ⏸️ Hold Position
          </button>
        </div>
        <div className="difficulty-indicator">
          🔥 Detection Sensitivity: {difficulty.toUpperCase()}
        </div>
      </div>
    </div>
  );

  const renderGameResult = () => (
    <div className="mini-game-overlay">
      <div className={`game-result ${gameState}`}>
        <h2>
          {gameState === 'success' 
            ? '🎉 SYSTEM ACCESS MAINTAINED 🎉' 
            : '💀 SYSTEM COMPROMISED 💀'
          }
        </h2>
        <p>
          {gameState === 'success' 
            ? 'You successfully defended against the AI intrusion! Your system remains secure... for now.' 
            : 'The AI has gained control! Your digital defenses have been breached...'
          }
        </p>
        <div className="result-stats">
          <div>🛡️ Security Score: {score}</div>
          <div>⏱️ Time Remaining: {timeLeft}s</div>
          <div>
            {gameState === 'success' 
              ? '✅ AI Threat Level: REDUCED' 
              : '❌ AI Threat Level: INCREASED'
            }
          </div>
        </div>
        <button 
          onClick={() => setGameState('waiting')}
          className="continue-btn"
        >
          {gameState === 'success' ? 'Continue Survival' : 'Face Consequences'}
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