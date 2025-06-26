import React, { useState } from 'react';
import { useCampaign } from '../hooks/useCampaign';
import './CampaignSelection.css';

const CampaignSelection = ({ onChapterSelect, onBack }) => {
  const {
    currentCampaign,
    getCampaignThemes,
    getCampaignProgress,
    isChapterUnlocked,
    getChapterProgress
  } = useCampaign();

  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showChapterDetails, setShowChapterDetails] = useState(false);

  const campaignThemes = getCampaignThemes();
  const progress = getCampaignProgress();

  const handleChapterClick = (chapter) => {
    if (chapter.unlocked) {
      setSelectedChapter(chapter);
      setShowChapterDetails(true);
    }
  };

  const handleStartChapter = () => {
    if (selectedChapter && onChapterSelect) {
      onChapterSelect(selectedChapter);
    }
  };

  const handleBack = () => {
    setShowChapterDetails(false);
    setSelectedChapter(null);
  };

  const getDifficultyStars = (difficulty) => {
    return '⭐'.repeat(difficulty);
  };

  const getProgressBar = (chapterId) => {
    const progress = getChapterProgress(chapterId);
    if (progress.completed) {
      return 100;
    }
    return 0; // Will be calculated based on actual progress
  };

  if (showChapterDetails && selectedChapter) {
    return (
      <div className="campaign-selection">
        <div className="chapter-details">
          <div className="chapter-header">
            <button className="back-button" onClick={handleBack}>
              ← Back to Chapters
            </button>
            <h2 className="chapter-title">
              <span className="chapter-icon">{selectedChapter.icon}</span>
              {selectedChapter.name}
            </h2>
          </div>

          <div className="chapter-info">
            <div className="chapter-description">
              {selectedChapter.description}
            </div>

            <div className="chapter-stats">
              <div className="stat-item">
                <span className="stat-label">Difficulty:</span>
                <span className="stat-value">{getDifficultyStars(selectedChapter.difficulty)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Rounds:</span>
                <span className="stat-value">{selectedChapter.rounds}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Theme:</span>
                <span className="stat-value">{selectedChapter.theme}</span>
              </div>
            </div>

            <div className="chapter-story">
              <h3>Story</h3>
              <p>{selectedChapter.story?.intro || 'No story available.'}</p>
            </div>

            <div className="chapter-achievements">
              <h3>Achievements</h3>
              <div className="achievements-list">
                {selectedChapter.achievements?.map((achievement, index) => (
                  <div key={index} className="achievement-item">
                    <span className="achievement-icon">🏆</span>
                    <span className="achievement-name">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chapter-actions">
              <button 
                className="start-chapter-button"
                onClick={handleStartChapter}
                style={{ backgroundColor: selectedChapter.color }}
              >
                Start Chapter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="campaign-selection">
      <div className="campaign-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Menu
        </button>
        <h1 className="campaign-title">{currentCampaign.name}</h1>
        <p className="campaign-description">{currentCampaign.description}</p>
      </div>

      <div className="campaign-progress">
        <div className="progress-info">
          <span className="progress-text">
            Progress: {progress.completed}/{progress.total} Chapters
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <span className="progress-percentage">{progress.percentage}%</span>
        </div>
      </div>

      <div className="chapters-grid">
        {campaignThemes.map((chapter, index) => (
          <div
            key={chapter.id}
            className={`chapter-card ${chapter.unlocked ? 'unlocked' : 'locked'} ${chapter.completed ? 'completed' : ''}`}
            onClick={() => handleChapterClick(chapter)}
            style={{ 
              borderColor: chapter.color,
              background: chapter.completed ? `linear-gradient(135deg, ${chapter.color}20, ${chapter.color}10)` : undefined
            }}
          >
            <div className="chapter-card-header">
              <span className="chapter-icon">{chapter.icon}</span>
              <div className="chapter-status">
                {chapter.completed && <span className="status-completed">✓</span>}
                {!chapter.unlocked && <span className="status-locked">🔒</span>}
              </div>
            </div>

            <div className="chapter-card-content">
              <h3 className="chapter-name">{chapter.name}</h3>
              <p className="chapter-description">{chapter.description}</p>
              
              <div className="chapter-meta">
                <div className="difficulty">
                  <span className="difficulty-label">Difficulty:</span>
                  <span className="difficulty-stars">{getDifficultyStars(chapter.difficulty)}</span>
                </div>
                
                <div className="progress-indicator">
                  <div className="progress-bar-small">
                    <div 
                      className="progress-fill-small"
                      style={{ width: `${getProgressBar(chapter.id)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {!chapter.unlocked && (
              <div className="chapter-lock-overlay">
                <span className="lock-icon">🔒</span>
                <span className="lock-text">Complete previous chapter to unlock</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="campaign-footer">
        <div className="campaign-tips">
          <h3>Campaign Tips</h3>
          <ul>
            <li>Complete chapters in order to unlock new ones</li>
            <li>Each chapter has a unique AI personality</li>
            <li>Difficulty increases as you progress</li>
            <li>Your choices affect the story and relationships</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CampaignSelection; 