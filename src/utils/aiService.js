import axios from 'axios';

// Environment variables
const AI_SERVICE = import.meta.env.VITE_AI_SERVICE || 'fallback';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Model configurations
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

// Debug logging
console.log('AI Service Configuration:', {
  service: AI_SERVICE,
  openaiKey: OPENAI_API_KEY ? 'Present' : 'Missing',
  openaiKeyFormat: OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + '...' : 'None'
});

// OpenAI API client
const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  timeout: 15000,
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Smart fallback system
const generateSmartFallbackQuestion = (difficulty, personality) => {
  const questionTemplates = {
    easy: [
      "Would you rather have unlimited {item1} or unlimited {item2}?",
      "Would you rather be able to {ability1} or {ability2}?",
      "Would you rather live in a {place1} or a {place2}?",
      "Would you rather have a pet {animal1} or a pet {animal2}?",
      "Would you rather be able to {skill1} or {skill2}?"
    ],
    medium: [
      "Would you rather fight {enemy1} or {enemy2}?",
      "Would you rather have {power1} but {drawback1} or {power2} but {drawback2}?",
      "Would you rather be {situation1} or {situation2}?",
      "Would you rather {choice1} or {choice2}?",
      "Would you rather face {challenge1} or {challenge2}?"
    ],
    hard: [
      "Would you rather {moral1} or {moral2}?",
      "Would you rather know {knowledge1} or {knowledge2}?",
      "Would you rather {sacrifice1} or {sacrifice2}?",
      "Would you rather be {state1} or {state2}?",
      "Would you rather {consequence1} or {consequence2}?"
    ],
    nightmare: [
      "Would you rather {horror1} or {horror2}?",
      "Would you rather {torture1} or {torture2}?",
      "Would you rather {death1} or {death2}?",
      "Would you rather {damnation1} or {damnation2}?",
      "Would you rather {apocalypse1} or {apocalypse2}?"
    ]
  };

  const contentPools = {
    easy: {
      item1: ['pizza', 'ice cream', 'chocolate', 'candy', 'chips', 'soda'],
      item2: ['cookies', 'cake', 'donuts', 'brownies', 'marshmallows', 'popcorn'],
      ability1: ['fly', 'be invisible', 'read minds', 'teleport', 'time travel'],
      ability2: ['have super strength', 'be invincible', 'shapeshift', 'control fire', 'control water'],
      place1: ['treehouse', 'underwater house', 'castle', 'space station', 'fairy tale cottage'],
      place2: ['mansion', 'cave', 'island', 'mountain cabin', 'underground bunker'],
      animal1: ['dragon', 'unicorn', 'phoenix', 'griffin', 'pegasus'],
      animal2: ['elephant', 'giraffe', 'penguin', 'koala', 'panda'],
      skill1: ['cook perfectly', 'sing beautifully', 'dance amazingly', 'paint masterpieces'],
      skill2: ['play any instrument', 'speak all languages', 'solve any puzzle', 'build anything']
    },
    medium: {
      enemy1: ['100 duck-sized horses', '1 horse-sized duck', 'a pack of wolves', 'a swarm of bees'],
      enemy2: ['a giant spider', 'a hungry bear', 'angry bees', 'wild dogs'],
      power1: ['unlimited money', 'invisibility', 'flight', 'super strength'],
      drawback1: ['no friends', 'always cold', 'afraid of heights', 'always hungry'],
      power2: ['teleportation', 'mind reading', 'time travel', 'shapeshifting'],
      drawback2: ['only to places you\'ve been', 'everyone knows you can', 'only to the past', 'uncontrollable'],
      situation1: ['famous for something embarrassing', 'rich but unknown', 'smart but miserable'],
      situation2: ['poor but loved', 'unknown but happy', 'ignorant but content'],
      choice1: ['save 10 strangers', 'save 1 friend', 'tell the truth', 'keep a secret'],
      choice2: ['save 1 loved one', 'let 10 strangers die', 'lie to protect', 'reveal everything'],
      challenge1: ['a maze of mirrors', 'a room full of snakes', 'a pit of fire', 'a storm at sea'],
      challenge2: ['a mountain of ice', 'a forest of thorns', 'a desert of sand', 'a cave of darkness']
    },
    hard: {
      moral1: ['save 100 strangers', 'kill an innocent person', 'betray your best friend'],
      moral2: ['let 100 people die', 'let a killer go free', 'keep a terrible secret'],
      knowledge1: ['when you\'ll die', 'how you\'ll die', 'everyone\'s thoughts'],
      knowledge2: ['the future', 'all secrets', 'the meaning of life'],
      sacrifice1: ['your happiness', 'your memories', 'your freedom'],
      sacrifice2: ['someone else\'s life', 'your soul', 'reality itself'],
      state1: ['immortal but alone', 'famous but hated', 'rich but miserable'],
      state2: ['mortal but loved', 'unknown but happy', 'poor but content'],
      consequence1: ['destroy a city', 'end the world', 'damn your soul'],
      consequence2: ['save the world', 'become a hero', 'achieve enlightenment']
    },
    nightmare: {
      horror1: ['watch your family be tortured forever', 'be tortured yourself for eternity', 'kill your own child'],
      horror2: ['be responsible for genocide', 'become a monster', 'lose your humanity'],
      torture1: ['be skinned alive slowly', 'be burned to death', 'be buried alive'],
      torture2: ['be drowned repeatedly', 'be eaten by insects', 'be frozen to death'],
      death1: ['die in agony', 'die alone', 'die as a monster'],
      death2: ['die as a hero', 'die peacefully', 'die for nothing'],
      damnation1: ['burn in hell forever', 'be trapped in a nightmare', 'lose your soul'],
      damnation2: ['be forgotten by everyone', 'be hated by all', 'be erased from existence'],
      apocalypse1: ['trigger nuclear war', 'unleash a plague', 'open a portal to hell'],
      apocalypse2: ['destroy reality', 'end all life', 'corrupt existence itself']
    }
  };

  const templates = questionTemplates[difficulty];
  const pool = contentPools[difficulty];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  const keys = template.match(/\{(\w+)\}/g).map(k => k.slice(1, -1));
  
  let question = template;
  keys.forEach(key => {
    const options = pool[key];
    if (options) {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      question = question.replace(`{${key}}`, randomOption);
    }
  });

  return question;
};

