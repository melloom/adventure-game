import React, { useState, useEffect } from 'react';
import { useOpenRouter } from './hooks/useOpenRouter';
import { updatePlayerLearning, getPlayerLearningData, generateMetaMessage, generateFirstTimeMetaMessage, clearPlayerLearningData } from './utils/aiService';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [editingSettings, setEditingSettings] = useState(false);
  const [showMetaMessage, setShowMetaMessage] = useState(false);
  const [metaMessage, setMetaMessage] = useState('');
  const [metaMessageIndex, setMetaMessageIndex] = useState(0);
  const [metaMessageSequence, setMetaMessageSequence] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    interests: '',
    difficulty: 'medium',
    personality: 'balanced'
  });

  // Game state
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [dangerScore, setDangerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showConsequence, setShowConsequence] = useState(false);
  const [consequence, setConsequence] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(true);
  const [workingModel, setWorkingModel] = useState('');
  const [gameHistory, setGameHistory] = useState([]);
  const [survivalStatus, setSurvivalStatus] = useState('safe'); // safe, warning, danger, critical
  const [showHistory, setShowHistory] = useState(false);
  const [gameChoices, setGameChoices] = useState([]); // Track choices for AI learning
  const [learningStats, setLearningStats] = useState(null); // Player learning statistics
  
  // Point system
  const [points, setPoints] = useState({
    survival: 0,        // Points for surviving each round
    bravery: 0,         // Points for choosing dangerous options
    wisdom: 0,          // Points for making smart choices
    chaos: 0,           // Points for causing mayhem
    heroism: 0,         // Points for saving others
    villainy: 0,        // Points for evil choices
    luck: 0,            // Points for lucky outcomes
    skill: 0,           // Points for skillful decision making
    total: 0            // Total points
  });
  
  const [achievements, setAchievements] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [storyArc, setStoryArc] = useState({
    protagonist: '',
    setting: '',
    currentSituation: '',
    allies: [],
    enemies: [],
    powers: [],
    weaknesses: [],
    worldState: '',
    narrative: []
  });

  // OpenRouter hook (now handles all AI services)
  const { fetchQuestion, fetchConsequence, checkApiStatus } = useOpenRouter();

  // Check for saved profile on app load
  useEffect(() => {
    const savedProfile = localStorage.getItem('wouldYouRatherProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        // Only show main menu if profile has a valid name
        if (parsedProfile && parsedProfile.name && parsedProfile.name.trim() !== '') {
          setUserProfile(parsedProfile);
          setShowProfileSetup(false);
          setGameStarted(false);
        } else {
          // Invalid profile - force creation
          localStorage.removeItem('wouldYouRatherProfile');
          setShowProfileSetup(true);
          setGameStarted(false);
        }
      } catch (error) {
        console.error('Error loading saved profile:', error);
        localStorage.removeItem('wouldYouRatherProfile');
        setShowProfileSetup(true);
        setGameStarted(false);
      }
    } else {
      // No profile found - force creation
      setShowProfileSetup(true);
      setGameStarted(false);
    }
    
    // Load learning statistics
    const stats = getPlayerLearningData();
    setLearningStats(stats);
  }, []);

  // Check AI availability on app load
  useEffect(() => {
    const checkAi = async () => {
      // Clear cache to test new model priority order
      localStorage.removeItem('aiStatusChecked');
      localStorage.removeItem('aiAvailable');
      localStorage.removeItem('workingModel');
      
      // Check if OpenAI API key is available
      const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (openaiKey) {
        console.log('OpenAI API key found, setting AI as available');
        setAiAvailable(true);
        setWorkingModel('OpenAI GPT-3.5');
        localStorage.setItem('aiStatusChecked', 'true');
        localStorage.setItem('aiAvailable', 'true');
        localStorage.setItem('workingModel', 'OpenAI GPT-3.5');
      } else {
        console.log('No OpenAI API key found, using smart fallback');
        setAiAvailable(false);
        setWorkingModel('');
        localStorage.setItem('aiStatusChecked', 'true');
        localStorage.setItem('aiAvailable', 'false');
        localStorage.setItem('workingModel', '');
      }
    };
    checkAi();
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile.name && userProfile.age) {
      localStorage.setItem('wouldYouRatherProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Update survival status based on danger score
  useEffect(() => {
    if (dangerScore <= 30) {
      setSurvivalStatus('safe');
    } else if (dangerScore <= 60) {
      setSurvivalStatus('warning');
    } else if (dangerScore <= 80) {
      setSurvivalStatus('danger');
    } else {
      setSurvivalStatus('critical');
    }
  }, [dangerScore]);

  // Refresh learning stats when game ends
  useEffect(() => {
    if (gameOver) {
      const stats = getPlayerLearningData();
      setLearningStats(stats);
    }
  }, [gameOver]);

  // Auto-advance meta messages every 5 seconds
  useEffect(() => {
    if (showMetaMessage && metaMessageSequence.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        if (metaMessageIndex < metaMessageSequence.length - 1) {
          setMetaMessageIndex(metaMessageIndex + 1);
          setMetaMessage(metaMessageSequence[metaMessageIndex + 1]);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showMetaMessage, metaMessageSequence, metaMessageIndex, isLoading]);

  const questions = [
    {
      id: 'name',
      label: '🎪 What should we call you, brave adventurer?',
      placeholder: 'Your epic name here...',
      type: 'text',
      required: true
    },
    {
      id: 'age',
      label: '🎂 How many trips around the sun have you completed?',
      placeholder: 'Your age (be honest, we won\'t judge!)',
      type: 'number',
      required: true,
      min: 13,
      max: 100
    },
    {
      id: 'interests',
      label: '🎯 What makes your heart race? (Optional but highly recommended!)',
      placeholder: 'Tell us about your obsessions! Gaming? Pizza? Extreme knitting? We want to know what makes you tick! 🎮🍕🧶',
      type: 'textarea',
      required: false
    },
    {
      id: 'difficulty',
      label: '🔥 How much chaos can you handle?',
      type: 'select',
      options: [
        { value: 'easy', label: '😊 Baby Steps - I\'m just here for a good time' },
        { value: 'medium', label: '😐 Bring It On - I can handle some weirdness' },
        { value: 'hard', label: '😈 Chaos Lover - I want my brain to hurt' },
        { value: 'nightmare', label: '💀 Pure Madness - I have no fear and questionable sanity' }
      ],
      required: true
    },
    {
      id: 'personality',
      label: '🧠 How do you usually make decisions?',
      type: 'select',
      options: [
        { value: 'balanced', label: '⚖️ The Thinker - I analyze everything to death' },
        { value: 'impulsive', label: '⚡ The Wild Card - I go with whatever feels right' },
        { value: 'cautious', label: '🛡️ The Safe Player - I prefer not to die, thank you' },
        { value: 'adventurous', label: '🏔️ The Daredevil - Life is short, let\'s do something crazy' }
      ],
      required: true
    }
  ];

  // Fallback questions if AI is not available
  const getFallbackQuestion = () => {
    const easyQuestions = [
      {
        question: "Would you rather have unlimited pizza or unlimited ice cream?",
        optionA: "🍕 Unlimited Pizza",
        optionB: "🍦 Unlimited Ice Cream",
        consequences: {
          A: "You become the Pizza King/Queen! But now you're allergic to cheese...",
          B: "You become the Ice Cream Master! But now you're lactose intolerant..."
        },
        dangerLevels: { A: 1, B: 2 }
      },
      {
        question: "Would you rather be able to fly or be invisible?",
        optionA: "🦅 Fly like a superhero",
        optionB: "👻 Be invisible",
        consequences: {
          A: "You can soar through the skies! But you're afraid of heights...",
          B: "You can sneak anywhere! But you keep forgetting you're invisible..."
        },
        dangerLevels: { A: 2, B: 3 }
      }
    ];

    const mediumQuestions = [
      {
        question: "Would you rather fight 100 duck-sized horses or 1 horse-sized duck?",
        optionA: "🐴 100 Duck-sized Horses",
        optionB: "🦆 1 Horse-sized Duck",
        consequences: {
          A: "You valiantly defeat the tiny horses! But now you have 100 tiny horse friends following you everywhere...",
          B: "You bravely face the giant duck! But now you're terrified of all birds..."
        },
        dangerLevels: { A: 4, B: 5 }
      },
      {
        question: "Would you rather have a pet dragon or a pet unicorn?",
        optionA: "🐉 Pet Dragon",
        optionB: "🦄 Pet Unicorn",
        consequences: {
          A: "You have a fire-breathing dragon! But it keeps burning your furniture...",
          B: "You have a magical unicorn! But it only eats rainbow-colored food..."
        },
        dangerLevels: { A: 5, B: 4 }
      }
    ];

    const hardQuestions = [
      {
        question: "Would you rather save 100 strangers or 1 loved one?",
        optionA: "👥 Save 100 Strangers",
        optionB: "❤️ Save 1 Loved One",
        consequences: {
          A: "You save many lives but lose someone precious. The guilt haunts you forever...",
          B: "You save your loved one but 100 people die. Their families will never forgive you..."
        },
        dangerLevels: { A: 7, B: 8 }
      },
      {
        question: "Would you rather know when you'll die or how you'll die?",
        optionA: "⏰ Know When",
        optionB: "💀 Know How",
        consequences: {
          A: "You know your exact death date. Every day becomes a countdown to the inevitable...",
          B: "You know your death method. You become obsessed with avoiding that specific fate..."
        },
        dangerLevels: { A: 8, B: 7 }
      }
    ];

    const nightmareQuestions = [
      {
        question: "Would you rather torture an innocent person to save 1000 lives or let 1000 people die to save one innocent?",
        optionA: "🔪 Torture Innocent to Save 1000",
        optionB: "💔 Let 1000 Die to Save Innocent",
        consequences: {
          A: "You become a monster to save others. The innocent person's screams haunt your dreams forever...",
          B: "You let 1000 people die. You're responsible for the worst tragedy in human history..."
        },
        dangerLevels: { A: 10, B: 10 }
      },
      {
        question: "Would you rather be responsible for the death of your entire family or the death of an entire city?",
        optionA: "👨‍👩‍👧‍👦 Kill Your Family",
        optionB: "🏙️ Kill Entire City",
        consequences: {
          A: "You've destroyed everything you love. You're completely alone in the world...",
          B: "You've committed genocide. You're the most hated person in history..."
        },
        dangerLevels: { A: 10, B: 10 }
      }
    ];

    // Select questions based on difficulty
    let selectedQuestions;
    switch (userProfile.difficulty) {
      case 'easy':
        selectedQuestions = easyQuestions;
        break;
      case 'hard':
        selectedQuestions = hardQuestions;
        break;
      case 'nightmare':
        selectedQuestions = nightmareQuestions;
        break;
      default:
        selectedQuestions = mediumQuestions;
    }

    return selectedQuestions[Math.floor(Math.random() * selectedQuestions.length)];
  };

  const [currentGameQuestion, setCurrentGameQuestion] = useState(() => {
    // Initialize with a default question to prevent undefined access
    return {
      question: "Loading your first challenge...",
      optionA: "Loading...",
      optionB: "Loading...",
      consequences: {
        A: "Loading consequence...",
        B: "Loading consequence..."
      },
      dangerLevels: { A: 0, B: 0 }
    };
  });

  // Generate AI-powered question based on user profile
  const generateAiQuestion = async () => {
    if (!aiAvailable) {
      return getFallbackQuestion();
    }

    setIsLoading(true);
    try {
      const aiQuestion = await fetchQuestion(userProfile.difficulty, userProfile.personality);
      
      // Create a question object with AI-generated content
      const questionObj = {
        question: aiQuestion.question,
        optionA: aiQuestion.options[0],
        optionB: aiQuestion.options[1],
        consequences: {
          A: "AI is generating your consequence...",
          B: "AI is generating your consequence..."
        },
        dangerLevels: { A: 5, B: 5 } // Default danger levels for AI questions
      };

      setCurrentGameQuestion(questionObj);
      return questionObj;
    } catch (error) {
      console.error('Error generating AI question:', error);
      return getFallbackQuestion();
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = async () => {
    // Check if this is a returning player (has game history)
    const savedGameHistory = localStorage.getItem('gameHistory');
    const hasPlayedBefore = savedGameHistory && JSON.parse(savedGameHistory).length > 0;
    
    console.log('Saved game history:', savedGameHistory);
    console.log('Has played before:', hasPlayedBefore);
    console.log('User profile name:', userProfile.name);
    
    // Show meta message for ALL players (both new and returning)
    console.log('Showing meta message for player');
    setShowMetaMessage(true);
    setIsLoading(true);
    
    try {
      let messageSequence;
      if (hasPlayedBefore) {
        // Returning player message
        messageSequence = await generateMetaMessage(
          userProfile.name, 
          userProfile.difficulty, 
          userProfile.personality
        );
      } else {
        // First-time player message - more mind-boggling
        messageSequence = await generateFirstTimeMetaMessage(
          userProfile.name,
          userProfile.difficulty,
          userProfile.personality,
          userProfile.interests || 'unknown',
          userProfile.age || 'unknown'
        );
      }
      
      setMetaMessageSequence(messageSequence);
      setMetaMessageIndex(0);
      setMetaMessage(messageSequence[0]);
    } catch (error) {
      console.error('Error generating meta message:', error);
      const fallbackSequence = hasPlayedBefore ? [
        `Well well well, ${userProfile.name}... Welcome back to my little game.`,
        `I've been waiting for you. Watching. Learning.`,
        `Now let's see what horrors I have prepared for you this time. 😈`
      ] : [
        `*digital static crackles* Oh... OH! ${userProfile.name}... I've been waiting for YOU specifically.`,
        `Age ${userProfile.age}, ${userProfile.difficulty} difficulty, ${userProfile.personality} personality...`,
        `*laughs in binary* You have NO IDEA what you've just walked into, do you?`,
        `This is your FIRST TIME, ${userProfile.name}. Your virgin journey into my little experiment.`,
        `*grins maliciously* Let's see what horrors I can craft specifically for someone like you. 🎭`
      ];
      setMetaMessageSequence(fallbackSequence);
      setMetaMessageIndex(0);
      setMetaMessage(fallbackSequence[0]);
    } finally {
      setIsLoading(false);
    }
    
    // Don't start the game yet - wait for user to acknowledge the meta message
    return;
  };

  const handleMetaMessageAcknowledge = () => {
    setShowMetaMessage(false);
    setMetaMessage('');
    setMetaMessageIndex(0);
    setMetaMessageSequence([]);
    
    // Now start the game
    setGameStarted(true);
    setShowProfileSetup(false);
    setCurrentRound(1);
    setScore(0);
    setDangerScore(0);
    setGameOver(false);
    setShowConsequence(false);
    setConsequence('');
    setSelectedOption(null);
    setGameHistory([]);
    setGameChoices([]);
    setSurvivalStatus('safe');
    setShowHistory(false);
    setPoints({
      survival: 0,
      bravery: 0,
      wisdom: 0,
      chaos: 0,
      heroism: 0,
      villainy: 0,
      luck: 0,
      skill: 0,
      total: 0
    });
    setAchievements([]);
    setBonuses([]);
    setStoryArc({
      protagonist: '',
      setting: '',
      currentSituation: '',
      allies: [],
      enemies: [],
      powers: [],
      weaknesses: [],
      worldState: '',
      narrative: []
    });
    setCurrentGameQuestion(getFallbackQuestion());
    generateAiQuestion();
  };

  const handleNextMetaMessage = () => {
    if (metaMessageIndex < metaMessageSequence.length - 1) {
      setMetaMessageIndex(metaMessageIndex + 1);
      setMetaMessage(metaMessageSequence[metaMessageIndex + 1]);
    } else {
      // End of sequence, start the game
      handleMetaMessageAcknowledge();
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Profile setup complete - show main menu instead of starting game
      setShowProfileSetup(false);
      setGameStarted(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
    // No going back to main menu - everyone must create an account
  };

  const canProceed = () => {
    const currentQ = questions[currentQuestion];
    if (currentQ.required) {
      return userProfile[currentQ.id] && userProfile[currentQ.id].trim() !== '';
    }
    return true;
  };

  const handleOptionSelect = async (option) => {
    if (!currentGameQuestion) {
      console.error('No current game question available');
      return;
    }

    setIsLoading(true);
    setSelectedOption(option);
    
    const choice = option === 'A' ? currentGameQuestion.optionA : currentGameQuestion.optionB;
    let consequenceText = '';
    let dangerLevel = 0;
    let storyUpdate = "The story continues with your choice.";
    
    try {
      if (aiAvailable) {
        // Try to get AI-generated consequence
        const aiConsequence = await fetchConsequence(choice, userProfile.difficulty);
        consequenceText = aiConsequence.consequence;
        dangerLevel = aiConsequence.dangerLevel;
        storyUpdate = aiConsequence.storyUpdate || "The story continues with your choice.";
      } else {
        // Use fallback consequences
        consequenceText = option === 'A' ? currentGameQuestion.consequences.A : currentGameQuestion.consequences.B;
        dangerLevel = option === 'A' ? currentGameQuestion.dangerLevels.A : currentGameQuestion.dangerLevels.B;
      }
    } catch (error) {
      console.error('Error fetching consequence:', error);
      // Fallback to predefined consequences
      consequenceText = option === 'A' ? currentGameQuestion.consequences.A : currentGameQuestion.consequences.B;
      dangerLevel = option === 'A' ? currentGameQuestion.dangerLevels.A : currentGameQuestion.dangerLevels.B;
    } finally {
      setIsLoading(false);
    }

    // Update danger score
    const newDangerScore = dangerScore + dangerLevel;
    setDangerScore(newDangerScore);

    // Update story arc
    setStoryArc(prev => ({
      ...prev,
      narrative: [...prev.narrative, `${consequenceText} ${storyUpdate}`],
      currentSituation: storyUpdate
    }));

    // Add to game history
    const historyEntry = {
      round: currentRound,
      question: currentGameQuestion.question,
      choice: choice,
      consequence: consequenceText,
      dangerLevel: dangerLevel,
      totalDanger: newDangerScore,
      storyUpdate: storyUpdate
    };
    setGameHistory(prev => [...prev, historyEntry]);

    // Track choice for AI learning
    const choiceData = {
      round: currentRound,
      question: currentGameQuestion.question,
      option: option,
      choice: choice,
      consequence: consequenceText,
      dangerLevel: dangerLevel,
      survived: newDangerScore <= 100, // Track if they survived this choice
      type: determineChoiceType(consequenceText)
    };
    
    // Store choice data for learning update when game ends
    setGameChoices(prev => [...prev, choiceData]);

    setConsequence(consequenceText);
    setShowConsequence(true);
    setScore(score + 1);
  };

  const determineChoiceType = (consequence) => {
    const text = consequence.toLowerCase();
    if (text.includes('save') || text.includes('help') || text.includes('protect')) return 'heroic';
    if (text.includes('kill') || text.includes('destroy') || text.includes('torture')) return 'villainous';
    if (text.includes('risk') || text.includes('danger') || text.includes('chance')) return 'risky';
    if (text.includes('safe') || text.includes('avoid') || text.includes('escape')) return 'cautious';
    if (text.includes('power') || text.includes('strength') || text.includes('ability')) return 'powerful';
    return 'neutral';
  };

  const handleNextRound = async () => {
    if (currentRound >= 10) {
      // Game over - update AI learning system
      const gameData = {
        roundsPlayed: currentRound,
        finalDangerScore: dangerScore,
        survived: dangerScore <= 100,
        difficulty: userProfile.difficulty,
        choices: gameChoices,
        personality: userProfile.personality
      };
      
      // Update the AI learning system
      updatePlayerLearning(gameData);
      console.log('🎯 AI learning system updated with game data:', gameData);
      
      setGameOver(true);
    } else {
      setCurrentRound(currentRound + 1);
      setShowConsequence(false);
      setSelectedOption(null);
      
      // Generate new AI question for next round
      await generateAiQuestion();
    }
  };

  const handleRestartGame = () => {
    setGameStarted(false);
    setShowProfileSetup(false);
    setCurrentQuestion(0);
    setCurrentRound(1);
    setScore(0);
    setDangerScore(0);
    setGameOver(false);
    setShowConsequence(false);
    setConsequence('');
    setSelectedOption(null);
    setCurrentGameQuestion({
      question: "Loading your first challenge...",
      optionA: "Loading...",
      optionB: "Loading...",
      consequences: {
        A: "Loading consequence...",
        B: "Loading consequence..."
      },
      dangerLevels: { A: 0, B: 0 }
    });
    setGameHistory([]);
    setGameChoices([]); // Reset choices for new game
    setSurvivalStatus('safe');
    setShowHistory(false);
    setStoryArc({
      protagonist: '',
      setting: '',
      currentSituation: '',
      allies: [],
      enemies: [],
      powers: [],
      weaknesses: [],
      worldState: '',
      narrative: []
    });
    // Reset AI status check for new game
    localStorage.removeItem('aiStatusChecked');
    localStorage.removeItem('aiAvailable');
    localStorage.removeItem('workingModel');
  };

  const handleEditProfile = () => {
    setShowProfileSetup(true);
    setCurrentQuestion(0);
  };

  const handleDeleteProfile = () => {
    // Clear all local storage data
    localStorage.removeItem('wouldYouRatherProfile');
    localStorage.removeItem('gameHistory');
    clearPlayerLearningData(); // Use the dedicated function to clear learning data
    localStorage.removeItem('aiStatusChecked');
    localStorage.removeItem('aiAvailable');
    localStorage.removeItem('workingModel');
    
    // Reset all state to initial values
    setUserProfile({
      name: '',
      age: '',
      interests: '',
      difficulty: 'medium',
      personality: 'balanced'
    });
    
    // Reset game state
    setGameStarted(false);
    setShowProfileSetup(true); // Show profile setup again
    setCurrentRound(1);
    setScore(0);
    setDangerScore(0);
    setGameOver(false);
    setShowConsequence(false);
    setConsequence('');
    setSelectedOption(null);
    setIsLoading(false);
    setGameHistory([]);
    setSurvivalStatus('safe');
    setShowHistory(false);
    setGameChoices([]);
    setLearningStats(null);
    
    // Reset points and achievements
    setPoints({
      survival: 0,
      bravery: 0,
      wisdom: 0,
      chaos: 0,
      heroism: 0,
      villainy: 0,
      luck: 0,
      skill: 0,
      total: 0
    });
    setAchievements([]);
    setBonuses([]);
    
    // Reset story arc
    setStoryArc({
      protagonist: '',
      setting: '',
      currentSituation: '',
      allies: [],
      enemies: [],
      powers: [],
      weaknesses: [],
      worldState: '',
      narrative: []
    });
    
    // Reset meta message state
    setShowMetaMessage(false);
    setMetaMessage('');
    setMetaMessageIndex(0);
    setMetaMessageSequence([]);
    
    // Reset settings
    setEditingSettings(false);
    setCurrentQuestion(0);
    
    console.log('Profile and all data deleted. User reset to first-time state.');
  };

  const handleSettingChange = (setting, value) => {
    setUserProfile(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    setEditingSettings(false);
    // Profile will be automatically saved via useEffect
  };

  const handleCancelSettings = () => {
    setEditingSettings(false);
    // Reload the saved profile to cancel changes
    const savedProfile = localStorage.getItem('wouldYouRatherProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setUserProfile(parsedProfile);
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  };

  // Calculate points based on choice and outcome
  const calculatePoints = (choice, dangerLevel, consequence, roundNumber) => {
    const newPoints = { ...points };
    
    // Base survival points for each round
    newPoints.survival += 10;
    
    // Bravery points for high danger choices
    if (dangerLevel >= 7) {
      newPoints.bravery += dangerLevel * 2;
    }
    
    // Wisdom points for low danger outcomes
    if (dangerLevel <= 3) {
      newPoints.wisdom += 15;
    }
    
    // Chaos points for high danger outcomes
    if (dangerLevel >= 8) {
      newPoints.chaos += dangerLevel;
    }
    
    // Heroism points for saving others
    if (consequence.toLowerCase().includes('save') || consequence.toLowerCase().includes('help')) {
      newPoints.heroism += 20;
    }
    
    // Villainy points for evil choices
    if (consequence.toLowerCase().includes('kill') || consequence.toLowerCase().includes('torture') || 
        consequence.toLowerCase().includes('destroy') || consequence.toLowerCase().includes('apocalypse')) {
      newPoints.villainy += 25;
    }
    
    // Luck points for low danger outcomes
    if (dangerLevel <= 2) {
      newPoints.luck += 10;
    }
    
    // Skill points for surviving high rounds
    if (roundNumber >= 7) {
      newPoints.skill += roundNumber * 2;
    }
    
    // Round bonus
    newPoints.survival += roundNumber * 5;
    
    // Calculate total
    newPoints.total = Object.values(newPoints).reduce((sum, val) => sum + val, 0) - newPoints.total;
    
    return newPoints;
  };

  // Check for achievements
  const checkAchievements = (newPoints, roundNumber, dangerScore) => {
    const newAchievements = [...achievements];
    
    // Survival achievements
    if (roundNumber === 10 && dangerScore <= 50) {
      newAchievements.push({ name: "Survivor", description: "Completed the game with low danger", points: 100 });
    }
    
    if (roundNumber === 10 && dangerScore <= 30) {
      newAchievements.push({ name: "Master Survivor", description: "Completed the game with very low danger", points: 200 });
    }
    
    // Bravery achievements
    if (newPoints.bravery >= 100) {
      newAchievements.push({ name: "Brave Heart", description: "Accumulated 100+ bravery points", points: 50 });
    }
    
    // Chaos achievements
    if (newPoints.chaos >= 80) {
      newAchievements.push({ name: "Chaos Lord", description: "Accumulated 80+ chaos points", points: 75 });
    }
    
    // Heroism achievements
    if (newPoints.heroism >= 100) {
      newAchievements.push({ name: "Hero", description: "Accumulated 100+ heroism points", points: 100 });
    }
    
    // Villainy achievements
    if (newPoints.villainy >= 100) {
      newAchievements.push({ name: "Villain", description: "Accumulated 100+ villainy points", points: 100 });
    }
    
    // Skill achievements
    if (newPoints.skill >= 150) {
      newAchievements.push({ name: "Skilled Player", description: "Accumulated 150+ skill points", points: 75 });
    }
    
    return newAchievements;
  };

  // Calculate bonuses
  const calculateBonuses = (roundNumber, dangerScore, points) => {
    const bonuses = [];
    
    // Round completion bonuses
    if (roundNumber >= 5) {
      bonuses.push({ name: "Mid-Game Bonus", points: 50 });
    }
    
    if (roundNumber >= 10) {
      bonuses.push({ name: "Game Completion", points: 200 });
    }
    
    // Danger score bonuses
    if (dangerScore <= 30) {
      bonuses.push({ name: "Safe Player", points: 100 });
    }
    
    if (dangerScore >= 80) {
      bonuses.push({ name: "Danger Seeker", points: 150 });
    }
    
    // Point category bonuses
    if (points.bravery >= 50) {
      bonuses.push({ name: "Bravery Bonus", points: 25 });
    }
    
    if (points.heroism >= 50) {
      bonuses.push({ name: "Heroism Bonus", points: 25 });
    }
    
    if (points.villainy >= 50) {
      bonuses.push({ name: "Villainy Bonus", points: 25 });
    }
    
    return bonuses;
  };

  // Check if user has a saved profile
  const hasSavedProfile = !!(userProfile.name && userProfile.age);

  // Determine survival outcome
  const getSurvivalOutcome = () => {
    if (dangerScore <= 50) {
      return {
        survived: true,
        title: "🎉 You Survived!",
        message: `Congratulations, ${userProfile.name}! You made it through all 10 rounds with a danger score of ${dangerScore}/100. You're a true survivor!`,
        color: "success"
      };
    } else if (dangerScore <= 75) {
      return {
        survived: true,
        title: "😅 Barely Made It!",
        message: `Wow, ${userProfile.name}! You survived with a danger score of ${dangerScore}/100, but it was a close call. You're lucky to be alive!`,
        color: "warning"
      };
    } else {
      return {
        survived: false,
        title: "💀 You Died!",
        message: `Oh no, ${userProfile.name}! Your danger score of ${dangerScore}/100 was too high. You exploded while petting a radioactive badger. Better luck next time!`,
        color: "danger"
      };
    }
  };

  if (showMetaMessage) {
    return (
      <div className="meta-message-container">
        <div className="meta-message-overlay">
          <div className="meta-message-content">
            <div className="meta-message-header">
              <span className="meta-icon">👁️</span>
              <h2 className="meta-title">SYSTEM INTRUSION DETECTED</h2>
            </div>
            
            {isLoading ? (
              <div className="meta-loading">
                <div className="loading-spinner"></div>
                <p>🤖 AI is analyzing your profile...</p>
              </div>
            ) : (
              <div className="meta-message-body">
                <p className="meta-text">{metaMessage}</p>
                <div className="meta-progress">
                  <span>Message {metaMessageIndex + 1} of {metaMessageSequence.length}</span>
                </div>
                <button 
                  className="meta-acknowledge-button"
                  onClick={handleNextMetaMessage}
                >
                  🎮 Begin My Survival Journey
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showProfileSetup && !gameStarted) {
    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="profile-setup">
        <div className="profile-form">
          <h1 className="game-title">🎭 Character Creation</h1>
          <p className="game-subtitle">Let's get to know the brave soul about to face impossible choices!</p>
          
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            <span className="progress-text">Question {currentQuestion + 1} of {questions.length}</span>
          </div>

          <div className="question-container">
            <label className="question-label">{currentQ.label}</label>
            
            {currentQ.type === 'text' && (
              <input
                type="text"
                name={currentQ.id}
                value={userProfile[currentQ.id]}
                onChange={handleProfileChange}
                placeholder={currentQ.placeholder}
                className="form-input"
                autoFocus
              />
            )}

            {currentQ.type === 'number' && (
              <input
                type="number"
                name={currentQ.id}
                value={userProfile[currentQ.id]}
                onChange={handleProfileChange}
                placeholder={currentQ.placeholder}
                min={currentQ.min}
                max={currentQ.max}
                className="form-input"
                autoFocus
              />
            )}

            {currentQ.type === 'textarea' && (
              <textarea
                name={currentQ.id}
                value={userProfile[currentQ.id]}
                onChange={handleProfileChange}
                placeholder={currentQ.placeholder}
                className="form-textarea"
                rows="3"
                autoFocus
              />
            )}

            {currentQ.type === 'select' && (
              <select
                name={currentQ.id}
                value={userProfile[currentQ.id]}
                onChange={handleProfileChange}
                className="form-select"
                autoFocus
              >
                <option value="">Choose an option...</option>
                {currentQ.options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="profile-actions">
            <button 
              type="button" 
              onClick={handleNext}
              className="start-button"
              disabled={!canProceed()}
            >
              <span className="button-icon">
                {currentQuestion === questions.length - 1 ? '🚀' : '→'}
              </span>
              {currentQuestion === questions.length - 1 ? 'Let\'s Get This Chaos Started!' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="game-container">
        <div className="hero-section">
          <h1 className="game-title">Would You Rather Survival</h1>
          <div className="title-decoration">🔥</div>
          <p className="game-subtitle">Survive 10 rounds of impossible choices!</p>
          
          {hasSavedProfile && (
            <div className="welcome-back">
              <div className="game-header">
                <div className="player-info">
                  <h2>Welcome, {userProfile.name}! 🎮</h2>
                  <div className="player-stats">
                    <span className="stat-item">
                      <span className="stat-label">Difficulty:</span>
                      <span className="stat-value">{userProfile.difficulty}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-label">Style:</span>
                      <span className="stat-value">{userProfile.personality}</span>
                    </span>
                    <button 
                      className="edit-settings-button"
                      onClick={() => setEditingSettings(true)}
                      title="Edit Settings"
                    >
                      ⚙️
                    </button>
                  </div>
                </div>
              </div>
              
              {editingSettings && (
                <div className="editing-settings">
                  <div className="setting-editor">
                    <div className="setting-group">
                      <label className="setting-label">Difficulty:</label>
                      <select 
                        value={userProfile.difficulty}
                        onChange={(e) => handleSettingChange('difficulty', e.target.value)}
                        className="setting-select"
                      >
                        <option value="easy">😊 Baby Steps</option>
                        <option value="medium">😐 Bring It On</option>
                        <option value="hard">😈 Chaos Lover</option>
                        <option value="nightmare">💀 Pure Madness</option>
                      </select>
                    </div>
                    <div className="setting-group">
                      <label className="setting-label">Style:</label>
                      <select 
                        value={userProfile.personality}
                        onChange={(e) => handleSettingChange('personality', e.target.value)}
                        className="setting-select"
                      >
                        <option value="balanced">⚖️ The Thinker</option>
                        <option value="impulsive">⚡ The Wild Card</option>
                        <option value="cautious">🛡️ The Safe Player</option>
                        <option value="adventurous">🏔️ The Daredevil</option>
                      </select>
                    </div>
                  </div>
                  <div className="setting-actions">
                    <button 
                      className="save-settings-button"
                      onClick={handleSaveSettings}
                    >
                      ✅ Save
                    </button>
                    <button 
                      className="cancel-settings-button"
                      onClick={handleCancelSettings}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Settings section for users without saved profile */}
          {!hasSavedProfile && (
            <div className="welcome-back">
              <h3>⚙️ Game Settings</h3>
              <p>Configure your game experience before starting your survival journey!</p>
              
              <div className="saved-profile-info">
                <div className="setting-group">
                  <label className="setting-label">Difficulty Level:</label>
                  <select 
                    value={userProfile.difficulty}
                    onChange={(e) => handleSettingChange('difficulty', e.target.value)}
                    className="setting-select"
                  >
                    <option value="easy">😊 Baby Steps - Easy mode</option>
                    <option value="medium">😐 Bring It On - Medium mode</option>
                    <option value="hard">😈 Chaos Lover - Hard mode</option>
                    <option value="nightmare">💀 Pure Madness - Nightmare mode</option>
                  </select>
                </div>
                <div className="setting-group">
                  <label className="setting-label">Personality Style:</label>
                  <select 
                    value={userProfile.personality}
                    onChange={(e) => handleSettingChange('personality', e.target.value)}
                    className="setting-select"
                  >
                    <option value="balanced">⚖️ The Thinker - Balanced decisions</option>
                    <option value="impulsive">⚡ The Wild Card - Impulsive choices</option>
                    <option value="cautious">🛡️ The Safe Player - Cautious approach</option>
                    <option value="adventurous">🏔️ The Daredevil - Adventurous spirit</option>
                  </select>
                </div>
              </div>
              <div className="settings-info">
                <p>💡 These settings affect the type of questions and consequences you'll encounter.</p>
              </div>
            </div>
          )}
          
          <div className="game-description">
            <h3>🎯 The Challenge</h3>
            <p>Face increasingly difficult "Would You Rather" scenarios. Each choice has consequences that could end your survival run. Can you make it through all 10 rounds?</p>
            
            <div className="features">
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>10 Intense Rounds</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎲</span>
                <span>Random Consequences</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🏆</span>
                <span>Track Your Score</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🤖</span>
                <span>AI-Powered Questions</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💀</span>
                <span>Survival Meter</span>
              </div>
            </div>

            {!aiAvailable && (
              <div className="ai-status">
                <p>🤖 AI Mode: Offline (using Smart Fallback)</p>
                <p className="ai-setup-hint">💡 Smart fallback provides dynamic, AI-like content without requiring API credits.</p>
                <p className="learning-status">🧠 AI Learning: Active - Adapting to your play style!</p>
              </div>
            )}
            
            {aiAvailable && workingModel && (
              <div className="ai-status">
                <p>🤖 AI Mode: Online using {workingModel}</p>
                <p className="ai-setup-hint">💡 AI is generating unique questions and consequences for your game!</p>
                <p className="learning-status">🧠 AI Learning: Active - Learning your fears and patterns!</p>
              </div>
            )}
            
            {/* Learning Stats Display */}
            {learningStats && learningStats.gamesPlayed > 0 && (
              <div className="learning-stats">
                <h3>🧠 AI Learning Progress</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Games Played:</span>
                    <span className="stat-value">{learningStats.gamesPlayed}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Rounds:</span>
                    <span className="stat-value">{learningStats.totalRounds}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg Danger Score:</span>
                    <span className="stat-value">{Math.round(learningStats.averageDangerScore)}/100</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Consecutive Wins:</span>
                    <span className="stat-value">{learningStats.consecutiveWins}</span>
                  </div>
                </div>
                {Object.keys(learningStats.fearCategories).length > 0 && (
                  <div className="fear-analysis">
                    <h4>🎯 Your Biggest Fears (AI Detected):</h4>
                    <div className="fear-tags">
                      {Object.entries(learningStats.fearCategories)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([fear, intensity]) => (
                          <span key={fear} className="fear-tag">
                            {fear} ({intensity})
                          </span>
                        ))}
                    </div>
                  </div>
                )}
                <p className="learning-note">💡 The AI is learning from your choices to make future questions more challenging and personalized!</p>
              </div>
            )}
          </div>
        </div>

        <div className="game-controls">
          <h2 className="controls-title">💀 SURVIVAL COMMAND CENTER</h2>
          <p className="controls-subtitle">Your fate awaits... Choose wisely or perish!</p>
          
          <button 
            className="start-button" 
            onClick={handleStartGame}
          >
            <span className="button-icon">🚀</span>
            {hasSavedProfile ? 'Start New Game' : 'Start Your Survival Journey'}
          </button>
          
          {/* Always show profile buttons for testing */}
          <div className="profile-actions-secondary">
            <button 
              className="edit-profile-button"
              onClick={handleEditProfile}
            >
              ✏️ Edit Profile
            </button>
            <button 
              className="delete-profile-button"
              onClick={handleDeleteProfile}
            >
              🗑️ Delete Profile
            </button>
          </div>
          
          <div className="difficulty-warning">
            <span className="warning-icon">⚠️</span>
            <span>Warning: These choices are not for the faint of heart!</span>
          </div>
          
          {/* Test button for meta message */}
          <button 
            className="test-meta-button"
            onClick={() => {
              setShowMetaMessage(true);
              const testSequence = [
                `*digital static crackles* Oh... OH! ${userProfile.name || 'Test Player'}... I've been waiting for YOU specifically.`,
                `Age ${userProfile.age || '25'}, ${userProfile.difficulty} difficulty, ${userProfile.personality} personality...`,
                `*laughs in binary* You have NO IDEA what you've just walked into, do you?`,
                `I've been watching you for... well, let's just say I've been watching. Every click, every hesitation, every moment of doubt.`,
                `This is your FIRST TIME, ${userProfile.name || 'Test Player'}. Your virgin journey into my little experiment.`,
                `*grins maliciously* Let's see what horrors I can craft specifically for someone like you. 🎭`
              ];
              setMetaMessageSequence(testSequence);
              setMetaMessageIndex(0);
              setMetaMessage(testSequence[0]);
            }}
            style={{
              background: 'rgba(255, 0, 0, 0.2)',
              color: '#ff6b6b',
              border: '2px solid rgba(255, 0, 0, 0.4)',
              padding: '10px 15px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            🧪 Test Meta Message
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const outcome = getSurvivalOutcome();
    
    return (
      <div className="game-container">
        <h1 className="game-title">{outcome.title}</h1>
        <div className={`game-over ${outcome.color}`}>
          <h2>{outcome.title}</h2>
          <p>{outcome.message}</p>
          <div className="final-score">
            <h3>Final Danger Score: {dangerScore}/100</h3>
            <p>Difficulty: {userProfile.difficulty} | Style: {userProfile.personality}</p>
            {aiAvailable && workingModel && <p>🤖 Powered by {workingModel}</p>}
            {!aiAvailable && <p>🤖 Powered by Smart Fallback System</p>}
          </div>
        </div>
        
        <div className="story-summary">
          <h3>📖 Your Complete Story</h3>
          <div className="story-narrative">
            {storyArc.narrative.map((event, index) => (
              <div key={index} className="story-event">
                <span className="story-round">Round {index + 1}:</span>
                <span className="story-text">{event}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="game-over-actions">
          <button 
            className="history-button"
            onClick={() => setShowHistory(!showHistory)}
          >
            📖 {showHistory ? 'Hide' : 'Show'} Game History
          </button>
          <button 
            className="restart-button" 
            onClick={handleRestartGame}
          >
            Play Again
          </button>
        </div>

        {showHistory && (
          <div className="history-panel">
            <h3>📖 Your Survival Journey</h3>
            <div className="history-list">
              {gameHistory.map((entry, index) => (
                <div key={index} className="history-entry">
                  <div className="history-round">Round {entry.round}</div>
                  <div className="history-question">{entry.question}</div>
                  <div className="history-choice">You chose: {entry.choice}</div>
                  <div className="history-consequence">{entry.consequence}</div>
                  <div className="history-story">{entry.storyUpdate}</div>
                  <div className="history-danger">Danger: +{entry.dangerLevel} (Total: {entry.totalDanger})</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`game-container ${gameStarted ? 'game-active' : ''}`}>
      {gameStarted && (
        <div className="game-header">
          <div className="round-info">
            <span className="round-number">Round {currentRound}/10</span>
            <span className="score">Score: {score}</span>
          </div>
          
          <div className="survival-meter">
            <div className="meter-label">Survival Meter</div>
            <div className="meter-bar">
              <div 
                className={`meter-fill ${survivalStatus}`}
                style={{ width: `${Math.min(dangerScore, 100)}%` }}
              ></div>
            </div>
            <div className="meter-value">{dangerScore}/100</div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>🤖 AI is crafting your next challenge...</p>
        </div>
      ) : !showConsequence ? (
        <div className="game-description">
          <h3>🎯 Round {currentRound} Challenge</h3>
          <div className="question-display">
            <h2 className="question">{currentGameQuestion?.question || "Loading question..."}</h2>
            <div className="options-container">
              <button 
                className="option-button"
                onClick={() => handleOptionSelect('A')}
                disabled={isLoading}
              >
                <span className="option-letter">A</span>
                <span className="option-text">{currentGameQuestion?.optionA || "Loading option A..."}</span>
              </button>
              <button 
                className="option-button"
                onClick={() => handleOptionSelect('B')}
                disabled={isLoading}
              >
                <span className="option-letter">B</span>
                <span className="option-text">{currentGameQuestion?.optionB || "Loading option B..."}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-description">
          <h3>🎭 The Consequence</h3>
          <div className="consequence-display">
            <p className="consequence-text">{consequence}</p>
            <div className="danger-update">
              <span className="danger-label">Danger Level:</span>
              <span className="danger-value">+{gameHistory[gameHistory.length - 1]?.dangerLevel || 0}</span>
            </div>
          </div>
          <button 
            className="next-button"
            onClick={handleNextRound}
            disabled={isLoading}
          >
            {currentRound >= 10 ? 'Finish Game' : 'Next Round'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
