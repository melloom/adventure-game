import React from 'react';
import { useGameStats, useHighScores } from '../hooks/useLocalStorage';
import useClickSound from '../hooks/useClickSound';

const StatsPage = ({ onBack }) => {
  const { stats, resetStats } = useGameStats();
  const { highScores, clearHighScores } = useHighScores();
  const { withClickSound } = useClickSound();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const averageScore = stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0;

  return (
    <div className="stats-page">
      <div className="stats-content">
        <div className="stats-header">
          <h1 className="stats-title">
            <span className="stats-icon">📊</span>
            Game Statistics
          </h1>
          <p className="stats-subtitle">Track your progress and achievements</p>
        </div>
        <div className="stats-overview">
          <div className="overview-card primary">
            <div className="card-icon">🎮</div>
            <div className="card-content">
              <h3>Games Played</h3>
              <div className="card-value">{stats.gamesPlayed}</div>
              <div className="card-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((stats.gamesPlayed / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="overview-card success">
            <div className="card-icon">🏆</div>
            <div className="card-content">
              <h3>Win Rate</h3>
              <div className="card-value">{winRate}%</div>
              <div className="card-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${winRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="overview-card warning">
            <div className="card-icon">⭐</div>
            <div className="card-content">
              <h3>Highest Score</h3>
              <div className="card-value">{stats.highestScore}</div>
              <div className="card-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((stats.highestScore / 1000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="overview-card info">
            <div className="card-icon">⏱️</div>
            <div className="card-content">
              <h3>Longest Survival</h3>
              <div className="card-value">{stats.longestSurvival} rounds</div>
              <div className="card-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((stats.longestSurvival / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="stats-details">
          <div className="details-section">
            <h2 className="section-title">
              <span className="section-icon">📈</span>
              Performance Metrics
            </h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-icon">🎯</span>
                  <span className="metric-label">Games Won</span>
                </div>
                <div className="metric-value">{stats.gamesWon}</div>
                <div className="metric-description">Total victories achieved</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-icon">📊</span>
                  <span className="metric-label">Total Score</span>
                </div>
                <div className="metric-value">{stats.totalScore.toLocaleString()}</div>
                <div className="metric-description">Combined score from all games</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-icon">📊</span>
                  <span className="metric-label">Average Score</span>
                </div>
                <div className="metric-value">{averageScore.toLocaleString()}</div>
                <div className="metric-description">Average score per game</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-icon">⏱️</span>
                  <span className="metric-label">Average Survival</span>
                </div>
                <div className="metric-value">{stats.averageRoundsSurvived} rounds</div>
                <div className="metric-description">Average rounds survived per game</div>
              </div>
            </div>
          </div>
          <div className="details-section">
            <h2 className="section-title">
              <span className="section-icon">🏅</span>
              High Scores
            </h2>
            {highScores.length > 0 ? (
              <div className="high-scores-container">
                {highScores.map((score, index) => (
                  <div key={score.id} className={`high-score-card rank-${index + 1}`}>
                    <div className="score-rank">
                      <span className="rank-number">#{index + 1}</span>
                      {index === 0 && <span className="crown">👑</span>}
                    </div>
                    <div className="score-details">
                      <div className="score-value">{score.score.toLocaleString()} points</div>
                      <div className="score-meta">
                        <span className="score-rounds">{score.roundsSurvived} rounds</span>
                        <span className="score-date">{formatDate(score.date)}</span>
                      </div>
                    </div>
                    <div className="score-badge">
                      {index === 0 && <span className="badge gold">🥇</span>}
                      {index === 1 && <span className="badge silver">🥈</span>}
                      {index === 2 && <span className="badge bronze">🥉</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <h3>No High Scores Yet</h3>
                <p>Play a game to set some records and see them here!</p>
                <button className="play-now-button" onClick={withClickSound(onBack)}>
                  Start Playing
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="stats-actions">
          <button className="action-button primary" onClick={withClickSound(onBack)}>
            <span className="button-icon">←</span>
            Back to Menu
          </button>
          <button 
            className="action-button danger" 
            onClick={withClickSound(() => {
              if (window.confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
                resetStats();
                clearHighScores();
              }
            })}
          >
            <span className="button-icon">🗑️</span>
            Reset All Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsPage; 