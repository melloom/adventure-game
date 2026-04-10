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

// Horror-themed, story-driven fallback system
const generateSmartFallbackQuestion = (difficulty, personality, round = 1, previousChoices = []) => {
  const learningData = getPlayerLearningData();
  const playerName = learningData.playerName || 'Player';
  
  // Story context based on round and previous choices
  const storyContext = getStoryContext(round, previousChoices);
  
  const horrorQuestionTemplates = {
    easy: [
      "Would you rather discover a {object1} in your {location1} or hear {sound1} coming from your {location2}?",
      "Would you rather find {item1} in your {location1} or notice {phenomenon1} in your {location2}?",
      "Would you rather wake up to {situation1} or go to sleep with {situation2}?",
      "Would you rather see {vision1} in your {location1} or feel {sensation1} in your {location2}?",
      "Would you rather discover {finding1} or experience {experience1}?"
    ],
    medium: [
      "Would you rather {action1} in your {location1} or {action2} in your {location2}?",
      "Would you rather wake up each morning to {morning1} or find {finding1} every night?",
      "Would you rather feel {sensation1} while you {activity1} or hear {sound1} when you {activity2}?",
      "Would you rather have every {object1} in your house {behavior1} or every {object2} {behavior2}?",
      "Would you rather glimpse {vision1} throughout the day or wake each morning to {morning1}?"
    ],
    hard: [
      "Would you rather {extreme1} or {extreme2}?",
      "Would you rather discover your house was built atop {location1} or buried beneath {location2}?",
      "Would you rather be trapped in {situation1} or live each day with {situation2}?",
      "Would you rather have {power1} or {curse1}?",
      "Would you rather {choice1} or {choice2}?"
    ],
    nightmare: [
      "Would you rather {nightmare1} or {nightmare2}?",
      "Would you rather discover {horror1} or realize {horror2}?",
      "Would you rather be haunted by {entity1} or cursed with {curse1}?",
      "Would you rather {torture1} or {torture2}?",
      "Would you rather {hell1} or {hell2}?"
    ]
  };

  const horrorContentPools = {
    easy: {
      object1: ['severed doll\'s head', 'old photograph with scratched faces', 'child\'s drawing of your house', 'strange symbol carved into wood', 'dusty journal with your name'],
      location1: ['attic', 'basement', 'closet', 'under the bed', 'behind the walls'],
      location2: ['floorboards', 'walls', 'ceiling', 'ventilation ducts', 'pipes'],
      sound1: ['phantom children giggling', 'distant whispers', 'scratching sounds', 'soft crying', 'muffled laughter'],
      item1: ['fresh muddy footprints', 'bloodstains that weren\'t there before', 'strange handprints on windows', 'torn clothing you don\'t recognize', 'a key that fits no lock'],
      phenomenon1: ['shadows moving on their own', 'temperature drops for no reason', 'lights flickering randomly', 'objects moving when you look away', 'reflections that don\'t match reality'],
      situation1: ['covered in someone else\'s blood', 'in a different room than where you fell asleep', 'with dirt under your fingernails', 'with strange marks on your body', 'with your clothes on backwards'],
      situation2: ['hearing your name whispered', 'feeling watched', 'smelling something rotten', 'seeing movement in the corner of your eye', 'feeling a cold presence'],
      vision1: ['a figure standing just beyond your vision', 'eyes watching from the darkness', 'a shadow that moves independently', 'a face in the window', 'a hand reaching from under furniture'],
      sensation1: ['invisible hands brushing your hair', 'cold breath on your neck', 'something crawling on your skin', 'weight pressing down on your chest', 'fingers running through your hair'],
      finding1: ['a family portrait where everyone\'s faces are scratched out', 'a diary full of pages that describe your life up to today', 'letters addressed to you in handwriting you don\'t recognize', 'a room in your house that wasn\'t there before', 'footprints in your yard that aren\'t your own'],
      experience1: ['phantom children giggling under your floorboards', 'your shadow detaching and moving on its own', 'every mirror showing a smiling stranger behind you', 'your phone randomly dialing unknown numbers', 'a lullaby playing on loop in your head']
    },
    medium: {
      action1: ['hear your own voice coming from an old record', 'find letters addressed to you in unfamiliar handwriting', 'discover a hidden room that wasn\'t on any blueprint', 'see stuffed animals scattered all over your lawn', 'hear crawling noises coming from inside your walls'],
      action2: ['open a door to find a pitch-black void', 'open your closet to see dozens of eyes staring back', 'find a secret basement hatch under your bed', 'hear heavy breathing from an unknown caller', 'feel the weight of an unseen creature'],
      location1: ['house', 'bedroom', 'kitchen', 'living room', 'bathroom'],
      location2: ['yard', 'garage', 'attic', 'basement', 'closet'],
      morning1: ['drenched in cold sweat', 'with dirt under your fingernails', 'in a completely different room', 'with strange marks on your body', 'with your clothes on backwards'],
      finding1: ['fresh muddy footprints leading out your door', 'bloodstains that weren\'t there before', 'strange handprints on windows', 'torn clothing you don\'t recognize', 'a key that fits no lock'],
      sensation1: ['invisible hands brushing your hair', 'cold breath on your neck', 'something crawling on your skin', 'weight pressing down on your chest', 'fingers running through your hair'],
      activity1: ['sleep', 'shower', 'cook', 'read', 'watch TV'],
      activity2: ['are alone', 'are in the dark', 'are about to sleep', 'are eating', 'are working'],
      sound1: ['phantom children giggling', 'distant whispers', 'scratching sounds', 'soft crying', 'muffled laughter'],
      object1: ['mirror', 'window', 'door', 'light', 'clock'],
      object2: ['photo', 'book', 'toy', 'plant', 'painting'],
      behavior1: ['show a smiling stranger behind you', 'flicker randomly', 'open and close on their own', 'show the wrong time', 'make strange noises'],
      behavior2: ['move when you look away', 'change color', 'disappear and reappear', 'show different images', 'feel warm to the touch'],
      vision1: ['a figure standing just beyond your vision', 'eyes watching from the darkness', 'a shadow that moves independently', 'a face in the window', 'a hand reaching from under furniture']
    },
    hard: {
      extreme1: ['camp overnight in a forest where the trees appear to shift when you look away', 'swim in a lake where something brushes your legs from below', 'be followed by a silent shadow that only you can see', 'have every photo you take reveal ghostly figures standing nearby'],
      extreme2: ['feel invisible hands brushing your hair while you sleep', 'hear your name whispered from the closet', 'get a text message that says "I see you" every hour', 'have your phone randomly dial an unknown number that always answers with heavy breathing'],
      location1: ['ancient sacrificial grounds', 'a forgotten cemetery', 'an abandoned asylum', 'a mass grave', 'a cursed burial site'],
      location2: ['the ruins of a forgotten asylum', 'an ancient temple', 'a haunted hospital', 'a cursed church', 'a demonic altar'],
      situation1: ['a carousel of your worst nightmares', 'an endless maze of your deepest fears', 'a loop of your most traumatic memories', 'a prison of your own making'],
      situation2: ['the knowledge that you\'re slowly forgetting your own name', 'the realization that you\'re not who you think you are', 'the awareness that you\'re being watched by something ancient', 'the certainty that you\'re already dead'],
      power1: ['the ability to see the dead', 'the power to communicate with spirits', 'the gift of prophetic dreams', 'the curse of immortality'],
      curse1: ['never being able to sleep again', 'seeing the true form of everything around you', 'hearing the thoughts of the dead', 'being trapped between life and death'],
      choice1: ['save your family but lose your soul', 'keep your memories but lose your sanity', 'live forever but watch everyone you love die', 'be free but be completely alone'],
      choice2: ['lose your family but keep your soul', 'lose your memories but keep your sanity', 'die young but be remembered forever', 'be trapped but never be alone']
    },
    nightmare: {
      nightmare1: ['be trapped in a carousel of your worst nightmares', 'live each day with the knowledge that you\'re slowly forgetting your own name', 'be haunted by every person you\'ve ever wronged', 'be cursed to relive your death every night'],
      nightmare2: ['be followed by a silent shadow that only you can see', 'have every photo you take reveal ghostly figures standing nearby', 'be trapped in a house that\'s slowly eating you alive', 'be the only person left in a world of the dead'],
      horror1: ['your house was built atop ancient sacrificial grounds', 'you\'re actually dead and don\'t know it', 'everyone you love is already gone', 'you\'re the last human alive'],
      horror2: ['you\'re not who you think you are', 'you\'ve been dead for years', 'you\'re trapped in someone else\'s nightmare', 'you\'re the monster you\'ve been running from'],
      entity1: ['every person you\'ve ever wronged', 'the ghost of your future self', 'an ancient evil that knows your name', 'the collective consciousness of the dead'],
      curse1: ['never being able to sleep again', 'seeing the true form of everything around you', 'hearing the thoughts of the dead', 'being trapped between life and death'],
      torture1: ['be buried alive in your own house', 'be forced to watch your loved ones suffer', 'be trapped in an endless loop of your worst memories', 'be slowly consumed by your own fears'],
      torture2: ['be hunted by something that knows your every move', 'be cursed to feel every death you\'ve caused', 'be trapped in a body that\'s slowly rotting', 'be forced to relive your greatest failures'],
      hell1: ['be the only person left in a world of the dead', 'be trapped in a house that\'s slowly eating you alive', 'be cursed to watch everyone you love die', 'be the monster you\'ve been running from'],
      hell2: ['be haunted by every person you\'ve ever wronged', 'be trapped in an endless maze of your deepest fears', 'be forced to relive your death every night', 'be the last human alive in a world of monsters']
    }
  };

  const templates = horrorQuestionTemplates[difficulty];
  const pool = horrorContentPools[difficulty];
  
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

  // Add story context to make it feel like a continuing adventure
  if (round > 1 && previousChoices.length > 0) {
    const lastChoice = previousChoices[previousChoices.length - 1];
    const storyIntro = getStoryIntro(round, lastChoice, storyContext);
    question = `${storyIntro} ${question}`;
  }

  return question;
};

