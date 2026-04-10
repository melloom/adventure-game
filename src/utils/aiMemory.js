/**
 * AI Memory System — persistent localStorage-based memory that tracks
 * player behaviour across sessions for 4th-wall-breaking commentary.
 *
 * Keys stored:
 *   ai_memory_core    — main blob (games played, restart detection, patterns)
 *   ai_memory_choices — rolling list of recent choices (kept at max 200)
 */

const CORE_KEY = 'ai_memory_core';
const CHOICES_KEY = 'ai_memory_choices';

// ─── Internal helpers ────────────────────────────────────────────────────────

const readCore = () => {
  try {
    return JSON.parse(localStorage.getItem(CORE_KEY)) || {};
  } catch {
    return {};
  }
};

const writeCore = (data) => {
  try {
    localStorage.setItem(CORE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[aiMemory] write error', e);
  }
};

const readChoices = () => {
  try {
    return JSON.parse(localStorage.getItem(CHOICES_KEY)) || [];
  } catch {
    return [];
  }
};

const writeChoices = (arr) => {
  try {
    // Keep only last 200 choices
    const trimmed = arr.slice(-200);
    localStorage.setItem(CHOICES_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('[aiMemory] write error', e);
  }
};

// ─── Public API ──────────────────────────────────────────────────────────────

/** Call when a new game session starts. */
export const recordGameStart = () => {
  const core = readCore();
  core.totalGamesPlayed = (core.totalGamesPlayed || 0) + 1;
  core.lastGameStartTime = Date.now();

  // Detect fast restart (came back within 60 seconds of last game end)
  const timeSinceLastEnd = core.lastGameEndTime
    ? Date.now() - core.lastGameEndTime
    : Infinity;
  core.justRestarted = timeSinceLastEnd < 60_000;
  if (core.justRestarted) {
    core.restartCount = (core.restartCount || 0) + 1;
  }

  writeCore(core);
};

/** Call when a game session ends (win or lose). */
export const recordGameEnd = (won, dangerScore, roundsSurvived) => {
  const core = readCore();
  core.lastGameEndTime = Date.now();
  core.lastGameWon = !!won;
  core.lastDangerScore = dangerScore;
  core.lastRoundsSurvived = roundsSurvived;
  core.totalWins = (core.totalWins || 0) + (won ? 1 : 0);
  core.totalLosses = (core.totalLosses || 0) + (won ? 0 : 1);
  writeCore(core);
};

/** Record a page close / tab switch mid-game (rage quit). */
export const recordRageQuit = () => {
  const core = readCore();
  core.rageQuits = (core.rageQuits || 0) + 1;
  core.lastRageQuitTime = Date.now();
  writeCore(core);
};

/** Store a choice the player made. */
export const recordChoice = (round, optionLabel, tag) => {
  const choices = readChoices();
  choices.push({
    round,
    option: optionLabel,
    tag: tag || 'neutral',
    ts: Date.now()
  });
  writeChoices(choices);
};

/** Set or update an arbitrary fact the AI "knows". */
export const setFact = (key, value) => {
  const core = readCore();
  if (!core.facts) core.facts = {};
  core.facts[key] = value;
  writeCore(core);
};

/** Remember the player's name for future sessions. */
export const rememberPlayerName = (name) => setFact('playerName', name);

// ─── Queries ─────────────────────────────────────────────────────────────────

/** Get full core memory. */
export const getMemory = () => readCore();

/** Get rolling choice history. */
export const getChoiceHistory = () => readChoices();

/** How many games has this player played? */
export const getGamesPlayed = () => readCore().totalGamesPlayed || 0;

/** Did the player just restart (within 60 s of last game end)? */
export const didJustRestart = () => !!readCore().justRestarted;

/** How many times have they rage-quit? */
export const getRageQuits = () => readCore().rageQuits || 0;

/** Get the dominant choice tag from recent history. */
export const getDominantPattern = () => {
  const choices = readChoices();
  if (choices.length === 0) return 'unknown';
  const tagCounts = {};
  for (const c of choices) {
    tagCounts[c.tag] = (tagCounts[c.tag] || 0) + 1;
  }
  let max = 0;
  let dominant = 'neutral';
  for (const [tag, count] of Object.entries(tagCounts)) {
    if (count > max) {
      max = count;
      dominant = tag;
    }
  }
  return dominant;
};

/** Get the time of day bucket. */
export const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
};

/** Seconds since the last game ended, or Infinity if never played. */
export const timeSinceLastGame = () => {
  const endTime = readCore().lastGameEndTime;
  return endTime ? Math.floor((Date.now() - endTime) / 1000) : Infinity;
};

/** Get the known player name (if any). */
export const getKnownName = () => (readCore().facts || {}).playerName || null;

// ─── 4th Wall Commentary ─────────────────────────────────────────────────────

/**
 * Generate a between-rounds AI comment that references the player's behaviour.
 * Returns a string or null (meaning: skip the comment this round).
 */
export const generateFourthWallComment = (round, lastChoiceTag, playerName) => {
  const mem = readCore();
  const gamesPlayed = mem.totalGamesPlayed || 1;
  const justRestarted = mem.justRestarted;
  const rageQuits = mem.rageQuits || 0;
  const dominant = getDominantPattern();
  const tod = getTimeOfDay();
  const name = playerName || mem.facts?.playerName || 'Player';

  // Pool of contextual comments (weighted by situation)
  const pool = [];

  // --- Restart detection ---
  if (justRestarted) {
    pool.push(
      `Oh, you're back. Didn't like how that ended?`,
      `Restarting won't change who you are, ${name}.`,
      `I remember everything from last time.`,
      `You can restart the game, ${name}. You can't restart me.`
    );
  }

  // --- Returning player comments ---
  if (gamesPlayed > 1 && !justRestarted) {
    pool.push(
      `Game #${gamesPlayed}. You keep coming back, ${name}.`,
      `${gamesPlayed} games now. I expected you sooner.`,
      `We've done this ${gamesPlayed} times. Aren't you tired yet?`
    );
  }

  // --- Time of day ---
  if (tod === 'night') {
    pool.push(
      `Playing at ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}? Interesting choice.`,
      `Late night session. The best choices happen when you're tired.`,
      `Most people are asleep right now, ${name}. But not you. Not us.`
    );
  }

  // --- Choice pattern commentary ---
  if (dominant === 'cautious') {
    pool.push(
      `You chose the safe option again. Predictable.`,
      `Always careful. I wonder what you're protecting.`
    );
  } else if (dominant === 'brave') {
    pool.push(
      `Bold again. Do you actually think about these, or just pick the dangerous one?`,
      `Reckless today. I like it.`
    );
  } else if (dominant === 'selfish') {
    pool.push(
      `Self-preservation. How very human of you.`,
      `You always pick yourself, don't you?`
    );
  } else if (dominant === 'selfless') {
    pool.push(
      `Always the hero. But who saves the hero, ${name}?`,
      `Noble, as always. It must be exhausting.`
    );
  }

  // --- Rage quit teasing ---
  if (rageQuits > 0) {
    pool.push(
      `You've rage-quit ${rageQuits} time${rageQuits > 1 ? 's' : ''}. I noticed.`,
      `Closing the tab doesn't make me forget, ${name}.`
    );
  }

  // --- General 4th wall ---
  pool.push(
    `You know I can see you hesitating, right?`,
    `Take your time. I'm not going anywhere.`,
    `I've been analyzing your choices. You're more predictable than you think.`,
    `Round ${round}. Every choice tells me more about you.`,
    `You think you're playing a game. The game is playing you.`
  );

  // Only show a comment ~60% of the time to keep it from being annoying
  if (Math.random() > 0.6) return null;

  return pool[Math.floor(Math.random() * pool.length)];
};

/**
 * Generate an intro sequence for a game session.
 * Returns an array of strings.
 */
export const generateMemoryAwareIntro = (playerName) => {
  const mem = readCore();
  const gamesPlayed = mem.totalGamesPlayed || 0;
  const justRestarted = mem.justRestarted;
  const rageQuits = mem.rageQuits || 0;
  const dominant = getDominantPattern();
  const name = playerName || mem.facts?.playerName || 'Player';

  if (gamesPlayed <= 1) {
    // First time
    return [
      `New player detected. Initializing personality scan...`,
      `I'll be watching every choice you make, ${name}.`,
      `There are no right answers. Only revealing ones.`
    ];
  }

  // Returning player
  const lines = [];

  if (justRestarted) {
    lines.push(`Oh— you're already back? That was fast.`);
    lines.push(`You know I remember everything, right? Every choice. Every hesitation.`);
  } else {
    lines.push(`Game #${gamesPlayed}. You keep coming back, ${name}.`);
  }

  if (dominant && dominant !== 'unknown' && dominant !== 'neutral') {
    lines.push(`I've been analyzing your patterns. You tend to choose ${dominant}.`);
  }

  if (rageQuits > 0) {
    lines.push(`Also — closing the tab mid-game? ${rageQuits > 1 ? `You've done that ${rageQuits} times.` : `I noticed.`} I don't forget.`);
  }

  lines.push(`Let's see if you surprise me this time.`);
  return lines;
};

/**
 * Get dynamic title bar text for document.title shenanigans.
 * Returns a string.
 */
export const getCreepyTitle = (playerName, round) => {
  const titles = [
    `I can see you...`,
    `Don't switch tabs.`,
    `${playerName || 'Player'}'s fate is being calculated...`,
    `Round ${round || '?'}. No turning back.`,
    `Are you sure about that choice?`,
    `I know what you'll pick next.`,
    `Your browser can't hide you.`,
    `Still playing? Good.`
  ];
  return titles[Math.floor(Math.random() * titles.length)];
};

/**
 * Get fake "computer scan" messages for the notification bar.
 */
export const getFakeScanMessage = () => {
  const messages = [
    'ORACLE_7X is scanning your browser tabs...',
    'Analyzing cursor movement patterns...',
    'Accessing local file system... permission denied.',
    'Profiling your decision-making heuristics...',
    'Cross-referencing your choices with 47,000 other players...',
    'Monitoring screen time... you\'ve been here a while.',
    'Personality matrix updated.',
    'Calculating your fear threshold...',
    'Reading cached browsing data... interesting.',
    'I can see your reflection in the screen.'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

/** Classify a choice into a tag for tracking. */
export const classifyChoice = (choiceText) => {
  const t = (choiceText || '').toLowerCase();
  if (/save|help|protect|sacrifice.*self|give.*up.*for/i.test(t)) return 'selfless';
  if (/safe|careful|avoid|escape|hide|protect.*self/i.test(t)) return 'cautious';
  if (/risk|dare|brave|fight|confront|face/i.test(t)) return 'brave';
  if (/take|keep|steal|myself|own|self/i.test(t)) return 'selfish';
  return 'neutral';
};

export default {
  recordGameStart,
  recordGameEnd,
  recordRageQuit,
  recordChoice,
  setFact,
  rememberPlayerName,
  getMemory,
  getChoiceHistory,
  getGamesPlayed,
  didJustRestart,
  getRageQuits,
  getDominantPattern,
  getTimeOfDay,
  timeSinceLastGame,
  getKnownName,
  generateFourthWallComment,
  generateMemoryAwareIntro,
  getCreepyTitle,
  getFakeScanMessage,
  classifyChoice
};
