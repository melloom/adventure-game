import React from 'react';
import { useGameStats, useHighScores } from '../hooks/useLocalStorage';

const StatsPage = ({ onBack }) => {
  const { stats, resetStats } = useGameStats();
  const { highScores, clearHighScores } = useHighScores();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const averageScore = stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0;

  return (
    <div className="game-container">
      <h1 className="game-title">Game Statistics</h1>
      
      <div className="stats-section">
        <h2>Overall Stats</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Games Played</span>
            <span className="stat-value">{stats.gamesPlayed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Games Won</span>
            <span className="stat-value">{stats.gamesWon}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Win Rate</span>
            <span className="stat-value">{winRate}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Score</span>
            <span className="stat-value">{stats.totalScore}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Highest Score</span>
            <span className="stat-value">{stats.highestScore}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{averageScore}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Longest Survival</span>
            <span className="stat-value">{stats.longestSurvival} rounds</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Survival</span>
            <span className="stat-value">{stats.averageRoundsSurvived} rounds</span>
          </div>
        </div>
      </div>

      <div className="high-scores-section">
        <h2>High Scores</h2>
        {highScores.length > 0 ? (
          <div className="high-scores-list">
            {highScores.map((score, index) => (
              <div key={score.id} className="high-score-item">
                <div className="score-rank">#{index + 1}</div>
                <div className="score-details">
                  <div className="score-value">{score.score} points</div>
                  <div className="score-info">
                    {score.roundsSurvived} rounds • {formatDate(score.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-scores">No high scores yet. Play a game to set some records!</p>
        )}
      </div>

      <div className="stats-actions">
        <button className="action-button" onClick={onBack}>
          Back to Menu
        </button>
        <button 
          className="action-button danger" 
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
              resetStats();
              clearHighScores();
            }
          }}
        >
          Reset All Stats
        </button>
      </div>
    </div>
  );
};

export default StatsPage; 