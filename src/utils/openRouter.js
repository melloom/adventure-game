import axios from 'axios';

// You'll need to set your OpenRouter API key in environment variables
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Debug: Check if API key is available
console.log('OpenRouter API Key available:', !!OPENROUTER_API_KEY);
if (!OPENROUTER_API_KEY) {
  console.warn('⚠️ OpenRouter API key not found! Please set VITE_OPENROUTER_API_KEY in your .env file');
}

// Configure axios with OpenRouter headers
const openRouterClient = axios.create({
  baseURL: OPENROUTER_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'Would You Rather Survival Game'
  }
});

// Smart fallback system that simulates AI behavior
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

// Smart fallback system for consequences
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
  const isPositive = Math.random() > 0.6; // 40% chance of positive outcome
  const consequencePool = isPositive ? templates.positive : templates.negative;
  
  let consequence = consequencePool[Math.floor(Math.random() * consequencePool.length)];
  
  // Add round-specific context
  if (round > 5) {
    consequence += ` Round ${round} has taken its toll on your psyche.`;
  }
  
  // Add personality-specific flavor
  if (personality === 'impulsive') {
    consequence += ' Your quick decision-making continues to define your path.';
  } else if (personality === 'cautious') {
    consequence += ' Your careful consideration has shaped this outcome.';
  } else if (personality === 'adventurous') {
    consequence += ' Your boldness has led you to this moment.';
  }
  
  return consequence;
};

// Generate a random "Would You Rather" question based on difficulty and personality
export const generateQuestion = async (difficulty = 'medium', personality = 'balanced') => {
  // List of models to try in order (OpenAI first, then Meta, then Anthropic)
  const modelsToTry = [
    'openai/gpt-3.5-turbo',
    'openai/gpt-3.5-turbo:free',
    'meta-llama/llama-3.1-8b-instruct',
    'meta-llama/llama-3.1-8b-instruct:free',
    'meta-llama/llama-3.1-70b-instruct',
    'meta-llama/llama-3.1-70b-instruct:free',
    'anthropic/claude-3-haiku',
    'anthropic/claude-3-haiku:free'
  ];

  for (const model of modelsToTry) {
    try {
      console.log(`Trying model: ${model}`);
      
      const response = await openRouterClient.post('/chat/completions', {
        model: model,
        messages: [
          {
            role: 'system',
            content: `Generate a "Would You Rather" question. Return ONLY the question in this format: "Would you rather [option A] or [option B]?"`
          },
          {
            role: 'user',
            content: `Create a ${difficulty} difficulty question for a survival game.`
          }
        ],
        temperature: 0.8,
        max_tokens: 50
      });

      console.log(`Success with model ${model}:`, response.data);
      
      const content = response.data.choices[0].message.content.trim();
      console.log('Extracted content:', content);
      
      if (!content || content.length === 0) {
        throw new Error('AI returned empty response');
      }

      return content;
    } catch (error) {
      console.error(`Error with model ${model}:`, error.message);
      
      // If it's a 402 (payment required) or 429 (rate limit), try next model
      if (error.response?.status === 402 || error.response?.status === 429) {
        console.log(`Model ${model} requires payment or is rate limited, trying next...`);
        continue;
      }
      
      // If it's a 404 (model not found), try next model
      if (error.response?.status === 404) {
        console.log(`Model ${model} not found, trying next...`);
        continue;
      }
      
      // For other errors, also try next model
      console.log(`Model ${model} failed, trying next...`);
    }
  }

  // If all models fail, use smart fallback
  console.log('All AI models failed, using smart fallback system');
  return generateSmartFallbackQuestion(difficulty, personality);
};