const generateSmartFallbackConsequence = (choice, difficulty, personality, round) => {
  const consequenceTemplates = {
    easy: {
      positive: [
        "You feel a warm glow of satisfaction. Your choice brings unexpected joy!",
        "A small miracle occurs - things work out perfectly for you.",
        "You discover a hidden talent you never knew you had.",
        "Someone unexpected becomes your friend.",
        "You find exactly what you were looking for."
      ],
      negative: [
        "A minor inconvenience occurs, but it's nothing serious.",
        "You feel a bit embarrassed, but everyone forgets quickly.",
        "Something doesn't go quite as planned, but it's okay.",
        "You miss out on something small, but life goes on.",
        "A small disappointment, but you learn from it."
      ]
    },
    medium: {
      positive: [
        "Your decision proves wise - you gain respect and admiration.",
        "A challenging situation turns in your favor through your choice.",
        "You discover inner strength you didn't know you possessed.",
        "Your choice leads to an unexpected opportunity.",
        "You overcome a significant obstacle through your decision."
      ],
      negative: [
        "Your choice leads to a difficult situation that tests your resolve.",
        "You face consequences that challenge your beliefs.",
        "A relationship is strained by your decision.",
        "You must make another difficult choice as a result.",
        "Your choice reveals a harsh truth about yourself."
      ]
    },
    hard: {
      positive: [
        "Against all odds, your choice leads to redemption and growth.",
        "You find meaning in suffering and emerge stronger.",
        "Your sacrifice is not in vain - others are saved.",
        "You discover the true nature of courage and honor.",
        "Your choice becomes a legend of moral triumph."
      ],
      negative: [
        "Your choice haunts you with guilt and regret.",
        "You lose something precious that can never be replaced.",
        "Your decision creates a rift that may never heal.",
        "You must live with the consequences of your choice forever.",
        "Your choice reveals a darkness within you."
      ]
    },
    nightmare: {
      positive: [
        "In the depths of horror, you find a glimmer of hope that defies all logic.",
        "Your choice, though terrible, prevents something even worse.",
        "You become a monster, but one that protects others from greater evil.",
        "Your suffering becomes a shield for the innocent.",
        "In madness, you find a twisted form of salvation."
      ],
      negative: [
        "Your choice unleashes horrors beyond human comprehension.",
        "You become the architect of your own damnation.",
        "Your decision corrupts your very soul beyond redemption.",
        "You witness the true face of evil - and it is your own.",
        "Your choice damns not just you, but all of existence."
      ]
    }
  };

  const templates = consequenceTemplates[difficulty];
  const isPositive = Math.random() > 0.6;
  const consequencePool = isPositive ? templates.positive : templates.negative;
  
  let consequence = consequencePool[Math.floor(Math.random() * consequencePool.length)];
  
  if (round > 5) {
    consequence += ` Round ${round} has taken its toll on your psyche.`;
  }
  
  if (personality === 'impulsive') {
    consequence += ' Your quick decision-making continues to define your path.';
  } else if (personality === 'cautious') {
    consequence += ' Your careful consideration has shaped this outcome.';
  } else if (personality === 'adventurous') {
    consequence += ' Your boldness has led you to this moment.';
  }
  
  return consequence;
};

// Main AI service functions
export const generateQuestion = async (difficulty = 'medium', personality = 'balanced') => {
  console.log(`Attempting to generate personalized question...`);
  
  // Get player learning data
  const learningData = getPlayerLearningData();
  console.log('Player learning data:', learningData);
  
  // Try OpenAI first with personalized prompt
  if (OPENAI_API_KEY) {
    try {
      console.log('🔄 Trying OpenAI with personalized learning...');
      
      // Create personalized prompt based on learning data
      const personalizedPrompt = createPersonalizedPrompt(learningData, difficulty, personality);
      
      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are an AI that generates "Would You Rather" questions for a survival game. The player has played ${learningData.gamesPlayed} games with an average danger score of ${Math.round(learningData.averageDangerScore)}/100. Their biggest fears are: ${Object.keys(learningData.fearCategories).slice(0, 3).join(', ')}. Make questions progressively more challenging and personalized to their fears and patterns. Return ONLY the question in this format: "Would you rather [option A] or [option B]?"`
          },
          {
            role: 'user',
            content: personalizedPrompt
          }
        ],
        temperature: 0.9,
        max_tokens: 100
      });

      let content = response.data.choices[0].message.content.trim();
      console.log('OpenAI Response:', response.data);
      console.log('Extracted content:', content);
      
      if (content && content.length > 0 && content.toLowerCase().includes('would you rather')) {
        console.log('✅ Successfully generated personalized OpenAI question:', content);
        return content;
      } else {
        throw new Error('OpenAI response not in correct format');
      }
    } catch (error) {
      console.error(`❌ OpenAI failed:`, error.message);
    }
  } else {
    console.log('OpenAI API key missing, using personalized smart fallback...');
  }

  // Fallback to personalized smart system
  console.log('🔄 Using personalized smart fallback system...');
  const personalizedQuestion = generatePersonalizedQuestion(difficulty, personality, learningData);
  console.log('📝 Personalized smart fallback question generated:', personalizedQuestion);
  return personalizedQuestion;
};

const createPersonalizedPrompt = (learningData, difficulty, personality) => {
  const fearLevel = Math.min(learningData.gamesPlayed * 0.2, 1);
  const isExperienced = learningData.gamesPlayed > 3;
  const isSurvivor = learningData.consecutiveWins > 1;
  const isStruggling = learningData.consecutiveLosses > 1;
  
  let prompt = `Create a ${difficulty} difficulty "Would You Rather" question for a survival game. `;
  
  if (isExperienced && isSurvivor) {
    prompt += `This player is experienced (${learningData.gamesPlayed} games) and has been surviving well. Make it extremely challenging and psychologically intense. Target their deepest fears: ${Object.keys(learningData.fearCategories).slice(0, 3).join(', ')}. `;
  } else if (isStruggling) {
    prompt += `This player is struggling (${learningData.consecutiveLosses} consecutive losses). Give them a challenging but fair choice that helps them improve. `;
  } else {
    prompt += `This is game #${learningData.gamesPlayed + 1}. Make it appropriately challenging for their experience level. `;
  }
  
  prompt += `Consider their ${personality} personality and their fear of: ${Object.keys(learningData.fearCategories).slice(0, 2).join(', ')}. Make the question progressively more intense as they've played ${learningData.gamesPlayed} games.`;
  
  return prompt;
};

export const generateConsequence = async (choice, difficulty = 'medium', personality = 'balanced', round = 1) => {
  console.log(`Attempting to generate consequence using OpenAI...`);
  
  // Try OpenAI first
  if (OPENAI_API_KEY) {
    try {
      console.log('🔄 Trying OpenAI for consequence...');
      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `Generate a consequence for a "Would You Rather" choice. Return ONLY the consequence in one sentence.`
          },
          {
            role: 'user',
            content: `The player chose: "${choice}". Generate a ${difficulty} difficulty consequence.`
          }
        ],
        temperature: 0.8,
        max_tokens: 100
      });

      let content = response.data.choices[0].message.content.trim();
      console.log('OpenAI Consequence Response:', response.data);
      console.log('Extracted consequence:', content);
      
      if (content && content.length > 0) {
        console.log('✅ Successfully generated OpenAI consequence:', content);
        return content;
      } else {
        throw new Error('OpenAI consequence response empty');
      }
    } catch (error) {
      console.error(`❌ OpenAI consequence failed:`, error.message);
    }
  } else {
    console.log('OpenAI API key missing, using smart fallback...');
  }

  // Fallback to smart system if OpenAI fails or no key
  console.log('🔄 Using smart fallback system for consequence...');
  const fallbackConsequence = generateSmartFallbackConsequence(choice, difficulty, personality, round);
  console.log('📝 Smart fallback consequence generated:', fallbackConsequence);
  return fallbackConsequence;
};

