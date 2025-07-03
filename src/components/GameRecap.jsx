import React from 'react';

// Helper to determine playstyle and taunt
function getDeathTaunt(gameHistory, dangerScore) {
  const last = gameHistory[gameHistory.length - 1];
  let type = 'neutral';
  if (!last) return "ENTITY_ORACLE_7X: You died in the void. How... unimpressive.";
  if (last.consequence.toLowerCase().includes('kill') || last.consequence.toLowerCase().includes('destroy') || last.consequence.toLowerCase().includes('torture')) type = 'villainous';
  else if (last.dangerLevel >= 9) type = 'reckless';
  else if (last.dangerLevel <= 2) type = 'cautious';
  else if (last.consequence.toLowerCase().includes('save') || last.consequence.toLowerCase().includes('help')) type = 'heroic';
  else if (dangerScore > 70) type = 'overwhelmed';

  const taunts = {
    villainous: [
      "ENTITY_ORACLE_7X: You chose the path of darkness, and darkness devoured you. Fitting.",
      "ENTITY_ORACLE_7X: All those evil choices, and for what? Death still found you. Delicious irony."
    ],
    reckless: [
      "ENTITY_ORACLE_7X: You played with fire, and now you're ash. Did you expect mercy?",
      "ENTITY_ORACLE_7X: Danger was your companion, and now it's your executioner."
    ],
    cautious: [
      "ENTITY_ORACLE_7X: Playing it safe? Boring. Even caution couldn't save you.",
      "ENTITY_ORACLE_7X: You tiptoed through chaos, but chaos tripped you anyway."
    ],
    heroic: [
      "ENTITY_ORACLE_7X: You tried to be a hero. Heroes die young.",
      "ENTITY_ORACLE_7X: Sacrifice is noble. But nobility is no shield from death."
    ],
    overwhelmed: [
      "ENTITY_ORACLE_7X: The chaos was too much for you. I expected more.",
      "ENTITY_ORACLE_7X: Overwhelmed? Or just... weak?"
    ],
    neutral: [
      "ENTITY_ORACLE_7X: You died. Not memorable, not impressive. Try harder next time.",
      "ENTITY_ORACLE_7X: Another one bites the digital dust."
    ]
  };
  const arr = taunts[type] || taunts.neutral;
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSurvivalSummary(gameHistory, dangerScore) {
  let style = 'balanced';
  let bravery = 0, villainy = 0, heroism = 0, risky = 0, cautious = 0;
  for (const entry of gameHistory) {
    const c = entry.consequence.toLowerCase();
    if (c.includes('kill') || c.includes('destroy') || c.includes('torture')) villainy++;
    if (c.includes('save') || c.includes('help')) heroism++;
    if (entry.dangerLevel >= 7) risky++;
    if (entry.dangerLevel <= 2) cautious++;
    if (entry.dangerLevel >= 5) bravery++;
  }
  if (villainy > heroism && villainy > risky) style = 'villainous';
  else if (heroism > villainy && heroism > risky) style = 'heroic';
  else if (risky > cautious) style = 'reckless';
  else if (cautious > risky) style = 'cautious';

  const summaries = {
    villainous: [
      "ENTITY_ORACLE_7X: You survived, but at what cost? The darkness within you is impressive.",
      "ENTITY_ORACLE_7X: Survival through villainy. I approve."
    ],
    heroic: [
      "ENTITY_ORACLE_7X: A hero emerges from the chaos. But heroes rarely last long...",
      "ENTITY_ORACLE_7X: You saved others, and yourself. For now."
    ],
    reckless: [
      "ENTITY_ORACLE_7X: Reckless, wild, unstoppable. You survived by sheer force of will.",
      "ENTITY_ORACLE_7X: You danced with danger and lived. Impressive."
    ],
    cautious: [
      "ENTITY_ORACLE_7X: Caution kept you alive. But next time, I will adapt.",
      "ENTITY_ORACLE_7X: Careful steps, but you made it."
    ],
    balanced: [
      "ENTITY_ORACLE_7X: A balanced survivor. Predictable, but effective.",
      "ENTITY_ORACLE_7X: You played all sides. The AI is watching."
    ]
  };
  const arr = summaries[style] || summaries.balanced;
  return arr[Math.floor(Math.random() * arr.length)];
}

const GameRecap = ({ gameHistory, survived, dangerScore, onBackToMenu }) => {
  return (
    <div className="recap-container">
      <div className="recap-header">
        <h2>{survived ? 'You Survived!' : 'You Died!'}</h2>
        <p className="recap-danger">Final Danger Score: {dangerScore}</p>
      </div>
      <div className="recap-summary">
        {survived
          ? <p>{getSurvivalSummary(gameHistory, dangerScore)}</p>
          : <p>{getDeathTaunt(gameHistory, dangerScore)}</p>
        }
      </div>
      <div className="recap-breakdown">
        <h3>Journey Breakdown</h3>
        <ol>
          {gameHistory.map((entry, idx) => (
            <li key={idx} className="recap-round">
              <strong>Round {entry.round}:</strong> <br/>
              <span className="recap-question">Q: {entry.question}</span><br/>
              <span className="recap-choice">Choice: {entry.choice}</span><br/>
              <span className="recap-consequence">Consequence: {entry.consequence}</span><br/>
              <span className="recap-dlevel">Danger: +{entry.dangerLevel} (Total: {entry.totalDanger})</span>
            </li>
          ))}
        </ol>
      </div>
      <button className="recap-menu-btn" onClick={onBackToMenu}>
        Return to Main Menu
      </button>
    </div>
  );
};

export default GameRecap; 