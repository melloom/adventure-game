import React, { useState, useEffect, useRef } from 'react';
import { useGameStats } from '../hooks/useLocalStorage';

const BadgeSystem = () => {
  const { stats } = useGameStats();
  const [showBadges, setShowBadges] = useState(false);
  const overlayRef = useRef(null);

  // Define the 10 badge levels
  const badgeLevels = [
    {
      level: 1,
      name: "🌱 SURVIVAL SEED",
      requirement: "Survive 1 game",
      description: "The first step on your survival journey. You've tasted victory!",
      unlocked: stats.gamesWon >= 1,
      icon: "🌱"
    },
    {
      level: 2,
      name: "🌿 SURVIVAL SPROUT",
      requirement: "Survive 2 games",
      description: "Your survival skills are growing stronger with each victory!",
      unlocked: stats.gamesWon >= 2,
      icon: "🌿"
    },
    {
      level: 3,
      name: "🌳 SURVIVAL TREE",
      requirement: "Survive 3 games",
      description: "You're becoming a force to be reckoned with in the survival world!",
      unlocked: stats.gamesWon >= 3,
      icon: "🌳"
    },
    {
      level: 4,
      name: "🛡️ SURVIVAL KNIGHT",
      requirement: "Survive 4 games",
      description: "A true warrior of survival. Your armor is forged from experience!",
      unlocked: stats.gamesWon >= 4,
      icon: "🛡️"
    },
    {
      level: 5,
      name: "⚔️ SURVIVAL WARRIOR",
      requirement: "Survive 5 games",
      description: "Halfway to legend! You've proven your worth in the arena of chaos!",
      unlocked: stats.gamesWon >= 5,
      icon: "⚔️"
    },
    {
      level: 6,
      name: "🔥 SURVIVAL PHOENIX",
      requirement: "Survive 6 games",
      description: "You rise from the ashes of defeat, stronger than ever before!",
      unlocked: stats.gamesWon >= 6,
      icon: "🔥"
    },
    {
      level: 7,
      name: "👑 SURVIVAL MONARCH",
      requirement: "Survive 7 games",
      description: "You rule over the realm of survival. Lesser beings bow before you!",
      unlocked: stats.gamesWon >= 7,
      icon: "👑"
    },
    {
      level: 8,
      name: "🌟 SURVIVAL LEGEND",
      requirement: "Survive 8 games",
      description: "Your name is whispered in the halls of survival legends!",
      unlocked: stats.gamesWon >= 8,
      icon: "🌟"
    },
    {
      level: 9,
      name: "💎 SURVIVAL MASTER",
      requirement: "Survive 9 games",
      description: "Almost there! You're on the cusp of achieving the impossible!",
      unlocked: stats.gamesWon >= 9,
      icon: "💎"
    },
    {
      level: 10,
      name: "🏆 SURVIVAL GOD",
      requirement: "Survive 10 games",
      description: "THE ULTIMATE ACHIEVEMENT! You've transcended mortality itself!",
      unlocked: stats.gamesWon >= 10,
      icon: "🏆"
    }
  ];

  const currentLevel = Math.min(stats.gamesWon, 10);
  const progress = (stats.gamesWon / 10) * 100;

  // Scroll to overlay when it opens
  useEffect(() => {
    if (showBadges && overlayRef.current) {
      overlayRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [showBadges]);

  return (
    <div className="badge-system">
      <button 
        className="badge-button"
        onClick={() => setShowBadges(!showBadges)}
      >
        <span>🏆</span>
        <span>Badges</span>
        <span style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          padding: '2px 6px', 
          borderRadius: '8px', 
          fontSize: '0.75rem' 
        }}>
          {currentLevel}/10
        </span>
      </button>

      {showBadges && (
        <div className="badge-overlay" ref={overlayRef}>
          <div className="badge-content">
            <div className="badge-header">
              <h2>🏆 SURVIVAL BADGE SYSTEM</h2>
              <p>Unlock all 10 badges to achieve the ultimate survival status!</p>
              <div className="badge-progress-bar">
                <div 
                  className="badge-progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="badge-progress-text">{stats.gamesWon}/10 Games Survived</span>
              </div>
            </div>

            <div className="badge-grid">
              {badgeLevels.map((badge) => (
                <div 
                  key={badge.level} 
                  className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="badge-icon-large">
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>
                  <div className="badge-info">
                    <h3 className="badge-name">{badge.name}</h3>
                    <p className="badge-requirement">{badge.requirement}</p>
                    <p className="badge-description">{badge.description}</p>
                  </div>
                  {badge.unlocked && (
                    <div className="badge-unlocked-indicator">✓ UNLOCKED</div>
                  )}
                </div>
              ))}
            </div>

            {stats.gamesWon >= 10 && (
              <div className="ultimate-achievement">
                <h3>🎉 CONGRATULATIONS! 🎉</h3>
                <p>You've achieved the ultimate survival status! You are now a SURVIVAL GOD!</p>
                <p>You've unlocked the secret ending and proven yourself worthy of the highest honor!</p>
              </div>
            )}

            <button 
              className="badge-close-button"
              onClick={() => setShowBadges(false)}
            >
              Close Badges
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeSystem; 