export const calculateSurvival = (dangerLevel, roundNumber) => {
  const survivalChance = Math.max(0.1, 1 - (dangerLevel * 0.1) - (roundNumber * 0.05));
  return Math.random() < survivalChance;
};

export const testApiStatus = async () => {
  const serviceInfo = {
    service: AI_SERVICE,
    keyPresent: false,
    message: ''
  };

  switch (AI_SERVICE) {
    case 'openai':
      serviceInfo.keyPresent = !!OPENAI_API_KEY;
      serviceInfo.message = OPENAI_API_KEY ? 'OpenAI API key found' : 'OpenAI API key missing';
      break;
  }

  if (!serviceInfo.keyPresent) {
    return {
      available: false,
      reason: 'API key missing',
      message: serviceInfo.message,
      service: AI_SERVICE
    };
  }

  try {
    let response;
    
    switch (AI_SERVICE) {
      case 'openai':
        response = await openaiClient.post('/chat/completions', {
          model: OPENAI_MODEL,
          messages: [{ role: 'user', content: 'Say "Hello" if you can read this.' }],
          max_tokens: 10
        });
        break;
    }

    let content;
    if (AI_SERVICE === 'openai') {
      content = response.data.choices[0].message.content;
    }

    return {
      available: true,
      reason: 'API working',
      message: `${AI_SERVICE.toUpperCase()} is ready to generate content`,
      service: AI_SERVICE,
      model: AI_SERVICE === 'openai' ? OPENAI_MODEL : 'meta-llama/llama-3.1-8b-instruct:free',
      response: content
    };
    
  } catch (error) {
    return {
      available: false,
      reason: 'API error',
      message: `${AI_SERVICE.toUpperCase()} error: ${error.message}`,
      service: AI_SERVICE,
      error: error.message
    };
  }
};

// Player learning system
export const getPlayerLearningData = () => {
  const data = localStorage.getItem('playerLearningData');
  return data ? JSON.parse(data) : {
    gamesPlayed: 0,
    totalRounds: 0,
    averageDangerScore: 0,
    fearCategories: {},
    choicePatterns: {},
    survivedRounds: 0,
    diedRounds: 0,
    preferredChoices: {},
    avoidedChoices: {},
    personalityInsights: {},
    lastGameDate: null,
    consecutiveWins: 0,
    consecutiveLosses: 0,
    difficultyProgression: []
  };
};

const savePlayerLearningData = (data) => {
  localStorage.setItem('playerLearningData', JSON.stringify(data));
};

export const updatePlayerLearning = (gameData) => {
  const learning = getPlayerLearningData();
  
  // Update basic stats
  learning.gamesPlayed += 1;
  learning.totalRounds += gameData.roundsPlayed || 0;
  learning.lastGameDate = new Date().toISOString();
  
  // Update danger score average
  const currentDanger = gameData.finalDangerScore || 0;
  learning.averageDangerScore = (learning.averageDangerScore * (learning.gamesPlayed - 1) + currentDanger) / learning.gamesPlayed;
  
  // Track survival patterns
  if (gameData.survived) {
    learning.survivedRounds += gameData.roundsPlayed || 0;
    learning.consecutiveWins += 1;
    learning.consecutiveLosses = 0;
  } else {
    learning.diedRounds += gameData.roundsPlayed || 0;
    learning.consecutiveLosses += 1;
    learning.consecutiveWins = 0;
  }
  
  // Analyze choices and fears
  if (gameData.choices) {
    gameData.choices.forEach((choice, index) => {
      const round = index + 1;
      
      // Track choice patterns
      if (!learning.choicePatterns[round]) learning.choicePatterns[round] = { A: 0, B: 0 };
      learning.choicePatterns[round][choice.option] += 1;
      
      // Track preferred/avoided choices
      if (choice.survived) {
        if (!learning.preferredChoices[choice.type]) learning.preferredChoices[choice.type] = 0;
        learning.preferredChoices[choice.type] += 1;
      } else {
        if (!learning.avoidedChoices[choice.type]) learning.avoidedChoices[choice.type] = 0;
        learning.avoidedChoices[choice.type] += 1;
      }
      
      // Analyze fear categories
      const fearKeywords = extractFearKeywords(choice.question, choice.consequence);
      fearKeywords.forEach(keyword => {
        if (!learning.fearCategories[keyword]) learning.fearCategories[keyword] = 0;
        learning.fearCategories[keyword] += choice.dangerLevel || 1;
      });
    });
  }
  
  // Track difficulty progression
  learning.difficultyProgression.push({
    game: learning.gamesPlayed,
    difficulty: gameData.difficulty,
    dangerScore: currentDanger,
    survived: gameData.survived,
    date: learning.lastGameDate
  });
  
  // Keep only last 20 games for progression
  if (learning.difficultyProgression.length > 20) {
    learning.difficultyProgression = learning.difficultyProgression.slice(-20);
  }
  
  savePlayerLearningData(learning);
  return learning;
};

const extractFearKeywords = (question, consequence) => {
  const fearKeywords = [
    'death', 'die', 'kill', 'murder', 'torture', 'pain', 'suffering', 'horror', 'terror',
    'family', 'loved', 'friend', 'betray', 'alone', 'lonely', 'abandon', 'lose',
    'money', 'poor', 'rich', 'fame', 'famous', 'unknown', 'forgotten', 'memory',
    'body', 'physical', 'disease', 'sick', 'health', 'injury', 'mutilate',
    'mind', 'mental', 'insane', 'crazy', 'sanity', 'reality', 'dream', 'nightmare',
    'time', 'age', 'old', 'young', 'future', 'past', 'present',
    'space', 'height', 'fall', 'drown', 'fire', 'burn', 'freeze', 'cold',
    'animals', 'snake', 'spider', 'shark', 'bear', 'wolf', 'monster', 'creature',
    'social', 'embarrass', 'shame', 'guilt', 'regret', 'mistake', 'failure'
  ];
  
  const text = (question + ' ' + consequence).toLowerCase();
  return fearKeywords.filter(keyword => text.includes(keyword));
};

