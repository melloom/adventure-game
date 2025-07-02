import React from 'react';
import { useGameSettings } from '../hooks/useLocalStorage';
import { useAIPersonality } from '../hooks/useAIPersonality';
import StorageAnalytics from '../components/StorageAnalytics';
import AIPersonalityInterface from '../components/AIPersonalityInterface';
import useClickSound from '../hooks/useClickSound';

const SettingsPage = ({ onBack, onResetProfile }) => {
  const { settings, updateSetting, resetSettings } = useGameSettings();
  const { withClickSound } = useClickSound();
  const { 
    resetPersonality, 
    getPersonalityInsights, 
    getPlayerFears, 
    getRecentChoices,
    getAllPersonalities 
  } = useAIPersonality();

  const handleSettingChange = (key, value) => {
    updateSetting(key, value);
  };

  const handleResetPersonality = withClickSound(() => {
    if (window.confirm('Are you sure you want to reset your AI relationship? This will erase all memory of your choices and reset the relationship to neutral.')) {
      resetPersonality();
    }
  });

  const handleResetProfile = withClickSound(() => {
    if (window.confirm('Are you sure you want to reset your profile? This will take you back to the profile setup screen.')) {
      onResetProfile();
    }
  });

  const insights = getPersonalityInsights();
  const fears = getPlayerFears();
  const recentChoices = getRecentChoices(5);

  const [showFears, setShowFears] = React.useState(false);
  const [showChoices, setShowChoices] = React.useState(false);

  return (
    <div className="settings-container">
      <h1 className="game-title">Settings</h1>
      <div className="settings-card">
        <h2>Game Settings</h2>
        <div className="setting-item">
          <label className="setting-label">
            <span>Sound Effects</span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
            />
          </label>
        </div>
        <div className="setting-item">
          <label className="setting-label">
            <span>Background Music</span>
            <button
              className="music-toggle-btn"
              onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
              style={{
                background: settings.soundEnabled ? '#4CAF50' : '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
            >
              {settings.soundEnabled ? '🔊 Playing' : '🔇 Muted'}
            </button>
          </label>
        </div>
        <div className="setting-item">
          <label className="setting-label">
            <span>Difficulty</span>
            <select
              value={settings.difficulty}
              onChange={(e) => handleSettingChange('difficulty', e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>
        <div className="setting-item">
          <label className="setting-label">
            <span>Auto Save</span>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
            />
          </label>
        </div>
        <div className="setting-item">
          <label className="setting-label">
            <span>Theme</span>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="colorful">Colorful</option>
            </select>
          </label>
        </div>
        <div className="setting-item">
          <label className="setting-label">
            <span>Notifications</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
            />
          </label>
        </div>
        <div className="setting-item">
          <label className="setting-label">
            <span>Performance Mode</span>
            <input
              type="checkbox"
              checked={settings.performanceMode}
              onChange={(e) => handleSettingChange('performanceMode', e.target.checked)}
            />
          </label>
          <small className="setting-description">
            Reduces animations and effects for better performance
          </small>
        </div>
      </div>
      <div className="settings-card">
        <h2>AI Personality System</h2>
        <AIPersonalityInterface showInsights={false} showRelationship={false} />
        {/* Collapsible Fears Analysis */}
        {Object.keys(fears).length > 0 && (
          <div className="collapsible-section">
            <button 
              className="collapsible-header"
              onClick={withClickSound(() => setShowFears(!showFears))}
            >
              <span>Your Fears (AI Analysis) - {Object.keys(fears).length} detected</span>
              <span className="collapsible-icon">{showFears ? '▼' : '▶'}</span>
            </button>
            {showFears && (
              <div className="fears-list compact">
                {Object.entries(fears)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3) // Show only top 3
                  .map(([fear, count]) => (
                    <div key={fear} className="fear-item">
                      <span className="fear-name">{fear}</span>
                      <span className="fear-count">{count} times</span>
                    </div>
                  ))}
                {Object.keys(fears).length > 3 && (
                  <div className="more-indicator">+{Object.keys(fears).length - 3} more fears</div>
                )}
              </div>
            )}
          </div>
        )}
        {/* Collapsible Recent Choices */}
        {recentChoices.length > 0 && (
          <div className="collapsible-section">
            <button 
              className="collapsible-header"
              onClick={withClickSound(() => setShowChoices(!showChoices))}
            >
              <span>Recent Choices - {recentChoices.length} choices</span>
              <span className="collapsible-icon">{showChoices ? '▼' : '▶'}</span>
            </button>
            {showChoices && (
              <div className="choices-list compact">
                {recentChoices.slice(0, 3).map((choice, index) => (
                  <div key={index} className="choice-item">
                    <span className="choice-text">{choice.choice}</span>
                    <span className="choice-round">R{choice.context.round}</span>
                  </div>
                ))}
                {recentChoices.length > 3 && (
                  <div className="more-indicator">+{recentChoices.length - 3} more choices</div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="setting-item">
          <button onClick={handleResetPersonality} className="danger-button">
            Reset AI Relationship
          </button>
          <small className="setting-description">
            This will reset your AI relationship and erase all memory of your choices
          </small>
        </div>
      </div>
      <div className="settings-card">
        <h2>Storage Management</h2>
        <StorageAnalytics />
      </div>
      <div className="settings-card">
        <h2>Data Management</h2>
        <div className="setting-item">
          <button onClick={resetSettings} className="danger-button">
            Reset All Settings
          </button>
          <small className="setting-description">
            This will reset all settings to their default values
          </small>
        </div>
        <div className="setting-item">
          <button onClick={handleResetProfile} className="danger-button">
            Reset Profile
          </button>
          <small className="setting-description">
            This will reset your profile and take you back to the profile setup screen
          </small>
        </div>
      </div>
      <div className="settings-actions">
        <button onClick={withClickSound(onBack)} className="back-button">
          Back to Menu
        </button>
      </div>
      <style jsx>{`
        .settings-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .settings-card {
          flex: 1;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }

        .setting-item {
          margin-bottom: 20px;
        }

        .setting-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 500;
          color: #fff;
        }

        .setting-label span {
          flex: 1;
        }

        .setting-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #4CAF50;
        }

        .setting-label select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background: white;
          color: #333;
          min-width: 120px;
        }

        .setting-description {
          display: block;
          margin-top: 5px;
          font-size: 12px;
          color: #ccc;
          font-style: italic;
        }

        .danger-button {
          background: #f44336;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        .danger-button:hover {
          background: #d32f2f;
        }

        .settings-actions {
          text-align: center;
          margin-top: 30px;
        }

        .back-button {
          background: #2196f3;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        .back-button:hover {
          background: #1976d2;
        }

        /* AI Stats Grid */
        .ai-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }

        .ai-stat-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 15px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ai-stat-card h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #ccc;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #4CAF50;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 12px;
          color: #999;
        }

        /* Fears Analysis */
        .fears-analysis {
          margin: 20px 0;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .fears-analysis h4 {
          margin: 0 0 15px 0;
          color: #fff;
          font-size: 16px;
        }

        .fears-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .fear-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }

        .fear-name {
          font-weight: 500;
          color: #fff;
          text-transform: capitalize;
        }

        .fear-count {
          font-size: 12px;
          color: #ff4757;
          font-weight: 600;
        }

        /* Recent Choices */
        .recent-choices {
          margin: 20px 0;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .recent-choices h4 {
          margin: 0 0 15px 0;
          color: #fff;
          font-size: 16px;
        }

        .choices-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .choice-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }

        .choice-text {
          font-size: 14px;
          color: #fff;
          flex: 1;
          margin-right: 10px;
        }

        .choice-round {
          font-size: 12px;
          color: #2196f3;
          font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .ai-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .fear-item,
          .choice-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }

        @media (max-width: 480px) {
          .ai-stats-grid {
            grid-template-columns: 1fr;
          }
          
          .stat-value {
            font-size: 20px;
          }
        }

        /* Collapsible Section */
        .collapsible-section {
          margin-bottom: 20px;
        }

        .collapsible-header {
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          cursor: pointer;
          outline: inherit;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          text-align: left;
          color: #fff;
          font-weight: 500;
        }

        .collapsible-icon {
          transition: transform 0.2s;
        }

        .collapsible-header.collapsed .collapsible-icon {
          transform: rotate(90deg);
        }

                 .fears-list.compact {
           margin-top: 12px;
         }

         .fears-list.compact .fear-item {
           padding: 8px 12px;
           background: rgba(255, 255, 255, 0.05);
           border-radius: 6px;
           margin-bottom: 8px;
           display: flex;
           justify-content: space-between;
           align-items: center;
         }

         .fears-list.compact .fear-name {
           font-weight: 500;
           color: #fff;
           text-transform: capitalize;
         }

         .fears-list.compact .fear-count {
           font-size: 12px;
           color: #ff4757;
           font-weight: 600;
         }

         .more-indicator {
           font-size: 12px;
           color: #999;
           font-style: italic;
           text-align: center;
           padding: 8px;
         }

         .choices-list.compact {
           margin-top: 12px;
         }

         .choices-list.compact .choice-item {
           padding: 8px 12px;
           background: rgba(255, 255, 255, 0.05);
           border-radius: 6px;
           margin-bottom: 8px;
           display: flex;
           justify-content: space-between;
           align-items: center;
         }

         .choices-list.compact .choice-text {
           font-size: 14px;
           color: #fff;
           flex: 1;
           margin-right: 10px;
         }

         .choices-list.compact .choice-round {
           font-size: 12px;
           color: #2196f3;
           font-weight: 600;
         }
      `}</style>
    </div>
  );
};

export default SettingsPage; 