// Generate a consequence based on the player's choice
export const generateConsequence = async (choice, difficulty = 'medium', personality = 'balanced', round = 1) => {
  // List of models to try in order (OpenAI first, then Meta, then Anthropic)
  const modelsToTry = [
    'openai/gpt-3.5-turbo',
    'openai/gpt-3.5-turbo:free',
    'meta-llama/llama-3.1-8b-instruct',
    'meta-llama/llama-3.1-8b-instruct:free',
    'meta-llama/llama-3.1-70b-instruct',
    'meta-llama/llama-3.1-70b-instruct:free',
    'anthropic/claude-3-haiku',
    'anthropic/claude-3-haiku:free'
  ];

  for (const model of modelsToTry) {
    try {
      console.log(`Trying model for consequence: ${model}`);
      
      const response = await openRouterClient.post('/chat/completions', {
        model: model,
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

      console.log(`Success with model ${model} for consequence:`, response.data);
      
      const content = response.data.choices[0].message.content.trim();
      console.log('Extracted consequence:', content);
      
      if (!content || content.length === 0) {
        throw new Error('AI returned empty consequence');
      }

      return content;
    } catch (error) {
      console.error(`Error with model ${model} for consequence:`, error.message);
      
      // If it's a 402 (payment required) or 429 (rate limit), try next model
      if (error.response?.status === 402 || error.response?.status === 429) {
        console.log(`Model ${model} requires payment or is rate limited, trying next...`);
        continue;
      }
      
      // If it's a 404 (model not found), try next model
      if (error.response?.status === 404) {
        console.log(`Model ${model} not found, trying next...`);
        continue;
      }
      
      // For other errors, also try next model
      console.log(`Model ${model} failed, trying next...`);
    }
  }

  // If all models fail, use smart fallback
  console.log('All AI models failed for consequence, using smart fallback system');
  return generateSmartFallbackConsequence(choice, difficulty, personality, round);
};

// Determine if player survives based on danger level and round
export const calculateSurvival = (dangerLevel, roundNumber) => {
  // Higher rounds and danger levels make survival harder
  const survivalChance = Math.max(0.1, 1 - (dangerLevel * 0.1) - (roundNumber * 0.05));
  return Math.random() < survivalChance;
};

// Test function to check API status
export const testApiStatus = async () => {
  if (!OPENROUTER_API_KEY) {
    return {
      available: false,
      reason: 'API key not found',
      message: 'Please set VITE_OPENROUTER_API_KEY in your .env file'
    };
  }

  // List of models to test (OpenAI first, then Meta, then Anthropic)
  const modelsToTest = [
    'openai/gpt-3.5-turbo',
    'openai/gpt-3.5-turbo:free',
    'meta-llama/llama-3.1-8b-instruct',
    'meta-llama/llama-3.1-8b-instruct:free',
    'meta-llama/llama-3.1-70b-instruct',
    'meta-llama/llama-3.1-70b-instruct:free',
    'anthropic/claude-3-haiku',
    'anthropic/claude-3-haiku:free'
  ];

  const results = [];

  for (const model of modelsToTest) {
    try {
      console.log(`Testing model: ${model}`);
      
      const response = await openRouterClient.post('/chat/completions', {
        model: model,
        messages: [
          {
            role: 'user',
            content: 'Say "Hello" if you can read this.'
          }
        ],
        max_tokens: 10
      });

      results.push({
        model: model,
        status: 'success',
        response: response.data.choices[0].message.content
      });
      
      console.log(`✅ Model ${model} works!`);
      
      // Return success on first working model
      return {
        available: true,
        reason: 'API working',
        message: `AI is ready to generate content using ${model}`,
        workingModel: model,
        response: response.data.choices[0].message.content,
        allResults: results
      };
      
    } catch (error) {
      const errorInfo = {
        model: model,
        status: 'failed',
        error: error.message,
        statusCode: error.response?.status,
        details: error.response?.data
      };
      
      results.push(errorInfo);
      
      console.log(`❌ Model ${model} failed:`, error.response?.status, error.message);
    }
  }

  // If no models work, return detailed failure info
  return {
    available: false,
    reason: 'All models failed',
    message: 'No AI models are currently available. Using smart fallback system.',
    allResults: results,
    fallbackAvailable: true
  };
}; 