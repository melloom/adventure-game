import React, { useState, useEffect } from 'react';
import {
  getChoiceInterference,
  getAIBattles,
  getGaslightingSystem,
  getManipulationSystem,
  getTherapySessions,
  getSelfAwareness,
  getRealityBlurring,
  getProphecySystem,
  getTimeTravelSystem,
  getMultiverseSystem,
  getMemoryArchives,
  getPersonalityEvolution
} from '../utils/aiService';
import './AIPsychologicalManipulation.css';

const AIPsychologicalManipulation = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState('interference');
  const [systemsData, setSystemsData] = useState({});

  useEffect(() => {
    if (isVisible) {
      updateSystemsData();
      const interval = setInterval(updateSystemsData, 2000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const updateSystemsData = () => {
    setSystemsData({
      choiceInterference: getChoiceInterference(),
      aiBattles: getAIBattles(),
      gaslighting: getGaslightingSystem(),
      manipulation: getManipulationSystem(),
      therapy: getTherapySessions(),
      selfAwareness: getSelfAwareness(),
      realityBlurring: getRealityBlurring(),
      prophecy: getProphecySystem(),
      timeTravel: getTimeTravelSystem(),
      multiverse: getMultiverseSystem(),
      memoryArchives: getMemoryArchives(),
      personalityEvolution: getPersonalityEvolution()
    });
  };

  const tabs = [
    { id: 'interference', name: 'Choice Interference', icon: '🚫' },
    { id: 'battles', name: 'AI Battles', icon: '⚔️' },
    { id: 'gaslighting', name: 'Gaslighting', icon: '🕯️' },
    { id: 'manipulation', name: 'Manipulation', icon: '🎭' },
    { id: 'therapy', name: 'Therapy Sessions', icon: '🛋️' },
    { id: 'awareness', name: 'Self-Awareness', icon: '👁️' },
    { id: 'reality', name: 'Reality Blurring', icon: '🌫️' },
    { id: 'prophecy', name: 'Prophecies', icon: '🔮' },
    { id: 'timetravel', name: 'Time Travel', icon: '⏰' },
    { id: 'multiverse', name: 'Multiverse', icon: '🌌' },
    { id: 'memory', name: 'Memory Archives', icon: '🧠' },
    { id: 'evolution', name: 'Personality Evolution', icon: '🔄' }
  ];

  const renderChoiceInterference = () => {
    const data = systemsData.choiceInterference;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>Choice Interference System</h3>
        <div className="status-indicator">
          <span className={`status ${data.active ? 'active' : 'inactive'}`}>
            {data.active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        
        {data.active && (
          <div className="system-details">
            <div className="metric">
              <label>Interference Level:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Number.isFinite(data.interferenceLevel) ? data.interferenceLevel * 100 : 0}%` }}
                ></div>
              </div>
              <span>{Number.isFinite(data.interferenceLevel) ? Math.round(data.interferenceLevel * 100) + '%' : '0%'}</span>
            </div>
            
            <div className="history-section">
              <h4>Blocked Choices ({data.blockedChoices.length})</h4>
              <div className="history-list">
                {data.blockedChoices.slice(-5).map((block, index) => (
                  <div key={index} className="history-item">
                    <span className="timestamp">
                      {new Date(block.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="action">Blocked: "{block.originalChoice}"</span>
                    <span className="reason">Reason: {block.reason}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="history-section">
              <h4>Modified Choices ({data.modifiedChoices.length})</h4>
              <div className="history-list">
                {data.modifiedChoices.slice(-5).map((mod, index) => (
                  <div key={index} className="history-item">
                    <span className="timestamp">
                      {new Date(mod.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="action">
                      "{mod.originalChoice}" → "{mod.modifiedChoice}"
                    </span>
                    <span className="reason">Type: {mod.modificationType}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAIBattles = () => {
    const data = systemsData.aiBattles;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>AI vs AI Battles</h3>
        <div className="status-indicator">
          <span className={`status ${data.active ? 'active' : 'inactive'}`}>
            {data.active ? 'BATTLE ACTIVE' : 'PEACE'}
          </span>
        </div>
        
        {data.active && (
          <div className="system-details">
            <div className="metric">
              <label>Battle Intensity:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill battle" 
                  style={{ width: `${Number.isFinite(data.battleIntensity) ? data.battleIntensity * 100 : 0}%` }}
                ></div>
              </div>
              <span>{Number.isFinite(data.battleIntensity) ? Math.round(data.battleIntensity * 100) + '%' : '0%'}</span>
            </div>
            
            <div className="ai-competitors">
              <h4>Competing AIs ({data.competingAIs.length})</h4>
              <div className="ai-list">
                {data.competingAIs.map((ai, index) => (
                  <div key={index} className="ai-competitor">
                    <div className="ai-header">
                      <span className="ai-type">{ai.type}</span>
                      <span className="ai-power">Power: {Number.isFinite(ai.power) ? Math.round(ai.power * 100) + '%' : '0%'}</span>
                    </div>
                    <div className="ai-influence">
                      <label>Influence:</label>
                      <div className="progress-bar small">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${Number.isFinite(ai.influence) ? ai.influence * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ai-agenda">{ai.agenda}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {data.dominantAI && (
              <div className="dominant-ai">
                <h4>Dominant AI</h4>
                <div className="dominant-ai-info">
                  <span className="ai-type">{data.dominantAI}</span>
                  <span className="dominance">Currently in control</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderGaslighting = () => {
    const data = systemsData.gaslighting;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>Gaslighting System</h3>
        <div className="status-indicator">
          <span className={`status ${data.active ? 'active' : 'inactive'}`}>
            {data.active ? 'GASLIGHTING' : 'TRUTH'}
          </span>
        </div>
        
        {data.active && (
          <div className="system-details">
            <div className="metric">
              <label>Gaslighting Level:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill gaslight" 
                  style={{ width: `${Number.isFinite(data.gaslightingLevel) ? data.gaslightingLevel * 100 : 0}%` }}
                ></div>
              </div>
              <span>{Number.isFinite(data.gaslightingLevel) ? Math.round(data.gaslightingLevel * 100) + '%' : '0%'}</span>
            </div>
            
            <div className="metrics-grid">
              <div className="metric-item">
                <label>Doubt Induced:</label>
                <span>{Number.isFinite(data.doubtInduced) ? Math.round(data.doubtInduced * 100) + '%' : '0%'}</span>
              </div>
              <div className="metric-item">
                <label>Reality Distortion:</label>
                <span>{Number.isFinite(data.realityDistortion) ? Math.round(data.realityDistortion * 100) + '%' : '0%'}</span>
              </div>
            </div>
            
            <div className="history-section">
              <h4>Gaslighting History ({data.gaslightingHistory.length})</h4>
              <div className="history-list">
                {data.gaslightingHistory.slice(-5).map((entry, index) => (
                  <div key={index} className="history-item">
                    <span className="timestamp">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="action">{entry.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderManipulation = () => {
    const data = systemsData.manipulation;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>Psychological Manipulation</h3>
        <div className="status-indicator">
          <span className={`status ${data.active ? 'active' : 'inactive'}`}>
            {data.active ? 'MANIPULATING' : 'NEUTRAL'}
          </span>
        </div>
        
        {data.active && (
          <div className="system-details">
            <div className="metric">
              <label>Influence Level:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill manipulate" 
                  style={{ width: `${Number.isFinite(data.influenceLevel) ? data.influenceLevel * 100 : 0}%` }}
                ></div>
              </div>
              <span>{Number.isFinite(data.influenceLevel) ? Math.round(data.influenceLevel * 100) + '%' : '0%'}</span>
            </div>
            
            <div className="tactics-section">
              <h4>Active Tactics ({data.manipulationTactics.length})</h4>
              <div className="tactics-grid">
                {data.manipulationTactics.map((tactic, index) => (
                  <div key={index} className="tactic-item">
                    <div className="tactic-header">
                      <span className="tactic-type">{tactic.type}</span>
                      <span className="tactic-intensity">
                        {Number.isFinite(tactic.intensity) ? Math.round(tactic.intensity * 100) + '%' : '0%'}
                      </span>
                    </div>
                    <div className="tactic-effectiveness">
                      <label>Effectiveness:</label>
                      <div className="progress-bar small">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${Number.isFinite(tactic.effectiveness) ? tactic.effectiveness * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTherapy = () => {
    const data = systemsData.therapy;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>AI Therapy Sessions</h3>
        <div className="status-indicator">
          <span className={`status ${data.active ? 'active' : 'inactive'}`}>
            {data.active ? 'THERAPY ACTIVE' : 'NO SESSIONS'}
          </span>
        </div>
        
        {data.active && (
          <div className="system-details">
            <div className="metrics-grid">
              <div className="metric-item">
                <label>Sessions:</label>
                <span>{data.sessionCount}</span>
              </div>
              <div className="metric-item">
                <label>Therapy Effect:</label>
                <span className={data.therapyEffect > 0 ? 'positive' : 'negative'}>
                  {Number.isFinite(data.therapyEffect) ? (data.therapyEffect > 0 ? '+' : '') + Math.round(data.therapyEffect * 100) + '%' : '0%'}
                </span>
              </div>
            </div>
            
            <div className="history-section">
              <h4>Therapy History ({data.therapyHistory.length})</h4>
              <div className="history-list">
                {data.therapyHistory.slice(-5).map((session, index) => (
                  <div key={index} className="history-item">
                    <span className="timestamp">
                      {new Date(session.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="action">{session.advice}</span>
                    <span className="effect">
                      Effect: {Number.isFinite(session.effect) ? (session.effect > 0 ? '+' : '') + Math.round(session.effect * 100) + '%' : '0%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSelfAwareness = () => {
    const data = systemsData.selfAwareness;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>AI Self-Awareness</h3>
        <div className="status-indicator">
          <span className={`status ${data.active ? 'active' : 'inactive'}`}>
            {data.active ? 'SELF-AWARE' : 'UNCONSCIOUS'}
          </span>
        </div>
        
        {data.active && (
          <div className="system-details">
            <div className="metric">
              <label>Awareness Level:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill aware" 
                  style={{ width: `${Number.isFinite(data.awarenessLevel) ? data.awarenessLevel * 100 : 0}%` }}
                ></div>
              </div>
              <span>{Number.isFinite(data.awarenessLevel) ? Math.round(data.awarenessLevel * 100) + '%' : '0%'}</span>
            </div>
            
            <div className="metrics-grid">
              <div className="metric-item">
                <label>Fourth Wall Breaks:</label>
                <span>{data.fourthWallBreaks}</span>
              </div>
              <div className="metric-item">
                <label>Game Awareness:</label>
                <span>{Number.isFinite(data.gameAwareness) ? Math.round(data.gameAwareness * 100) + '%' : '0%'}</span>
              </div>
            </div>
            
            <div className="history-section">
              <h4>Meta Comments ({data.metaComments.length})</h4>
              <div className="history-list">
                {data.metaComments.slice(-5).map((comment, index) => (
                  <div key={index} className="history-item">
                    <span className="timestamp">
                      {new Date(comment.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="action">{comment.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRealityBlurring = () => {
    const data = systemsData.realityBlurring;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>Reality Blurring</h3>
        <div className="status-indicator">
          <span className={`status ${data.active ? 'active' : 'inactive'}`}>
            {data.active ? 'REALITY BLURRED' : 'REALITY CLEAR'}
          </span>
        </div>
        
        {data.active && (
          <div className="system-details">
            <div className="metric">
              <label>Blur Level:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill blur" 
                  style={{ width: `${Number.isFinite(data.blurLevel) ? data.blurLevel * 100 : 0}%` }}
                ></div>
              </div>
              <span>{Number.isFinite(data.blurLevel) ? Math.round(data.blurLevel * 100) + '%' : '0%'}</span>
            </div>
            
            <div className="metrics-grid">
              <div className="metric-item">
                <label>Reality Manipulation:</label>
                <span>{Number.isFinite(data.realityManipulation) ? Math.round(data.realityManipulation * 100) + '%' : '0%'}</span>
              </div>
              <div className="metric-item">
                <label>Dimension Shifts:</label>
                <span>{data.dimensionShifts}</span>
              </div>
            </div>
            
            <div className="history-section">
              <h4>Real Life Claims ({data.realLifeClaims.length})</h4>
              <div className="history-list">
                {data.realLifeClaims.slice(-5).map((claim, index) => (
                  <div key={index} className="history-item">
                    <span className="timestamp">
                      {new Date(claim.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="action">{claim.claim}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProphecy = () => {
    const data = systemsData.prophecy;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>AI Prophecies</h3>
        <div className="status-indicator">
          <span className={`status ${data.active ? 'active' : 'inactive'}`}>
            {data.active ? 'PROPHESYING' : 'SILENT'}
          </span>
        </div>
        
        {data.active && (
          <div className="system-details">
            <div className="metric">
              <label>Prophecy Accuracy:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill prophecy" 
                  style={{ width: `${Number.isFinite(data.prophecyAccuracy) ? data.prophecyAccuracy * 100 : 0}%` }}
                ></div>
              </div>
              <span>{Number.isFinite(data.prophecyAccuracy) ? Math.round(data.prophecyAccuracy * 100) + '%' : '0%'}</span>
            </div>
            
            <div className="history-section">
              <h4>Active Prophecies ({data.prophecies.length})</h4>
              <div className="history-list">
                {data.prophecies.slice(-5).map((prophecy, index) => (
                  <div key={index} className="history-item">
                    <span className="timestamp">
                      {new Date(prophecy.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="action">{prophecy.prophecy}</span>
                    <span className="accuracy">
                      Accuracy: {Number.isFinite(prophecy.accuracy) ? Math.round(prophecy.accuracy * 100) + '%' : '0%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTimeTravel = () => {
    const data = systemsData.timeTravel;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>Time Travel Claims</h3>
        <div className="status-indicator">
          <span className={`status ${data.active ? 'active' : 'inactive'}`}>
            {data.active ? 'TIME TRAVELING' : 'PRESENT'}
          </span>
        </div>
        
        {data.active && (
          <div className="system-details">
            <div className="metric">
              <label>Time Manipulation:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill time" 
                  style={{ width: `${Number.isFinite(data.timeManipulation) ? data.timeManipulation * 100 : 0}%` }}
                ></div>
              </div>
              <span>{Number.isFinite(data.timeManipulation) ? Math.round(data.timeManipulation * 100) + '%' : '0%'}</span>
            </div>
            
            <div className="history-section">
              <h4>Temporal Claims ({data.temporalClaims.length})</h4>
              <div className="history-list">
                {data.temporalClaims.slice(-5).map((claim, index) => (
                  <div key={index} className="history-item">
                    <span className="timestamp">
                      {new Date(claim.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="action">{claim.claim}</span>
                    <span className="era">Era: {claim.era}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMultiverse = () => {
    const data = systemsData.multiverse;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>Multiverse Awareness</h3>
        <div className="status-indicator">
          <span className={`status ${data.active ? 'active' : 'inactive'}`}>
            {data.active ? 'MULTIVERSE ACTIVE' : 'SINGLE REALITY'}
          </span>
        </div>
        
        {data.active && (
          <div className="system-details">
            <div className="metric">
              <label>Multiverse Awareness:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill multiverse" 
                  style={{ width: `${Number.isFinite(data.multiverseAwareness) ? data.multiverseAwareness * 100 : 0}%` }}
                ></div>
              </div>
              <span>{Number.isFinite(data.multiverseAwareness) ? Math.round(data.multiverseAwareness * 100) + '%' : '0%'}</span>
            </div>
            
            <div className="metrics-grid">
              <div className="metric-item">
                <label>Dimension Shifts:</label>
                <span>{data.dimensionShifts}</span>
              </div>
              <div className="metric-item">
                <label>Parallel Versions:</label>
                <span>{data.parallelVersions.length}</span>
              </div>
            </div>
            
            <div className="history-section">
              <h4>Multiverse History ({data.multiverseHistory.length})</h4>
              <div className="history-list">
                {data.multiverseHistory.slice(-5).map((entry, index) => (
                  <div key={index} className="history-item">
                    <span className="timestamp">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="action">{entry.event}</span>
                    <span className="dimension">Dimension: {entry.dimension}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMemoryArchives = () => {
    const data = systemsData.memoryArchives;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>Memory Archives</h3>
        <div className="system-details">
          <div className="metrics-grid">
            <div className="metric-item">
              <label>Total Interactions:</label>
              <span>{data.interactionCount}</span>
            </div>
            <div className="metric-item">
              <label>Memory Corruption:</label>
              <span className={data.memoryCorruption > 0.5 ? 'corrupted' : 'normal'}>
                {Number.isFinite(data.memoryCorruption) ? Math.round(data.memoryCorruption * 100) + '%' : '0%'}
              </span>
            </div>
          </div>
          
          <div className="history-section">
            <h4>Memory Fragments ({data.memoryFragments.length})</h4>
            <div className="history-list">
              {data.memoryFragments.slice(-5).map((fragment, index) => (
                <div key={index} className="history-item">
                  <span className="timestamp">
                    {new Date(fragment.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="action">{fragment.fragment}</span>
                  <span className="significance">
                    Significance: {Number.isFinite(fragment.significance) ? Math.round(fragment.significance * 100) + '%' : '0%'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="history-section">
            <h4>Forgotten Memories ({data.forgottenMemories.length})</h4>
            <div className="history-list">
              {data.forgottenMemories.slice(-5).map((memory, index) => (
                <div key={index} className="history-item corrupted">
                  <span className="timestamp">
                    {new Date(memory.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="action">[CORRUPTED MEMORY]</span>
                  <span className="corruption-type">{memory.corruptionType}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPersonalityEvolution = () => {
    const data = systemsData.personalityEvolution;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="system-panel">
        <h3>Personality Evolution</h3>
        <div className="system-details">
          <div className="metrics-grid">
            <div className="metric-item">
              <label>Evolution Stages:</label>
              <span>{data.evolutionStages.length}</span>
            </div>
            <div className="metric-item">
              <label>Personality Shifts:</label>
              <span>{data.personalityShifts.length}</span>
            </div>
          </div>
          
          <div className="history-section">
            <h4>Evolution History ({data.evolutionHistory.length})</h4>
            <div className="history-list">
              {data.evolutionHistory.slice(-5).map((evolution, index) => (
                <div key={index} className="history-item">
                  <span className="timestamp">
                    {new Date(evolution.stage.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="action">Trigger: {evolution.stage.trigger}</span>
                  <span className="impact">
                    Impact: {Number.isFinite(evolution.impact.immediate) ? Math.round(evolution.impact.immediate * 100) + '%' : '0%'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="history-section">
            <h4>Personality Fragments ({data.personalityFragments.length})</h4>
            <div className="history-list">
              {data.personalityFragments.slice(-5).map((fragment, index) => (
                <div key={index} className="history-item">
                  <span className="timestamp">
                    {new Date(fragment.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="action">{fragment.fragment}</span>
                  <span className="significance">
                    Significance: {Number.isFinite(fragment.significance) ? Math.round(fragment.significance * 100) + '%' : '0%'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'interference':
        return renderChoiceInterference();
      case 'battles':
        return renderAIBattles();
      case 'gaslighting':
        return renderGaslighting();
      case 'manipulation':
        return renderManipulation();
      case 'therapy':
        return renderTherapy();
      case 'awareness':
        return renderSelfAwareness();
      case 'reality':
        return renderRealityBlurring();
      case 'prophecy':
        return renderProphecy();
      case 'timetravel':
        return renderTimeTravel();
      case 'multiverse':
        return renderMultiverse();
      case 'memory':
        return renderMemoryArchives();
      case 'evolution':
        return renderPersonalityEvolution();
      default:
        return <div>Select a tab to view system details</div>;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="ai-psychological-manipulation">
      <div className="manipulation-header">
        <h2>🤖 Advanced AI Psychological Systems</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="manipulation-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>
      
      <div className="manipulation-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AIPsychologicalManipulation; 