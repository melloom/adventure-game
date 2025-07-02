import React, { useState, useEffect, useRef } from 'react';
import { useGameStats } from '../hooks/useLocalStorage';

const AchievementSystem = () => {
  const { stats } = useGameStats();
  const [showAchievements, setShowAchievements] = useState(false);
  const overlayRef = useRef(null);

  // Define special achievements
  const achievements = [
    {
      id: 'first_win',
      name: "🎯 FIRST BLOOD",
      description: "Win your first game",
      unlocked: stats.gamesWon >= 1,
      icon: "🎯"
    },
    {
      id: 'perfect_run',
      name: "🌟 PERFECT SURVIVOR",
      description: "Survive with 0 danger score",
      unlocked: false, // This would need to be tracked separately
      icon: "🌟"
    },
    {
      id: 'speed_runner',
      name: "⚡ SPEED DEMON",
      description: "Complete a game in under 2 minutes",
      unlocked: false,
      icon: "⚡"
    },
    {
      id: 'lucky_charm',
      name: "🍀 LUCKY CHARM",
      description: "Survive with 90+ danger score",
      unlocked: false,
      icon: "🍀"
    },
    {
      id: 'warrior',
      name: "⚔️ BATTLE HARDENED",
      description: "Win 5 games in a row",
      unlocked: stats.gamesWon >= 5,
      icon: "⚔️"
    },
    {
      id: 'legend',
      name: "👑 LEGENDARY",
      description: "Win 10 games total",
      unlocked: stats.gamesWon >= 10,
      icon: "👑"
    },
    {
      id: 'nightmare_master',
      name: "💀 NIGHTMARE MASTER",
      description: "Win on nightmare difficulty",
      unlocked: false,
      icon: "💀"
    },
    {
      id: 'chaos_lover',
      name: "🎭 CHAOS LOVER",
      description: "Choose the most dangerous option 5 times in one game",
      unlocked: false,
      icon: "🎭"
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Scroll to overlay when it opens
  useEffect(() => {
    if (showAchievements && overlayRef.current) {
      overlayRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [showAchievements]);

  return (
    <div className="achievement-system">
      <button 
        className="achievement-button"
        onClick={() => setShowAchievements(!showAchievements)}
      >
        <span>🏅</span>
        <span>Achievements</span>
        <span style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          padding: '2px 6px', 
          borderRadius: '8px', 
          fontSize: '0.75rem' 
        }}>
          {unlockedCount}/{achievements.length}
        </span>
      </button>

      {showAchievements && (
        <div className="achievement-overlay" ref={overlayRef}>
          <div className="achievement-content">
            <div className="achievement-header">
              <h2>🏅 ACHIEVEMENT SYSTEM</h2>
              <p>Unlock special achievements by completing unique challenges!</p>
            </div>

            <div className="achievement-grid">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon-large">
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className="achievement-info">
                    <h3 className="achievement-name">{achievement.name}</h3>
                    <p className="achievement-description">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="achievement-unlocked-indicator">✓ UNLOCKED</div>
                  )}
                </div>
              ))}
            </div>

            <button 
              className="achievement-close-button"
              onClick={() => setShowAchievements(false)}
            >
              Close Achievements
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementSystem; 