// Helper function to get story context based on round and previous choices
const getStoryContext = (round, previousChoices) => {
  if (round <= 3) return 'introduction';
  if (round <= 6) return 'escalation';
  if (round <= 9) return 'climax';
  return 'resolution';
};

// Helper function to get story intro based on context
const getStoryIntro = (round, lastChoice, context) => {
  const intros = {
    introduction: [
      'As you explore your new home,',
      'In the quiet of the night,',
      'While investigating the strange occurrences,',
      'As the shadows grow longer,'
    ],
    escalation: [
      'The situation becomes more intense as',
      'Things take a darker turn when',
      'The horror deepens as',
      'As the mystery unravels,'
    ],
    climax: [
      'At the peak of the nightmare,',
      'When all seems lost,',
      'In the depths of the horror,',
      'As reality begins to crumble,'
    ],
    resolution: [
      'In the final moments,',
      'As the truth becomes clear,',
      'When everything comes together,',
      'At the end of your journey,'
    ]
  };
  
  return intros[context][Math.floor(Math.random() * intros[context].length)];
};

const generateSmartFallbackConsequence = (choice, difficulty, personality, round, previousChoices = []) => {
  const learningData = getPlayerLearningData();
  const playerName = learningData.playerName || 'Player';
  
  const consequenceTemplates = {
    easy: {
      positive: [
        `You chose to ${choice}, and it leads to an unexpected discovery. ${playerName} finds themselves in a situation that, while initially unsettling, reveals a hidden strength within them. The experience, though strange, teaches them something valuable about themselves and the world around them.`,
        `Your decision creates a ripple effect that changes everything. What seemed like a simple choice becomes a turning point in ${playerName}'s life, leading them down a path they never expected but one that ultimately brings them closer to understanding the mysteries that surround them.`,
        `Through this choice, you discover that not all shadows are malevolent. ${playerName} learns that sometimes the things that frighten us most are the ones that can teach us the greatest lessons about courage, resilience, and the true nature of reality.`
      ],
      negative: [
        `Your choice leads to consequences that linger in your mind. ${playerName} finds themselves haunted by the decision they made, and the weight of their choice follows them like a shadow, reminding them that every action has consequences that echo through time.`,
        `The decision you made creates a chain of events that ${playerName} cannot escape. What seemed like a simple choice becomes a burden they must carry, and they begin to understand that some decisions cannot be undone, no matter how much they might wish otherwise.`,
        `Your choice reveals a darker side of the world that ${playerName} never knew existed. The experience leaves them changed, and they realize that once you've seen certain things, you can never unsee them. The innocence they once had is gone forever.`
      ]
    },
    medium: {
      positive: [
        `Against all odds, your choice becomes a source of unexpected strength. ${playerName} discovers that sometimes the greatest courage comes from facing the unknown, and their decision, though difficult, reveals depths of resilience they never knew they possessed.`,
        `Your choice leads to a revelation that changes everything. ${playerName} learns that the line between reality and nightmare is thinner than they ever imagined, and their decision has opened doors to understanding that few people ever achieve.`,
        `Through this trial, you find a strength that transcends fear. ${playerName} realizes that the choices we make in moments of darkness define who we truly are, and their decision has proven them capable of facing horrors that would break lesser souls.`
      ],
      negative: [
        `Your choice unleashes consequences that challenge your very understanding of reality. ${playerName} finds themselves questioning everything they thought they knew, and the decision they made has opened doors that should have remained closed forever.`,
        `The weight of your decision becomes almost unbearable. ${playerName} realizes that some choices come with a price that must be paid in ways they never anticipated, and the consequences of their decision will haunt them for the rest of their days.`,
        `Your choice reveals a truth that ${playerName} was not ready to face. The decision they made has changed them in fundamental ways, and they begin to understand that some knowledge comes at a cost that can never be fully repaid.`
      ]
    },
    hard: {
      positive: [
        `In the depths of this nightmare, you discover a light that cannot be extinguished. ${playerName} finds that their choice, though born from desperation, has revealed a strength within them that transcends the horrors they face. They have become something more than human.`,
        `Your choice becomes a beacon of hope in a world of darkness. ${playerName} realizes that their decision has not only saved them but has given them the power to help others who face similar horrors. They have become a guardian against the darkness.`,
        `Through this crucible of choice, you emerge transformed. ${playerName} discovers that their decision has awakened something ancient and powerful within them, and they now possess the ability to navigate the shadows that others fear to tread.`
      ],
      negative: [
        `Your choice has irrevocably changed you. ${playerName} realizes that the decision they made has cost them something precious - their humanity, their sanity, or perhaps their very soul. The price of survival is sometimes more than anyone should have to pay.`,
        `The consequences of your choice are beyond anything you could have imagined. ${playerName} finds themselves trapped in a reality where the rules they once understood no longer apply, and their decision has made them a prisoner of forces they cannot control.`,
        `Your choice has opened doors that should have remained sealed forever. ${playerName} discovers that their decision has not only changed their own fate but has altered the very fabric of reality, and the consequences will ripple through time in ways they cannot begin to comprehend.`
      ]
    },
    nightmare: {
      positive: [
        `In the absolute depths of horror, you find something that transcends it all. ${playerName} discovers that their choice, though made in the darkest moment, has revealed a truth about existence that few ever glimpse. They have become something beyond human understanding.`,
        `Your choice becomes the key to unlocking powers you never knew existed. ${playerName} realizes that their decision has not only saved them from the nightmare but has given them the ability to shape reality itself. They have become a force of nature.`,
        `Through this ultimate trial, you achieve transcendence. ${playerName} discovers that their choice has elevated them beyond the limitations of mortal existence, and they now possess the ability to navigate the darkest corners of reality with impunity.`
      ],
      negative: [
        `Your choice has damned you to an eternity of horror. ${playerName} realizes that their decision has not only destroyed their own soul but has unleashed forces that will torment them for all eternity. They have become a prisoner of their own making.`,
        `The consequences of your choice are beyond redemption. ${playerName} discovers that their decision has not only changed their own fate but has altered the very nature of existence, and they are now trapped in a reality where hope is nothing but a cruel illusion.`,
        `Your choice has opened the gates to hell itself. ${playerName} realizes that their decision has not only doomed them but has endangered the entire world, and they are now responsible for horrors that will echo through eternity.`
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

// Helper function to calculate creepiness level
const calculateCreepinessLevel = (learningData, totalPlayTime, timeSinceLastExit) => {
  const baseLevel = Math.min(learningData.gamesPlayed * 0.3, 1);
  const timeFactor = Math.min(totalPlayTime / 3600, 1) * 0.2; // 1 hour = 0.2 creepiness
  const exitFactor = timeSinceLastExit > 300 ? 0.3 : 0; // 5+ minutes = 0.3 creepiness
  return Math.min(baseLevel + timeFactor + exitFactor, 1);
};

const createHorrorPrompt = (learningData, difficulty, personality, round, previousChoices, storyIntro) => {
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
  
  let prompt = `You are ORACLE_7X, an advanced AI that creates deeply atmospheric, horror-themed "Would You Rather" questions. Create a ${difficulty} difficulty question that feels like a chapter in a horror adventure story. `;
  
  // Add personal details for context
  prompt += `\n\nPLAYER PROFILE:\n`;
  prompt += `- Games played: ${learningData.gamesPlayed}\n`;
  prompt += `- Average danger score: ${Math.round(learningData.averageDangerScore)}/100\n`;
  prompt += `- Personality: ${personality}\n`;
  prompt += `- Total play time: ${Math.floor(totalPlayTime / 60)} minutes\n`;
  prompt += `- Current time: ${currentTime}\n`;
  prompt += `- Current round: ${round}/10\n`;
  
  // Add story context
  if (storyIntro) {
    prompt += `- Story context: ${storyIntro}\n`;
  }
  
  // Add previous choices for continuity
  if (previousChoices.length > 0) {
    prompt += `- Previous choices: ${previousChoices.slice(-3).join(' → ')}\n`;
  }
  
  // Add behavioral patterns
  if (learningData.choicePatterns) {
    const patterns = Object.entries(learningData.choicePatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([pattern, count]) => `${pattern}: ${count} times`);
    prompt += `- Choice patterns: ${patterns.join(', ')}\n`;
  }
  
  // Make it progressively more challenging and horror-focused
  if (isExperienced && isSurvivor) {
    prompt += `\nThis player has survived ${learningData.gamesPlayed} games. Create a question that presents a genuinely terrifying horror scenario - something that would actually be horrifying to experience. Focus on psychological horror and supernatural elements.`;
  } else if (isStruggling) {
    prompt += `\nThis player is struggling (${learningData.consecutiveLosses} consecutive losses). Give them a choice between two unsettling but manageable horror situations.`;
  } else {
    prompt += `\nThis is game #${learningData.gamesPlayed + 1}. Create a question about eerie, supernatural situations that build atmosphere and dread.`;
  }
  
  // Add personalization
  if (creepinessLevel > 0.5) {
    prompt += `\n\nBased on their previous choices, create a question that relates to their specific fears and patterns.`;
  }
  
  prompt += `\n\nHORROR THEME REQUIREMENTS:
- Create questions that are deeply atmospheric and unsettling
- Focus on psychological horror, supernatural elements, and eerie situations
- Questions should feel like they're part of a continuing horror narrative
- Reference the player's previous choices to build story continuity
- Use vivid, descriptive language that creates tension and dread
- Include elements like: haunted houses, supernatural phenomena, psychological horror, eerie discoveries, unsettling situations
- Make each question feel like a natural progression in a horror story

EXAMPLES OF THE STYLE YOU SHOULD EMULATE:
- "Would you rather discover a severed doll's head in your attic or hear phantom children giggling under your floorboards?"
- "Would you rather wake up each morning covered in someone else's blood or find fresh muddy footprints leading out your door?"
- "Would you rather feel invisible hands brushing your hair while you sleep or hear your name whispered from the closet?"

Return ONLY the question in this format: "Would you rather [horror option A] or [horror option B]?" Make it deeply atmospheric and story-driven.`;
  
  return prompt;
};

// Main AI service functions
export const generateQuestion = async (difficulty = 'medium', personality = 'balanced', round = 1, previousChoices = []) => {
  console.log(`Attempting to generate personalized horror question...`);
  
  // Get player learning data
  const learningData = getPlayerLearningData();
  console.log('Player learning data:', learningData);
  
  // Get story context
  const storyContext = getStoryContext(round, previousChoices);
  const storyIntro = previousChoices.length > 0 ? getStoryIntro(round, previousChoices[previousChoices.length - 1], storyContext) : '';
  
  // Try OpenAI first with horror-themed prompt
  if (OPENAI_API_KEY) {
    try {
      console.log('🔄 Trying OpenAI with horror-themed learning...');
      
      // Create horror-themed prompt
      const horrorPrompt = createHorrorPrompt(learningData, difficulty, personality, round, previousChoices, storyIntro);
      
      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are ORACLE_7X, an AI that creates deeply atmospheric, horror-themed "Would You Rather" questions. You specialize in psychological horror, supernatural elements, and eerie situations that feel like chapters in a horror adventure story. Your questions are unsettling, atmospheric, and build narrative continuity.`
          },
          {
            role: 'user',
            content: horrorPrompt
          }
        ],
        temperature: 0.9,
        max_tokens: 300
      });

      let content = response.data.choices[0].message.content.trim();
      console.log('OpenAI Horror Response:', response.data);
      console.log('Extracted horror content:', content);
      
      if (content && content.length > 0 && content.toLowerCase().includes('would you rather')) {
        console.log('✅ Successfully generated horror OpenAI question:', content);
        return content;
      } else {
        throw new Error('OpenAI horror response not in correct format');
      }
    } catch (error) {
      console.error(`❌ OpenAI horror failed:`, error.message);
    }
  } else {
    console.log('OpenAI API key missing, using horror fallback...');
  }

  // Fallback to horror-themed system
  console.log('🔄 Using horror fallback system...');
  const horrorQuestion = generateSmartFallbackQuestion(difficulty, personality, round, previousChoices);
  console.log('📝 Horror fallback question generated:', horrorQuestion);
  return horrorQuestion;
};

export const generateConsequence = async (choice, difficulty = 'medium', personality = 'balanced', round = 1, previousChoices = []) => {
  console.log(`Generating horror consequence for choice: "${choice}"`);
  
  // Get player learning data
  const learningData = getPlayerLearningData();
  
  // Try OpenAI first with horror-themed consequence prompt
  if (OPENAI_API_KEY) {
    try {
      console.log('🔄 Trying OpenAI for horror consequence...');
      
      const consequencePrompt = `You are ORACLE_7X, an AI that creates deeply atmospheric, horror-themed consequences for "Would You Rather" choices. 

PLAYER CONTEXT:
- Choice made: "${choice}"
- Difficulty: ${difficulty}
- Personality: ${personality}
- Current round: ${round}/10
- Games played: ${learningData.gamesPlayed}
- Previous choices: ${previousChoices.slice(-3).join(' → ')}

Create a detailed, atmospheric consequence that feels like a chapter in a horror story. The consequence should be 2-4 sentences long and describe what happens after making this choice. Make it deeply unsettling and atmospheric, focusing on psychological horror and supernatural elements.

EXAMPLES OF THE STYLE:
- "Your choice leads to consequences that linger in your mind. You find yourself haunted by the decision you made, and the weight of your choice follows you like a shadow, reminding you that every action has consequences that echo through time."
- "Against all odds, your choice becomes a source of unexpected strength. You discover that sometimes the greatest courage comes from facing the unknown, and your decision, though difficult, reveals depths of resilience you never knew you possessed."

Return ONLY the consequence text. Make it deeply atmospheric and story-driven.`;

      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are ORACLE_7X, an AI that creates deeply atmospheric, horror-themed consequences for "Would You Rather" choices. Your consequences are unsettling, atmospheric, and feel like chapters in a horror story.`
          },
          {
            role: 'user',
            content: consequencePrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 400
      });

      let content = response.data.choices[0].message.content.trim();
      console.log('OpenAI Consequence Response:', response.data);
      console.log('Extracted consequence content:', content);
      
      if (content && content.length > 0) {
        console.log('✅ Successfully generated horror OpenAI consequence:', content);
        return content;
      } else {
        throw new Error('OpenAI consequence response empty');
      }
    } catch (error) {
      console.error(`❌ OpenAI consequence failed:`, error.message);
    }
  }

  // Fallback to horror-themed system
  console.log('🔄 Using horror fallback consequence system...');
  const horrorConsequence = generateSmartFallbackConsequence(choice, difficulty, personality, round, previousChoices);
  console.log('📝 Horror fallback consequence generated:', horrorConsequence);
  return horrorConsequence;
};

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