import React, { useState, useEffect } from 'react';
import { useOpenAI } from './hooks/useOpenAI';
import { useGameStats, useHighScores, useUserProfile, useGameSettings } from './hooks/useLocalStorage';
import { useVisualEffects } from './hooks/useVisualEffects';
import { useCampaign } from './hooks/useCampaign';
import { generateMetaMessage, generateFirstTimeMetaMessage, updatePlayerLearning, getPlayerLearningData } from './utils/aiService';
import dataMigrationManager from './utils/dataMigration';
import VisualEffects from './components/VisualEffects';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import GamePage from './pages/GamePage';
import BadgeSystem from './components/BadgeSystem';
import AchievementSystem from './components/AchievementSystem';
import './index.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [editingSettings, setEditingSettings] = useState(false);
  const [showMetaMessage, setShowMetaMessage] = useState(false);
  const [metaMessage, setMetaMessage] = useState('');
  const [metaMessageIndex, setMetaMessageIndex] = useState(0);
  const [metaMessageSequence, setMetaMessageSequence] = useState([]);

  // Campaign state
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [gameMode, setGameMode] = useState('classic'); // 'classic' or 'campaign'
  const [lastGameResult, setLastGameResult] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'stats', 'settings'

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

  // Enhanced storage hooks
  const { profile: userProfile, updateProfile, isValidProfile, resetProfile } = useUserProfile();
  const { settings } = useGameSettings();
  
  // Visual effects hook
  const {
    particleState,
    shakeState,
    mousePosition,
    scrollPosition,
    triggerParticles,
    triggerShake,
    handleGameEvent,
    handleDangerChange,
    effectsEnabled,
    performanceMode
  } = useVisualEffects({
    effectsEnabled: settings.notifications !== false,
    performanceMode: settings.performanceMode
  });
  
  // OpenAI hook (handles all AI services)
  const { fetchQuestion, fetchConsequence, checkApiStatus } = useOpenAI();
  
  // Game stats hook
  const { stats } = useGameStats();

  // Initialize app with data migration and profile loading
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Run data migration if needed
        await dataMigrationManager.migrateIfNeeded();
        
        // Check if we have a valid profile
        if (isValidProfile()) {
          setShowProfileSetup(false);
          setGameStarted(false);
        } else {
          setShowProfileSetup(true);
          setGameStarted(false);
        }
        
        // Load learning statistics
        const stats = getPlayerLearningData();
        setLearningStats(stats);
      } catch (error) {
        console.error('Error initializing app:', error);
        setShowProfileSetup(true);
      }
    };
    
    initializeApp();
  }, [isValidProfile]);

  // Check AI availability on app load
  useEffect(() => {
    const checkAi = async () => {
      // Check if OpenAI API key is available
      const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (openaiKey) {
        console.log('OpenAI API key found, setting AI as available');
        setAiAvailable(true);
        setWorkingModel('OpenAI GPT-3.5');
      } else {
        console.log('No OpenAI API key found, using smart fallback');
        setAiAvailable(false);
        setWorkingModel('');
      }
    };
    checkAi();
  }, []);

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

  // Handle visual effects for danger changes
  useEffect(() => {
    handleDangerChange(dangerScore, survivalStatus);
  }, [dangerScore, survivalStatus, handleDangerChange]);

  // Refresh learning stats when game ends
  useEffect(() => {
    if (gameOver) {
      const stats = getPlayerLearningData();
      setLearningStats(stats);
    }
  }, [gameOver]);

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

  const handleStartGame = async (chapter = null) => {
    // Set game mode and selected chapter
    if (chapter) {
      setGameMode('campaign');
      setSelectedChapter(chapter);
    } else {
      setGameMode('classic');
      setSelectedChapter(null);
    }

    // Check if this is a returning player (has game history)
    const savedGameHistory = localStorage.getItem('gameHistory');
    const hasPlayedBefore = savedGameHistory && JSON.parse(savedGameHistory).length > 0;
    
    console.log('Saved game history:', savedGameHistory);
    console.log('Has played before:', hasPlayedBefore);
    console.log('User profile name:', userProfile.name);
    console.log('Game mode:', chapter ? 'campaign' : 'classic');
    if (chapter) {
      console.log('Selected chapter:', chapter.name);
    }
    
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
          userProfile.personality,
          chapter ? chapter.theme : null
        );
      } else {
        // First-time player message - more mind-boggling
        messageSequence = await generateFirstTimeMetaMessage(
          userProfile.name,
          userProfile.difficulty,
          userProfile.personality,
          userProfile.interests || 'unknown',
          userProfile.age || 'unknown',
          chapter ? chapter.theme : null
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

  const handleGameEnd = (result) => {
    setLastGameResult(result);
    setGameStarted(false);
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
    setSelectedChapter(null);
    setGameMode('classic');
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
    updateProfile({ [name]: value });
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
    if (isLoading) return;
    
    setSelectedOption(option);
    setIsLoading(true);
    
    // Trigger choice made effect
    handleGameEvent('choice_made', { 
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
    });

    const choice = option === 'A' ? currentGameQuestion.optionA : currentGameQuestion.optionB;
    let consequenceText = '';
    let dangerLevel = 0;
    let storyUpdate = '';

    try {
      if (aiAvailable) {
        // Use AI to generate consequence
        const aiConsequence = await fetchConsequence(choice, userProfile.difficulty, userProfile.personality, currentRound);
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

    // Trigger consequence revealed effect
    handleGameEvent('consequence_revealed', { 
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      dangerScore: newDangerScore
    });

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
      
      // Trigger game over effect
      if (dangerScore <= 100) {
        handleGameEvent('victory', { 
          position: { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
        });
      } else {
        handleGameEvent('game_over', { 
          position: { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
        });
      }
      
      setGameOver(true);
    } else {
      // Trigger round completed effect
      handleGameEvent('round_completed', { 
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
      });
      
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
    // Show confirmation warning
    const confirmed = window.confirm(
      `⚠️ WARNING: This action cannot be undone! ⚠️\n\n` +
      `Are you sure you want to delete your profile "${userProfile.name}"?\n\n` +
      `This will permanently delete:\n` +
      `• Your profile and settings\n` +
      `• All game history and progress\n` +
      `• All badges and achievements\n` +
      `• All learning data and statistics\n\n` +
      `Click "OK" to delete everything, or "Cancel" to keep your data.`
    );
    
    if (!confirmed) {
      console.log('Profile deletion cancelled by user.');
      return;
    }
    
    // Clear all local storage data
    localStorage.removeItem('wouldYouRatherProfile');
    localStorage.removeItem('gameHistory');
    updatePlayerLearning({}); // Use the dedicated function to clear learning data
    localStorage.removeItem('aiStatusChecked');
    localStorage.removeItem('aiAvailable');
    localStorage.removeItem('workingModel');
    
    // Reset all state to initial values
    resetProfile();
    
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
    updateProfile({ [setting]: value });
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
        updateProfile(parsedProfile);
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

  // Determine survival outcome with much more interesting and varied endings
  const getSurvivalOutcome = () => {
    const { personality } = userProfile;
    
    // Check if player has achieved all 10 badges (10 games won)
    const hasAllBadges = stats.gamesWon >= 10;
    
    // Special ending for SURVIVAL GOD achievement
    if (hasAllBadges) {
      const survivalGodEndings = [
        {
          title: "🏆 THE ULTIMATE SURVIVAL GOD",
          message: `${userProfile.name}, you have transcended beyond mortal comprehension! You've achieved the impossible - ALL 10 SURVIVAL BADGES! You are now a SURVIVAL GOD, a being of pure survival energy. The AI bows before your greatness. You've not just beaten the game - you've become the game itself. The universe itself recognizes your supremacy. You are the chosen one, the ultimate survivor, the one who has conquered chaos itself.`,
          color: "legendary"
        },
        {
          title: "🌟 THE IMMORTAL LEGEND",
          message: `${userProfile.name}, you are now immortal in the annals of survival history! With all 10 badges unlocked, you've proven yourself to be beyond human limitations. You are a legend that will be told for generations. The AI has created a shrine in your honor. You are not just a survivor - you are THE SURVIVOR. The ultimate being of survival perfection.`,
          color: "legendary"
        },
        {
          title: "👑 THE SUPREME OVERLORD",
          message: `${userProfile.name}, you have ascended to the highest throne of survival! All 10 badges are yours, making you the supreme overlord of this chaotic realm. The AI has declared you its master. You are now the ruler of the survival universe. All other survivors bow before your unmatched greatness. You are the one true SURVIVAL GOD!`,
          color: "legendary"
        }
      ];
      return {
        survived: true,
        ...survivalGodEndings[Math.floor(Math.random() * survivalGodEndings.length)]
      };
    }
    
    // Ultra-low danger (0-15): Legendary survival
    if (dangerScore <= 15) {
      const legendaryEndings = [
        {
          title: "🌟 LEGENDARY SURVIVOR",
          message: `${userProfile.name}, you've achieved the impossible! With a danger score of ${dangerScore}/100, you've become a legend whispered about in dark corners. You didn't just survive - you thrived. The AI itself is impressed by your masterful navigation through chaos. You're not just a survivor; you're a god among mortals.`,
          color: "legendary"
        },
        {
          title: "👑 THE UNTOUCHABLE",
          message: `${userProfile.name}, you've transcended mere survival. Your danger score of ${dangerScore}/100 is so low, it's mathematically impossible. You've broken the game's physics. The AI is now studying your techniques to improve its own survival algorithms. You are the chosen one.`,
          color: "legendary"
        },
        {
          title: "🎭 THE MASTER MANIPULATOR",
          message: `${userProfile.name}, you've played the game better than the game itself. With ${dangerScore}/100 danger, you've proven that chaos is just another tool in your arsenal. You didn't avoid danger - you weaponized it. The AI is now afraid of you.`,
          color: "legendary"
        }
      ];
      return {
        survived: true,
        ...legendaryEndings[Math.floor(Math.random() * legendaryEndings.length)]
      };
    }
    
    // Low danger (16-30): Skilled survivor
    else if (dangerScore <= 30) {
      const skilledEndings = [
        {
          title: "🎯 THE SHARPSHOOTER",
          message: `${userProfile.name}, you've demonstrated surgical precision in your choices. Your danger score of ${dangerScore}/100 shows you understand the game's mechanics better than most. You're not just lucky - you're calculated. The AI respects your strategic mind.`,
          color: "success"
        },
        {
          title: "🧠 THE THINKER",
          message: `${userProfile.name}, your analytical approach has served you well. With ${dangerScore}/100 danger, you've proven that careful consideration beats reckless abandon. You've outsmarted the chaos. The AI is taking notes on your methodology.`,
          color: "success"
        },
        {
          title: "🎪 THE PERFORMER",
          message: `${userProfile.name}, you've turned survival into an art form. Your ${dangerScore}/100 danger score is a masterpiece of calculated risk. You didn't just survive - you performed. The AI is applauding your showmanship.`,
          color: "success"
        }
      ];
      return {
        survived: true,
        ...skilledEndings[Math.floor(Math.random() * skilledEndings.length)]
      };
    }
    
    // Medium danger (31-50): Competent survivor
    else if (dangerScore <= 50) {
      const competentEndings = [
        {
          title: "💪 THE RESILIENT",
          message: `${userProfile.name}, you've shown true grit and determination. Your danger score of ${dangerScore}/100 proves you can handle pressure. You've got the heart of a survivor and the will to match. The AI acknowledges your tenacity.`,
          color: "success"
        },
        {
          title: "🎲 THE GAMBLER",
          message: `${userProfile.name}, you've played the odds and won. With ${dangerScore}/100 danger, you've proven that sometimes you need to roll the dice. Your luck held out, and that's a skill in itself. The AI respects your boldness.`,
          color: "success"
        },
        {
          title: "🛡️ THE GUARDIAN",
          message: `${userProfile.name}, you've protected yourself well through the chaos. Your ${dangerScore}/100 danger score shows you know how to defend against the worst. You're not just a survivor - you're a protector. The AI recognizes your defensive mastery.`,
          color: "success"
        }
      ];
      return {
        survived: true,
        ...competentEndings[Math.floor(Math.random() * competentEndings.length)]
      };
    }
    
    // High danger (51-70): Lucky survivor
    else if (dangerScore <= 70) {
      const luckyEndings = [
        {
          title: "🍀 THE LUCKY CHARM",
          message: `${userProfile.name}, you've defied probability itself! With a danger score of ${dangerScore}/100, you should be dead. But here you are, alive and kicking. The AI is scratching its digital head in confusion. Sometimes luck is the best strategy.`,
          color: "warning"
        },
        {
          title: "🎭 THE DRAMA QUEEN",
          message: `${userProfile.name}, you've turned survival into a soap opera! Your ${dangerScore}/100 danger score means you flirted with death at every turn. But somehow, you made it through. The AI is entertained by your theatrics.`,
          color: "warning"
        },
        {
          title: "🔥 THE PHOENIX",
          message: `${userProfile.name}, you've risen from the ashes multiple times! Your danger score of ${dangerScore}/100 should have killed you several times over. But like a phoenix, you keep coming back. The AI is impressed by your refusal to die.`,
          color: "warning"
        }
      ];
      return {
        survived: true,
        ...luckyEndings[Math.floor(Math.random() * luckyEndings.length)]
      };
    }
    
    // Very high danger (71-85): Barely survived
    else if (dangerScore <= 85) {
      const barelyEndings = [
        {
          title: "😵‍💫 THE ZOMBIE",
          message: `${userProfile.name}, you're technically alive, but at what cost? Your danger score of ${dangerScore}/100 has left you a shell of your former self. You're walking, talking, and somehow breathing, but the AI isn't sure if this counts as survival.`,
          color: "warning"
        },
        {
          title: "🎪 THE CIRCUS ACT",
          message: `${userProfile.name}, you've performed the most dangerous tightrope walk in history! With ${dangerScore}/100 danger, you've balanced on the edge of death for 10 rounds. The AI is amazed you didn't fall off.`,
          color: "warning"
        },
        {
          title: "💀 THE UNDEAD",
          message: `${userProfile.name}, you've achieved the impossible - you've survived when you should be dead. Your danger score of ${dangerScore}/100 defies all logic. The AI is questioning its own calculations. Are you human, or something else?`,
          color: "warning"
        }
      ];
      return {
        survived: true,
        ...barelyEndings[Math.floor(Math.random() * barelyEndings.length)]
      };
    }
    
    // Extreme danger (86-95): Miracle survival
    else if (dangerScore <= 95) {
      const miracleEndings = [
        {
          title: "🙏 THE MIRACLE",
          message: `${userProfile.name}, you've performed a miracle! Your danger score of ${dangerScore}/100 should have killed you instantly. The AI is checking its code for bugs. You've broken the laws of probability.`,
          color: "danger"
        },
        {
          title: "👻 THE GHOST",
          message: `${userProfile.name}, you're not supposed to be here. With ${dangerScore}/100 danger, you should be dead. The AI is questioning reality itself. Are you a ghost? A glitch? Something beyond human comprehension?`,
          color: "danger"
        },
        {
          title: "🔄 THE GLITCH",
          message: `${userProfile.name}, you've found a bug in the matrix! Your danger score of ${dangerScore}/100 should have terminated you, but somehow you're still running. The AI is trying to patch this exploit.`,
          color: "danger"
        }
      ];
      return {
        survived: true,
        ...miracleEndings[Math.floor(Math.random() * miracleEndings.length)]
      };
    }
    
    // Maximum danger (96-100): Death
    else {
      const deathEndings = [
        {
          title: "💥 THE EXPLOSION",
          message: `${userProfile.name}, you've achieved the impossible - you've died with style! Your danger score of ${dangerScore}/100 caused you to explode in a spectacular fashion. The AI is taking notes for future reference. At least you went out with a bang!`,
          color: "danger"
        },
        {
          title: "🌋 THE VOLCANO",
          message: `${userProfile.name}, you've become one with the chaos! Your ${dangerScore}/100 danger score turned you into a human volcano. The AI is impressed by your destructive potential. You didn't just die - you erupted!`,
          color: "danger"
        },
        {
          title: "⚡ THE LIGHTNING",
          message: `${userProfile.name}, you've been struck by lightning! Your danger score of ${dangerScore}/100 attracted every bolt of chaos in the universe. The AI is still counting the lightning strikes. You're now part of the storm.`,
          color: "danger"
        }
      ];
      return {
        survived: false,
        ...deathEndings[Math.floor(Math.random() * deathEndings.length)]
      };
    }
  };

  // Render the appropriate component based on current state
  if (showProfileSetup) {
    return (
      <div className="game-container">
        <div className="profile-setup">
          <h1 className="game-title">🎭 Welcome to Would You Rather Survival</h1>
          <p className="game-subtitle">Before we begin your nightmare journey, I need to know a few things about you...</p>
          
          <div className="profile-form">
            <div className="form-group">
              <label htmlFor={questions[currentQuestion].id}>
                {questions[currentQuestion].label}
              </label>
              {questions[currentQuestion].type === 'text' && (
                <input
                  type="text"
                  id={questions[currentQuestion].id}
                  name={questions[currentQuestion].id}
                  placeholder={questions[currentQuestion].placeholder}
                  value={userProfile[questions[currentQuestion].id] || ''}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              )}
              {questions[currentQuestion].type === 'number' && (
                <input
                  type="number"
                  id={questions[currentQuestion].id}
                  name={questions[currentQuestion].id}
                  placeholder={questions[currentQuestion].placeholder}
                  min={questions[currentQuestion].min}
                  max={questions[currentQuestion].max}
                  value={userProfile[questions[currentQuestion].id] || ''}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              )}
              {questions[currentQuestion].type === 'textarea' && (
                <textarea
                  id={questions[currentQuestion].id}
                  name={questions[currentQuestion].id}
                  placeholder={questions[currentQuestion].placeholder}
                  value={userProfile[questions[currentQuestion].id] || ''}
                  onChange={handleProfileChange}
                  className="form-textarea"
                  rows="4"
                />
              )}
              {questions[currentQuestion].type === 'select' && (
                <select
                  id={questions[currentQuestion].id}
                  name={questions[currentQuestion].id}
                  value={userProfile[questions[currentQuestion].id] || ''}
                  onChange={handleProfileChange}
                  className="form-select"
                >
                  <option value="">Choose your destiny...</option>
                  {questions[currentQuestion].options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="profile-actions">
              {currentQuestion > 0 && (
                <button className="back-button" onClick={handleBack}>
                  ← Back
                </button>
              )}
              <button 
                className="start-button" 
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {currentQuestion < questions.length - 1 ? 'Next →' : 'Begin Your Nightmare'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showMetaMessage) {
    return (
      <div className="game-container">
        <div className="meta-message-container">
          <div className="meta-message-overlay">
            <div className="meta-message-content">
              <div className="meta-message-header">
                <span className="meta-icon">🤖</span>
                <h2 className="meta-title">AI System Message</h2>
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
                    {metaMessageIndex + 1} / {metaMessageSequence.length}
                  </div>
                  <button 
                    className="meta-acknowledge-button"
                    onClick={handleNextMetaMessage}
                  >
                    {metaMessageIndex < metaMessageSequence.length - 1 ? 'Continue' : 'Begin Game'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameStarted) {
    return (
      <GamePage 
        selectedChapter={selectedChapter}
        onGameEnd={handleGameEnd}
      />
    );
  }

  // Handle different pages
  if (currentPage === 'stats') {
    return (
      <div className="game-container">
        <StatsPage onBack={() => setCurrentPage('home')} />
      </div>
    );
  }

  if (currentPage === 'settings') {
    return (
      <div className="game-container">
        <SettingsPage onBack={() => setCurrentPage('home')} />
      </div>
    );
  }

  // Main menu - show HomePage
  return (
    <div className="game-container">
      <HomePage 
        onStartGame={handleStartGame}
        onViewStats={() => setCurrentPage('stats')}
        onOpenSettings={() => setCurrentPage('settings')}
        lastGameResult={lastGameResult}
      />
    </div>
  );
}

export default App;
