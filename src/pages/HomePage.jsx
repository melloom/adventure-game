import React, { useState } from 'react';
import { useGameStats } from '../hooks/useLocalStorage';
import { useCampaign } from '../hooks/useCampaign';
import BadgeSystem from '../components/BadgeSystem';
import CampaignSelection from '../components/CampaignSelection';

const HomePage = ({ onStartGame, onViewStats, onOpenSettings, lastGameResult }) => {
  const { stats } = useGameStats();
  const { getCampaignProgress } = useCampaign();
  const [showCampaignSelection, setShowCampaignSelection] = useState(false);
  const [gameMode, setGameMode] = useState('classic'); // 'classic' or 'campaign'

  const campaignProgress = getCampaignProgress();

  const handleStartClassicGame = () => {
    setGameMode('classic');
    onStartGame();
  };

  const handleStartCampaignGame = () => {
    setGameMode('campaign');
    setShowCampaignSelection(true);
  };

  const handleChapterSelect = (chapter) => {
    setShowCampaignSelection(false);
    onStartGame(chapter);
  };

  const handleBackToMenu = () => {
    setShowCampaignSelection(false);
    setGameMode('classic');
  };

  if (showCampaignSelection) {
    return (
      <CampaignSelection 
        onChapterSelect={handleChapterSelect}
        onBack={handleBackToMenu}
      />
    );
  }

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

      {/* Campaign Progress Preview */}
      <div className="campaign-preview">
        <h3>🎭 Campaign Progress</h3>
        <div className="campaign-progress-bar">
          <div className="progress-info">
            <span className="progress-text">
              The Nightmare Collection: {campaignProgress.completed}/{campaignProgress.total} Chapters
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${campaignProgress.percentage}%` }}
              />
            </div>
            <span className="progress-percentage">{campaignProgress.percentage}%</span>
          </div>
        </div>
        <p className="campaign-description">
          Experience interconnected horror stories with unique AI personalities and progressive difficulty.
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
        <h2 className="controls-title">💀 SURVIVAL COMMAND CENTER</h2>
        <p className="controls-subtitle">Your fate awaits... Choose wisely or perish!</p>
        
        <div className="game-modes">
          <div className="mode-section">
            <h3>🎮 Game Modes</h3>
            <div className="mode-buttons">
              <button className="mode-button classic" onClick={handleStartClassicGame}>
                <span className="mode-icon">🎲</span>
                <div className="mode-info">
                  <span className="mode-name">Classic Mode</span>
                  <span className="mode-description">10 rounds of random horror choices</span>
                </div>
              </button>
              
              <button className="mode-button campaign" onClick={handleStartCampaignGame}>
                <span className="mode-icon">🎭</span>
                <div className="mode-info">
                  <span className="mode-name">Campaign Mode</span>
                  <span className="mode-description">Connected horror stories with unique AI personalities</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <BadgeSystem />
        
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
        
        <div className="campaign-rules">
          <h4>🎭 Campaign Mode Features</h4>
          <ul>
            <li><strong>Multiple Chapters:</strong> Each with unique themes and stories</li>
            <li><strong>Progressive Difficulty:</strong> Challenges increase as you advance</li>
            <li><strong>AI Personalities:</strong> Each chapter has a unique AI character</li>
            <li><strong>Story Progression:</strong> Your choices affect the narrative</li>
            <li><strong>Chapter Unlocks:</strong> Complete chapters to unlock new ones</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 