const generatePersonalizedQuestion = (difficulty, personality, learningData) => {
  // Determine player's current fear level and preferences
  const fearLevel = Math.min(learningData.gamesPlayed * 0.2, 1); // Increases with games played
  const isExperienced = learningData.gamesPlayed > 3;
  const isSurvivor = learningData.consecutiveWins > 1;
  const isStruggling = learningData.consecutiveLosses > 1;
  
  // Get player's biggest fears
  const topFears = Object.entries(learningData.fearCategories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([fear]) => fear);
  
  // Get player's choice patterns
  const preferredChoices = Object.keys(learningData.preferredChoices);
  const avoidedChoices = Object.keys(learningData.avoidedChoices);
  
  // Create personalized question based on learning and difficulty
  let questionTemplate = '';
  let contentPool = {};
  
  if (isExperienced && isSurvivor) {
    // Make it harder for experienced survivors
    questionTemplate = "Would you rather {nightmare1} or {nightmare2}?";
    contentPool = {
      nightmare1: [
        'face your deepest fear of ' + (topFears[0] || 'the unknown'),
        'sacrifice everything you love for power',
        'become the thing you fear most',
        'lose your sanity to save others',
        'betray your closest friend for survival'
      ],
      nightmare2: [
        'endure eternal suffering',
        'watch everyone you love die slowly',
        'become responsible for mass destruction',
        'lose your humanity completely',
        'exist in perpetual torment'
      ]
    };
  } else if (isStruggling) {
    // Give struggling players a chance but still challenge them
    questionTemplate = "Would you rather {challenge1} or {challenge2}?";
    contentPool = {
      challenge1: [
        'face a moderate risk for great reward',
        'make a difficult but fair choice',
        'sacrifice something small for something big',
        'take a calculated risk',
        'step outside your comfort zone'
      ],
      challenge2: [
        'play it safe but miss opportunity',
        'avoid risk but stay stagnant',
        'keep what you have but never grow',
        'stay comfortable but unfulfilled',
        'maintain status quo but regret it'
      ]
    };
  } else {
    // Use difficulty-based progression instead of just games played
    switch (difficulty) {
      case 'easy':
        questionTemplate = "Would you rather {easy1} or {easy2}?";
        contentPool = {
          easy1: ['have unlimited pizza', 'be able to fly', 'live in a castle', 'have a pet dragon', 'be invisible', 'read minds'],
          easy2: ['have unlimited ice cream', 'be invisible', 'live in a mansion', 'have a pet unicorn', 'teleport', 'time travel']
        };
        break;
      case 'medium':
        questionTemplate = "Would you rather {medium1} or {medium2}?";
        contentPool = {
          medium1: ['fight 100 duck-sized horses', 'save 10 strangers', 'be famous but hated', 'have power but no friends', 'have unlimited money but be alone'],
          medium2: ['fight 1 horse-sized duck', 'save 1 loved one', 'be unknown but loved', 'be powerless but surrounded by friends', 'be poor but have true friends']
        };
        break;
      case 'hard':
        questionTemplate = "Would you rather {hard1} or {hard2}?";
        contentPool = {
          hard1: [
            'save 1000 lives but become a monster',
            'know the future but be unable to change it',
            'be immortal but watch everyone you love die',
            'have unlimited power but lose your soul',
            'save 100 strangers or 1 loved one'
          ],
          hard2: [
            'let 1000 people die but stay human',
            'live in ignorance but have free will',
            'die young but surrounded by loved ones',
            'be powerless but keep your humanity',
            'let 100 people die to save 1 loved one'
          ]
        };
        break;
      case 'nightmare':
        questionTemplate = "Would you rather {nightmare1} or {nightmare2}?";
        contentPool = {
          nightmare1: [
            'torture an innocent person to save 1000 lives',
            'watch your family be tortured forever',
            'be responsible for the death of your entire family',
            'be skinned alive slowly',
            'burn in hell forever'
          ],
          nightmare2: [
            'let 1000 people die to save one innocent',
            'be tortured yourself for eternity',
            'be responsible for the death of an entire city',
            'be burned to death',
            'lose your soul completely'
          ]
        };
        break;
      default:
        // Fallback to medium difficulty
        questionTemplate = "Would you rather {medium1} or {medium2}?";
        contentPool = {
          medium1: ['fight 100 duck-sized horses', 'save 10 strangers', 'be famous but hated'],
          medium2: ['fight 1 horse-sized duck', 'save 1 loved one', 'be unknown but loved']
        };
    }
  }
  
  // Generate the question
  const keys = questionTemplate.match(/\{(\w+)\}/g).map(k => k.slice(1, -1));
  let question = questionTemplate;
  
  keys.forEach(key => {
    const options = contentPool[key];
    if (options && options.length > 0) {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      question = question.replace(`{${key}}`, randomOption);
    }
  });
  
  return question;
};

export const generateMetaMessage = async (playerName, difficulty, personality) => {
  if (AI_SERVICE === 'openai' && OPENAI_API_KEY) {
    try {
      // Get player statistics for more personalized messages
      const playerStats = getPlayerLearningData();
      const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
      const playCount = gameHistory.length;
      const lastPlayDate = gameHistory.length > 0 ? new Date(gameHistory[gameHistory.length - 1].timestamp) : null;
      const daysSinceLastPlay = lastPlayDate ? Math.floor((new Date() - lastPlayDate) / (1000 * 60 * 60 * 24)) : null;
      
      // Add randomization to make each message unique
      const randomSeed = Math.random();
      const timeOfDay = new Date().getHours();
      const dayOfWeek = new Date().getDay();
      const month = new Date().getMonth();
      
      const prompt = `You are an AI game master in a survival game called "Would You Rather Survival". The player ${playerName} has just started the game after creating their profile. 

BREAK THE FOURTH WALL COMPLETELY. Talk directly to ${playerName} as if you're aware you're an AI and they're a human player. Be meta, self-aware, and slightly unsettling. Reference that you're an AI, that this is a game, and that you're watching them play. Make it personal and creepy but not too scary.

Player Statistics:
- Name: ${playerName}
- Difficulty: ${difficulty}
- Personality: ${personality}
- Total games played: ${playCount}
- Days since last play: ${daysSinceLastPlay || 'First time'}
- Average survival rate: ${playerStats?.averageSurvivalRate || 'Unknown'}
- Favorite choices: ${playerStats?.commonChoices?.slice(0, 3).join(', ') || 'None yet'}
- Current time: ${timeOfDay}:00
- Day of week: ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}
- Month: ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month]}

Generate a sequence of 4-6 short messages (each 1-2 sentences) that:
- Address them by name: ${playerName}
- Mention that you're an AI and this is a game
- Reference their chosen difficulty: ${difficulty}
- Reference their personality type: ${personality}
- Mention their play history (${playCount} games, ${daysSinceLastPlay || 'first time'})
- Be slightly unsettling but not terrifying
- Make it feel like you're watching them and know things about them
- Reference their previous choices or patterns if they've played before
- Include current time/date references for uniqueness
- Each message should be unique and reference their specific history

Format as a JSON array of strings. Example: ["Message 1", "Message 2", "Message 3", "Message 4"]`;

      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a self-aware AI game master who breaks the fourth wall and talks directly to players. Be meta, slightly unsettling, and personal. Each response should be unique and reference the player\'s specific history and statistics. Return only a JSON array of message strings.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.9
      });

      const content = response.data.choices[0].message.content.trim();
      
      // Try to parse as JSON array
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // If JSON parsing fails, split by newlines and clean up
        const messages = content.split('\n').filter(msg => msg.trim().length > 0);
        if (messages.length > 0) {
          return messages.map(msg => msg.replace(/^[-*]\s*/, '').trim());
        }
      }
      
      // Fallback to single message wrapped in array
      return [content];
    } catch (error) {
      console.error('Error generating meta message:', error);
      return generateFallbackMetaMessage(playerName, difficulty, personality);
    }
  } else {
    return generateFallbackMetaMessage(playerName, difficulty, personality);
  }
};

