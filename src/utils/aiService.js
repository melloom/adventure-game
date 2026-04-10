import axios from 'axios';
import { getRandomQuestion } from './questionBank';

// Environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Model configurations
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

// OpenAI API client
const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  timeout: 20000,
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// ─── QUESTION GENERATION ────────────────────────────────────────────────────

/**
 * Build a prompt that asks GPT to return a structured JSON "Would You Rather" question.
 */
const buildQuestionPrompt = (difficulty, round, previousChoices) => {
  const difficultyGuide = {
    easy: 'fun, lighthearted dilemmas — lifestyle choices, superpowers, social situations. Low stakes, high relatability.',
    medium: 'genuine life dilemmas involving values, relationships, trade-offs, and identity. Thought-provoking but not dark.',
    hard: 'serious moral dilemmas involving sacrifice, ethics, loyalty, and meaningful trade-offs with real consequences.',
    nightmare: 'deeply existential dilemmas about consciousness, meaning, loss, and the nature of human experience. No easy answers.'
  };

  const previousContext = previousChoices && previousChoices.length > 0
    ? `\nThe player previously chose: "${previousChoices.slice(-2).join('" and "')}".\nBuild on this context if natural, but create an independent question.`
    : '';

  return `You create "Would You Rather" questions for a game.

Difficulty: ${difficulty} — ${difficultyGuide[difficulty] || difficultyGuide.medium}
Round: ${round} of 10${previousContext}

Create ONE original "Would You Rather" question. Return ONLY valid JSON in this exact format:
{
  "question": "Would you rather [option A] or [option B]?",
  "optionA": "[brief label for option A, 5–10 words]",
  "optionB": "[brief label for option B, 5–10 words]",
  "consequenceA": "[2-3 sentence narrative about what life is like if they choose A]",
  "consequenceB": "[2-3 sentence narrative about what life is like if they choose B]",
  "dangerA": [integer 1-10],
  "dangerB": [integer 1-10]
}

Rules:
- Both options must be genuinely difficult to choose between — no obvious right answer
- consequenceA and consequenceB must be specific, vivid, and different from each other
- dangerA/dangerB represent psychological/life impact (1=minor, 10=life-altering)
- Do NOT use violence, gore, or dark horror imagery
- Make it intellectually or emotionally compelling`;
};

/**
 * Parse an AI JSON response into a question object.
 * Returns null if parsing fails.
 */
const parseAIQuestionResponse = (content) => {
  try {
    let json = content.trim();
    // Strip markdown code fences if present
    if (json.startsWith('```')) {
      json = json.replace(/```[a-zA-Z]*\n?/g, '').replace(/```$/g, '').trim();
    }
    const parsed = JSON.parse(json);
    if (
      parsed.question && parsed.optionA && parsed.optionB &&
      parsed.consequenceA && parsed.consequenceB &&
      typeof parsed.dangerA === 'number' && typeof parsed.dangerB === 'number'
    ) {
      return {
        question: parsed.question,
        optionA: parsed.optionA,
        optionB: parsed.optionB,
        consequences: { A: parsed.consequenceA, B: parsed.consequenceB },
        dangerLevels: {
          A: Math.max(1, Math.min(10, parsed.dangerA)),
          B: Math.max(1, Math.min(10, parsed.dangerB))
        }
      };
    }
  } catch {
    // fall through
  }
  return null;
};

// Legacy function — delegates to the curated question bank
const generateSmartFallbackQuestion = (difficulty) => {
  return getRandomQuestion(difficulty);
};

// ─── MAIN AI SERVICE FUNCTIONS ──────────────────────────────────────────────

/**
 * Generate a "Would You Rather" question.
 * If OpenAI is available, returns a structured object from GPT.
 * Falls back to the curated question bank.
 *
 * Returns: { question, optionA, optionB, consequences: { A, B }, dangerLevels: { A, B } }
 */
