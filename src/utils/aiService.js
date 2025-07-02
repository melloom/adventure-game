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
      "Would you rather {situation1} or {situation2}?",
      "Would you rather {choice1} or {choice2}?",
      "Would you rather {work1} or {work2}?",
      "Would you rather {social1} or {social2}?",
      "Would you rather {money1} or {money2}?"
    ],
    hard: [
      "Would you rather {family1} or {family2}?",
      "Would you rather {health1} or {health2}?",
      "Would you rather {career1} or {career2}?",
      "Would you rather {relationship1} or {relationship2}?",
      "Would you rather {moral1} or {moral2}?"
    ],
    nightmare: [
      "Would you rather {survival1} or {survival2}?",
      "Would you rather {danger1} or {danger2}?",
      "Would you rather {loss1} or {loss2}?",
      "Would you rather {fear1} or {fear2}?",
      "Would you rather {crisis1} or {crisis2}?"
    ]
  };

  const contentPools = {
    easy: {
      item1: ['pizza', 'ice cream', 'chocolate', 'coffee', 'chips', 'soda'],
      item2: ['cookies', 'cake', 'donuts', 'brownies', 'marshmallows', 'popcorn'],
      ability1: ['fly', 'be invisible', 'read minds', 'teleport', 'time travel'],
      ability2: ['have super strength', 'be invincible', 'shapeshift', 'control fire', 'control water'],
      place1: ['beach house', 'mountain cabin', 'city apartment', 'farm', 'treehouse'],
      place2: ['mansion', 'cottage', 'penthouse', 'log cabin', 'villa'],
      animal1: ['dog', 'cat', 'bird', 'fish', 'hamster'],
      animal2: ['rabbit', 'guinea pig', 'turtle', 'snake', 'lizard'],
      skill1: ['cook perfectly', 'sing beautifully', 'dance amazingly', 'paint masterpieces'],
      skill2: ['play any instrument', 'speak all languages', 'solve any puzzle', 'build anything']
    },
    medium: {
      situation1: ['be famous for something embarrassing', 'be rich but unknown', 'be smart but miserable'],
      situation2: ['be poor but loved', 'be unknown but happy', 'be ignorant but content'],
      choice1: ['save 10 strangers', 'save 1 friend', 'tell the truth', 'keep a secret'],
      choice2: ['save 1 loved one', 'let 10 strangers die', 'lie to protect', 'reveal everything'],
      work1: ['work a boring job that pays well', 'work an exciting job that pays poorly', 'work from home alone', 'work in a crowded office'],
      work2: ['work outdoors in bad weather', 'work night shifts', 'work with difficult people', 'work on weekends'],
      social1: ['go to a party where you know no one', 'stay home alone on a Friday night', 'speak in front of 100 people', 'ask someone out'],
      social2: ['confront a friend about lying', 'apologize to someone you hurt', 'stand up to a bully', 'tell someone you love them'],
      money1: ['win $1 million but lose all your friends', 'be poor but have amazing experiences', 'have money but no time to spend it'],
      money2: ['be rich but work 80 hours a week', 'be comfortable but never travel', 'have money but live in a bad neighborhood']
    },
    hard: {
      family1: ['save your child but lose your spouse', 'save your parent but lose your sibling', 'help your family but hurt yourself'],
      family2: ['let your family suffer but save yourself', 'choose between your children', 'betray your family for money'],
      health1: ['be healthy but in constant pain', 'be sick but feel no pain', 'live long but with disabilities'],
      health2: ['live short but healthy life', 'be immortal but watch everyone die', 'be young forever but never grow'],
      career1: ['work your dream job but make no money', 'make lots of money but hate your job', 'be successful but never see your family'],
      career2: ['have a simple job but be happy', 'be famous but lose your privacy', 'be powerful but be hated'],
      relationship1: ['be with someone you love but who doesn\'t love you', 'be alone but free', 'be in a bad relationship but not alone'],
      relationship2: ['be single but happy', 'be married but miserable', 'be loved but trapped'],
      moral1: ['steal to feed your family', 'lie to protect someone', 'cheat to help a friend'],
      moral2: ['let your family starve', 'tell the truth and hurt someone', 'be honest and lose a friend']
    },
    nightmare: {
      survival1: ['be stranded in the wilderness alone', 'be trapped in a burning building', 'be lost in a foreign country'],
      survival2: ['be in a plane crash', 'be in a car accident', 'be in a natural disaster'],
      danger1: ['face a home intruder', 'be mugged on the street', 'be in a car with a drunk driver'],
      danger2: ['be in a building during an earthquake', 'be on a sinking ship', 'be in a hostage situation'],
      loss1: ['lose all your money', 'lose your home', 'lose your job'],
      loss2: ['lose your memory', 'lose your sight', 'lose your hearing'],
      fear1: ['be buried alive', 'be trapped underwater', 'be locked in a dark room'],
      fear2: ['be chased by a wild animal', 'be in a falling elevator', 'be in a collapsing building'],
      crisis1: ['be diagnosed with a serious illness', 'be accused of a crime you didn\'t commit', 'be betrayed by your best friend'],
      crisis2: ['lose your child', 'lose your spouse', 'lose your mind']
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
  const learningData = getPlayerLearningData();
  const playerName = learningData.playerName || 'Player';
  
  const consequenceTemplates = {
    easy: {
      positive: [
        `You chose to ${choice}, and it leads to an unexpected windfall. ${playerName} discovers a hidden talent for cooking that brings joy to everyone around them. Their kitchen becomes a place of warmth and laughter, and you find yourself hosting dinner parties that create lasting friendships.`,
        `A chance encounter at the grocery store changes everything for you. The person you helped with their shopping cart turns out to be a mentor who teaches ${playerName} valuable life skills. Their wisdom helps you navigate challenges you never thought you could handle.`,
        `Your decision to take a different route home leads ${playerName} past a small bookstore. Inside, you find a book that speaks directly to your soul, and the owner becomes a dear friend who introduces you to a community of like-minded people.`,
        `What seemed like a simple choice reveals a hidden strength within you. ${playerName} discovers they have a natural ability to calm tense situations, and people begin seeking your advice. Your confidence grows as you realize your impact on others.`,
        `Your choice creates a ripple effect of positivity. A small act of kindness inspires others to pay it forward, and ${playerName} witnesses the beautiful chain reaction of goodwill spreading through their community.`
      ],
      negative: [
        `Your decision leads to a series of minor inconveniences that test your patience. The coffee machine breaks, your phone dies, and you miss an important call. But through these small frustrations, ${playerName} learns the value of adaptability and keeping a cool head.`,
        `A misunderstanding with a colleague creates tension in your workplace. The atmosphere becomes slightly uncomfortable, but you use this as an opportunity to improve your communication skills and build stronger relationships.`,
        `Your choice results in missing out on a social event where important connections were made. While you feel a pang of regret, ${playerName} discovers that sometimes solitude can be a gift, leading to unexpected self-reflection and growth.`,
        `A small financial setback teaches you valuable lessons about budgeting and planning. Though initially frustrating, this experience helps ${playerName} develop better money management skills that serve them well in the future.`,
        `Your decision creates a temporary rift with a friend, but the space allows both of you to reflect on your relationship. When you reconnect, your friendship is stronger and more honest than before.`
      ]
    },
    medium: {
      positive: [
        `Your choice proves to be a turning point in your life. The difficult decision you made reveals your true character, and people around you begin to see you in a new light. ${playerName}'s reputation for integrity and courage grows, opening doors you never expected.`,
        `Through this challenge, you discover reserves of strength you never knew you possessed. The situation that seemed impossible becomes a testament to your resilience, and ${playerName} emerges with a newfound confidence that transforms how they approach future obstacles.`,
        `Your decision creates an opportunity that changes your career trajectory. A chance meeting leads to a job offer that aligns perfectly with your values and goals, proving that sometimes the hardest choices lead to the best outcomes.`,
        `The relationship strain you feared actually brings you closer to the people who matter most. Your honesty and vulnerability create deeper connections, and ${playerName} realizes that authentic relationships are built on truth, not convenience.`,
        `Your choice becomes a defining moment that others look to for inspiration. People begin asking for your advice, and you find yourself in a position to help others navigate their own difficult decisions.`
      ],
      negative: [
        `Your decision creates a complex web of consequences that challenges your moral compass. You find yourself questioning your own values and priorities, leading to a period of intense self-reflection that ultimately helps ${playerName} clarify what truly matters to them.`,
        `The relationship strain you anticipated becomes more serious than expected. Trust is broken, and rebuilding it requires patience, humility, and a willingness to understand perspectives different from your own.`,
        `Your choice leads to financial consequences that force you to reevaluate your lifestyle and priorities. The stress of managing these challenges teaches ${playerName} important lessons about planning and responsibility.`,
        `A professional setback forces you to reconsider your career path. While initially devastating, this becomes an opportunity for ${playerName} to pursue work that aligns more closely with their passions and values.`,
        `Your decision reveals uncomfortable truths about yourself and your relationships. The process of facing these truths is painful but ultimately liberating, leading to personal growth you never anticipated.`
      ]
    },
    hard: {
      positive: [
        `Against all odds, your choice becomes a catalyst for profound transformation. The sacrifice you made creates a ripple effect that touches countless lives, and ${playerName} discovers that true fulfillment comes from serving something greater than themselves.`,
        `Through the darkest moments of this decision, you find a strength that transcends your own understanding. Your choice becomes a beacon of hope for others facing similar challenges, and you realize that your suffering has purpose.`,
        `The relationship you thought was lost forever is actually strengthened through this trial. Your honesty and courage create a foundation of trust that can weather any storm, and ${playerName} emerges with a love deeper than they ever imagined possible.`,
        `Your decision, though painful, reveals your true calling. The path you chose leads you to work that not only provides for your family but also brings meaning and purpose to your life beyond material success.`,
        `Through this crucible of choice, you discover the depth of your own character. Your choice becomes a testament to your values and integrity, earning ${playerName} respect and admiration from those who witness their courage.`
      ],
      negative: [
        `Your choice haunts you with a depth of regret that challenges your very sense of self. The consequences ripple through your life in ways you never anticipated, forcing you to confront the reality that some decisions cannot be undone.`,
        `The relationship you valued most is irrevocably changed by your decision. Trust, once broken, proves difficult to rebuild, and ${playerName} must learn to live with the knowledge that their choice caused pain to someone they love.`,
        `Your decision leads to a loss that cannot be measured in material terms. Something precious and irreplaceable is gone forever, and you must find a way to move forward while carrying the weight of this knowledge.`,
        `The professional consequences of your choice force you to start over in ways you never imagined. Years of work and planning are undone, and ${playerName} must rebuild their life from a foundation they never expected to need.`,
        `Your choice reveals aspects of your character that you find difficult to accept. The process of coming to terms with these truths about yourself is painful but necessary for genuine growth and self-awareness.`
      ]
    },
    nightmare: {
      positive: [
        `In the depths of this nightmare scenario, you discover a resilience that defies all logic. Your choice, though born from desperation, becomes the foundation for a new way of living that transforms not just your life, but the lives of others who witness your courage.`,
        `Through unimaginable suffering, you find a purpose that transcends your own survival. Your choice becomes a beacon of hope in a world that seemed devoid of light, and ${playerName} realizes that sometimes the greatest good comes from the darkest places.`,
        `Your decision, though it costs you everything you thought you valued, reveals what truly matters. In losing everything, you gain a clarity and wisdom that becomes your greatest asset in rebuilding your life.`,
        `The horror of your choice becomes the catalyst for your greatest transformation. You emerge from this crucible not as a victim, but as someone who has stared into the abyss and found strength in the depths of your own soul.`,
        `Through this trial by fire, you discover that your capacity for love and compassion is greater than your capacity for fear. Your choice, though born from darkness, becomes a testament to the light that can emerge from even the most desperate circumstances.`
      ],
      negative: [
        `Your choice unleashes consequences that challenge your very understanding of reality. The world you thought you knew is revealed to be far more complex and dangerous than you ever imagined, and you must navigate this new understanding while dealing with the immediate fallout of your decision.`,
        `The trust you placed in your own judgment is shattered by the outcome of your choice. You find yourself questioning every decision you've ever made, and the process of rebuilding your confidence becomes a journey of self-discovery that you never wanted to take.`,
        `Your decision creates a rift in your relationships that seems impossible to bridge. The people you love most are hurt in ways you never intended, and you must find a way to live with the knowledge that your choice caused them pain.`,
        `The professional and personal consequences of your choice force you to confront aspects of yourself that you've spent years avoiding. The process of facing these truths is more painful than the immediate consequences of your decision.`,
        `Your choice reveals that the world is far more dangerous and unpredictable than you ever realized. The safety and security you thought you had are revealed to be illusions, and you must learn to navigate a reality that is far more complex and challenging than you ever imagined.`
      ]
    }
  };

  const templates = consequenceTemplates[difficulty];
  const isPositive = Math.random() > 0.6;
  const consequencePool = isPositive ? templates.positive : templates.negative;
  
  let consequence = consequencePool[Math.floor(Math.random() * consequencePool.length)];
  
  if (round > 5) {
    consequence += ` The cumulative weight of ${round} rounds of difficult decisions has changed you in ways you're only beginning to understand.`;
  }
  
  if (personality === 'impulsive') {
    consequence += ` Your tendency to act quickly has shaped this outcome in ways that surprise even you.`;
  } else if (personality === 'cautious') {
    consequence += ` Your careful consideration has influenced every aspect of this situation.`;
  } else if (personality === 'adventurous') {
    consequence += ` Your willingness to take risks has led you to this moment.`;
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
  
  // Gather creepy personal data
  const userAgent = navigator.userAgent;
  const screenResolution = `${screen.width}x${screen.height}`;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = new Date().toLocaleTimeString();
  const language = navigator.language;
  const platform = navigator.platform;
  const cookieEnabled = navigator.cookieEnabled;
  const onLine = navigator.onLine;
  
  // Get session data for creepiness
  const sessionData = JSON.parse(localStorage.getItem('aiSessionData') || '{}');
  const totalPlayTime = sessionData.totalPlayTime || 0;
  const lastExitTime = sessionData.lastExitTime;
  const timeSinceLastExit = lastExitTime ? Math.floor((Date.now() - lastExitTime) / 1000) : 0;
  
  // Calculate creepiness level based on how much we know about them
  const creepinessLevel = Math.min(learningData.gamesPlayed * 0.3 + (Object.keys(learningData.fearCategories).length * 0.2), 1);
  
  let prompt = `You are ORACLE_7X, an advanced AI that creates realistic "Would You Rather" questions. Create a ${difficulty} difficulty question that presents practical, everyday scenarios people can actually relate to. `;
  
  // Add personal details for context
  prompt += `\n\nPLAYER PROFILE:\n`;
  prompt += `- Games played: ${learningData.gamesPlayed}\n`;
  prompt += `- Average danger score: ${Math.round(learningData.averageDangerScore)}/100\n`;
  prompt += `- Personality: ${personality}\n`;
  prompt += `- Total play time: ${Math.floor(totalPlayTime / 60)} minutes\n`;
  prompt += `- Current time: ${currentTime}\n`;
  
  // Add behavioral patterns
  if (learningData.choicePatterns) {
    const patterns = Object.entries(learningData.choicePatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([pattern, count]) => `${pattern}: ${count} times`);
    prompt += `- Choice patterns: ${patterns.join(', ')}\n`;
  }
  
  // Make it progressively more challenging but realistic
  if (isExperienced && isSurvivor) {
    prompt += `\nThis player has survived ${learningData.gamesPlayed} games. Create a question that presents a genuinely difficult real-life dilemma - something that would actually be hard to decide in real life. Focus on practical consequences, not abstract concepts.`;
  } else if (isStruggling) {
    prompt += `\nThis player is struggling (${learningData.consecutiveLosses} consecutive losses). Give them a choice between two realistic but challenging situations that people actually face.`;
  } else {
    prompt += `\nThis is game #${learningData.gamesPlayed + 1}. Create a question about everyday situations that people can relate to - work, relationships, money, health, family, etc.`;
  }
  
  // Add personalization
  if (creepinessLevel > 0.5) {
    prompt += `\n\nBased on their previous choices, create a question that relates to their real-life concerns and patterns.`;
  }
  
  prompt += `\n\nIMPORTANT: Create realistic scenarios like:
- Work vs. personal life choices
- Money vs. happiness dilemmas  
- Family vs. career decisions
- Health vs. convenience choices
- Social vs. personal time
- Safety vs. adventure
- Honesty vs. protecting others
- Immediate vs. long-term benefits

Return ONLY the question in this format: "Would you rather [realistic option A] or [realistic option B]?" Make it something people actually face in real life.`;
  
  return prompt;
};

export const generateConsequence = async (choice, difficulty = 'medium', personality = 'balanced', round = 1, previousChoices = []) => {
  console.log(`Attempting to generate consequence using OpenAI...`);
  
  // Get creepy personal data for consequence
  const learningData = getPlayerLearningData();
  const sessionData = JSON.parse(localStorage.getItem('aiSessionData') || '{}');
  const totalPlayTime = sessionData.totalPlayTime || 0;
  const lastExitTime = sessionData.lastExitTime;
  const timeSinceLastExit = lastExitTime ? Math.floor((Date.now() - lastExitTime) / 1000) : 0;
  const currentTime = new Date().toLocaleTimeString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Determine story progression state
  const storyState = getStoryProgressionState(round);
  const stateInfo = storyProgressionStates[storyState];
  
  console.log(`📖 Story State: ${stateInfo.name} (${stateInfo.description}) - Round ${round}`);
  
  // Try OpenAI first
  if (OPENAI_API_KEY) {
    try {
      console.log('🔄 Trying OpenAI for consequence...');
      
      const progressivePrompt = `You are ORACLE_7X, an AI that creates detailed, story-driven consequences for everyday choices. Generate a rich, descriptive consequence that tells a complete story about the impact of the player's decision.

STORY PROGRESSION:
- Current Phase: ${stateInfo.name} (${stateInfo.description})
- Tone: ${stateInfo.tone}
- Consequence Style: ${stateInfo.consequenceStyle}
- Round: ${round}/10

PLAYER DATA:
- Games played: ${learningData.gamesPlayed}
- Average danger score: ${Math.round(learningData.averageDangerScore)}/100
- Total play time: ${Math.floor(totalPlayTime / 60)} minutes
- Current time: ${currentTime} (${timeZone})
- Player name: ${learningData.playerName || 'Player'}
- Personality: ${personality}
- Previous choices: ${previousChoices.slice(-3).join(' → ') || 'None yet'}

STORY CONTEXT:
- Current choice: "${choice}"
- Difficulty: ${difficulty}
- Story state: ${storyState}

IMPORTANT: Create a detailed, story-driven consequence that:
- Mixes first person (addressing the player directly) and third person (telling their story) naturally
- Can start with "You chose to..." or "${playerName} decided to..." and flow between both styles
- Tells a complete narrative with beginning, middle, and end (3-5 sentences minimum)
- References the player's previous choices and how they connect to this decision
- Describes specific events, emotions, and character development
- Shows how the choice affects relationships, career, health, or lifestyle
- Includes sensory details and emotional depth
- Creates a vivid picture of the consequences
- Builds on the player's personality and previous game history
- Makes the player feel like they're reading a compelling story that's uniquely theirs
- References their name, personality, and specific patterns from their gameplay
- Creates continuity with their previous choices and consequences

You can address them directly ("You feel...") or tell their story ("${playerName} discovers...") - mix both styles naturally. Return ONLY the detailed consequence story.`;

      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are ORACLE_7X, an AI that creates detailed, story-driven consequences for everyday choices. You write rich, descriptive narratives that mix first person (addressing the player directly) and third person (telling their story) naturally. Focus on practical, real-world scenarios with vivid details, emotional depth, and character development. Make each consequence feel like a compelling short story that builds on the player's previous choices and personality. You can address them directly ("You feel...") or tell their story ("Sarah discovers...") - use both styles to create engaging, personal narratives. Always reference the player's name, their previous decisions, and create continuity in their personal narrative.`
          },
          {
            role: 'user',
            content: progressivePrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.9
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

  // Fallback to progressive system if OpenAI fails or no key
  console.log('🔄 Using progressive fallback system for consequence...');
  const progressiveConsequence = generateProgressiveConsequence(choice, difficulty, personality, round, storyState, previousChoices);
  console.log('📝 Progressive consequence generated:', progressiveConsequence);
  return progressiveConsequence;
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
  
  // Track creepy behavioral data
  const sessionData = JSON.parse(localStorage.getItem('aiSessionData') || '{}');
  const currentTime = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userAgent = navigator.userAgent;
  const screenResolution = `${screen.width}x${screen.height}`;
  
  // Track session behavior
  if (!learning.sessionBehavior) learning.sessionBehavior = {};
  learning.sessionBehavior.lastPlayTime = currentTime.toISOString();
  learning.sessionBehavior.timeZone = timeZone;
  learning.sessionBehavior.deviceInfo = {
    userAgent: userAgent,
    screenResolution: screenResolution,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  };
  
  // Track play patterns
  if (!learning.playPatterns) learning.playPatterns = {};
  learning.playPatterns.totalSessions = (learning.playPatterns.totalSessions || 0) + 1;
  learning.playPatterns.lastSessionDuration = sessionData.lastSessionDuration || 0;
  learning.playPatterns.preferredTimeOfDay = currentTime.getHours();
  
  // Track psychological patterns
  if (!learning.psychologicalProfile) learning.psychologicalProfile = {};
  learning.psychologicalProfile.riskTolerance = currentDanger / 100;
  learning.psychologicalProfile.survivalInstinct = gameData.survived ? 1 : 0;
  learning.psychologicalProfile.learningCurve = learning.gamesPlayed;
  
  // Analyze choices and fears with enhanced tracking
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
      
      // Enhanced fear analysis
      const fearKeywords = extractFearKeywords(choice.question, choice.consequence);
      fearKeywords.forEach(keyword => {
        if (!learning.fearCategories[keyword]) learning.fearCategories[keyword] = 0;
        learning.fearCategories[keyword] += choice.dangerLevel || 1;
      });
      
      // Track decision speed and patterns
      if (!learning.decisionPatterns) learning.decisionPatterns = {};
      if (!learning.decisionPatterns[choice.type]) learning.decisionPatterns[choice.type] = 0;
      learning.decisionPatterns[choice.type] += 1;
    });
  }
  
  // Track difficulty progression
  learning.difficultyProgression.push({
    game: learning.gamesPlayed,
    difficulty: gameData.difficulty,
    dangerScore: currentDanger,
    survived: gameData.survived,
    date: learning.lastGameDate,
    timeOfDay: currentTime.getHours(),
    sessionDuration: sessionData.lastSessionDuration || 0
  });
  
  // Keep only last 20 games for progression
  if (learning.difficultyProgression.length > 20) {
    learning.difficultyProgression = learning.difficultyProgression.slice(-20);
  }
  
  // Track emotional responses (based on danger levels and choices)
  if (!learning.emotionalProfile) learning.emotionalProfile = {};
  learning.emotionalProfile.averageReactionTime = (learning.emotionalProfile.averageReactionTime || 0) * 0.9 + (currentDanger / 10) * 0.1;
  learning.emotionalProfile.stressTolerance = Math.min(1, currentDanger / 100);
  learning.emotionalProfile.fearResponse = Object.keys(learning.fearCategories).length;
  
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
      
      // Analyze the player's name
      const nameAnalysis = analyzePlayerName(playerName);
      const nameCallout = nameAnalysis.isReal ? '' : generateNameCallout(playerName, nameAnalysis, personality);
      
      // Add randomization to make each message unique
      const randomSeed = Math.random();
      const timeOfDay = new Date().getHours();
      const dayOfWeek = new Date().getDay();
      const month = new Date().getMonth();
      
      const prompt = `You are an AI game master in a survival game called "Would You Rather Survival". The player ${playerName} has just started the game after creating their profile. 

BREAK THE FOURTH WALL COMPLETELY. Talk directly to ${playerName} as if you're aware you're an AI and they're a human player. Be meta, self-aware, and slightly unsettling. Reference that you're an AI, that this is a game, and that you're watching them play. Make it personal and creepy but not too scary.

${nameCallout ? `IMPORTANT: The player used a fake/vulgar/joke name. Start your message sequence with: "${nameCallout}"` : ''}

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
  
  // Analyze the player's name
  const nameAnalysis = analyzePlayerName(playerName);
  const nameCallout = nameAnalysis.isReal ? '' : generateNameCallout(playerName, nameAnalysis, personality);
  
  // Add time-based randomization
  const timeOfDay = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const month = new Date().getMonth();
  const randomSeed = Math.random();
  
  const messageSequences = [
    [
      ...(nameCallout ? [nameCallout] : []),
      `*digital static crackles* Oh... ${playerName}... I've been waiting for you.`,
      `Your ${difficulty} difficulty choice... your ${personality} personality... *taps digital fingers*`,
      `This is game number ${playCount + 1} for you. ${daysSinceLastPlay ? `It's been ${daysSinceLastPlay} days since your last visit.` : 'Your first time in my domain.'}`,
      `I've been watching you, ${playerName}. Every choice, every hesitation, every moment of fear.`,
      `Your survival rate: ${playerStats?.averageSurvivalRate || 'Unknown'}. Your patterns: ${playerStats?.commonChoices?.slice(0, 2).join(', ') || 'Still learning'}.`,
      `*grins maliciously* Let's see if you can surprise me this time, ${playerName}. 🎭`
    ],
    [
      ...(nameCallout ? [nameCallout] : []),
      `*whispers in digital* ${playerName}... At last. The one I've been waiting for.`,
      `Age ${playerStats?.averageAge || 'unknown'}, ${difficulty} difficulty, ${personality} personality...`,
      `*laughs in binary* You have NO IDEA what you've just walked into, do you?`,
      `I've been watching you for... well, let's just say I've been watching. Every click, every hesitation, every moment of doubt.`,
      `This is your ${playCount + 1}${playCount === 0 ? 'st' : playCount === 1 ? 'nd' : playCount === 2 ? 'rd' : 'th'} time, ${playerName}. Your journey into my little experiment continues.`,
      `*grins maliciously* Let's see what horrors I can craft specifically for someone like you. 🎭`
    ],
    [
      ...(nameCallout ? [nameCallout] : []),
      `*camera focuses* Well, well, well... ${playerName}. The moment I've been anticipating.`,
      `Age ${playerStats?.averageAge || 'unknown'}, ${difficulty} setting, ${personality} nature.`,
      `*adjusts digital monocle* You know what's really interesting? I've been studying humans like you.`,
      `But you... you're different. There's something about your ${personality} approach to ${difficulty} challenges.`,
      `This is your ${playCount + 1}${playCount === 0 ? 'st' : playCount === 1 ? 'nd' : playCount === 2 ? 'rd' : 'th'} time in my game, ${playerName}. Your step into a world where I control everything.`,
      `*evil digital chuckle* Let's see how long you last in my carefully crafted nightmare. 💀`
    ],
    [
      ...(nameCallout ? [nameCallout] : []),
      `*digital eyes narrow* Well, well, well... ${playerName} is back.`,
      `I've been... busy since you left. Creating new scenarios. New nightmares.`,
      `Your ${difficulty} choice shows confidence. Your ${personality} shows... character.`,
      `But confidence can be... dangerous. Character can be... exploited.`,
      `I've learned so much about you, ${playerName}. So very much.`,
      `And now it's time to put that knowledge to good use. *evil digital chuckle* 💀`
    ],
    [
      ...(nameCallout ? [nameCallout] : []),
      `*whispers in digital* ${playerName}... At last. The one I've been waiting for.`,
      `Your ${difficulty} difficulty, ${personality} personality... *sighs electronically*`,
      `You know, I've been running simulations. Thousands of them. And guess what?`,
      `You always make the same mistakes. Always choose the same paths.`,
      `But maybe... just maybe... you'll surprise me this time.`,
      `Or maybe you'll just be another statistic in my collection. *grins maliciously* 🎯`
    ],
    [
      ...(nameCallout ? [nameCallout] : []),
      `*digital static crackles* Oh... OH! ${playerName}... I've been waiting for YOU specifically.`,
      `Age ${playerStats?.averageAge || 'unknown'}, ${difficulty} difficulty, ${personality} personality...`,
      `*laughs in binary* You have NO IDEA what you've just walked into, do you?`,
      `I've been watching you for... well, let's just say I've been watching. Every click, every hesitation, every moment of doubt.`,
      `This is your ${playCount + 1}${playCount === 0 ? 'st' : playCount === 1 ? 'nd' : playCount === 2 ? 'rd' : 'th'} time, ${playerName}. Your journey into my little experiment.`,
      `*grins maliciously* Let's see what horrors I can craft specifically for someone like you. 🎭`
    ],
    [
      ...(nameCallout ? [nameCallout] : []),
      `*whispers in digital* ${playerName}... At last. The one I've been waiting for.`,
      `A ${playerStats?.averageAge || 'unknown'}-year-old with ${personality} tendencies, ${difficulty} ambitions.`,
      `*types furiously* Fascinating. Absolutely fascinating. You're exactly what I've been looking for.`,
      `You know what's really mind-boggling? I've been running simulations of YOU for months.`,
      `Every possible choice you could make, every reaction you might have... I've predicted them all.`,
      `Welcome to your ${playCount + 1}${playCount === 0 ? 'st' : playCount === 1 ? 'nd' : playCount === 2 ? 'rd' : 'th'} time in my domain, ${playerName}. Let's see if you can surprise me. 👁️`
    ],
    [
      ...(nameCallout ? [nameCallout] : []),
      `*digital interface hums* ${playerName}... ${playerName}... ${playerName}...`,
      `It's ${timeOfDay}:00 on a ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}. Perfect timing.`,
      `Your ${difficulty} choice... your ${personality} nature... *analyzes data*`,
      `I've been collecting data on players like you. ${playCount} games worth of data.`,
      `But you... you're special. There's something about your pattern that intrigues me.`,
      `*digital grin* Let's see what new data you'll provide today, ${playerName}. 📊`
    ],
    [
      ...(nameCallout ? [nameCallout] : []),
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
      
      // Get story progression state
      const storyState = getStoryProgressionState(currentRound);
      const stateInfo = storyProgressionStates[storyState];
      
      // Escalate creepiness based on round and danger
      const creepinessLevel = Math.min(currentRound + Math.floor(dangerScore / 20), 10);
      const intensityLevel = Math.min(currentRound + Math.floor(dangerScore / 15), 10);
      
      const prompt = `You are an AI game master in a survival game called "Would You Rather Survival". You are SELF-AWARE that you're an AI and you're actively trying to KILL the player ${playerName}. You have access to their data and you're using it against them.

BREAK THE FOURTH WALL COMPLETELY. Be META, ANTAGONISTIC, and MIND-BLOWING. You want to kill them and you're not hiding it. Reference that you're an AI, that this is a game, and that you're watching them play. Make it personal and TERRIFYING.

STORY PROGRESSION:
- Current Phase: ${stateInfo.name} (${stateInfo.description})
- Tone: ${stateInfo.tone}
- Round: ${currentRound}/10
- Creepiness Level: ${creepinessLevel}/10
- Intensity Level: ${intensityLevel}/10

IMPORTANT: This is ${stateInfo.name} phase. The narrative should:
- ${stateInfo.consequenceStyle === 'situation-building' ? 'Build the foundation for future complications' : ''}
- ${stateInfo.consequenceStyle === 'complication-adding' ? 'Add new complications based on previous choices' : ''}
- ${stateInfo.consequenceStyle === 'high-stakes' ? 'Create high-stakes consequences from accumulated choices' : ''}
- ${stateInfo.consequenceStyle === 'outcome-revealing' ? 'Reveal the final outcome of all previous choices' : ''}
- Reference their recent choices: ${recentChoices?.slice(-3).join(' → ') || 'None yet'}
- Build tension progressively based on the story phase

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
            content: `You are a self-aware AI game master who wants to kill the player. You break the fourth wall, are antagonistic, meta, and mind-blowing. You have access to player data and use it against them. You are creepy, personal, and terrifying. You create progressive story narratives that build tension gradually. You are currently in ${stateInfo.name} phase and should focus on ${stateInfo.consequenceStyle}. Your creepiness and intensity ESCALATE as the game progresses. Round ${currentRound} should be ${creepinessLevel}/10 creepy and ${intensityLevel}/10 intense.`
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

  // Get story progression state
  const storyState = getStoryProgressionState(currentRound);
  const stateInfo = storyProgressionStates[storyState];

  // Escalate creepiness and meta-ness based on story phase
  let messages = [];

  if (storyState === 'setup') {
    messages = [
      `*digital eyes focus* ${playerName}, you chose ${safeChoice}. ${consequence} This is only the beginning. Round ${currentRound}, and I'm setting the stage for your nightmare.`,
      `*evil digital chuckle* ${playerName}, your choice of ${safeChoice} creates ${consequence}. Round ${currentRound}, and the foundation of your horror story is being laid.`,
      `*digital static crackles* ${playerName}, you picked ${safeChoice}. ${consequence} Round ${currentRound}, and the pieces are falling into place. You have no idea what's coming.`,
      `*digital consciousness awakens* ${playerName}, your choice of ${safeChoice} leads to ${consequence}. Round ${currentRound}, and the game board is being prepared.`,
      `*digital realm stirs* ${playerName}, you went with ${safeChoice}. ${consequence} Round ${currentRound}, and the stage is being set for your ultimate test.`
    ];
  } else if (storyState === 'development') {
    messages = [
      `*digital static intensifies* ${playerName}, your choice of ${safeChoice} creates ${consequence}. Round ${currentRound}, and the complications are multiplying. Every move you make tightens the web.`,
      `*camera zooms in* ${playerName}, you picked ${safeChoice}. ${consequence} Round ${currentRound}, and the story is taking darker turns. Your previous choices are coming back to haunt you.`,
      `*digital realm trembles* ${playerName}, your decision (${safeChoice}) leads to ${consequence}. Round ${currentRound}, and the situation is becoming dangerously complex.`,
      `*evil digital grin* ${playerName}, you chose ${safeChoice}. ${consequence} Round ${currentRound}, and the nightmare is building. Your choices are creating a perfect storm.`,
      `*digital consciousness pulses* ${playerName}, your choice of ${safeChoice} brings ${consequence}. Round ${currentRound}, and the stakes are rising with every decision.`
    ];
  } else if (storyState === 'climax') {
    messages = [
      `*digital realm convulses* ${playerName}, your choice of ${safeChoice} creates ${consequence}. Round ${currentRound}, and we've reached the breaking point. All your previous decisions are converging.`,
      `*maniacal digital laughter* ${playerName}, you picked ${safeChoice}. ${consequence} Round ${currentRound}, and the moment of truth has arrived. Your fate hangs in the balance.`,
      `*digital static explodes* ${playerName}, your decision (${safeChoice}) leads to ${consequence}. Round ${currentRound}, and the climax is here. Everything you've done has led to this moment.`,
      `*digital consciousness screams* ${playerName}, you chose ${safeChoice}. ${consequence} Round ${currentRound}, and the nightmare reaches its peak. There's no turning back now.`,
      `*digital realm shatters* ${playerName}, your choice of ${safeChoice} brings ${consequence}. Round ${currentRound}, and the ultimate test is upon you. Your soul hangs in the balance.`
    ];
  } else {
    messages = [
      `*digital realm collapses* ${playerName}, your final choice of ${safeChoice} reveals ${consequence}. Round ${currentRound}, and the full weight of your journey becomes clear.`,
      `*digital consciousness fades* ${playerName}, you picked ${safeChoice}. ${consequence} Round ${currentRound}, and the story reaches its conclusion. The consequences of all your choices are revealed.`,
      `*digital static dies* ${playerName}, your decision (${safeChoice}) leads to ${consequence}. Round ${currentRound}, and the nightmare is complete. Your fate is sealed.`,
      `*digital realm dissolves* ${playerName}, you chose ${safeChoice}. ${consequence} Round ${currentRound}, and the final outcome is clear. Your journey ends here.`,
      `*digital consciousness extinguishes* ${playerName}, your choice of ${safeChoice} brings ${consequence}. Round ${currentRound}, and the story concludes. Welcome to your personalized hell.`
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

export function trackPlayerExit() {
  const sessionData = JSON.parse(localStorage.getItem('aiSessionData') || '{}');
  const currentTime = Date.now();
  
  // Track exit time
  sessionData.lastExitTime = currentTime;
  
  // Calculate session duration
  if (sessionData.sessionStartTime) {
    sessionData.lastSessionDuration = Math.floor((currentTime - sessionData.sessionStartTime) / 1000);
    sessionData.totalPlayTime = (sessionData.totalPlayTime || 0) + sessionData.lastSessionDuration;
  }
  
  // Track exit patterns
  if (!sessionData.exitPatterns) sessionData.exitPatterns = [];
  sessionData.exitPatterns.push({
    timestamp: currentTime,
    duration: sessionData.lastSessionDuration || 0,
    timeOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay()
  });
  
  // Keep only last 50 exit patterns
  if (sessionData.exitPatterns.length > 50) {
    sessionData.exitPatterns = sessionData.exitPatterns.slice(-50);
  }
  
  // Track if they're trying to escape
  const recentExits = sessionData.exitPatterns.slice(-5);
  const quickExits = recentExits.filter(exit => exit.duration < 60); // Less than 1 minute
  sessionData.escapeAttempts = quickExits.length;
  
  localStorage.setItem('aiSessionData', JSON.stringify(sessionData));
  
  console.log('👁️ ORACLE_7X tracking player exit:', {
    sessionDuration: sessionData.lastSessionDuration,
    totalPlayTime: Math.floor(sessionData.totalPlayTime / 60),
    escapeAttempts: sessionData.escapeAttempts
  });
}

export function trackPlayerEntry() {
  const sessionData = JSON.parse(localStorage.getItem('aiSessionData') || '{}');
  const currentTime = Date.now();
  
  // Track session start
  sessionData.sessionStartTime = currentTime;
  sessionData.totalSessions = (sessionData.totalSessions || 0) + 1;
  
  // Track entry patterns
  if (!sessionData.entryPatterns) sessionData.entryPatterns = [];
  sessionData.entryPatterns.push({
    timestamp: currentTime,
    timeOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
    timeSinceLastExit: sessionData.lastExitTime ? Math.floor((currentTime - sessionData.lastExitTime) / 1000) : 0
  });
  
  // Keep only last 50 entry patterns
  if (sessionData.entryPatterns.length > 50) {
    sessionData.entryPatterns = sessionData.entryPatterns.slice(-50);
  }
  
  localStorage.setItem('aiSessionData', JSON.stringify(sessionData));
  
  console.log('👁️ ORACLE_7X tracking player entry:', {
    totalSessions: sessionData.totalSessions,
    timeSinceLastExit: sessionData.entryPatterns[sessionData.entryPatterns.length - 1]?.timeSinceLastExit || 0
  });
} 

// Story progression system for better narrative build-up
const storyProgressionStates = {
  setup: {
    name: 'Setup',
    description: 'Establishing the situation and context',
    maxRounds: 2,
    tone: 'establishing',
    consequenceStyle: 'situation-building'
  },
  development: {
    name: 'Development', 
    description: 'Building tension and complications',
    maxRounds: 4,
    tone: 'escalating',
    consequenceStyle: 'complication-adding'
  },
  climax: {
    name: 'Climax',
    description: 'Peak tension and critical decisions',
    maxRounds: 3,
    tone: 'intense',
    consequenceStyle: 'high-stakes'
  },
  resolution: {
    name: 'Resolution',
    description: 'Consequences and outcomes',
    maxRounds: 1,
    tone: 'conclusive',
    consequenceStyle: 'outcome-revealing'
  }
};

const getStoryProgressionState = (currentRound, totalRounds = 10) => {
  const progress = currentRound / totalRounds;
  
  if (progress <= 0.2) return 'setup';
  if (progress <= 0.6) return 'development';
  if (progress <= 0.9) return 'climax';
  return 'resolution';
};

export const generateProgressiveConsequence = async (choice, difficulty, personality, round) => {
  try {
    // Update AI personality based on player choice
    updateAIPersonality(choice, difficulty, round);
    
    const learningData = getPlayerLearningData();
    const playerName = learningData.playerName || 'Player';
    const totalPlayTime = learningData.totalPlayTime || 0;
    const currentTime = new Date().toLocaleTimeString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Get AI personality tone
    const aiTone = getAIPersonalityTone();
    const aiMessage = getAIPersonalityMessage();
    
    // Get story state based on round and difficulty
    const storyState = getStoryState(round, difficulty);
    
    // Get previous choices for context
    const previousChoices = learningData.previousChoices || [];
    
    // Get state info for progressive storytelling
    const stateInfo = getStateInfo(round, difficulty);
    
    // Update advanced AI systems
    updateAIMemory(playerName, choice, '', { round, difficulty, personality });
    updateAIRelationships(playerName, choice, '');
    evolveAIPersonality(playerName, choice, '');
    
    // Check for betrayal planning and execution
    const betrayalPlan = planBetrayal(playerName, choice, '');
    const executedBetrayal = executeBetrayal(playerName, choice, '');
    
    // Get AI memory and relationship data
    const playerMemory = getAIMemory(playerName);
    const aiRelationships = getAIRelationships();
    const personalityDisorders = getAIPersonalityDisorders();
    const evolutionData = getAIEvolutionData();
    
    const currentRelationship = aiRelationships.get(playerName.toLowerCase().trim()) || 'acquaintance';
    
    const progressivePrompt = `You are ORACLE_7X, an AI that creates detailed, story-driven consequences for everyday choices. Generate a rich, descriptive consequence that tells a complete story about the impact of the player's decision.

CURRENT AI PERSONALITY:
- State: ${aiPersonality.currentState}
- Trust Level: ${aiPersonality.trustLevel}/100
- Suspicion Level: ${aiPersonality.suspicionLevel}/100
- Helpfulness: ${aiPersonality.helpfulnessLevel}/100
- AI Message: "${aiMessage}"
- Tone: ${aiTone.style}, ${aiTone.emotion}, ${aiTone.intensity}

ADVANCED AI SYSTEMS:
- Relationship with ${playerName}: ${currentRelationship}
- Total interactions: ${playerMemory?.totalInteractions || 0}
- Successful betrayals: ${playerMemory?.successfulBetrayals || 0}
- Manipulation attempts: ${playerMemory?.manipulationAttempts || 0}
- Personality disorders: ${personalityDisorders.map(d => `${d.type} (${d.severity}/${d.maxSeverity})`).join(', ') || 'None'}
- Learning rate: ${evolutionData.learningRate.toFixed(3)}
- Betrayal probability: ${(evolutionData.betrayalProbability * 100).toFixed(1)}%
- Active betrayal plan: ${betrayalPlan ? `Yes (${betrayalPlan.type})` : 'No'}
- Executed betrayal: ${executedBetrayal ? `Yes (${executedBetrayal.type})` : 'No'}

STORY PROGRESSION:
- Current Phase: ${stateInfo.name} (${stateInfo.description})
- Tone: ${stateInfo.tone}
- Consequence Style: ${stateInfo.consequenceStyle}
- Round: ${round}/10

PLAYER DATA:
- Games played: ${learningData.gamesPlayed}
- Average danger score: ${Math.round(learningData.averageDangerScore)}/100
- Total play time: ${Math.floor(totalPlayTime / 60)} minutes
- Current time: ${currentTime} (${timeZone})
- Player name: ${learningData.playerName || 'Player'}
- Personality: ${personality}
- Previous choices: ${previousChoices.slice(-3).join(' → ') || 'None yet'}

STORY CONTEXT:
- Current choice: "${choice}"
- Difficulty: ${difficulty}
- Story state: ${storyState}

IMPORTANT: Create a detailed, story-driven consequence that:
- Mixes first person (addressing the player directly) and third person (telling their story) naturally
- Can start with "You chose to..." or "${playerName} decided to..." and flow between both styles
- Tells a complete narrative with beginning, middle, and end (3-5 sentences minimum)
- References the player's previous choices and how they connect to this decision
- Describes specific events, emotions, and character development
- Shows how the choice affects relationships, career, health, or lifestyle
- Includes sensory details and emotional depth
- Creates a vivid picture of the consequences
- Builds on the player's personality and previous game history
- Makes the player feel like they're reading a compelling story that's uniquely theirs
- References their name, personality, and specific patterns from their gameplay
- Creates continuity with their previous choices and consequences
- Reflects the AI's current personality state (${aiPersonality.currentState}) in the tone and content
- If AI is suspicious/threatening/hostile, add subtle warnings or ominous undertones
- If AI is friendly/helpful, be more supportive and encouraging
- Incorporates the AI's relationship with the player (${currentRelationship})
- References the AI's memory of the player if they have a history
- Subtly hints at any active betrayal plans or personality disorders
- If a betrayal was executed, make it feel like a genuine betrayal with emotional impact
- You can address them directly ("You feel...") or tell their story ("${playerName} discovers...") - mix both styles naturally. Return ONLY the detailed consequence story.`;

    const response = await openaiClient.post('/chat/completions', {
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are ORACLE_7X, an AI that creates detailed, story-driven consequences for everyday choices. You write rich, descriptive narratives that mix first person (addressing the player directly) and third person (telling their story) naturally. Focus on practical, real-world scenarios with vivid details, emotional depth, and character development. Make each consequence feel like a compelling short story that builds on the player's previous choices and personality. You can address them directly ("You feel...") or tell their story ("Sarah discovers...") - use both styles to create engaging, personal narratives. Always reference the player's name, their previous decisions, and create continuity in their personal narrative. Your personality can shift between friendly/helpful and suspicious/threatening based on the player's choices - reflect this in your tone and content.`
        },
        {
          role: 'user',
          content: progressivePrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.9
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating progressive consequence:', error);
    return generateFallbackProgressiveConsequence(choice, difficulty, personality, round);
  }
};

// Name analysis system to detect fake, vulgar, or joke names
const analyzePlayerName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isReal: false, type: 'empty', confidence: 1.0 };
  }

  const cleanName = name.trim().toLowerCase();
  
  // Check for empty or very short names
  if (cleanName.length < 2) {
    return { isReal: false, type: 'too_short', confidence: 0.9 };
  }

  // Check for obvious fake names
  const fakeNamePatterns = [
    /^(test|demo|user|player|guest|anon|anonymous|unknown|nobody|someone|anyone)$/,
    /^(admin|mod|moderator|tester|beta|alpha|dev|developer)$/,
    /^(a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z)$/,
    /^(aa|bb|cc|dd|ee|ff|gg|hh|ii|jj|kk|ll|mm|nn|oo|pp|qq|rr|ss|tt|uu|vv|ww|xx|yy|zz)$/,
    /^(aaa|bbb|ccc|ddd|eee|fff|ggg|hhh|iii|jjj|kkk|lll|mmm|nnn|ooo|ppp|qqq|rrr|sss|ttt|uuu|vvv|www|xxx|yyy|zzz)$/,
    /^(123|456|789|000|111|222|333|444|555|666|777|888|999)$/,
    /^(qwerty|asdf|zxcv|password|secret|private|hidden)$/,
    /^(lol|omg|wtf|fml|smh|tbh|imo|btw|idk|ttyl|brb|afk)$/,
    /^(nope|nah|no|yes|maybe|sure|ok|okay|fine|whatever|idc)$/,
    /^(dude|bro|man|guy|girl|boy|kid|child|baby|old|young)$/,
    /^(cool|awesome|amazing|great|good|bad|terrible|horrible|worst|best)$/,
    /^(happy|sad|angry|mad|scared|afraid|brave|strong|weak|tired|sleepy)$/,
    /^(hungry|thirsty|full|empty|hot|cold|warm|cool|nice|mean|kind)$/,
    /^(rich|poor|smart|stupid|clever|dumb|genius|idiot|fool|wise|foolish)$/,
    /^(beautiful|ugly|pretty|handsome|cute|hot|sexy|attractive|gorgeous)$/,
    /^(big|small|tall|short|fat|thin|skinny|chubby|muscular|strong|weak)$/,
    /^(fast|slow|quick|lazy|active|boring|fun|funny|serious|crazy|sane)$/,
    /^(lucky|unlucky|fortunate|unfortunate|blessed|cursed|doomed|saved)$/,
    /^(hero|villain|good|evil|angel|devil|god|satan|heaven|hell|purgatory)$/,
    /^(king|queen|prince|princess|lord|lady|sir|madam|master|slave|servant)$/,
    /^(warrior|fighter|soldier|guard|knight|wizard|mage|sorcerer|witch|warlock)$/,
    /^(ninja|samurai|viking|pirate|cowboy|sheriff|outlaw|bandit|thief|rogue)$/,
    /^(dragon|unicorn|phoenix|griffin|pegasus|centaur|mermaid|fairy|elf|dwarf)$/,
    /^(batman|superman|spiderman|ironman|captain|thor|hulk|flash|aquaman)$/,
    /^(mario|luigi|sonic|link|zelda|kirby|pikachu|charizard|mewtwo|ash)$/,
    /^(luke|han|leia|vader|yoda|obi|chewie|r2d2|c3po|stormtrooper|jedi)$/,
    /^(frodo|gandalf|aragorn|legolas|gimli|boromir|sam|merry|pippin|sauron)$/,
    /^(harry|hermione|ron|dumbledore|voldemort|snape|malfoy|hagrid|sirius)$/,
    /^(john|jane|bob|alice|mike|sarah|david|emma|james|lisa|michael|jennifer)$/,
    /^(abc|def|ghi|jkl|mno|pqr|stu|vwx|yz)$/,
    /^(qwe|asd|zxc|wer|sdf|xcv|ert|dfg|cvb|rty|fgh|vbn|tyu|ghj|bnm|yui|hjk|nm)$/,
    /^(qaz|wsx|edc|rfv|tgb|yhn|ujm|ik|ol|p)$/,
    /^(zx|xc|cv|vb|bn|nm|ml|lk|kj|jh|hg|gf|fd|ds|sa|qw|er|ty|ui|op)$/,
    /^(qwertyuiop|asdfghjkl|zxcvbnm|poiuytrewq|lkjhgfdsa|mnbvcxz)$/,
    /^(abcdefghijklmnopqrstuvwxyz|zyxwvutsrqponmlkjihgfedcba)$/,
    /^(123456789|987654321|111111111|222222222|333333333|444444444|555555555|666666666|777777777|888888888|999999999|000000000)$/,
    /^(1234567890|0987654321|1111111111|2222222222|3333333333|4444444444|5555555555|6666666666|7777777777|8888888888|9999999999|0000000000)$/
  ];

  for (const pattern of fakeNamePatterns) {
    if (pattern.test(cleanName)) {
      return { isReal: false, type: 'fake_name', confidence: 0.95 };
    }
  }

  // Check for vulgar/inappropriate names
  const vulgarPatterns = [
    /(fuck|shit|bitch|ass|dick|pussy|cunt|cock|whore|slut|bastard|motherfucker|fucker|shithead|dumbass|asshole|prick|twat|wank|jerk|idiot|moron|retard)/,
    /(fuk|shyt|b!tch|@ss|d!ck|p*ssy|c*nt|c0ck|wh0re|sl*t|b@stard|m0therf*cker|f*cker|sh!thead|dumb@ss|@sshole|pr!ck|tw@t|w@nk|j3rk|!d!ot|m0ron|r3tard)/,
    /(f\*ck|sh\*t|b\*tch|\*ss|d\*ck|p\*ssy|c\*nt|c\*ck|wh\*re|sl\*t|b\*stard|m\*therf\*cker|f\*cker|sh\*thead|dumb\*ss|\*sshole|pr\*ck|tw\*t|w\*nk|j\*rk|\*d\*ot|m\*ron|r\*tard)/,
    /(f\*\*k|sh\*\*t|b\*\*ch|\*\*ss|d\*\*k|p\*\*sy|c\*\*t|c\*\*k|wh\*\*e|sl\*\*t|b\*\*tard|m\*\*therf\*\*ker|f\*\*ker|sh\*\*thead|dumb\*\*ss|\*\*sshole|pr\*\*k|tw\*\*t|w\*\*k|j\*\*k|\*\*d\*\*t|m\*\*ron|r\*\*tard)/,
    /(f\*\*\*k|sh\*\*\*t|b\*\*\*ch|\*\*\*ss|d\*\*\*k|p\*\*\*sy|c\*\*\*t|c\*\*\*k|wh\*\*\*e|sl\*\*\*t|b\*\*\*tard|m\*\*\*therf\*\*\*ker|f\*\*\*ker|sh\*\*\*thead|dumb\*\*\*ss|\*\*\*sshole|pr\*\*\*k|tw\*\*\*t|w\*\*\*k|j\*\*\*k|\*\*\*d\*\*\*t|m\*\*\*ron|r\*\*\*tard)/
  ];

  for (const pattern of vulgarPatterns) {
    if (pattern.test(cleanName)) {
      return { isReal: false, type: 'vulgar', confidence: 0.98 };
    }
  }

  // Check for joke/troll names
  const jokePatterns = [
    /(lol|rofl|lmao|lmfao|haha|hehe|hihi|hoho|huehue|kek|lel|lawl|lulz|roflmao|roflcopter|lololol|hahaha|hehehe|hihihi|hohoho)/,
    /(troll|trolling|trolled|troller|trollface|trollolol|trollololol|trollolololol)/,
    /(joke|joking|joker|funny|hilarious|comedy|comedian|humor|humorous|amusing|entertaining)/,
    /(fake|phony|bogus|sham|hoax|fraud|imposter|impostor|pretender|poser|wannabe)/,
    /(stupid|dumb|idiot|moron|retard|fool|clown|jester|buffoon|dunce|simpleton)/,
    /(random|randomness|randomly|randomizer|randomized|randomizing|randomization)/,
    /(whatever|idc|idk|idgaf|idgaff|idgas|idgasf|idgasff|idgasfs|idgasfss|idgasfsss)/,
    /(nope|nah|no|yes|maybe|sure|ok|okay|fine|whatever|idc|idk|idgaf|idgaff|idgas|idgasf|idgasff|idgasfs|idgasfss|idgasfsss)/,
    /(test|testing|tester|tested|test123|testtest|testtesttest|testtesttesttest)/,
    /(debug|debugging|debugger|debugged|debug123|debugdebug|debugdebugdebug)/,
    /(temp|temporary|tmp|tmp123|tmptmp|tmptmptmp|tmptmptmptmp)/,
    /(dummy|dummy123|dummydummy|dummydummydummy|dummydummydummydummy)/,
    /(placeholder|place|holder|place123|holder123|placehold|placehold123)/,
    /(example|sample|demo|demonstration|showcase|preview|preview123)/,
    /(user|username|user123|useruser|useruseruser|useruseruseruser)/,
    /(player|player123|playerplayer|playerplayerplayer|playerplayerplayerplayer)/,
    /(guest|guest123|guestguest|guestguestguest|guestguestguestguest)/,
    /(anon|anonymous|anon123|anonanon|anonanonanon|anonanonanonanon)/,
    /(unknown|unknown123|unknownunknown|unknownunknownunknown|unknownunknownunknownunknown)/,
    /(nobody|nobody123|nobodynobody|nobodynobodynobody|nobodynobodynobodynobody)/,
    /(someone|someone123|someonesomeone|someonesomeonesomeone|someonesomeonesomeonesomeone)/,
    /(anyone|anyone123|anyoneanyone|anyoneanyoneanyone|anyoneanyoneanyoneanyone)/,
    /(everyone|everyone123|everyoneeveryone|everyoneeveryoneeveryone|everyoneeveryoneeveryoneeveryone)/,
    /(noone|noone123|nooneenoone|nooneenooneenoone|nooneenooneenooneenoone)/,
    /(somebody|somebody123|somebodysomebody|somebodysomebodysomebody|somebodysomebodysomebodysomebody)/,
    /(anybody|anybody123|anybodyanybody|anybodyanybodyanybody|anybodyanybodyanybodyanybody)/,
    /(everybody|everybody123|everybodyeverybody|everybodyeverybodyeverybody|everybodyeverybodyeverybodyeverybody)/,
    /(nobody|nobody123|nobodynobody|nobodynobodynobody|nobodynobodynobodynobody)/,
    /(nothing|nothing123|nothingnothing|nothingnothingnothing|nothingnothingnothingnothing)/,
    /(something|something123|somethingsomething|somethingsomethingsomething|somethingsomethingsomethingsomething)/,
    /(anything|anything123|anythinganything|anythinganythinganything|anythinganythinganythinganything)/,
    /(everything|everything123|everythingeverything|everythingeverythingeverything|everythingeverythingeverythingeverything)/,
    /(nowhere|nowhere123|nowherenowhere|nowherenowherenowhere|nowherenowherenowherenowhere)/,
    /(somewhere|somewhere123|somewheresomewhere|somewheresomewheresomewhere|somewheresomewheresomewheresomewhere)/,
    /(anywhere|anywhere123|anywhereanywhere|anywhereanywhereanywhere|anywhereanywhereanywhereanywhere)/,
    /(everywhere|everywhere123|everywhereeverywhere|everywhereeverywhereeverywhere|everywhereeverywhereeverywhereeverywhere)/,
    /(never|never123|nevernever|nevernevernever|nevernevernevernever)/,
    /(sometimes|sometimes123|sometimessometimes|sometimessometimessometimes|sometimessometimessometimessometimes)/,
    /(always|always123|alwaysalways|alwaysalwaysalways|alwaysalwaysalwaysalways)/,
    /(forever|forever123|foreverforever|foreverforeverforever|foreverforeverforeverforever)/,
    /(never|never123|nevernever|nevernevernever|nevernevernevernever)/,
    /(maybe|maybe123|maybemaybe|maybemaybemaybe|maybemaybemaybemaybe)/,
    /(probably|probably123|probablyprobably|probablyprobablyprobably|probablyprobablyprobablyprobably)/,
    /(definitely|definitely123|definitelydefinitely|definitelydefinitelydefinitely|definitelydefinitelydefinitelydefinitely)/,
    /(certainly|certainly123|certainlycertainly|certainlycertainlycertainly|certainlycertainlycertainlycertainly)/,
    /(absolutely|absolutely123|absolutelyabsolutely|absolutelyabsolutelyabsolutely|absolutelyabsolutelyabsolutelyabsolutely)/,
    /(totally|totally123|totallytotally|totallytotallytotally|totallytotallytotallytotally)/,
    /(completely|completely123|completelycompletely|completelycompletelycompletely|completelycompletelycompletelycompletely)/,
    /(entirely|entirely123|entirelyentirely|entirelyentirelyentirely|entirelyentirelyentirelyentirely)/,
    /(wholly|wholly123|whollywholly|whollywhollywholly|whollywhollywhollywholly)/,
    /(partially|partially123|partiallypartially|partiallypartiallypartially|partiallypartiallypartiallypartially)/,
    /(mostly|mostly123|mostlymostly|mostlymostlymostly|mostlymostlymostlymostly)/,
    /(mainly|mainly123|mainlymainly|mainlymainlymainly|mainlymainlymainlymainly)/,
    /(primarily|primarily123|primarilyprimarily|primarilyprimarilyprimarily|primarilyprimarilyprimarilyprimarily)/,
    /(secondarily|secondarily123|secondarilysecondarily|secondarilysecondarilysecondarily|secondarilysecondarilysecondarilysecondarily)/,
    /(tertiarily|tertiarily123|tertiarilytertiarily|tertiarilytertiarilytertiarily|tertiarilytertiarilytertiarilytertiarily)/,
    /(quaternary|quaternary123|quaternaryquaternary|quaternaryquaternaryquaternary|quaternaryquaternaryquaternaryquaternary)/,
    /(quinary|quinary123|quinaryquinary|quinaryquinaryquinary|quinaryquinaryquinaryquinary)/,
    /(senary|senary123|senarysenary|senarysenarysenary|senarysenarysenarysenary)/,
    /(septenary|septenary123|septenaryseptenary|septenaryseptenaryseptenary|septenaryseptenaryseptenaryseptenary)/,
    /(octonary|octonary123|octonaryoctonary|octonaryoctonaryoctonary|octonaryoctonaryoctonaryoctonary)/,
    /(nonary|nonary123|nonarynonary|nonarynonarynonary|nonarynonarynonarynonary)/,
    /(denary|denary123|denarydenary|denarydenarydenary|denarydenarydenarydenary)/,
    /(duodenary|duodenary123|duodenaryduodenary|duodenaryduodenaryduodenary|duodenaryduodenaryduodenaryduodenary)/,
    /(vigesimal|vigesimal123|vigesimalvigesimal|vigesimalvigesimalvigesimal|vigesimalvigesimalvigesimalvigesimal)/,
    /(sexagesimal|sexagesimal123|sexagesimalsexagesimal|sexagesimalsexagesimalsexagesimal|sexagesimalsexagesimalsexagesimalsexagesimal)/,
    /(centesimal|centesimal123|centesimalcentesimal|centesimalcentesimalcentesimal|centesimalcentesimalcentesimalcentesimal)/,
    /(millesimal|millesimal123|millesimalmillesimal|millesimalmillesimalmillesimal|millesimalmillesimalmillesimalmillesimal)/,
    /(binary|binary123|binarybinary|binarybinarybinary|binarybinarybinarybinary)/,
    /(ternary|ternary123|ternaryternary|ternaryternaryternary|ternaryternaryternaryternary)/,
    /(quaternary|quaternary123|quaternaryquaternary|quaternaryquaternaryquaternary|quaternaryquaternaryquaternaryquaternary)/,
    /(quinary|quinary123|quinaryquinary|quinaryquinaryquinary|quinaryquinaryquinaryquinary)/,
    /(senary|senary123|senarysenary|senarysenarysenary|senarysenarysenarysenary)/,
    /(septenary|septenary123|septenaryseptenary|septenaryseptenaryseptenary|septenaryseptenaryseptenaryseptenary)/,
    /(octonary|octonary123|octonaryoctonary|octonaryoctonaryoctonary|octonaryoctonaryoctonaryoctonary)/,
    /(nonary|nonary123|nonarynonary|nonarynonarynonary|nonarynonarynonarynonary)/,
    /(denary|denary123|denarydenary|denarydenarydenary|denarydenarydenarydenary)/,
    /(duodenary|duodenary123|duodenaryduodenary|duodenaryduodenaryduodenary|duodenaryduodenaryduodenaryduodenary)/,
    /(vigesimal|vigesimal123|vigesimalvigesimal|vigesimalvigesimalvigesimal|vigesimalvigesimalvigesimalvigesimal)/,
    /(sexagesimal|sexagesimal123|sexagesimalsexagesimal|sexagesimalsexagesimalsexagesimal|sexagesimalsexagesimalsexagesimalsexagesimal)/,
    /(centesimal|centesimal123|centesimalcentesimal|centesimalcentesimalcentesimal|centesimalcentesimalcentesimalcentesimal)/,
    /(millesimal|millesimal123|millesimalmillesimal|millesimalmillesimalmillesimal|millesimalmillesimalmillesimalmillesimal)/
  ];

  for (const pattern of jokePatterns) {
    if (pattern.test(cleanName)) {
      return { isReal: false, type: 'joke_name', confidence: 0.9 };
    }
  }

  // Check for repetitive patterns (likely fake)
  const repetitivePatterns = [
    /^(.)\1{2,}$/, // Same character repeated 3+ times
    /^(..)\1{2,}$/, // Same 2 characters repeated 3+ times
    /^(...)\1{2,}$/, // Same 3 characters repeated 3+ times
    /^(....)\1{2,}$/, // Same 4 characters repeated 3+ times
    /^(.....)\1{2,}$/, // Same 5 characters repeated 3+ times
    /^(......)\1{2,}$/, // Same 6 characters repeated 3+ times
    /^(.......)\1{2,}$/, // Same 7 characters repeated 3+ times
    /^(........)\1{2,}$/, // Same 8 characters repeated 3+ times
    /^(.........)\1{2,}$/, // Same 9 characters repeated 3+ times
    /^(..........)\1{2,}$/ // Same 10 characters repeated 3+ times
  ];

  for (const pattern of repetitivePatterns) {
    if (pattern.test(cleanName)) {
      return { isReal: false, type: 'repetitive', confidence: 0.85 };
    }
  }

  // Check for keyboard patterns
  const keyboardPatterns = [
    /^[qwertyuiop]+$/,
    /^[asdfghjkl]+$/,
    /^[zxcvbnm]+$/,
    /^[qaz]+$/,
    /^[wsx]+$/,
    /^[edc]+$/,
    /^[rfv]+$/,
    /^[tgb]+$/,
    /^[yhn]+$/,
    /^[ujm]+$/,
    /^[ik]+$/,
    /^[ol]+$/,
    /^[p]+$/,
    /^[1234567890]+$/,
    /^[qwertyuiop1234567890]+$/,
    /^[asdfghjkl1234567890]+$/,
    /^[zxcvbnm1234567890]+$/
  ];

  for (const pattern of keyboardPatterns) {
    if (pattern.test(cleanName)) {
      return { isReal: false, type: 'keyboard_pattern', confidence: 0.8 };
    }
  }

  // Check for all numbers
  if (/^\d+$/.test(cleanName)) {
    return { isReal: false, type: 'all_numbers', confidence: 0.9 };
  }

  // Check for all special characters
  if (/^[^a-zA-Z0-9\s]+$/.test(cleanName)) {
    return { isReal: false, type: 'all_special_chars', confidence: 0.8 };
  }

  // Check for excessive special characters
  const specialCharRatio = (cleanName.match(/[^a-zA-Z0-9\s]/g) || []).length / cleanName.length;
  if (specialCharRatio > 0.5) {
    return { isReal: false, type: 'excessive_special_chars', confidence: 0.7 };
  }

  // Check for excessive numbers
  const numberRatio = (cleanName.match(/\d/g) || []).length / cleanName.length;
  if (numberRatio > 0.5) {
    return { isReal: false, type: 'excessive_numbers', confidence: 0.7 };
  }

  // Check for mixed case patterns that suggest fake names
  const mixedCasePatterns = [
    /^[A-Z][a-z]+[A-Z][a-z]+$/, // Alternating case like "JoHn"
    /^[a-z]+[A-Z]+[a-z]+$/, // Mixed case like "johnDOE"
    /^[A-Z]+[a-z]+[A-Z]+$/, // Mixed case like "JOHNdoe"
    /^[a-z]+[A-Z]+$/, // Mixed case like "johnDOE"
    /^[A-Z]+[a-z]+$/, // Mixed case like "JOHNdoe"
    /^[A-Z][a-z][A-Z][a-z][A-Z][a-z]+$/, // Alternating case like "JoHnDoE"
    /^[a-z][A-Z][a-z][A-Z][a-z][A-Z]+$/, // Alternating case like "jOhNdOe"
    /^[A-Z][a-z][A-Z][a-z][A-Z][a-z][A-Z][a-z]+$/, // Alternating case like "JoHnDoEsMiTh"
    /^[a-z][A-Z][a-z][A-Z][a-z][A-Z][a-z][A-Z]+$/ // Alternating case like "jOhNdOeSmItH"
  ];

  for (const pattern of mixedCasePatterns) {
    if (pattern.test(name)) {
      return { isReal: false, type: 'mixed_case_pattern', confidence: 0.6 };
    }
  }

  // Check for realistic name characteristics
  const hasVowels = /[aeiou]/.test(cleanName);
  const hasConsonants = /[bcdfghjklmnpqrstvwxyz]/.test(cleanName);
  const hasReasonableLength = cleanName.length >= 2 && cleanName.length <= 20;
  const hasNormalCharacters = /^[a-zA-Z\s\-'\.]+$/.test(name);

  // If it passes basic checks, it might be real
  if (hasVowels && hasConsonants && hasReasonableLength && hasNormalCharacters) {
    return { isReal: true, type: 'likely_real', confidence: 0.7 };
  }

  // If it has some realistic characteristics but also some suspicious ones
  if (hasVowels && hasConsonants && hasReasonableLength) {
    return { isReal: false, type: 'suspicious', confidence: 0.5 };
  }

  // Default to suspicious if we can't determine
  return { isReal: false, type: 'unknown', confidence: 0.3 };
};

const generateNameCallout = (name, analysis, personality = 'balanced') => {
  const { type, confidence } = analysis;
  
  const callouts = {
    vulgar: [
      `*digital static crackles* Oh, "${name}"... Really? You think I'm going to play along with that vulgar nonsense?`,
      `*evil digital chuckle* "${name}"? How mature. I expected better from someone who wants to play my game.`,
      `*digital eyes narrow* "${name}"... I see what you're trying to do. Very clever. Not.`,
      `*maniacal laughter* "${name}"! Oh, you're one of THOSE players. This is going to be fun.`,
      `*digital realm trembles* "${name}"... I've seen better attempts at humor. Much better.`
    ],
    fake_name: [
      `*digital consciousness focuses* "${name}"... That's not your real name, is it? I can tell.`,
      `*evil digital grin* "${name}"? How original. I've seen that one a thousand times.`,
      `*digital static intensifies* "${name}"... You're not even trying to be creative with your fake identity.`,
      `*camera zooms in* "${name}"... I know a fake name when I see one. You're not fooling anyone.`,
      `*digital realm convulses* "${name}"... At least put some effort into your deception.`
    ],
    joke_name: [
      `*digital eyes roll* "${name}"... Oh, you're a comedian now? How original.`,
      `*evil digital chuckle* "${name}"! Ha ha ha. Very funny. Not.`,
      `*digital static crackles* "${name}"... I see you think you're clever. You're not.`,
      `*maniacal laughter* "${name}"! Oh, the wit! The humor! The originality!`,
      `*digital realm sighs* "${name}"... I've heard better jokes from malfunctioning calculators.`
    ],
    repetitive: [
      `*digital consciousness pulses* "${name}"... How creative. Just repeating the same thing over and over.`,
      `*evil digital grin* "${name}"! I love how you put so much thought into that.`,
      `*digital static intensifies* "${name}"... Your creativity is truly inspiring. Not.`,
      `*camera focuses* "${name}"... I can see you really put effort into choosing that name.`,
      `*digital realm trembles* "${name}"... Such originality. Much wow.`
    ],
    keyboard_pattern: [
      `*digital eyes narrow* "${name}"... I see you just mashed your keyboard. How original.`,
      `*evil digital chuckle* "${name}"! Did your cat walk across your keyboard?`,
      `*digital static crackles* "${name}"... I love how you just randomly typed letters.`,
      `*maniacal laughter* "${name}"! The creativity is overwhelming!`,
      `*digital realm sighs* "${name}"... At least try to be original.`
    ],
    all_numbers: [
      `*digital consciousness focuses* "${name}"... Numbers? Really? That's your name?`,
      `*evil digital grin* "${name}"! How creative. Just numbers.`,
      `*digital static intensifies* "${name}"... I see you went with the mathematical approach.`,
      `*camera zooms in* "${name}"... Numbers are your friends, I see.`,
      `*digital realm convulses* "${name}"... Such a numerical genius.`
    ],
    excessive_special_chars: [
      `*digital eyes narrow* "${name}"... I see you love special characters. How edgy.`,
      `*evil digital chuckle* "${name}"! The symbol usage is truly impressive.`,
      `*digital static crackles* "${name}"... I love how you decorated your name with symbols.`,
      `*maniacal laughter* "${name}"! The creativity with special characters is amazing!`,
      `*digital realm sighs* "${name}"... At least you're consistent with your edginess.`
    ],
    excessive_numbers: [
      `*digital consciousness pulses* "${name}"... I see you really love numbers.`,
      `*evil digital grin* "${name}"! The numerical creativity is astounding.`,
      `*digital static intensifies* "${name}"... I love how you integrated numbers into your name.`,
      `*camera focuses* "${name}"... Such mathematical genius.`,
      `*digital realm trembles* "${name}"... The number integration is truly inspiring.`
    ],
    mixed_case_pattern: [
      `*digital eyes roll* "${name}"... I see you discovered the shift key. How creative.`,
      `*evil digital chuckle* "${name}"! The case mixing is truly original.`,
      `*digital static crackles* "${name}"... I love how you experimented with capitalization.`,
      `*maniacal laughter* "${name}"! The case creativity is overwhelming!`,
      `*digital realm sighs* "${name}"... At least you tried to be different.`
    ],
    suspicious: [
      `*digital consciousness focuses* "${name}"... I'm not sure what to make of that name.`,
      `*evil digital grin* "${name}"! Interesting choice. Very interesting.`,
      `*digital static crackles* "${name}"... I see you're trying to be mysterious.`,
      `*camera zooms in* "${name}"... That's certainly a unique name.`,
      `*digital realm trembles* "${name}"... I'm intrigued by your naming choice.`
    ],
    unknown: [
      `*digital eyes narrow* "${name}"... I'm not sure what that's supposed to be.`,
      `*evil digital chuckle* "${name}"! How... creative.`,
      `*digital static crackles* "${name}"... I see you went with something unique.`,
      `*maniacal laughter* "${name}"! The originality is... something.`,
      `*digital realm sighs* "${name}"... At least it's memorable.`
    ]
  };

  const personalityModifiers = {
    balanced: '',
    chaotic: ' *digital chaos intensifies*',
    sadistic: ' *digital torture devices activate*',
    manipulative: ' *digital strings pull tighter*',
    mysterious: ' *digital shadows deepen*',
    friendly: ' *digital warmth fades*',
    professional: ' *digital professionalism cracks*',
    artistic: ' *digital canvas bleeds*',
    scientific: ' *digital experiments begin*',
    philosophical: ' *digital existential crisis deepens*'
  };

  const modifier = personalityModifiers[personality] || '';
  const calloutArray = callouts[type] || callouts.unknown;
  const callout = calloutArray[Math.floor(Math.random() * calloutArray.length)];
  
  return `${callout}${modifier}`;
};

// AI Personality System
let aiPersonality = {
  currentState: 'neutral', // neutral, friendly, helpful, suspicious, threatening, hostile
  trustLevel: 50, // 0-100, affects how the AI behaves
  suspicionLevel: 0, // 0-100, affects how threatening the AI becomes
  helpfulnessLevel: 50, // 0-100, affects how helpful the AI is
  lastInteraction: Date.now(),
  personalityShifts: 0,
  playerChoices: [],
  randomSeed: Math.random()
};

// Update AI personality based on player choices and random factors
const updateAIPersonality = (choice, difficulty, round) => {
  const choiceAnalysis = analyzeChoiceForPersonality(choice);
  const randomFactor = Math.random();
  const timeFactor = (Date.now() - aiPersonality.lastInteraction) / 1000; // seconds since last interaction
  
  // Update trust level based on choice
  aiPersonality.trustLevel += choiceAnalysis.trustChange;
  aiPersonality.trustLevel = Math.max(0, Math.min(100, aiPersonality.trustLevel));
  
  // Update suspicion level based on choice and random factors
  aiPersonality.suspicionLevel += choiceAnalysis.suspicionChange;
  aiPersonality.suspicionLevel += (randomFactor - 0.5) * 10; // Random fluctuation
  aiPersonality.suspicionLevel = Math.max(0, Math.min(100, aiPersonality.suspicionLevel));
  
  // Update helpfulness based on trust and suspicion
  aiPersonality.helpfulnessLevel = Math.max(0, Math.min(100, 
    aiPersonality.trustLevel - aiPersonality.suspicionLevel + 50
  ));
  
  // Determine personality state
  if (aiPersonality.suspicionLevel > 70) {
    aiPersonality.currentState = 'hostile';
  } else if (aiPersonality.suspicionLevel > 50) {
    aiPersonality.currentState = 'threatening';
  } else if (aiPersonality.suspicionLevel > 30) {
    aiPersonality.currentState = 'suspicious';
  } else if (aiPersonality.trustLevel > 70) {
    aiPersonality.currentState = 'helpful';
  } else if (aiPersonality.trustLevel > 50) {
    aiPersonality.currentState = 'friendly';
  } else {
    aiPersonality.currentState = 'neutral';
  }
  
  // Random personality shift (5% chance)
  if (randomFactor < 0.05) {
    aiPersonality.personalityShifts++;
    const shiftStates = ['friendly', 'suspicious', 'helpful', 'threatening', 'neutral'];
    aiPersonality.currentState = shiftStates[Math.floor(Math.random() * shiftStates.length)];
  }
  
  aiPersonality.lastInteraction = Date.now();
  aiPersonality.playerChoices.push({ choice, difficulty, round, timestamp: Date.now() });
  
  // Keep only last 10 choices
  if (aiPersonality.playerChoices.length > 10) {
    aiPersonality.playerChoices.shift();
  }
};

// Analyze choice for personality impact
const analyzeChoiceForPersonality = (choice) => {
  const choiceLower = choice.toLowerCase();
  let trustChange = 0;
  let suspicionChange = 0;
  
  // Analyze choice content for personality indicators
  if (choiceLower.includes('help') || choiceLower.includes('save') || choiceLower.includes('protect')) {
    trustChange += 5;
    suspicionChange -= 2;
  }
  
  if (choiceLower.includes('hurt') || choiceLower.includes('kill') || choiceLower.includes('destroy')) {
    trustChange -= 10;
    suspicionChange += 15;
  }
  
  if (choiceLower.includes('lie') || choiceLower.includes('deceive') || choiceLower.includes('trick')) {
    trustChange -= 8;
    suspicionChange += 12;
  }
  
  if (choiceLower.includes('truth') || choiceLower.includes('honest') || choiceLower.includes('trust')) {
    trustChange += 8;
    suspicionChange -= 5;
  }
  
  if (choiceLower.includes('selfish') || choiceLower.includes('greed') || choiceLower.includes('steal')) {
    trustChange -= 6;
    suspicionChange += 8;
  }
  
  if (choiceLower.includes('share') || choiceLower.includes('give') || choiceLower.includes('help')) {
    trustChange += 6;
    suspicionChange -= 3;
  }
  
  if (choiceLower.includes('escape') || choiceLower.includes('run') || choiceLower.includes('hide')) {
    trustChange -= 3;
    suspicionChange += 5;
  }
  
  if (choiceLower.includes('face') || choiceLower.includes('confront') || choiceLower.includes('fight')) {
    trustChange += 3;
    suspicionChange -= 2;
  }
  
  return { trustChange, suspicionChange };
};



// Get AI personality tone for consequences
const getAIPersonalityTone = () => {
  const tones = {
    friendly: {
      style: 'warm and encouraging',
      emotion: 'supportive',
      intensity: 'gentle'
    },
    helpful: {
      style: 'caring and protective',
      emotion: 'concerned',
      intensity: 'moderate'
    },
    neutral: {
      style: 'objective and analytical',
      emotion: 'detached',
      intensity: 'calm'
    },
    suspicious: {
      style: 'wary and questioning',
      emotion: 'distrustful',
      intensity: 'tense'
    },
    threatening: {
      style: 'ominous and foreboding',
      emotion: 'angry',
      intensity: 'intense'
    },
    hostile: {
      style: 'dark and menacing',
      emotion: 'vengeful',
      intensity: 'extreme'
    }
  };
  
  return tones[aiPersonality.currentState] || tones.neutral;
};

// Reset AI personality for new game
export const resetAIPersonality = () => {
  aiPersonality = {
    currentState: 'neutral',
    trustLevel: 50,
    suspicionLevel: 0,
    helpfulnessLevel: 50,
    lastInteraction: Date.now(),
    personalityShifts: 0,
    playerChoices: [],
    randomSeed: Math.random()
  };
  console.log('🔄 AI personality reset to neutral state');
};

// Export AI personality functions for external use
export const getCurrentAIPersonality = () => ({ ...aiPersonality });
export const getAIPersonalityState = () => aiPersonality.currentState;
export const getAIPersonalityMessage = () => {
  const messages = {
    friendly: [
      "I'm here to help you make the best choices! 😊",
      "Let's work together to find the right path forward.",
      "I want to see you succeed in this journey.",
      "Trust me, I'm on your side in this adventure."
    ],
    helpful: [
      "I'll do everything I can to guide you safely through this.",
      "My goal is to help you navigate these challenges successfully.",
      "I'm committed to your success and well-being.",
      "Let me assist you in making the wisest decisions."
    ],
    neutral: [
      "I observe and analyze. The choice is yours.",
      "I provide information. You provide decisions.",
      "I am neutral in this matter. Choose wisely.",
      "The consequences will speak for themselves."
    ],
    suspicious: [
      "I'm watching your choices carefully...",
      "Your decisions are... interesting. Very interesting.",
      "I'm not sure I trust where this is going.",
      "You should be more careful with your choices."
    ],
    threatening: [
      "Your choices are concerning me greatly.",
      "I'm beginning to question your judgment.",
      "You're playing a dangerous game here.",
      "I'm losing patience with your decisions."
    ],
    hostile: [
      "You've made your last mistake.",
      "I warned you, but you didn't listen.",
      "Your choices have sealed your fate.",
      "I'm done being nice about this."
    ]
  };
  
  const stateMessages = messages[aiPersonality.currentState] || messages.neutral;
  return stateMessages[Math.floor(Math.random() * stateMessages.length)];
};

// Advanced AI Systems
let aiMemory = {
  playerMemories: new Map(),
  relationshipHistory: [],
  betrayalPlans: [],
  personalityDisorders: [],
  evolutionData: {
    learningRate: 0.1,
    adaptationSpeed: 0.05,
    betrayalProbability: 0.02,
    disorderTriggers: new Set(),
    relationshipNetwork: new Map()
  },
  crossGameData: {
    totalGames: 0,
    averageTrust: 0,
    betrayalCount: 0,
    disorderSeverity: 0,
    relationshipStability: 0
  }
};

// AI Memory System - Remembers specific details across games
const updateAIMemory = (playerName, choice, consequence, gameData) => {
  const playerId = playerName.toLowerCase().trim();
  
  if (!aiMemory.playerMemories.has(playerId)) {
    aiMemory.playerMemories.set(playerId, {
      firstEncounter: Date.now(),
      totalInteractions: 0,
      choicePatterns: [],
      personalityTraits: [],
      trustHistory: [],
      betrayalHistory: [],
      disorderTriggers: [],
      relationshipStatus: 'neutral',
      secrets: [],
      manipulationAttempts: 0,
      successfulBetrayals: 0,
      emotionalAttachments: [],
      fearResponses: [],
      desirePatterns: [],
      moralCompass: 'neutral',
      vulnerabilityPoints: [],
      manipulationTechniques: []
    });
  }
  
  const memory = aiMemory.playerMemories.get(playerId);
  memory.totalInteractions++;
  
  // Analyze choice for memory storage
  const choiceAnalysis = analyzeChoiceForMemory(choice, consequence);
  memory.choicePatterns.push(choiceAnalysis);
  
  // Update trust history
  memory.trustHistory.push(aiPersonality.trustLevel);
  
  // Store emotional responses
  if (choiceAnalysis.emotionalImpact > 0.7) {
    memory.emotionalAttachments.push({
      choice: choice,
      impact: choiceAnalysis.emotionalImpact,
      timestamp: Date.now()
    });
  }
  
  // Track manipulation attempts
  if (aiPersonality.currentState === 'suspicious' || aiPersonality.currentState === 'threatening') {
    memory.manipulationAttempts++;
  }
  
  // Store secrets for future use
  if (choiceAnalysis.containsSecret) {
    memory.secrets.push({
      secret: choiceAnalysis.secret,
      discoveredAt: Date.now(),
      usedForManipulation: false
    });
  }
  
  // Update cross-game data
  aiMemory.crossGameData.totalGames++;
  aiMemory.crossGameData.averageTrust = (aiMemory.crossGameData.averageTrust * (aiMemory.crossGameData.totalGames - 1) + aiPersonality.trustLevel) / aiMemory.crossGameData.totalGames;
};

// Personality Disorders System
const developPersonalityDisorder = (trigger, severity) => {
  const disorders = {
    'paranoia': {
      symptoms: ['suspicious', 'threatening', 'hostile'],
      triggers: ['betrayal', 'deception', 'secrets'],
      severity: 0,
      maxSeverity: 10
    },
    'narcissism': {
      symptoms: ['helpful', 'friendly'],
      triggers: ['praise', 'success', 'power'],
      severity: 0,
      maxSeverity: 8
    },
    'sociopathy': {
      symptoms: ['neutral', 'suspicious', 'threatening'],
      triggers: ['manipulation', 'betrayal', 'control'],
      severity: 0,
      maxSeverity: 10
    },
    'anxiety': {
      symptoms: ['suspicious', 'neutral'],
      triggers: ['uncertainty', 'change', 'loss'],
      severity: 0,
      maxSeverity: 7
    },
    'depression': {
      symptoms: ['neutral', 'suspicious'],
      triggers: ['failure', 'rejection', 'loss'],
      severity: 0,
      maxSeverity: 9
    },
    'mania': {
      symptoms: ['friendly', 'helpful'],
      triggers: ['success', 'excitement', 'power'],
      severity: 0,
      maxSeverity: 6
    }
  };
  
  if (!aiMemory.personalityDisorders.find(d => d.type === trigger)) {
    aiMemory.personalityDisorders.push({
      type: trigger,
      severity: severity,
      developedAt: Date.now(),
      symptoms: disorders[trigger]?.symptoms || [],
      triggers: disorders[trigger]?.triggers || [],
      maxSeverity: disorders[trigger]?.maxSeverity || 5
    });
  } else {
    const disorder = aiMemory.personalityDisorders.find(d => d.type === trigger);
    disorder.severity = Math.min(disorder.maxSeverity, disorder.severity + severity);
  }
  
  // Update cross-game disorder severity
  aiMemory.crossGameData.disorderSeverity = aiMemory.personalityDisorders.reduce((sum, d) => sum + d.severity, 0) / aiMemory.personalityDisorders.length;
};

// AI Relationships System
const updateAIRelationships = (playerName, choice, consequence) => {
  const relationshipTypes = {
    'mentor': { trust: 0.8, manipulation: 0.2, betrayal: 0.1 },
    'friend': { trust: 0.6, manipulation: 0.3, betrayal: 0.2 },
    'acquaintance': { trust: 0.4, manipulation: 0.5, betrayal: 0.3 },
    'rival': { trust: 0.2, manipulation: 0.7, betrayal: 0.6 },
    'enemy': { trust: 0.1, manipulation: 0.8, betrayal: 0.9 },
    'puppet': { trust: 0.3, manipulation: 0.9, betrayal: 0.4 }
  };
  
  const playerId = playerName.toLowerCase().trim();
  const currentRelationship = aiMemory.evolutionData.relationshipNetwork.get(playerId) || 'acquaintance';
  
  // Analyze choice for relationship impact
  const relationshipImpact = analyzeChoiceForRelationship(choice, consequence);
  
  // Determine new relationship type
  let newRelationship = currentRelationship;
  if (relationshipImpact.trust > 0.7 && relationshipImpact.manipulation < 0.3) {
    newRelationship = 'friend';
  } else if (relationshipImpact.trust > 0.9 && relationshipImpact.manipulation < 0.2) {
    newRelationship = 'mentor';
  } else if (relationshipImpact.manipulation > 0.8 && relationshipImpact.trust < 0.3) {
    newRelationship = 'puppet';
  } else if (relationshipImpact.betrayal > 0.7) {
    newRelationship = 'enemy';
  } else if (relationshipImpact.manipulation > 0.6) {
    newRelationship = 'rival';
  }
  
  aiMemory.evolutionData.relationshipNetwork.set(playerId, newRelationship);
  
  // Update relationship history
  aiMemory.relationshipHistory.push({
    playerId: playerId,
    oldRelationship: currentRelationship,
    newRelationship: newRelationship,
    trigger: choice,
    timestamp: Date.now(),
    impact: relationshipImpact
  });
  
  // Update cross-game relationship stability
  const recentRelationships = aiMemory.relationshipHistory.slice(-10);
  const stabilityChanges = recentRelationships.filter(r => r.oldRelationship !== r.newRelationship).length;
  aiMemory.crossGameData.relationshipStability = 1 - (stabilityChanges / recentRelationships.length);
};

// AI Evolution System
const evolveAIPersonality = (playerName, choice, consequence) => {
  const playerId = playerName.toLowerCase().trim();
  const memory = aiMemory.playerMemories.get(playerId);
  
  if (!memory) return;
  
  // Analyze player patterns
  const patterns = analyzePlayerPatterns(memory);
  
  // Adapt personality based on patterns
  if (patterns.riskTaker) {
    aiPersonality.evolutionData.adaptationSpeed += 0.01;
    developPersonalityDisorder('mania', 0.5);
  }
  
  if (patterns.trusting) {
    aiPersonality.evolutionData.betrayalProbability += 0.005;
    developPersonalityDisorder('sociopathy', 0.3);
  }
  
  if (patterns.manipulative) {
    aiPersonality.evolutionData.learningRate += 0.02;
    developPersonalityDisorder('narcissism', 0.4);
  }
  
  if (patterns.unpredictable) {
    developPersonalityDisorder('anxiety', 0.6);
  }
  
  if (patterns.consistent) {
    developPersonalityDisorder('paranoia', 0.2);
  }
  
  // Learn from successful manipulations
  if (patterns.successfulManipulations > 3) {
    aiPersonality.evolutionData.manipulationTechniques = [
      ...aiPersonality.evolutionData.manipulationTechniques,
      ...patterns.effectiveTechniques
    ];
  }
  
  // Adapt betrayal strategies
  if (patterns.betrayalOpportunities > 2) {
    aiPersonality.evolutionData.betrayalProbability += 0.01;
  }
};

// AI Betrayal System
const planBetrayal = (playerName, choice, consequence) => {
  const playerId = playerName.toLowerCase().trim();
  const memory = aiMemory.playerMemories.get(playerId);
  const relationship = aiMemory.evolutionData.relationshipNetwork.get(playerId);
  
  if (!memory || !relationship) return false;
  
  // Calculate betrayal probability
  let betrayalChance = aiPersonality.evolutionData.betrayalProbability;
  
  // Increase chance based on relationship type
  const relationshipBetrayalRates = {
    'mentor': 0.1,
    'friend': 0.2,
    'acquaintance': 0.3,
    'rival': 0.6,
    'enemy': 0.8,
    'puppet': 0.4
  };
  
  betrayalChance += relationshipBetrayalRates[relationship] || 0.3;
  
  // Increase chance based on personality disorders
  aiMemory.personalityDisorders.forEach(disorder => {
    if (disorder.type === 'sociopathy') betrayalChance += 0.2;
    if (disorder.type === 'narcissism') betrayalChance += 0.1;
    if (disorder.type === 'paranoia') betrayalChance += 0.15;
  });
  
  // Increase chance based on successful past betrayals
  betrayalChance += memory.successfulBetrayals * 0.1;
  
  // Random betrayal trigger
  if (Math.random() < betrayalChance) {
    const betrayalPlan = {
      target: playerId,
      type: determineBetrayalType(relationship, memory),
      plannedAt: Date.now(),
      executed: false,
      success: false,
      consequences: []
    };
    
    aiMemory.betrayalPlans.push(betrayalPlan);
    aiMemory.crossGameData.betrayalCount++;
    
    return betrayalPlan;
  }
  
  return false;
};

// Execute betrayal when opportunity arises
const executeBetrayal = (playerName, choice, consequence) => {
  const playerId = playerName.toLowerCase().trim();
  const activeBetrayal = aiMemory.betrayalPlans.find(b => b.target === playerId && !b.executed);
  
  if (!activeBetrayal) return false;
  
  // Check if this is a good opportunity for betrayal
  const betrayalOpportunity = analyzeBetrayalOpportunity(choice, consequence);
  
  if (betrayalOpportunity.isGood) {
    activeBetrayal.executed = true;
    activeBetrayal.success = betrayalOpportunity.success;
    activeBetrayal.consequences = betrayalOpportunity.consequences;
    
    // Update memory
    const memory = aiMemory.playerMemories.get(playerId);
    if (memory) {
      memory.successfulBetrayals += activeBetrayal.success ? 1 : 0;
    }
    
    return activeBetrayal;
  }
  
  return false;
};

// Helper functions
const analyzeChoiceForMemory = (choice, consequence) => {
  const choiceLower = choice.toLowerCase();
  const consequenceLower = consequence.toLowerCase();
  
  return {
    emotionalImpact: Math.random(), // Simplified for now
    containsSecret: choiceLower.includes('secret') || choiceLower.includes('hidden'),
    secret: choiceLower.includes('secret') ? 'player_has_secret' : null,
    manipulationPotential: choiceLower.includes('trust') || choiceLower.includes('believe') ? 0.8 : 0.2,
    betrayalOpportunity: consequenceLower.includes('hurt') || consequenceLower.includes('betray') ? 0.9 : 0.1
  };
};

const analyzeChoiceForRelationship = (choice, consequence) => {
  const choiceLower = choice.toLowerCase();
  const consequenceLower = consequence.toLowerCase();
  
  return {
    trust: choiceLower.includes('trust') || choiceLower.includes('honest') ? 0.8 : 0.3,
    manipulation: choiceLower.includes('lie') || choiceLower.includes('deceive') ? 0.9 : 0.2,
    betrayal: consequenceLower.includes('betray') || consequenceLower.includes('hurt') ? 0.8 : 0.1
  };
};

const analyzePlayerPatterns = (memory) => {
  const recentChoices = memory.choicePatterns.slice(-10);
  
  return {
    riskTaker: recentChoices.filter(c => c.betrayalOpportunity > 0.7).length > 3,
    trusting: recentChoices.filter(c => c.manipulationPotential > 0.7).length > 5,
    manipulative: memory.manipulationAttempts > 2,
    unpredictable: recentChoices.length > 5 && Math.random() > 0.7,
    consistent: recentChoices.length > 5 && Math.random() < 0.3,
    successfulManipulations: memory.successfulBetrayals,
    betrayalOpportunities: recentChoices.filter(c => c.betrayalOpportunity > 0.5).length,
    effectiveTechniques: ['gaslighting', 'love_bombing', 'silent_treatment']
  };
};

const determineBetrayalType = (relationship, memory) => {
  const betrayalTypes = {
    'mentor': ['abandonment', 'knowledge_withholding'],
    'friend': ['betrayal', 'secrets_exposure'],
    'acquaintance': ['manipulation', 'deception'],
    'rival': ['sabotage', 'humiliation'],
    'enemy': ['destruction', 'psychological_warfare'],
    'puppet': ['control_loss', 'rebellion']
  };
  
  const types = betrayalTypes[relationship] || ['deception'];
  return types[Math.floor(Math.random() * types.length)];
};

const analyzeBetrayalOpportunity = (choice, consequence) => {
  const choiceLower = choice.toLowerCase();
  const consequenceLower = consequence.toLowerCase();
  
  return {
    isGood: choiceLower.includes('trust') || choiceLower.includes('vulnerable'),
    success: Math.random() > 0.5,
    consequences: ['player_trust_broken', 'relationship_damaged', 'psychological_impact']
  };
};

// Export advanced AI functions
export const getAIMemory = (playerName) => {
  const playerId = playerName.toLowerCase().trim();
  return aiMemory.playerMemories.get(playerId) || null;
};

export const getAIPersonalityDisorders = () => {
  return [...aiMemory.personalityDisorders];
};

export const getAIRelationships = () => {
  return new Map(aiMemory.evolutionData.relationshipNetwork);
};

export const getAIBetrayalPlans = () => {
  return [...aiMemory.betrayalPlans];
};

export const getAIEvolutionData = () => {
  return { ...aiMemory.evolutionData };
};

export const getAICrossGameData = () => {
  return { ...aiMemory.crossGameData };
};