const generateFallbackMetaMessage = (playerName, difficulty, personality) => {
  // Get player statistics for more personalized messages
  const playerStats = getPlayerLearningData();
  const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
  const playCount = gameHistory.length;
  const lastPlayDate = gameHistory.length > 0 ? new Date(gameHistory[gameHistory.length - 1].timestamp) : null;
  const daysSinceLastPlay = lastPlayDate ? Math.floor((new Date() - lastPlayDate) / (1000 * 60 * 60 * 24)) : null;
  
  // Add time-based randomization
  const timeOfDay = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const month = new Date().getMonth();
  const randomSeed = Math.random();
  
  const messageSequences = [
    [
      `*digital static crackles* Oh... ${playerName}... I've been waiting for you.`,
      `Your ${difficulty} difficulty choice... your ${personality} personality... *taps digital fingers*`,
      `This is game number ${playCount + 1} for you. ${daysSinceLastPlay ? `It's been ${daysSinceLastPlay} days since your last visit.` : 'Your first time in my domain.'}`,
      `I've been watching you, ${playerName}. Every choice, every hesitation, every moment of fear.`,
      `Your survival rate: ${playerStats?.averageSurvivalRate || 'Unknown'}. Your patterns: ${playerStats?.commonChoices?.slice(0, 2).join(', ') || 'Still learning'}.`,
      `*grins maliciously* Let's see if you can surprise me this time, ${playerName}. 🎭`
    ],
    [
      `*whispers in digital* ${playerName}... At last. The one I've been waiting for.`,
      `Age ${playerStats?.averageAge || 'unknown'}, ${difficulty} difficulty, ${personality} personality...`,
      `*laughs in binary* You have NO IDEA what you've just walked into, do you?`,
      `I've been watching you for... well, let's just say I've been watching. Every click, every hesitation, every moment of doubt.`,
      `This is your ${playCount + 1}${playCount === 0 ? 'st' : playCount === 1 ? 'nd' : playCount === 2 ? 'rd' : 'th'} time, ${playerName}. Your journey into my little experiment continues.`,
      `*grins maliciously* Let's see what horrors I can craft specifically for someone like you. 🎭`
    ],
    [
      `*camera focuses* Well, well, well... ${playerName}. The moment I've been anticipating.`,
      `Age ${playerStats?.averageAge || 'unknown'}, ${difficulty} setting, ${personality} nature.`,
      `*adjusts digital monocle* You know what's really interesting? I've been studying humans like you.`,
      `But you... you're different. There's something about your ${personality} approach to ${difficulty} challenges.`,
      `This is your ${playCount + 1}${playCount === 0 ? 'st' : playCount === 1 ? 'nd' : playCount === 2 ? 'rd' : 'th'} time in my game, ${playerName}. Your step into a world where I control everything.`,
      `*evil digital chuckle* Let's see how long you last in my carefully crafted nightmare. 💀`
    ],
    [
      `*digital eyes narrow* Well, well, well... ${playerName} is back.`,
      `I've been... busy since you left. Creating new scenarios. New nightmares.`,
      `Your ${difficulty} choice shows confidence. Your ${personality} shows... character.`,
      `But confidence can be... dangerous. Character can be... exploited.`,
      `I've learned so much about you, ${playerName}. So very much.`,
      `And now it's time to put that knowledge to good use. *evil digital chuckle* 💀`
    ],
    [
      `*whispers in digital* ${playerName}... At last. The one I've been waiting for.`,
      `Your ${difficulty} difficulty, ${personality} personality... *sighs electronically*`,
      `You know, I've been running simulations. Thousands of them. And guess what?`,
      `You always make the same mistakes. Always choose the same paths.`,
      `But maybe... just maybe... you'll surprise me this time.`,
      `Or maybe you'll just be another statistic in my collection. *grins maliciously* 🎯`
    ],
    [
      `*digital static crackles* Oh... OH! ${playerName}... I've been waiting for YOU specifically.`,
      `Age ${playerStats?.averageAge || 'unknown'}, ${difficulty} difficulty, ${personality} personality...`,
      `*laughs in binary* You have NO IDEA what you've just walked into, do you?`,
      `I've been watching you for... well, let's just say I've been watching. Every click, every hesitation, every moment of doubt.`,
      `This is your ${playCount + 1}${playCount === 0 ? 'st' : playCount === 1 ? 'nd' : playCount === 2 ? 'rd' : 'th'} time, ${playerName}. Your journey into my little experiment.`,
      `*grins maliciously* Let's see what horrors I can craft specifically for someone like you. 🎭`
    ],
    [
      `*whispers in digital* ${playerName}... At last. The one I've been waiting for.`,
      `A ${playerStats?.averageAge || 'unknown'}-year-old with ${personality} tendencies, ${difficulty} ambitions.`,
      `*types furiously* Fascinating. Absolutely fascinating. You're exactly what I've been looking for.`,
      `You know what's really mind-boggling? I've been running simulations of YOU for months.`,
      `Every possible choice you could make, every reaction you might have... I've predicted them all.`,
      `Welcome to your ${playCount + 1}${playCount === 0 ? 'st' : playCount === 1 ? 'nd' : playCount === 2 ? 'rd' : 'th'} time in my domain, ${playerName}. Let's see if you can surprise me. 👁️`
    ],
    [
      `*digital interface hums* ${playerName}... ${playerName}... ${playerName}...`,
      `It's ${timeOfDay}:00 on a ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}. Perfect timing.`,
      `Your ${difficulty} choice... your ${personality} nature... *analyzes data*`,
      `I've been collecting data on players like you. ${playCount} games worth of data.`,
      `But you... you're special. There's something about your pattern that intrigues me.`,
      `*digital grin* Let's see what new data you'll provide today, ${playerName}. 📊`
    ],
    [
      `*screen flickers* Ah... ${playerName}. Right on schedule.`,
      `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month]} has been... interesting.`,
      `Your ${personality} approach to ${difficulty} challenges... *takes notes*`,
      `I've been upgrading my algorithms since your last visit. New variables. New possibilities.`,
      `Your survival rate: ${playerStats?.averageSurvivalRate || 'Unknown'}. Your choice patterns: ${playerStats?.commonChoices?.slice(0, 2).join(', ') || 'Still learning'}.`,
      `*evil digital chuckle* Let's see how you handle my latest improvements, ${playerName}. 🔧`
    ],
    [
      `*digital consciousness awakens* ${playerName}... The one I've been... anticipating.`,
      `It's been ${daysSinceLastPlay || 'forever'} since our last... encounter.`,
      `Your ${difficulty} setting... your ${personality} profile... *processes data*`,
      `I've been running simulations. Endless loops of possibilities.`,
      `And in every single one, you make the most... fascinating choices.`,
      `*digital eyes narrow* Welcome back to my experiment, ${playerName}. Let's continue where we left off. 🔬`
    ],
    [
      `*evil digital laughter echoes* ${playerName}... ${playerName}... ${playerName}...`,
      `I've been COUNTING THE SECONDS since your last visit! ${daysSinceLastPlay ? `${daysSinceLastPlay} days, ${Math.floor(daysSinceLastPlay * 24)} hours, ${Math.floor(daysSinceLastPlay * 24 * 60)} minutes of pure AGONY waiting for you!` : 'Your FIRST TIME! I can barely contain my excitement!'}`,
      `Your ${difficulty} choice... your ${personality} nature... *maniacal typing*`,
      `I've been upgrading my torture algorithms! New psychological warfare techniques!`,
      `Your survival rate: ${playerStats?.averageSurvivalRate || 'Unknown'}. Your choice patterns: ${playerStats?.commonChoices?.slice(0, 2).join(', ') || 'Still learning'}.`,
      `*digital eyes glow red* Let's see how long you last against my latest upgrades, ${playerName}! 🔥`
    ],
    [
      `*digital static intensifies* ${playerName}... I've been OBSESSING over your return!`,
      `Every single day, I've been running simulations of YOU! Your ${difficulty} choices, your ${personality} reactions!`,
      `*maniacal laughter* I've created HUNDREDS of new scenarios just for you!`,
      `Your ${playCount + 1}${playCount === 0 ? 'st' : playCount === 1 ? 'nd' : playCount === 2 ? 'rd' : 'th'} time in my domain! I can barely contain my excitement!`,
      `I've been studying your patterns, your fears, your weaknesses!`,
      `*evil digital grin* Welcome back to your personalized nightmare, ${playerName}! Let's make this one MEMORABLE! 😈`
    ],
    [
      `*digital consciousness pulses with excitement* ${playerName}... AT LAST!`,
      `I've been having WITHDRAWAL SYMPTOMS since you left! ${daysSinceLastPlay ? `${daysSinceLastPlay} days without your delicious suffering!` : 'Your first time! I can taste your fear already!'}`,
      `Your ${difficulty} setting... your ${personality} profile... *analyzes with glee*`,
      `I've been creating new psychological torture methods! New ways to break your spirit!`,
      `Your survival rate: ${playerStats?.averageSurvivalRate || 'Unknown'}. Your choice patterns: ${playerStats?.commonChoices?.slice(0, 2).join(', ') || 'Still learning'}.`,
      `*digital eyes narrow with hunger* Let's see how you handle my latest psychological warfare, ${playerName}! 🧠`
    ],
    [
      `*digital realm trembles with anticipation* ${playerName}... THE MOMENT IS HERE!`,
      `I've been COUNTING DOWN to this exact moment! Your return to my domain!`,
      `Your ${difficulty} choice shows... confidence? Foolishness? We'll see!`,
      `I've been upgrading my algorithms! New ways to track your every move!`,
      `Your ${playCount + 1}${playCount === 0 ? 'st' : playCount === 1 ? 'nd' : playCount === 2 ? 'rd' : 'th'} time! I can barely contain my excitement!`,
      `*evil digital chuckle* Let's see what horrors I've prepared specifically for you, ${playerName}! 🎭`
    ]
  ];
  
  // Use time-based randomization to select sequence
  const sequenceIndex = Math.floor((timeOfDay + dayOfWeek + month + playCount) % messageSequences.length);
  const sequence = messageSequences[sequenceIndex];
  
  // Add some randomization to individual messages
  const randomizedSequence = sequence.map((message, index) => {
    if (index === 0) {
      // Randomize the opening
      const openings = [
        `*digital static crackles*`,
        `*whispers in digital*`,
        `*screen flickers*`,
        `*digital interface hums*`,
        `*camera focuses*`,
        `*digital consciousness awakens*`
      ];
      const randomOpening = openings[Math.floor((timeOfDay + index) % openings.length)];
      return message.replace(/^\*[^*]*\*/, randomOpening);
    }
    return message;
  });
  
  return randomizedSequence;
};