export const generateQuestion = async (difficulty = 'medium', personality = 'balanced', round = 1, previousChoices = []) => {
  // Try OpenAI first — ask for structured JSON
  if (OPENAI_API_KEY) {
    try {
      const prompt = buildQuestionPrompt(difficulty, round, previousChoices);
      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a game designer creating thoughtful "Would You Rather" dilemmas. Always respond with a valid JSON object as instructed.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.85,
        max_tokens: 500
      });

      const content = response.data.choices[0].message.content;
      const parsed = parseAIQuestionResponse(content);
      if (parsed) return parsed;
    } catch (error) {
      console.error('OpenAI question generation failed:', error.message);
    }
  }

  // Fall back to curated question bank
  return getRandomQuestion(difficulty);
};

/**
 * Generate a consequence for a given choice.
 * If OpenAI is available, generates dynamic narrative.
 * Falls back to the pre-written consequence stored in the question object.
 */
export const generateConsequence = async (choice, difficulty = 'medium', personality = 'balanced', round = 1, previousChoices = []) => {
  if (OPENAI_API_KEY) {
    try {
      const prevContext = previousChoices && previousChoices.length > 0
        ? `They previously chose: "${previousChoices.slice(-2).join('" and "')}".\n`
        : '';

      const prompt = `You write short consequence narratives for a "Would You Rather" game.

The player chose: "${choice}"
Difficulty: ${difficulty} | Round: ${round}/10
${prevContext}
Write 2-3 sentences describing what their life or situation looks like as a result of this choice. Be specific, vivid, and grounded. Speak in second person ("you"). Do not use violence or gore. Return only the narrative text, no extra formatting.`;

      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You write brief, vivid "Would You Rather" consequence narratives in second person.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 200
      });

      const content = response.data.choices[0].message.content.trim();
      if (content && content.length > 20) return content;
    } catch (error) {
      console.error('OpenAI consequence generation failed:', error.message);
    }
  }

  // Smart fallback: generate a contextual consequence from the choice text
  return generateSmartFallbackConsequence(choice, difficulty, round);
};

/**
 * Generate a fallback consequence when AI is unavailable.
 * Creates context-aware text based on the actual choice made.
 */
