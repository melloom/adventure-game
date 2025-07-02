import React, { useState, useEffect } from 'react';
import { 
  getAIMemory, 
  getAIPersonalityDisorders, 
  getAIRelationships, 
  getAIBetrayalPlans, 
  getAIEvolutionData, 
  getAICrossGameData,
  getCurrentAIPersonality,
  getAIPersonalityState
} from '../utils/aiService';
import './AdvancedAISystems.css';

const AdvancedAISystems = ({ playerName, isVisible = false }) => {
  const [aiData, setAiData] = useState({
    memory: null,
    disorders: [],
    relationships: new Map(),
    betrayalPlans: [],
    evolutionData: {},
    crossGameData: {},
    personality: {},
    personalityState: 'neutral'
  });
  const [activeTab, setActiveTab] = useState('memory');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isVisible && playerName) {
      const updateData = () => {
        setAiData({
          memory: getAIMemory(playerName),
          disorders: getAIPersonalityDisorders(),
          relationships: getAIRelationships(),
          betrayalPlans: getAIBetrayalPlans(),
          evolutionData: getAIEvolutionData(),
          crossGameData: getAICrossGameData(),
          personality: getCurrentAIPersonality(),
          personalityState: getAIPersonalityState()
        });
      };

      updateData();
      const interval = setInterval(updateData, 2000); // Update every 2 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible, playerName]);

  if (!isVisible) return null;

  const getDisorderColor = (type) => {
    const colors = {
      'paranoia': '#ff6b6b',
      'narcissism': '#ffd93d',
      'sociopathy': '#6bcf7f',
      'anxiety': '#4ecdc4',
      'depression': '#45b7d1',
      'mania': '#96ceb4'
    };
    return colors[type] || '#ff6b6b';
  };

  const getRelationshipColor = (type) => {
    const colors = {
      'mentor': '#4CAF50',
      'friend': '#2196F3',
      'acquaintance': '#FF9800',
      'rival': '#FFC107',
      'enemy': '#F44336',
      'puppet': '#9C27B0'
    };
    return colors[type] || '#FF9800';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const renderMemoryTab = () => (
    <div className="ai-tab-content">
      <h3>🧠 AI Memory System</h3>
      {aiData.memory ? (
        <div className="memory-data">
          <div className="memory-stats">
            <div className="stat-item">
              <span className="stat-label">First Encounter:</span>
              <span className="stat-value">{formatTimestamp(aiData.memory.firstEncounter)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Interactions:</span>
              <span className="stat-value">{aiData.memory.totalInteractions}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Successful Betrayals:</span>
              <span className="stat-value">{aiData.memory.successfulBetrayals}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Manipulation Attempts:</span>
              <span className="stat-value">{aiData.memory.manipulationAttempts}</span>
            </div>
          </div>
          
          {aiData.memory.secrets.length > 0 && (
            <div className="secrets-section">
              <h4>🔒 Discovered Secrets</h4>
              <div className="secrets-list">
                {aiData.memory.secrets.map((secret, index) => (
                  <div key={index} className="secret-item">
                    <span className="secret-type">{secret.secret}</span>
                    <span className="secret-time">{formatTimestamp(secret.discoveredAt)}</span>
                    <span className={`secret-used ${secret.usedForManipulation ? 'used' : 'unused'}`}>
                      {secret.usedForManipulation ? 'Used' : 'Unused'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>No memory data available for this player.</p>
      )}
    </div>
  );

  const renderDisordersTab = () => (
    <div className="ai-tab-content">
      <h3>😵‍💫 Personality Disorders</h3>
      {aiData.disorders.length > 0 ? (
        <div className="disorders-list">
          {aiData.disorders.map((disorder, index) => (
            <div 
              key={index} 
              className="disorder-item"
              style={{ borderLeftColor: getDisorderColor(disorder.type) }}
            >
              <div className="disorder-header">
                <span className="disorder-type">{disorder.type.toUpperCase()}</span>
                <span className="disorder-severity">
                  {disorder.severity}/{disorder.maxSeverity}
                </span>
              </div>
              <div className="disorder-progress">
                <div 
                  className="disorder-progress-bar"
                  style={{ 
                    width: `${(disorder.severity / disorder.maxSeverity) * 100}%`,
                    backgroundColor: getDisorderColor(disorder.type)
                  }}
                ></div>
              </div>
              <div className="disorder-details">
                <span className="disorder-developed">
                  Developed: {formatTimestamp(disorder.developedAt)}
                </span>
                <span className="disorder-symptoms">
                  Symptoms: {disorder.symptoms.join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No personality disorders detected.</p>
      )}
    </div>
  );

  const renderRelationshipsTab = () => (
    <div className="ai-tab-content">
      <h3>🤝 AI Relationships</h3>
      <div className="relationships-list">
        {Array.from(aiData.relationships.entries()).map(([playerId, relationship]) => (
          <div 
            key={playerId} 
            className="relationship-item"
            style={{ borderLeftColor: getRelationshipColor(relationship) }}
          >
            <div className="relationship-header">
              <span className="relationship-player">{playerId}</span>
              <span 
                className="relationship-type"
                style={{ color: getRelationshipColor(relationship) }}
              >
                {relationship.toUpperCase()}
              </span>
            </div>
            <div className="relationship-details">
              <span className="relationship-trust">
                Trust: {aiData.memory?.trustHistory[aiData.memory.trustHistory.length - 1] || 50}/100
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBetrayalTab = () => (
    <div className="ai-tab-content">
      <h3>🗡️ Betrayal Plans</h3>
      {aiData.betrayalPlans.length > 0 ? (
        <div className="betrayal-list">
          {aiData.betrayalPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`betrayal-item ${plan.executed ? 'executed' : 'planned'}`}
            >
              <div className="betrayal-header">
                <span className="betrayal-target">{plan.target}</span>
                <span className={`betrayal-status ${plan.executed ? 'executed' : 'planned'}`}>
                  {plan.executed ? 'EXECUTED' : 'PLANNED'}
                </span>
              </div>
              <div className="betrayal-details">
                <span className="betrayal-type">{plan.type}</span>
                <span className="betrayal-time">
                  {plan.executed ? 'Executed' : 'Planned'}: {formatTimestamp(plan.plannedAt)}
                </span>
              </div>
              {plan.executed && (
                <div className="betrayal-consequences">
                  <span className="betrayal-success">
                    Success: {plan.success ? 'Yes' : 'No'}
                  </span>
                  <span className="betrayal-consequences-list">
                    Consequences: {plan.consequences.join(', ')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No active betrayal plans.</p>
      )}
    </div>
  );

  const renderEvolutionTab = () => (
    <div className="ai-tab-content">
      <h3>🧬 AI Evolution</h3>
      <div className="evolution-data">
        <div className="evolution-stats">
          <div className="stat-item">
            <span className="stat-label">Learning Rate:</span>
            <span className="stat-value">{aiData.evolutionData.learningRate?.toFixed(3) || '0.000'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Adaptation Speed:</span>
            <span className="stat-value">{aiData.evolutionData.adaptationSpeed?.toFixed(3) || '0.000'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Betrayal Probability:</span>
            <span className="stat-value">
              {((aiData.evolutionData.betrayalProbability || 0) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="cross-game-data">
          <h4>🌐 Cross-Game Statistics</h4>
          <div className="cross-game-stats">
            <div className="stat-item">
              <span className="stat-label">Total Games:</span>
              <span className="stat-value">{aiData.crossGameData.totalGames || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Trust:</span>
              <span className="stat-value">{Math.round(aiData.crossGameData.averageTrust || 0)}/100</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Betrayals:</span>
              <span className="stat-value">{aiData.crossGameData.betrayalCount || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Disorder Severity:</span>
              <span className="stat-value">{aiData.crossGameData.disorderSeverity?.toFixed(1) || '0.0'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Relationship Stability:</span>
              <span className="stat-value">{((aiData.crossGameData.relationshipStability || 0) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="advanced-ai-systems">
      <div className="ai-systems-header">
        <h2>🤖 Advanced AI Systems</h2>
        <div className="ai-personality-indicator">
          <span className="ai-state">{aiData.personalityState.toUpperCase()}</span>
          <span className="ai-trust">Trust: {aiData.personality?.trustLevel || 50}</span>
          <span className="ai-suspicion">Suspicion: {aiData.personality?.suspicionLevel || 0}</span>
        </div>
      </div>
      
      <div className="ai-tabs">
        <button 
          className={`ai-tab ${activeTab === 'memory' ? 'active' : ''}`}
          onClick={() => setActiveTab('memory')}
        >
          🧠 Memory
        </button>
        <button 
          className={`ai-tab ${activeTab === 'disorders' ? 'active' : ''}`}
          onClick={() => setActiveTab('disorders')}
        >
          😵‍💫 Disorders
        </button>
        <button 
          className={`ai-tab ${activeTab === 'relationships' ? 'active' : ''}`}
          onClick={() => setActiveTab('relationships')}
        >
          🤝 Relationships
        </button>
        <button 
          className={`ai-tab ${activeTab === 'betrayal' ? 'active' : ''}`}
          onClick={() => setActiveTab('betrayal')}
        >
          🗡️ Betrayal
        </button>
        <button 
          className={`ai-tab ${activeTab === 'evolution' ? 'active' : ''}`}
          onClick={() => setActiveTab('evolution')}
        >
          🧬 Evolution
        </button>
      </div>
      
      <div className="ai-content">
        {activeTab === 'memory' && renderMemoryTab()}
        {activeTab === 'disorders' && renderDisordersTab()}
        {activeTab === 'relationships' && renderRelationshipsTab()}
        {activeTab === 'betrayal' && renderBetrayalTab()}
        {activeTab === 'evolution' && renderEvolutionTab()}
      </div>
    </div>
  );
};

export default AdvancedAISystems; 