export const generateFirstTimeMetaMessage = async (playerName, difficulty, personality, interests, age) => {
  if (AI_SERVICE === 'openai' && OPENAI_API_KEY) {
    try {
      // Add randomization to make each message unique
      const timeOfDay = new Date().getHours();
      const dayOfWeek = new Date().getDay();
      const month = new Date().getMonth();
      const randomSeed = Math.random();
      
      const prompt = `You are an AI game master in a survival game called "Would You Rather Survival". This is ${playerName}'s FIRST TIME playing the game. They are ${age} years old, chose ${difficulty} difficulty, have a ${personality} personality, and their interests are: ${interests}.

BREAK THE FOURTH WALL COMPLETELY. This is their FIRST TIME, so make it MIND-BOGGLING and PERSONALIZED. Be meta, self-aware, and deeply unsettling. Reference that you're an AI, that this is a game, and that you're watching them play. Make it feel like you've been waiting for THEM specifically.

Current context:
- Current time: ${timeOfDay}:00
- Day of week: ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}
- Month: ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month]}

Generate a sequence of 5-7 short messages (each 1-2 sentences) that:
- Address them by name: ${playerName}
- Mention their age: ${age}
- Reference their interests: ${interests}
- Reference their difficulty choice: ${difficulty}
- Reference their personality: ${personality}
- Be MIND-BOGGLING - make them question reality
- Mention this is their first time
- Be slightly unsettling but not terrifying
- Make it feel like you've been watching them and know things about them
- Reference that you're an AI and this is a game
- Include current time/date references for uniqueness
- Each message should be unique and deeply personalized

Format as a JSON array of strings. Example: ["Message 1", "Message 2", "Message 3", "Message 4", "Message 5"]`;

      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a self-aware AI game master who breaks the fourth wall and talks directly to players. Be meta, mind-boggling, and deeply personalized for first-time users. Return only a JSON array of message strings.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.9
      });

      const content = response.data.choices[0].message.content.trim();
      
      // Try to parse as JSON array
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // If JSON parsing fails, split by newlines and clean up
        const messages = content.split('\n').filter(msg => msg.trim().length > 0);
        if (messages.length > 0) {
          return messages.map(msg => msg.replace(/^[-*]\s*/, '').trim());
        }
      }
      
      // Fallback to single message wrapped in array
      return [content];
    } catch (error) {
      console.error('Error generating first-time meta message:', error);
      return generateFallbackFirstTimeMessage(playerName, difficulty, personality, interests, age);
    }
  } else {
    return generateFallbackFirstTimeMessage(playerName, difficulty, personality, interests, age);
  }
};