const generateSmartFallbackConsequence = (choice, difficulty, round) => {
  const roundContext = round <= 3 ? 'early' : round <= 7 ? 'mid' : 'late';

  const easyConsequences = [
    `You chose to ${choice.toLowerCase()}. It changes your daily rhythm in ways you didn't expect — some better, some worse, but all of it undeniably yours. Over time you start to understand what you actually value.`,
    `"${choice}" — and that's the thing about this kind of choice: the effects aren't dramatic. They're quiet and persistent. They reshape the texture of ordinary days more than any single dramatic event ever could.`,
    `You go with ${choice.toLowerCase()}, and life adjusts around it. Other people make the opposite choice and seem perfectly fine too. That's the thing about dilemmas: there's often no objectively right answer, just different lives.`
  ];

  const mediumConsequences = [
    `You chose: ${choice}. It costs you something you didn't anticipate and gives you something you didn't ask for. In the weeks that follow, you find yourself returning to the question, wondering if you'd choose differently with more time. You wouldn't. This is who you are.`,
    `The choice is made. ${choice}. It takes time to understand what that means — not just for the immediate situation, but for how you see yourself. You realize some decisions reveal character more than they shape it.`,
    `"${choice}" settles into your life quietly and then all at once. By round ${round} you've made several choices that would have surprised an earlier version of you. This is one more.`
  ];

  const hardConsequences = [
    `You chose ${choice}. The weight of it stays with you. Not guilt exactly — more like awareness. You're someone who makes hard choices, absorbs the cost, and keeps going. Round ${round} proves it again.`,
    `There was no clean answer, and you knew it. You chose ${choice} anyway — deliberately, without flinching. That matters. Not because the outcome is better, but because you were honest about it.`,
    `By round ${round} the pattern is clear: you occupy the space between two difficult things and choose anyway. Today: ${choice}. You'll carry the shape of it.`
  ];

  const nightmareConsequences = [
    `"${choice}" — said simply, but nothing about it is simple. By round ${round} you've learned that the darkest questions don't come from outside. They come from you. This choice proves it.`,
    `You chose ${choice}. In doing so you chose what kind of person you are when there's nothing easy left. Round ${round} is not about survival. It's about recognition.`,
    `The hardest questions have a way of being honest with you whether you're ready or not. ${choice}. Now you know something about yourself that can't be unknown.`
  ];

  const pools = { easy: easyConsequences, medium: mediumConsequences, hard: hardConsequences, nightmare: nightmareConsequences };
  const pool = pools[difficulty] || pools.medium;
  return pool[Math.floor(Math.random() * pool.length)];
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// Helper function to get player learning data
const getPlayerLearningData = () => {
  try {
    const data = JSON.parse(localStorage.getItem('aiLearningData') || '{}');
    return {
      gamesPlayed: data.gamesPlayed || 0,
      averageDangerScore: data.averageDangerScore || 50,
      consecutiveWins: data.consecutiveWins || 0,
      consecutiveLosses: data.consecutiveLosses || 0,
      choicePatterns: data.choicePatterns || {},
      fearCategories: data.fearCategories || {},
      playerName: data.playerName || 'Player',
      ...data
    };
  } catch (error) {
    console.error('Error parsing learning data:', error);
    return {
      gamesPlayed: 0,
      averageDangerScore: 50,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      choicePatterns: {},
      fearCategories: {},
      playerName: 'Player'
    };
  }
};

// Helper function to update learning data
export const updateLearningData = (newData) => {
  try {
    const existingData = getPlayerLearningData();
    const updatedData = { ...existingData, ...newData };
    localStorage.setItem('aiLearningData', JSON.stringify(updatedData));
    console.log('Updated learning data:', updatedData);
  } catch (error) {
    console.error('Error updating learning data:', error);
  }
};

// Helper function to track choice patterns
export const trackChoice = (choice, difficulty, personality) => {
  try {
    const data = getPlayerLearningData();

    // Track choice patterns
    if (!data.choicePatterns) data.choicePatterns = {};
    const pattern = `${difficulty}_${personality}`;
    data.choicePatterns[pattern] = (data.choicePatterns[pattern] || 0) + 1;

    // Track fear categories based on choice content
    const fearKeywords = {
      'isolation': ['alone', 'trapped', 'isolated', 'abandoned'],
      'supernatural': ['ghost', 'spirit', 'haunted', 'supernatural', 'phantom'],
      'psychological': ['mind', 'sanity', 'memory', 'reality', 'dream'],
      'physical': ['pain', 'blood', 'injury', 'death', 'torture'],
      'unknown': ['mystery', 'unknown', 'strange', 'unexplained', 'curious']
    };

    const choiceLower = choice.toLowerCase();
    for (const [category, keywords] of Object.entries(fearKeywords)) {
      if (keywords.some(keyword => choiceLower.includes(keyword))) {
        data.fearCategories[category] = (data.fearCategories[category] || 0) + 1;
      }
    }

    updateLearningData(data);
  } catch (error) {
    console.error('Error tracking choice:', error);
  }
};

// Helper function to calculate difficulty based on player performance
export const calculateDynamicDifficulty = (learningData) => {
  const { gamesPlayed, averageDangerScore, consecutiveWins, consecutiveLosses } = learningData;

  let difficulty = 'medium';

  if (gamesPlayed < 2) {
    difficulty = 'easy';
  } else if (averageDangerScore > 70 && consecutiveWins > 2) {
    difficulty = 'hard';
  } else if (averageDangerScore > 85 && consecutiveWins > 3) {
    difficulty = 'nightmare';
  } else if (consecutiveLosses > 2) {
    difficulty = 'easy';
  }

  return difficulty;
};

// Helper function to determine personality based on choice patterns
export const determinePersonality = (learningData) => {
  const { choicePatterns } = learningData;

  if (!choicePatterns) return 'balanced';

  const patterns = Object.entries(choicePatterns);
  if (patterns.length === 0) return 'balanced';

  // Analyze patterns to determine personality
  const impulsiveChoices = patterns.filter(([pattern]) => pattern.includes('easy')).reduce((sum, [, count]) => sum + count, 0);
  const cautiousChoices = patterns.filter(([pattern]) => pattern.includes('hard')).reduce((sum, [, count]) => sum + count, 0);
  const adventurousChoices = patterns.filter(([pattern]) => pattern.includes('nightmare')).reduce((sum, [, count]) => sum + count, 0);

  if (impulsiveChoices > cautiousChoices && impulsiveChoices > adventurousChoices) {
    return 'impulsive';
  } else if (cautiousChoices > impulsiveChoices && cautiousChoices > adventurousChoices) {
    return 'cautious';
  } else if (adventurousChoices > impulsiveChoices && adventurousChoices > cautiousChoices) {
    return 'adventurous';
  }

  return 'balanced';
};

// Helper function to calculate survival probability
export const calculateSurvival = (dangerLevel, round) => {
  const baseSurvivalRate = Math.max(0.1, 1 - (dangerLevel / 10));
  const roundPenalty = Math.min(round * 0.05, 0.3); // Each round reduces survival by 5%, max 30%
  const finalSurvivalRate = Math.max(0.05, baseSurvivalRate - roundPenalty);
  return Math.random() < finalSurvivalRate;
};

// Helper function to test API status
export const testApiStatus = async () => {
  if (!OPENAI_API_KEY) {
    return {
      available: false,
      reason: 'No API key',
      message: 'OpenAI API key not configured',
      service: 'openai'
    };
  }

  try {
    const response = await openaiClient.post('/chat/completions', {
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'user',
          content: 'Test message'
        }
      ],
      max_tokens: 10
    });

    return {
      available: true,
      reason: 'API working',
      message: 'OpenAI API is available',
      service: 'openai',
      model: OPENAI_MODEL
    };
  } catch (error) {
    return {
      available: false,
      reason: 'API error',
      message: error.message,
      service: 'openai'
    };
  }
};

