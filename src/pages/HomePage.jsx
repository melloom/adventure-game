import React from 'react';
import { useGameStats } from '../hooks/useLocalStorage';

const HomePage = ({ onStartGame, onViewStats, onOpenSettings, lastGameResult }) => {
  const { stats } = useGameStats();

  return (
    <div className="game-container">
      <h1 className="game-title">Would You Rather Survival</h1>
      <p className="game-subtitle">Survive 10 rounds of impossible choices!</p>
      
      {lastGameResult && (
        <div className={`last-game-result ${lastGameResult.won ? 'win' : 'lose'}`}>
          <h3>Last Game Result</h3>
          <p>
            {lastGameResult.won 
              ? "🎉 You won! " 
              : "💀 You survived "}
            {lastGameResult.roundsSurvived} rounds with a score of {lastGameResult.score}
          </p>
        </div>
      )}
      
      <div className="game-description">
        <p>
          Face impossible choices in this thrilling survival game. Each decision you make 
          will have consequences, and your survival depends on the danger level of your choices. 
          Can you make it through all 10 rounds?
        </p>
      </div>

      <div className="stats-preview">
        <h3>Your Stats</h3>
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
            <span className="stat-value">
              {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Best Score</span>
            <span className="stat-value">{stats.highestScore}</span>
          </div>
        </div>
      </div>

      <div className="game-controls">
        <button className="start-button" onClick={onStartGame}>
          Start New Game
        </button>
        <button className="stats-button" onClick={onViewStats}>
          View Full Stats
        </button>
        <button className="settings-button" onClick={onOpenSettings}>
          Settings
        </button>
      </div>

      <div className="game-rules">
        <h3>How to Play</h3>
        <ol>
          <li>Read the "Would you rather" question</li>
          <li>Choose one of the two options</li>
          <li>Face the consequence of your choice</li>
          <li>Survive based on the danger level</li>
          <li>Make it through 10 rounds to win!</li>
        </ol>
      </div>
    </div>
  );
};

export default HomePage; 