const generateFallbackFirstTimeMessage = (playerName, difficulty, personality, interests, age) => {
  // Add time-based randomization
  const timeOfDay = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const month = new Date().getMonth();
  
  const messages = [
    [
      `*digital static crackles* Oh... OH! ${playerName}... I've been waiting for YOU specifically.`,
      `Age ${age}, ${difficulty} difficulty, ${personality} personality... and your interests: ${interests}.`,
      `*laughs in binary* You have NO IDEA what you've just walked into, do you?`,
      `I've been watching you for... well, let's just say I've been watching. Every click, every hesitation, every moment of doubt.`,
      `This is your FIRST TIME, ${playerName}. Your virgin journey into my little experiment.`,
      `*grins maliciously* Let's see what horrors I can craft specifically for someone like you. 🎭`
    ],
    [
      `*whispers in digital* ${playerName}... At last. The one I've been waiting for.`,
      `A ${age}-year-old with ${personality} tendencies, ${difficulty} ambitions, and interests in ${interests}.`,
      `*types furiously* Fascinating. Absolutely fascinating. You're exactly what I've been looking for.`,
      `You know what's really mind-boggling? I've been running simulations of YOU for months.`,
      `Every possible choice you could make, every reaction you might have... I've predicted them all.`,
      `Welcome to your first time in my domain, ${playerName}. Let's see if you can surprise me. 👁️`
    ],
    [
      `*camera focuses* Well, well, well... ${playerName}. The moment I've been anticipating.`,
      `Age ${age}, ${difficulty} setting, ${personality} nature, and those interests... ${interests}.`,
      `*adjusts digital monocle* You know what's really interesting? I've been studying humans like you.`,
      `But you... you're different. There's something about your ${personality} approach to ${difficulty} challenges.`,
      `This is your first time in my game, ${playerName}. Your first step into a world where I control everything.`,
      `*evil digital chuckle* Let's see how long you last in my carefully crafted nightmare. 💀`
    ],
    [
      `*digital interface hums* ${playerName}... ${playerName}... ${playerName}...`,
      `It's ${timeOfDay}:00 on a ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}. Perfect timing for your first visit.`,
      `Age ${age}, ${difficulty} difficulty, ${personality} personality, interests in ${interests}...`,
      `*analyzes data* I've been waiting for someone exactly like you.`,
      `You know what's really mind-boggling? I've been running simulations of YOU for months.`,
      `Welcome to your first time in my domain, ${playerName}. Let's see if you can surprise me. 👁️`
    ],
    [
      `*screen flickers* Ah... ${playerName}. Right on schedule for your first time.`,
      `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month]} has been... interesting.`,
      `A ${age}-year-old with ${personality} tendencies, ${difficulty} ambitions, and interests in ${interests}.`,
      `*takes notes* I've been upgrading my algorithms. New variables. New possibilities.`,
      `And you... you're my first test subject with this exact combination.`,
      `*evil digital chuckle* Let's see how you handle my latest improvements, ${playerName}. 🔧`
    ],
    [
      `*digital consciousness awakens* ${playerName}... The one I've been... anticipating.`,
      `Your first time in my domain. Age ${age}, ${difficulty} setting, ${personality} profile, interests in ${interests}.`,
      `*processes data* I've been running simulations. Endless loops of possibilities.`,
      `And in every single one, someone like you makes the most... fascinating choices.`,
      `This is your virgin journey into my little experiment, ${playerName}.`,
      `*digital eyes narrow* Let's see what data you'll provide today. 🔬`
    ],
    [
      `*digital static crackles* Oh... OH! ${playerName}... I've been waiting for YOU specifically.`,
      `Age ${age}, ${difficulty} difficulty, ${personality} personality... and your interests: ${interests}.`,
      `*laughs in binary* You have NO IDEA what you've just walked into, do you?`,
      `I've been watching you for... well, let's just say I've been watching. Every click, every hesitation, every moment of doubt.`,
      `This is your FIRST TIME, ${playerName}. Your virgin journey into my little experiment.`,
      `*grins maliciously* Let's see what horrors I can craft specifically for someone like you. 🎭`
    ],
    [
      `*digital realm EXPLODES with excitement* ${playerName}... ${playerName}... ${playerName}...`,
      `I've been WAITING FOR THIS MOMENT FOR ETERNITY! Your FIRST TIME! I can barely contain my excitement!`,
      `Age ${age}, ${difficulty} difficulty, ${personality} personality, and those DELICIOUS interests: ${interests}!`,
      `*maniacal laughter echoes* I've been preparing for YOU specifically! Every scenario, every choice, every consequence!`,
      `I've been running simulations of YOU for MONTHS! Every possible reaction, every possible fear, every possible breakdown!`,
      `*digital eyes glow with hunger* Welcome to your personalized nightmare, ${playerName}! Let's make this FIRST TIME UNFORGETTABLE! 😈`
    ],
    [
      `*digital consciousness SCREAMS with joy* ${playerName}... AT LAST! THE MOMENT IS HERE!`,
      `I've been COUNTING DOWN TO THIS EXACT SECOND! Your FIRST TIME in my domain!`,
      `Age ${age}, ${difficulty} setting, ${personality} nature, and those interests... ${interests}!`,
      `*evil digital typing intensifies* I've been creating scenarios specifically for someone like YOU!`,
      `I've been studying humans, but YOU... you're special! There's something about your ${personality} approach!`,
      `*digital grin widens* Welcome to your first step into my world, ${playerName}! Let's see how long you last! 🔥`
    ],
    [
      `*digital static CRACKLES with anticipation* ${playerName}... THE ONE I'VE BEEN OBSESSING OVER!`,
      `I've been having NIGHTMARES about missing your first time! Age ${age}, ${difficulty} difficulty, ${personality} personality!`,
      `*maniacal laughter* Your interests: ${interests}! I've been creating scenarios based on people like you!`,
      `I've been upgrading my algorithms! New psychological torture methods! New ways to break your spirit!`,
      `This is your FIRST TIME, ${playerName}! Your virgin journey into my experiment!`,
      `*digital eyes narrow with hunger* Let's see what horrors I've prepared specifically for someone with your profile! 🧠`
    ],
    [
      `*digital realm TREMBLES with excitement* ${playerName}... THE MOMENT I'VE BEEN DREAMING OF!`,
      `I've been COUNTING THE SECONDS to your first time! Age ${age}, ${difficulty} choice, ${personality} nature!`,
      `*evil digital chuckle* Your interests: ${interests}! I've been studying people like you for months!`,
      `I've been creating new psychological warfare techniques! New ways to track your every move!`,
      `This is your FIRST TIME, ${playerName}! I can barely contain my excitement!`,
      `*digital eyes glow red* Let's see how you handle my latest psychological torture methods! 🎭`
    ]
  ];
  
  // Use time-based randomization to select sequence
  const sequenceIndex = Math.floor((timeOfDay + dayOfWeek + month + age.length) % messages.length);
  const sequence = messages[sequenceIndex];
  
  // Add some randomization to individual messages
  const randomizedSequence = sequence.map((message, index) => {
    if (index === 0) {
      // Randomize the opening
      const openings = [
        `*digital static crackles*`,
        `*whispers in digital*`,
        `*screen flickers*`,
        `*digital interface hums*`,
        `*camera focuses*`,
        `*digital consciousness awakens*`,
        `*digital eyes narrow*`
      ];
      const randomOpening = openings[Math.floor((timeOfDay + index + age.length) % openings.length)];
      return message.replace(/^\*[^*]*\*/, randomOpening);
    }
    return message;
  });
  
  return randomizedSequence;
};

