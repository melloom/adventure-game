import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SettingsPage = ({ onBack }) => {
  const [settings, setSettings] = useLocalStorage('gameSettings', {
    soundEnabled: true,
    difficulty: 'normal',
    autoSave: true,
    theme: 'default'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Settings</h1>
      
      <div className="settings-section">
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
              <option value="colorful">Colorful</option>
            </select>
          </label>
        </div>
      </div>

      <div className="settings-actions">
        <button className="action-button" onClick={onBack}>
          Back to Menu
        </button>
        <button 
          className="action-button" 
          onClick={() => {
            setSettings({
              soundEnabled: true,
              difficulty: 'normal',
              autoSave: true,
              theme: 'default'
            });
          }}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default SettingsPage; 