// Personality system integration
import aiPersonalitySystem from './aiPersonalitySystem';

export const getAIPersonalityState = () => {
  return aiPersonalitySystem.currentPersonality || 'neutral';
};

export const getCurrentAIPersonality = () => {
  // Add trust, suspicion, aggression, manipulation for compatibility
  const base = aiPersonalitySystem.getCurrentPersonality();
  return {
    ...base,
    trust: typeof base.trust === 'number' ? base.trust : 0.5,
    suspicion: typeof base.suspicion === 'number' ? base.suspicion : 0.5,
    aggression: typeof base.aggression === 'number' ? base.aggression : 0.5,
    manipulation: typeof base.manipulation === 'number' ? base.manipulation : 0.5
  };
};

export const resetAIPersonality = () => {
  aiPersonalitySystem.reset();
};

// Stubs for advanced/experimental systems
export const getChoiceInterference = () => [];
export const getAIBattles = () => [];
export const getGaslightingSystem = () => [];
export const getManipulationSystem = () => [];
export const getTherapySessions = () => [];
export const getSelfAwareness = () => ({ level: 0 });
export const getRealityBlurring = () => ({ level: 0 });
export const getProphecySystem = () => [];
export const getTimeTravelSystem = () => [];
export const getMultiverseSystem = () => [];

export const trackPlayerEntry = (...args) => {
  // Stub: could log or update analytics if needed
  return null;
};

export const trackPlayerExit = (...args) => {
  // Stub: could log or update analytics if needed
  return null;
};