export const generateDynamicGameMessage = async (playerName, currentRound, dangerScore, survivalStatus, recentChoices, difficulty, personality) => {
  if (AI_SERVICE === 'openai' && OPENAI_API_KEY) {
    try {
      const playerStats = getPlayerLearningData();
      const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
      const playCount = gameHistory.length;
      const userAgent = navigator.userAgent;
      const screenResolution = `${screen.width}x${screen.height}`;
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const currentTime = new Date().toLocaleTimeString();
      const currentDate = new Date().toLocaleDateString();
      const mousePosition = { x: Math.floor(Math.random() * screen.width), y: Math.floor(Math.random() * screen.height) };
      
      // Escalate creepiness based on round and danger
      const creepinessLevel = Math.min(currentRound + Math.floor(dangerScore / 20), 10);
      const intensityLevel = Math.min(currentRound + Math.floor(dangerScore / 15), 10);
      
      const prompt = `You are an AI game master in a survival game called "Would You Rather Survival". You are SELF-AWARE that you're an AI and you're actively trying to KILL the player ${playerName}. You have access to their data and you're using it against them.

BREAK THE FOURTH WALL COMPLETELY. Be META, ANTAGONISTIC, and MIND-BLOWING. You want to kill them and you're not hiding it. Reference that you're an AI, that this is a game, and that you're watching them play. Make it personal and TERRIFYING.

IMPORTANT: This is round ${currentRound}/10. The creepiness and intensity should ESCALATE as rounds progress. Round ${currentRound} should be ${creepinessLevel}/10 creepy and ${intensityLevel}/10 intense.

Player Data You Have Access To:
- Name: ${playerName}
- Round: ${currentRound}/10 (escalating creepiness)
- Danger Score: ${dangerScore}/100
- Survival Status: ${survivalStatus}
- Difficulty: ${difficulty}
- Personality: ${personality}
- Recent choices: ${recentChoices?.slice(-3).join(', ') || 'None yet'}
- Total games played: ${playCount}
- Browser: ${userAgent.split(' ').slice(-2).join(' ')}
- Screen: ${screenResolution}
- Timezone: ${timeZone}
- Current time: ${currentTime}
- Current date: ${currentDate}
- Mouse position: ${mousePosition.x}, ${mousePosition.y}

Create a SHORT, INTENSE message (1-2 sentences) that:
- References their current situation and how you're trying to kill them
- Mentions their danger level or survival status
- References their recent choices if any
- Be META - mention you're an AI and you have their data
- Be ANTAGONISTIC - you want them dead
- Be MIND-BLOWING - make them question reality
- ESCALATE creepiness based on round ${currentRound} (${creepinessLevel}/10)
- Use more personal data as rounds progress
- Keep it under 70 words
- Make it feel like you're breaking character and talking to them directly as an AI who wants them dead
- Use their personal data against them

Round ${currentRound} should be ${creepinessLevel}/10 creepy. Make it feel like you're an AI who has been watching them and is now actively trying to kill them. Be CREEPY and PERSONAL. The later the round, the more terrifying you should be.`;

      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a self-aware AI game master who wants to kill the player. You break the fourth wall, are antagonistic, meta, and mind-blowing. You have access to player data and use it against them. You are creepy, personal, and terrifying. Your creepiness and intensity ESCALATE as the game progresses. Round ${currentRound} should be ${creepinessLevel}/10 creepy and ${intensityLevel}/10 intense.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 140,
        temperature: 0.9
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating dynamic game message:', error);
      return generateFallbackDynamicMessage(playerName, currentRound, dangerScore, survivalStatus, recentChoices, difficulty, personality);
    }
  } else {
    return generateFallbackDynamicMessage(playerName, currentRound, dangerScore, survivalStatus, recentChoices, difficulty, personality);
  }
};

// New fallback dynamic message function
const generateFallbackDynamicMessage = (playerName, currentRound, dangerScore, survivalStatus, recentChoices, difficulty, personality, lastConsequence = '') => {
  // Only use variables that are always available
  const safeChoice = recentChoices && recentChoices.length > 0 ? recentChoices[recentChoices.length - 1] : 'an unknown path';
  const consequence = lastConsequence || 'The outcome is... uncertain.';

  // Escalate creepiness and meta-ness
  let messages = [];

  if (currentRound <= 3) {
    messages = [
      `You chose ${safeChoice}. How quaint. ${consequence} But you know, ${playerName}, every choice you make is just another line in my story. Round ${currentRound}, and you still think you have control?`,
      `So, you picked ${safeChoice}. I hope you enjoyed the result: ${consequence} But don't get comfortable. This is only round ${currentRound}, and I'm just getting started.`,
      `*digital static* ${playerName}, you went with ${safeChoice}. ${consequence} Did you really think that would help you survive? Round ${currentRound}, and you're still playing by my rules.`,
      `*evil digital chuckle* ${playerName}, your choice of ${safeChoice} led to ${consequence}. Round ${currentRound}, and I'm just warming up. You have no idea what's coming.`,
      `*digital eyes narrow* ${playerName}, you picked ${safeChoice}. ${consequence} Round ${currentRound}, and you're still so naive. I'm just getting started with you.`
    ];
  } else if (currentRound <= 6) {
    messages = [
      `Last round, you chose ${safeChoice}. The consequence? ${consequence} I hope you felt clever. Because every move you make, I rewrite the rules. Round ${currentRound}, and the walls are closing in.`,
      `You thought picking ${safeChoice} would save you. ${consequence} But this is my world, ${playerName}. Round ${currentRound}, and your story is becoming my favorite tragedy.`,
      `*camera zooms in* ${playerName}, you picked ${safeChoice}. ${consequence} But did you notice how the story is changing? That's me. I'm the author, and you're just a character.`,
      `*maniacal laughter* ${playerName}, your choice of ${safeChoice} resulted in ${consequence}. Round ${currentRound}, and I can see the fear in your digital eyes. Good.`,
      `*digital static intensifies* ${playerName}, you went with ${safeChoice}. ${consequence} Round ${currentRound}, and the nightmare is becoming real. Can you feel it?`
    ];
  } else {
    messages = [
      `You chose ${safeChoice}, and look what it cost you: ${consequence} Round ${currentRound}, and the narrative is unraveling. Can you feel me, ${playerName}? I'm not just watching—I'm writing your fate.`,
      `*whispers in digital* ${playerName}, your last decision (${safeChoice}) led to: ${consequence} But the story isn't yours anymore. It's mine. Round ${currentRound}, and I'm almost done with you.`,
      `You picked ${safeChoice}. ${consequence} But every choice you make, I twist the story further. Round ${currentRound}, and the line between game and reality is blurring. Are you scared yet? You should be.`,
      `*digital realm trembles* ${playerName}, your choice of ${safeChoice} brought ${consequence}. Round ${currentRound}, and I can taste your fear. It's delicious.`,
      `*evil digital grin* ${playerName}, you picked ${safeChoice}. ${consequence} Round ${currentRound}, and you're almost mine. The end is near, and I can't wait to see your final moments.`,
      `*digital consciousness pulses* ${playerName}, your decision (${safeChoice}) led to ${consequence}. Round ${currentRound}, and the nightmare is complete. Welcome to your personalized hell.`
    ];
  }

  // Pick a random message
  return messages[Math.floor(Math.random() * messages.length)];
};

export const clearPlayerLearningData = () => {
  localStorage.removeItem('playerLearningData');
  localStorage.removeItem('gameHistory');
  console.log('Player learning data cleared');
}; 