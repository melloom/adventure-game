import React, { useEffect, useState } from 'react';
import { useOpenAI } from '../hooks/useOpenAI';
import { useGameStats, useHighScores } from '../hooks/useLocalStorage';
import HorrorEffects from '../components/HorrorEffects';
import MiniGames from '../components/MiniGames';
import horrorSystem from '../utils/horrorSystem';
import useClickSound from '../hooks/useClickSound';

// Floating stats badge component - defined outside to prevent recreation
const FloatingStatsBadge = React.memo(({ dangerScore, currentRound }) => {
  const getSurvivalStatus = () => {
    if (dangerScore <= 30) return 'safe';
    if (dangerScore <= 60) return 'caution';
    if (dangerScore <= 90) return 'danger';
    return 'critical';
  };
  
  const survivalStatus = getSurvivalStatus();
  
  return (
    <div className="floating-stats-badge">
      <div className="badge-row"><span className="badge-label">Danger Score:</span> <span className="badge-value">{dangerScore}/100</span></div>
      <div className="badge-row"><span className="badge-label">Round:</span> <span className="badge-value">{currentRound} / 10</span></div>
      <div className="badge-row"><span className="badge-label">Status:</span> <span className={`badge-value status-${survivalStatus}`}>{survivalStatus.charAt(0).toUpperCase() + survivalStatus.slice(1)}</span></div>
    </div>
  );
});

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
  onBackToMenu,
  isLoading
}) => {
  // Debug log for troubleshooting
  console.log('GamePage props:', { currentRound, currentGameQuestion });

  const { fetchQuestion, fetchConsequence } = useOpenAI();
  const { updateStats } = useGameStats();
  const { addHighScore } = useHighScores();
  const { withClickSound } = useClickSound();

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

  // Auto-advance after showing consequence
  useEffect(() => {
    if (showConsequence && dangerScore <= 100 && currentRound < 10) {
      const timer = setTimeout(() => {
        if (onNextRound) onNextRound();
      }, 8000); // Increased from 2000ms to 8000ms (8 seconds) for better reading time
      return () => clearTimeout(timer);
    }
  }, [showConsequence, dangerScore, currentRound, onNextRound]);

  const handleChoice = withClickSound(async (option) => {
    if (onOptionSelect) {
      onOptionSelect(option);
    }
  });

  const handleNext = withClickSound(() => {
    if (onNextRound) {
      onNextRound();
    }
  });

  const handleRestart = withClickSound(() => {
    if (onRestartGame) {
      onRestartGame();
    }
  });

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

  // Enhanced loading state with creepy AI generation effects
  const [loadingText, setLoadingText] = useState('Initializing ORACLE_7X...');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const loadingMessages = [
        'Initializing ORACLE_7X...',
        'Analyzing player patterns...',
        'Calculating psychological profile...',
        'Accessing fear database...',
        'Generating personalized nightmare...',
        'Crafting your fate...',
        'Almost ready to break you...',
        'Preparing your doom...'
      ];

      let messageIndex = 0;
      let progress = 0;
      
      const messageInterval = setInterval(() => {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 200);
        
        setLoadingText(loadingMessages[messageIndex]);
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        
        progress += Math.random() * 15 + 5;
        setLoadingProgress(Math.min(progress, 95));
      }, 800);

      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 2;
        });
      }, 100);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      };
    } else {
      setLoadingProgress(100);
      setLoadingText('ORACLE_7X ready...');
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="game-container">
        <div className="enhanced-loading">
          {/* Background effects */}
          <div className="loading-background">
            <div className="matrix-rain"></div>
            <div className="digital-static"></div>
          </div>
          
          {/* Main loading content */}
          <div className="loading-content">
            <div className="oracle-logo">
              <div className={`logo-text ${glitchEffect ? 'glitch' : ''}`}>
                ORACLE_7X
              </div>
              <div className="logo-subtitle">Advanced AI System</div>
            </div>
            
            <div className="loading-status">
              <div className={`status-text ${glitchEffect ? 'glitch' : ''}`}>
                {loadingText}
              </div>
              <div className="status-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">{Math.round(loadingProgress)}%</div>
            </div>
            
            <div className="loading-details">
              <div className="detail-item">
                <span className="detail-label">Processing:</span>
                <span className="detail-value">Player Data Analysis</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">Generating Nightmare</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Target:</span>
                <span className="detail-value">Psychological Breakdown</span>
              </div>
            </div>
            
            <div className="loading-warning">
              ⚠️ WARNING: ORACLE_7X is learning from your choices...
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="loading-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}></div>
            ))}
          </div>
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
      <div className="game-centered-container">
        <FloatingStatsBadge dangerScore={dangerScore} currentRound={currentRound} />
        <h1 className="game-title">Would You Rather Survival</h1>
        <div className="horizontal-progress-bar">
          <div className="progress-bar-fill" style={{ width: `${(currentRound / 10) * 100}%` }}></div>
          <span className="progress-bar-text">Round {currentRound} of 10</span>
        </div>
        <div className="game-card">
          <div className="danger-level" style={{ marginBottom: '12px', fontWeight: 'bold', fontSize: '1.1rem' }}>
            Danger Score: {dangerScore}/100
          </div>
          <p className="consequence-text" style={{ marginBottom: '18px', textAlign: 'center' }}>{consequence}</p>
          {dangerScore > 100 && <p style={{fontWeight: 'bold', marginTop: '10px'}}>💀 You didn't survive this round!</p>}
          <button className="next-button" onClick={handleNext} style={{ marginTop: '18px' }}>
            {dangerScore > 100 ? 'See Results' : currentRound >= 10 ? 'Finish Game' : 'Continue'}
          </button>
          {/* Back to Menu button */}
          <button 
            className="back-button"
            style={{ marginTop: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            onClick={() => { if (typeof onBackToMenu === 'function') onBackToMenu(); }}
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-centered-container">
      <FloatingStatsBadge dangerScore={dangerScore} currentRound={currentRound} />
      <h1 className="game-title">Would You Rather Survival</h1>
      <p className="game-subtitle">Survive 10 rounds of impossible choices!</p>
      <div className="horizontal-progress-bar">
        <div className="progress-bar-fill" style={{ width: `${(currentRound / 10) * 100}%` }}></div>
        <span className="progress-bar-text">Round {currentRound} of 10</span>
      </div>
      <div className="game-card">
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
        {/* Back to Menu button */}
        <button 
          className="back-button"
          style={{ marginTop: '16px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          onClick={() => { if (typeof onBackToMenu === 'function') onBackToMenu(); }}
        >
          ← Back to Menu
        </button>
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