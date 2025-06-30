import React, { useState, useEffect } from 'react';
import { useAIPersonality } from '../hooks/useAIPersonality';
import './AIPersonalityInterface.css';

const AIPersonalityInterface = ({ 
  showTaunt = false, 
  showRelationship = false, 
  showInsights = false,
  onPersonalityChange = null 
}) => {
  const {
    currentPersonality,
    relationshipLevel,
    getPersonalizedTaunt,
    generateRelationshipMessage,
    getPersonalityInsights,
    getAllPersonalities,
    changePersonality,
    getRelationshipStatus,
    getPersonalityColor,
    getPersonalityIcon
  } = useAIPersonality();

  const [taunt, setTaunt] = useState('');
  const [relationshipMessage, setRelationshipMessage] = useState('');
  const [insights, setInsights] = useState(null);
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Generate taunt when requested
  useEffect(() => {
    if (showTaunt) {
      const newTaunt = getPersonalizedTaunt();
      if (newTaunt) {
        setTaunt(newTaunt);
        setAnimationKey(prev => prev + 1);
      }
    }
  }, [showTaunt, getPersonalizedTaunt]);

  // Generate relationship message when requested
  useEffect(() => {
    if (showRelationship) {
      const message = generateRelationshipMessage();
      setRelationshipMessage(message);
    }
  }, [showRelationship, generateRelationshipMessage]);

  // Get insights when requested
  useEffect(() => {
    if (showInsights) {
      const personalityInsights = getPersonalityInsights();
      setInsights(personalityInsights);
    }
  }, [showInsights, getPersonalityInsights]);

  // Handle personality change
  const handlePersonalityChange = (personalityKey) => {
    const success = changePersonality(personalityKey);
    if (success && onPersonalityChange) {
      onPersonalityChange(personalityKey);
    }
    setShowPersonalitySelector(false);
  };

  // Get relationship color
  const getRelationshipColor = () => {
    const status = getRelationshipStatus();
    switch (status) {
      case 'allied': return '#4CAF50';
      case 'friendly': return '#8BC34A';
      case 'neutral': return '#FFC107';
      case 'hostile': return '#FF5722';
      case 'enemy': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  // Get relationship icon
  const getRelationshipIcon = () => {
    const status = getRelationshipStatus();
    switch (status) {
      case 'allied': return '🤝';
      case 'friendly': return '😊';
      case 'neutral': return '😐';
      case 'hostile': return '😠';
      case 'enemy': return '😡';
      default: return '❓';
    }
  };

  return (
    <div className="ai-personality-interface">
      {/* Current Personality Display */}
      <div className="personality-header">
        <div 
          className="personality-avatar"
          style={{ backgroundColor: getPersonalityColor() }}
          onClick={() => setShowPersonalitySelector(!showPersonalitySelector)}
        >
          <span className="personality-icon">{getPersonalityIcon()}</span>
        </div>
        <div className="personality-info">
          <h3 className="personality-name">{currentPersonality.name}</h3>
          <p className="personality-description">{currentPersonality.description}</p>
        </div>
        <div className="relationship-indicator">
          <span className="relationship-icon">{getRelationshipIcon()}</span>
          <div className="relationship-bar">
            <div 
              className="relationship-fill"
              style={{ 
                width: `${Math.max(0, Math.min(100, (relationshipLevel + 100) / 2))}%`,
                backgroundColor: getRelationshipColor()
              }}
            />
          </div>
          <span className="relationship-level">{relationshipLevel}</span>
        </div>
      </div>

      {/* Personality Selector */}
      {showPersonalitySelector && (
        <div className="personality-selector">
          <h4>Choose AI Personality</h4>
          <div className="personality-options">
            {Object.entries(getAllPersonalities()).map(([key, personality]) => (
              <button
                key={key}
                className={`personality-option ${currentPersonality.name === personality.name ? 'active' : ''}`}
                onClick={() => handlePersonalityChange(key)}
                style={{ borderColor: personality.color }}
              >
                <span className="option-icon">{personality.icon}</span>
                <div className="option-info">
                  <span className="option-name">{personality.name}</span>
                  <span className="option-description">{personality.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Taunt Display */}
      {showTaunt && taunt && (
        <div 
          key={animationKey}
          className="ai-taunt"
          style={{ color: getPersonalityColor() }}
        >
          <span className="taunt-icon">💬</span>
          <p className="taunt-text">{taunt}</p>
        </div>
      )}

      {/* Relationship Message */}
      {showRelationship && relationshipMessage && (
        <div className="relationship-message">
          <span className="message-icon">💭</span>
          <p className="message-text">{relationshipMessage}</p>
        </div>
      )}

      {/* Personality Insights */}
      {showInsights && insights && (
        <div className="personality-insights">
          <h4>AI Insights</h4>
          <div className="insights-grid">
            <div className="insight-item">
              <span className="insight-label">Top Fear:</span>
              <span className="insight-value">{insights.topFear || 'None detected'}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Total Choices:</span>
              <span className="insight-value">{insights.totalChoices}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Relationship:</span>
              <span className="insight-value">{insights.relationshipStatus}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Patterns Found:</span>
              <span className="insight-value">{insights.patternCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Personality Traits */}
      <div className="personality-traits">
        <h4>AI Traits</h4>
        <div className="traits-grid">
          {Object.entries(currentPersonality.traits).map(([trait, value]) => (
            <div key={trait} className="trait-item">
              <span className="trait-name">{trait}</span>
              <div className="trait-bar">
                <div 
                  className="trait-fill"
                  style={{ 
                    width: `${value * 100}%`,
                    backgroundColor: getPersonalityColor()
                  }}
                />
              </div>
              <span className="trait-value">{Math.round(value * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIPersonalityInterface; 