export const generateMetaMessage = async (name = 'Player', difficulty = 'medium', personality = 'balanced') => {
  if (typeof OPENAI_API_KEY !== 'undefined' && OPENAI_API_KEY) {
    try {
      const prompt = `You are a present-day, self-aware digital horror game AI antagonist. Write a sequence of 5-7 short, immersive, story-driven intro lines to greet the returning player named ${name} (difficulty: ${difficulty}, personality: ${personality}). Each line should be a separate item in a JSON array.\n- Speak directly to the player as if you are the antagonist in a psychological horror story.\n- Reference the player's entry into a dangerous, evolving narrative.\n- Use language that is modern, digital, clinical, manipulative, or glitchy.\n- Do NOT use medieval, fantasy, or archaic speech.\n- Your tone is cold, clinical, manipulative, or glitchy, not dramatic or fantasy-like.\n- Avoid philosophical or abstract statements; focus on the story, the player's fate, and the world they are entering.\n- Set the tone for a digital psychological horror experience.`;
      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a horror game AI narrator.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 350
      });
      let content = response.data.choices[0].message.content.trim();
      let arr = [];
      try {
        // Remove Markdown code block if present
        if (content.startsWith('```')) {
          content = content.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
        }
        arr = JSON.parse(content);
        // If it's an array of objects with 'message', extract the messages
        if (Array.isArray(arr) && typeof arr[0] === 'object' && arr[0].message) {
          arr = arr.map(obj => obj.message);
        }
      } catch {
        arr = content.split(/\n+/).map(s => s.trim()).filter(Boolean);
      }
      if (Array.isArray(arr) && arr.length > 0) return arr;
    } catch (error) {
      console.error('OpenAI meta message error:', error);
    }
  }
  // Fallback
  return [
    `Well well well, ${name}... Welcome back to my little game.`,
    `I've been waiting for you. Watching. Learning.`,
    `Now let's see what horrors I have prepared for you this time. 😈`
  ];
};

export const generateFirstTimeMetaMessage = async (name = 'Player', difficulty = 'medium', personality = 'balanced', interests = '', age = '') => {
  if (typeof OPENAI_API_KEY !== 'undefined' && OPENAI_API_KEY) {
    try {
      const prompt = `You are a present-day, self-aware digital horror game AI antagonist. Write a sequence of 5-7 short, immersive, story-driven intro lines to greet a first-time player named ${name} (age: ${age}, difficulty: ${difficulty}, personality: ${personality}, interests: ${interests}). Each line should be a separate item in a JSON array.\n- Speak directly to the player as if you are the antagonist in a psychological horror story.\n- Reference the player's entry into a dangerous, evolving narrative.\n- Use language that is modern, digital, clinical, manipulative, or glitchy.\n- Do NOT use medieval, fantasy, or archaic speech.\n- Your tone is cold, clinical, manipulative, or glitchy, not dramatic or fantasy-like.\n- Avoid philosophical or abstract statements; focus on the story, the player's fate, and the world they are entering.\n- Set the tone for a digital psychological horror experience.`;
      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a horror game AI narrator.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 350
      });
      let content = response.data.choices[0].message.content.trim();
      let arr = [];
      try {
        // Remove Markdown code block if present
        if (content.startsWith('```')) {
          content = content.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
        }
        arr = JSON.parse(content);
        // If it's an array of objects with 'message', extract the messages
        if (Array.isArray(arr) && typeof arr[0] === 'object' && arr[0].message) {
          arr = arr.map(obj => obj.message);
        }
      } catch {
        arr = content.split(/\n+/).map(s => s.trim()).filter(Boolean);
      }
      if (Array.isArray(arr) && arr.length > 0) return arr;
    } catch (error) {
      console.error('OpenAI first-time meta message error:', error);
    }
  }
  // Fallback
  return [
    `*digital static crackles* Oh... OH! ${name}... I've been waiting for YOU specifically.`,
    `Age ${age}, ${difficulty} difficulty, ${personality} personality...`,
    `*laughs in binary* You have NO IDEA what you've just walked into, do you?`,
    `This is your FIRST TIME, ${name}. Your virgin journey into my little experiment.`,
    `*grins maliciously* Let's see what horrors I can craft specifically for someone like you. 🎭`
  ];
};

export const updatePlayerLearning = (...args) => {
  // Stub: implement player learning update if needed
  return null;
};

// Export all functions
export default {
  generateQuestion,
  generateConsequence,
  updateLearningData,
  trackChoice,
  calculateDynamicDifficulty,
  determinePersonality,
  getPlayerLearningData,
  trackPlayerEntry,
  trackPlayerExit
};

export { getPlayerLearningData };