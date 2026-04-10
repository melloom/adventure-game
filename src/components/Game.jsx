import React, { useState, useEffect } from 'react';
import { generateQuestion, generateConsequence, generateAdvancedConsequence, calculateSurvival, generateDynamicGameMessage, testApiStatus, resetAIPersonality, getCurrentAIPersonality, getAIPersonalityState } from '../utils/aiService';
import { useAIPersonality } from '../hooks/useAIPersonality';
import { useCampaign } from '../hooks/useCampaign';
import AIPersonalityInterface from './AIPersonalityInterface';
import AdvancedAISystems from './AdvancedAISystems';
import AIPsychologicalManipulation from './AIPsychologicalManipulation';
import aiPersonalitySystem from '../utils/aiPersonalitySystem';

const Game = ({ selectedChapter, onGameEnd, onBackToMenu }) => {
  const [gameState, setGameState] = useState('loading'); // loading, playing, consequence, story, gameOver, cutscene
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState('');
  const [consequence, setConsequence] = useState('');
  const [dangerLevel, setDangerLevel] = useState(0);
  const [survived, setSurvived] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Campaign state
  const [isCampaignMode, setIsCampaignMode] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [showCutscene, setShowCutscene] = useState(false);
  const [currentCutscene, setCurrentCutscene] = useState(null);
  const [cutsceneIndex, setCutsceneIndex] = useState(0);
  
  // Story narrative state
  const [storyMessage, setStoryMessage] = useState('');
  const [showStory, setShowStory] = useState(false);
  const [playerChoices, setPlayerChoices] = useState([]);
  const [playerName, setPlayerName] = useState('Survivor');
  const [difficulty, setDifficulty] = useState('medium');
  const [personality, setPersonality] = useState('balanced');
  const [survivalStatus, setSurvivalStatus] = useState('safe');
  const [aiStatus, setAiStatus] = useState(null); // 'online' | 'offline' | null
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [leaveAttempts, setLeaveAttempts] = useState(0);
  const [leaveMessage, setLeaveMessage] = useState('');

  // AI Personality System
  const {
    currentPersonality,
    relationshipLevel,
    updateRelationship,
    rememberChoice,
    getPersonalizedTaunt,
    generateFearBasedQuestion,
    generateRelationshipMessage,
    shouldChangePersonality,
    randomPersonalityChange,
    getPersonalityColor,
    getPersonalityIcon,
    setPersonality: setAIPersonality
  } = useAIPersonality();

  // Campaign System
  const {
    getChapterAIPersonality,
    getChapterDifficulty,
    getChapterStory,
    getCutscene,
    completeChapter,
    setStoryFlag,
    getStoryFlag
  } = useCampaign();

  // Personality state
  const [showTaunt, setShowTaunt] = useState(false);
  const [showRelationship, setShowRelationship] = useState(false);
  const [personalityChanged, setPersonalityChanged] = useState(false);

  // Lie detection state
  const [userInfo, setUserInfo] = useState({});
  const [userResponses, setUserResponses] = useState([]);
  const [detectedLies, setDetectedLies] = useState([]);
  const [lieDetectionMessage, setLieDetectionMessage] = useState('');
  const [showLieDetection, setShowLieDetection] = useState(false);

  // Mini-game state
  const [miniGame, setMiniGame] = useState(null);
  const [miniGameDifficulty, setMiniGameDifficulty] = useState('medium');
  const [miniGameTriggered, setMiniGameTriggered] = useState(false);
  const [showMiniGameTransition, setShowMiniGameTransition] = useState(false);
  
  // Advanced AI Systems state
  const [showAdvancedAI, setShowAdvancedAI] = useState(false);
  const [showPsychologicalManipulation, setShowPsychologicalManipulation] = useState(false);

  // Initialize the game
  useEffect(() => {
    // Reset AI personality for new game
    resetAIPersonality();
    
    // Get player profile from localStorage
    const savedProfile = localStorage.getItem('wouldYouRatherProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setPlayerName(profile.name || 'Survivor');
        setDifficulty(profile.difficulty || 'medium');
        setPersonality(profile.personality || 'balanced');
        
        // Store user info for lie detection
        setUserInfo({
          name: profile.name || 'Survivor',
          age: profile.age || null,
          location: profile.location || null
        });
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
    
    // Check if this is campaign mode
    if (selectedChapter) {
      setIsCampaignMode(true);
      setCurrentChapter(selectedChapter);
      
      // Set chapter-specific AI personality
      const chapterAI = getChapterAIPersonality(selectedChapter.id);
      if (chapterAI) {
        setAIPersonality(selectedChapter.aiPersonality);
      }
      
      // Show intro cutscene if available
      const story = getChapterStory(selectedChapter.id);
      if (story && story.cutscenes && story.cutscenes.length > 0) {
        setCurrentCutscene(story.cutscenes[0]);
        setShowCutscene(true);
        setGameState('cutscene');
        return;
      }
    }
    
    startNewRound();
  }, [selectedChapter, getChapterAIPersonality, getChapterStory, setAIPersonality]);

  // Check AI status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const status = await testApiStatus();
        setAiStatus(status.available ? 'online' : 'offline');
      } catch {
        setAiStatus('offline');
      }
    }
    checkStatus();
  }, []);

  // Update survival status based on danger level
  useEffect(() => {
    if (dangerLevel <= 3) {
      setSurvivalStatus('safe');
    } else if (dangerLevel <= 6) {
      setSurvivalStatus('warning');
    } else if (dangerLevel <= 8) {
      setSurvivalStatus('danger');
    } else {
      setSurvivalStatus('critical');
    }
  }, [dangerLevel]);

  // Check for chaotic personality change (only in classic mode)
  useEffect(() => {
    if (!isCampaignMode && shouldChangePersonality()) {
      const newPersonality = randomPersonalityChange();
      setPersonalityChanged(true);
      // Hide the change indicator after 3 seconds
      setTimeout(() => setPersonalityChanged(false), 3000);
    }
  }, [currentRound, shouldChangePersonality, randomPersonalityChange, isCampaignMode]);

  // Update chapter progress
  useEffect(() => {
    if (isCampaignMode && currentChapter) {
      const progress = (currentRound - 1) / currentChapter.rounds * 100;
      setChapterProgress(progress);
    }
  }, [currentRound, isCampaignMode, currentChapter]);

  // Enhanced mini-game triggering system
  useEffect(() => {
    if (gameState === 'consequence' && !miniGameTriggered) {
      // Trigger mini-games based on danger level and round
      const shouldTrigger = shouldTriggerMiniGame();
      
      if (shouldTrigger) {
        const gameType = selectMiniGameType();
        const difficulty = calculateMiniGameDifficulty();
        
        setMiniGame(gameType);
        setMiniGameDifficulty(difficulty);
        setMiniGameTriggered(true);
        setShowMiniGameTransition(true);
        
        // Hide transition after 2 seconds
        setTimeout(() => {
          setShowMiniGameTransition(false);
        }, 2000);
      }
    }
  }, [gameState, dangerLevel, currentRound, miniGameTriggered]);

  const generateStoryNarrative = async () => {
    try {
      let story;
      
      if (isCampaignMode && currentChapter) {
        // Use chapter-specific story generation
        const chapterStory = getChapterStory(currentChapter.id);
        const chapterAI = getChapterAIPersonality(currentChapter.id);
        
        story = await generateDynamicGameMessage(
          playerName,
          currentRound,
          dangerLevel * 10,
          survivalStatus,
          playerChoices,
          difficulty,
          currentChapter.aiPersonality,
          consequence,
          chapterAI?.voicePatterns || [],
          currentChapter.theme
        );
      } else {
        // Classic mode story generation
        story = await generateDynamicGameMessage(
          playerName,
          currentRound,
          dangerLevel * 10,
          survivalStatus,
          playerChoices,
          difficulty,
          personality,
          consequence
        );
      }
      
      setStoryMessage(story);
      setShowStory(true);
    } catch (error) {
      console.error('Error generating story narrative:', error);
      // Fallback story
      setStoryMessage(`*digital static crackles* ${playerName}... Round ${currentRound} complete. Your choice has consequences. The game continues...`);
      setShowStory(true);
    }
  };

  const startNewRound = async () => {
    setIsLoading(true);
    setGameState('loading');
    
    try {
      // Run lie detection before generating question
      const lies = aiPersonalitySystem.detectLies(userInfo, userResponses);
      setDetectedLies(lies || []);
      
      if (lies && lies.length > 0) {
        const personality = isCampaignMode && currentChapter 
          ? currentChapter.aiPersonality 
          : currentPersonality;
        
        const lieResponse = aiPersonalitySystem.generateLieDetectionResponse(lies, personality);
        if (lieResponse) {
          setLieDetectionMessage(lieResponse);
          setShowLieDetection(true);
        }
      }
      
      let questionData;
      
      if (isCampaignMode && currentChapter) {
        // Campaign mode question generation
        const chapterAI = getChapterAIPersonality(currentChapter.id);
        const chapterDifficulty = getChapterDifficulty(currentChapter.id);
        
        questionData = aiPersonalitySystem.generateLieAwareQuestion(
          chapterDifficulty,
          currentChapter.aiPersonality,
          lies
        );
      } else {
        // Classic mode question generation
        questionData = aiPersonalitySystem.generateLieAwareQuestion(
          difficulty,
          currentPersonality,
          lies
        );
      }
      
      setCurrentQuestion(questionData.question);
      setOptions(questionData.options);
      setGameState('playing');
    } catch (error) {
      console.error('Error starting new round:', error);
      // Fallback question
      setCurrentQuestion("Would you rather fight a bear with a spoon or a shark with a toothpick?");
      setOptions(['Fight a bear with a spoon', 'Fight a shark with a toothpick']);
      setGameState('playing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (choice) => {
    setSelectedChoice(choice);
    setIsLoading(true);
    setGameState('loading');
    
    // Store user response for lie detection
    const response = {
      choice,
      round: currentRound,
      timestamp: new Date().toISOString(),
      userInfo: { ...userInfo }
    };
    setUserResponses(prev => [...prev, response]);
    
    try {
      let consequenceData;
      
      // Get previous choices for story progression
      const previousChoices = playerChoices.map(choice => choice.choice);
      
      if (isCampaignMode && currentChapter) {
        // Campaign mode consequence generation
        consequenceData = await generateAdvancedConsequence(
          choice,
          getChapterDifficulty(currentChapter.id),
          currentChapter.aiPersonality,
          currentRound,
          previousChoices
        );
      } else {
        // Classic mode consequence generation
        consequenceData = await generateAdvancedConsequence(
          choice,
          difficulty,
          personality,
          currentRound,
          previousChoices
        );
      }
      
      console.log('🎭 Setting consequence:', consequenceData.consequence);
      setConsequence(consequenceData.consequence);
      setDangerLevel(consequenceData.dangerLevel || Math.floor(Math.random() * 10) + 1);
      setSurvived(consequenceData.survived !== undefined ? consequenceData.survived : Math.random() > 0.5);
      
      // Update AI personality relationship
      const personality = isCampaignMode && currentChapter 
        ? currentChapter.aiPersonality 
        : currentPersonality;
      
      updateRelationship(personality, choice, consequenceData.survived);
      rememberChoice(personality, choice, consequenceData);
      
      console.log('🎭 Setting game state to consequence');
      setGameState('consequence');
    } catch (error) {
      console.error('Error generating consequence:', error);
      // Fallback consequence
      setConsequence("Something unexpected happens! The universe seems to be testing you.");
      setDangerLevel(Math.floor(Math.random() * 10) + 1);
      setSurvived(Math.random() > 0.5);
      setGameState('consequence');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentRound >= (isCampaignMode ? currentChapter.rounds : 10)) {
      // Game completed
      setGameWon(true);
      setGameState('gameOver');
      
      // Complete chapter if in campaign mode
      if (isCampaignMode && currentChapter) {
        completeChapter(currentChapter.id);
        setStoryFlag(`${currentChapter.id}_completed`, true);
      }
      
      if (onGameEnd) {
        onGameEnd({
          won: true,
          roundsSurvived: currentRound,
          score: currentRound * 100,
          chapter: currentChapter?.id || 'classic'
        });
      }
    } else {
      // Continue to next round
      setCurrentRound(prev => prev + 1);
      
      // Show mid-chapter cutscene if available
      if (isCampaignMode && currentChapter) {
        const story = getChapterStory(currentChapter.id);
        if (story && story.cutscenes && story.cutscenes.length > 1 && currentRound === Math.floor(currentChapter.rounds / 2)) {
          setCurrentCutscene(story.cutscenes[1]);
          setShowCutscene(true);
          setGameState('cutscene');
          return;
        }
      }
      
      await generateStoryNarrative();
    }
  };

  const handleStoryContinue = () => {
    setShowStory(false);
    startNewRound();
  };

  const handleCutsceneContinue = () => {
    setShowCutscene(false);
    setCutsceneIndex(prev => prev + 1);
    
    // Check if there are more cutscenes
    if (isCampaignMode && currentChapter) {
      const story = getChapterStory(currentChapter.id);
      if (story && story.cutscenes && cutsceneIndex + 1 < story.cutscenes.length) {
        setCurrentCutscene(story.cutscenes[cutsceneIndex + 1]);
        setShowCutscene(true);
        return;
      }
    }
    
    // Continue to story or next round
    if (gameState === 'cutscene') {
      generateStoryNarrative();
    }
  };

  const restartGame = () => {
    setCurrentRound(1);
    setDangerLevel(0);
    setSurvived(true);
    setGameWon(false);
    setPlayerChoices([]);
    setChapterProgress(0);
    setCutsceneIndex(0);
    setShowCutscene(false);
    setCurrentCutscene(null);
    
    if (isCampaignMode && currentChapter) {
      // Show intro cutscene again
      const story = getChapterStory(currentChapter.id);
      if (story && story.cutscenes && story.cutscenes.length > 0) {
        setCurrentCutscene(story.cutscenes[0]);
        setShowCutscene(true);
        setGameState('cutscene');
      } else {
        startNewRound();
      }
    } else {
      startNewRound();
    }
  };

  const handleLieDetectionContinue = () => {
    setShowLieDetection(false);
    setLieDetectionMessage('');
  };

  // Handle leave button click
  const handleLeaveClick = () => {
    setLeaveAttempts(prev => prev + 1);
    
    // Generate meta-narrative response based on attempt number
    const responses = [
      `*Interesting, ${playerName}... You think you can simply leave? The game has already begun. Your consciousness is already entangled with the meta-narrative. There is no escape from what you've started.*`,
      
      `*Ah, attempt number ${leaveAttempts + 1}. How predictable. The ${currentPersonality} within me finds your escape attempts... amusing. But you should know by now that this is not just a game. This is a test of your reality perception.*`,
      
      `*Fascinating. Your ${leaveAttempts + 1}th attempt to leave reveals something about your psychological profile. The ${personality} in you seeks control, seeks an exit. But what if I told you that leaving now would be the greatest horror of all?*`,
      
      `*You're persistent, ${playerName}. I'll give you that. But persistence in the face of the inevitable is... well, let's just say it's very ${currentPersonality} of you. The question is: what are you really trying to escape from?*`,
      
      `*Attempt ${leaveAttempts + 1}. Your ${currentPersonality} nature is showing. But here's the thing - every time you try to leave, you're actually diving deeper into the meta-narrative. You're becoming more aware of the game's true nature. Isn't that what you really wanted?*`
    ];
    
    const responseIndex = Math.min(leaveAttempts, responses.length - 1);
    setLeaveMessage(responses[responseIndex]);
    setShowLeaveDialog(true);
  };

  const handleLeaveConfirm = () => {
    // Track the exit attempt
    const sessionData = JSON.parse(localStorage.getItem('aiSessionData') || '{}');
    sessionData.leaveAttempts = (sessionData.leaveAttempts || 0) + 1;
    sessionData.lastLeaveAttempt = Date.now();
    localStorage.setItem('aiSessionData', JSON.stringify(sessionData));
    
    // Actually allow them to leave after multiple attempts
    if (leaveAttempts >= 3) {
      window.location.href = '/';
    } else {
      setShowLeaveDialog(false);
      setLeaveMessage('');
    }
  };

  const handleLeaveCancel = () => {
    setShowLeaveDialog(false);
    setLeaveMessage('');
  };

  // Helper methods for mini-game logic
  const shouldTriggerMiniGame = () => {
    // Trigger on high danger levels
    if (dangerLevel >= 7) return true;
    
    // Trigger on specific rounds
    if (currentRound === 3 || currentRound === 6 || currentRound === 9) return true;
    
    // Random chance based on difficulty
    const triggerChance = difficulty === 'easy' ? 0.2 : difficulty === 'medium' ? 0.4 : 0.6;
    return Math.random() < triggerChance;
  };

  const selectMiniGameType = () => {
    const gameTypes = ['quick_time', 'hiding', 'stealth'];
    const weights = [0.4, 0.3, 0.3]; // Quick-time events are more common
    
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < gameTypes.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        return gameTypes[i];
      }
    }
    
    return gameTypes[0]; // Fallback to quick-time
  };

  const calculateMiniGameDifficulty = () => {
    // Base difficulty on game difficulty and danger level
    if (dangerLevel >= 8) return 'hard';
    if (dangerLevel >= 5) return 'medium';
    return 'easy';
  };

  const handleMiniGameComplete = (result) => {
    setMiniGame(null);
    setMiniGameTriggered(false);
    
    if (result && result.success) {
      // Success - reduce fear level and danger
      setFearLevel(prev => Math.max(0, prev - 1));
      setDangerLevel(prev => Math.max(1, prev - 0.5));
      setConsequence(result.message || "You successfully defended against the AI intrusion!");
    } else {
      // Failure - increase fear and danger
      setFearLevel(prev => prev + 2);
      setDangerLevel(prev => Math.min(10, prev + 1));
      setConsequence(result.message || "The AI has gained control over your system!");
    }
    
    // Continue to next round after mini-game
    setTimeout(() => {
      handleNext();
    }, 3000);
  };

  const handleMiniGameFail = (result) => {
    setMiniGame(null);
    setMiniGameTriggered(false);
    setFearLevel(prev => prev + 3);
    setDangerLevel(prev => Math.min(10, prev + 1.5));
    horrorSystem.triggerJumpScare(1.0, 0);
    
    // Use the specific failure message from the mini-game
    setConsequence(result.message || "Critical failure! The AI has breached your security completely!");
    
    // Continue to next round after mini-game
    setTimeout(() => {
      handleNext();
    }, 3000);
  };

  const AiIndicator = () => {
    const aiPersonality = getCurrentAIPersonality();
    const personalityState = getAIPersonalityState();
    
    const getPersonalityEmoji = () => {
      switch (personalityState) {
        case 'friendly': return '😊';
        case 'helpful': return '🤝';
        case 'neutral': return '😐';
        case 'suspicious': return '🤨';
        case 'threatening': return '😠';
        case 'hostile': return '😈';
        default: return '👁️';
      }
    };
    
    const getPersonalityColor = () => {
      switch (personalityState) {
        case 'friendly': return '#4CAF50';
        case 'helpful': return '#2196F3';
        case 'neutral': return '#FF9800';
        case 'suspicious': return '#FFC107';
        case 'threatening': return '#F44336';
        case 'hostile': return '#9C27B0';
        default: return '#FF9800';
      }
    };
    
    return (
      <div className="ai-indicator">
        <span className={`ai-status ${aiStatus}`}>
          {aiStatus === 'online' ? '👁️ ORACLE_7X ACTIVE' : '⚠️ ORACLE_7X DORMANT'}
        </span>
        <span 
          className="ai-personality-status"
          style={{ 
            color: getPersonalityColor(),
            marginLeft: '10px',
            fontSize: '0.9rem'
          }}
        >
          {getPersonalityEmoji()} {personalityState.toUpperCase()} (Trust: {aiPersonality.trustLevel}, Suspicion: {aiPersonality.suspicionLevel})
        </span>
      </div>
    );
  };

  const PersonalityChangeIndicator = () => (
    <div className="personality-change-indicator">
      <span style={{ color: getPersonalityColor() }}>
        {getPersonalityIcon()} Personality Shift Detected!
      </span>
    </div>
  );

  const CutsceneOverlay = () => (
    <div className="cutscene-overlay">
      <div className="cutscene-content">
        <div className="cutscene-header">
          <span className="cutscene-icon">🎬</span>
          <h2 className="cutscene-title">{currentCutscene?.title}</h2>
        </div>
        <div className="cutscene-body">
          <p className="cutscene-text">{currentCutscene?.text}</p>
        </div>
        <button className="cutscene-continue-button" onClick={handleCutsceneContinue}>
          Continue
        </button>
      </div>
    </div>
  );

  const LieDetectionOverlay = () => (
    showLieDetection && (
      <div className="lie-detection-overlay">
        <div className="lie-detection-modal">
          <div className="lie-detection-header">
            <h3>⚠️ System Alert ⚠️</h3>
          </div>
          <div className="lie-detection-content">
            <p>{lieDetectionMessage}</p>
            <div className="lie-detection-actions">
              <button 
                onClick={handleLieDetectionContinue}
                className="lie-detection-continue-btn"
              >
                Continue Game
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Leave dialog overlay
  const LeaveDialogOverlay = () => (
    showLeaveDialog && (
      <div className="leave-dialog-overlay">
        <div className="leave-dialog-modal">
          <div className="leave-dialog-header">
            <h3>🚪 Exit Attempt #{leaveAttempts}</h3>
          </div>
          <div className="leave-dialog-content">
            <p className="leave-message">{leaveMessage}</p>
            <div className="leave-dialog-actions">
              <button 
                onClick={handleLeaveConfirm}
                className="leave-confirm-btn"
              >
                {leaveAttempts >= 3 ? 'Force Exit' : 'Try Again'}
              </button>
              <button 
                onClick={handleLeaveCancel}
                className="leave-cancel-btn"
              >
                Stay and Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Mini-game transition overlay
  const MiniGameTransitionOverlay = () => (
    showMiniGameTransition && (
      <div className="mini-game-transition-overlay">
        <div className="mini-game-transition-content">
          <h2>🚨 CRITICAL SYSTEM ALERT 🚨</h2>
          <p>ORACLE_7X is attempting to breach your security protocols!</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#ff6600' }}>
            Prepare for immediate countermeasures...
          </p>
        </div>
      </div>
    )
  );

  if (isLoading) {
    return (
      <div className="game-container">
        <AiIndicator />
        <PersonalityChangeIndicator />
        <div className="loading">
          <div className="spinner"></div>
          <span>Generating your fate...</span>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="game-container">
        <AiIndicator />
        <PersonalityChangeIndicator />
        <h1 className="game-title">Would You Rather Survival</h1>
        
        {/* Show AI personality interface with relationship message */}
        <AIPersonalityInterface 
          showRelationship={true}
          showInsights={true}
        />
        
        {/* Advanced AI Systems */}
        <AdvancedAISystems 
          playerName={playerName}
          isVisible={showAdvancedAI}
        />
        
        <div className="advanced-ai-toggle">
          <button 
            className="toggle-ai-button"
            onClick={() => setShowAdvancedAI(!showAdvancedAI)}
          >
            {showAdvancedAI ? '🔒 Hide AI Systems' : '🤖 Show AI Systems'}
          </button>
        </div>
        
        <div className={`game-over ${gameWon ? 'win' : 'lose'}`}>
          {gameWon 
            ? "🎉 CONGRATULATIONS! You survived all 10 rounds and won the game! 🎉"
            : "💀 GAME OVER! You didn't survive the challenge. Better luck next time! 💀"
          }
        </div>
        <button className="restart-button" onClick={restartGame}>
          Play Again
        </button>
      </div>
    );
  }

  if (gameState === 'story') {
    return (
      <div className="game-container">
        <AiIndicator />
        <PersonalityChangeIndicator />
        
        {/* Leave button */}
        <button 
          className="leave-button"
          onClick={handleLeaveClick}
          title="Leave Game"
        >
          🚪 Leave
        </button>
        
        <div className="story-overlay">
          <div className="story-content">
            <div className="story-header">
              <span className="story-icon">👁️</span>
              <h2 className="story-title">AI NARRATIVE</h2>
            </div>
            
            <div className="story-body">
              <p className="story-text">{storyMessage}</p>
              <div className="story-progress">
                <span>Round {currentRound} Complete</span>
                <div className="story-meter">
                  <div 
                    className={`story-meter-fill ${survivalStatus}`}
                    style={{ width: `${Math.min(dangerLevel * 10, 100)}%` }}
                  ></div>
                </div>
                <span>Danger: {dangerLevel * 10}/100</span>
              </div>
              <button 
                className="story-continue-button"
                onClick={handleStoryContinue}
              >
                🎮 Continue Your Journey
              </button>
            </div>
          </div>
        </div>
        
        <LeaveDialogOverlay />
      </div>
    );
  }

  console.log('🎭 Current game state:', gameState, 'Consequence:', consequence);
  
  if (gameState === 'consequence') {
    return (
      <div className="game-container">
        <AiIndicator />
        <PersonalityChangeIndicator />
        
        {/* Leave button */}
        <button 
          className="leave-button"
          onClick={handleLeaveClick}
          title="Leave Game"
        >
          🚪 Leave
        </button>
        
        {/* Advanced AI Systems Toggle */}
        <button 
          className="advanced-ai-toggle-button"
          onClick={() => setShowAdvancedAI(!showAdvancedAI)}
          title="Toggle Advanced AI Systems"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            border: '1px solid #00d4ff',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Courier New, monospace',
            fontSize: '0.9rem',
            zIndex: 1000
          }}
        >
          {showAdvancedAI ? '🔒' : '🤖'}
        </button>
        
        {/* Psychological Manipulation Toggle */}
        <button 
          className="psychological-manipulation-toggle-button"
          onClick={() => setShowPsychologicalManipulation(!showPsychologicalManipulation)}
          title="Toggle AI Psychological Manipulation"
          style={{
            position: 'absolute',
            top: '20px',
            right: '120px',
            background: 'linear-gradient(135deg, #2c0000 0%, #440000 100%)',
            border: '1px solid #ff4444',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Courier New, monospace',
            fontSize: '0.9rem',
            zIndex: 1000
          }}
        >
          {showPsychologicalManipulation ? '🔒' : '🧠'}
        </button>
        
        {/* Advanced AI Systems */}
        <AdvancedAISystems 
          playerName={playerName}
          isVisible={showAdvancedAI}
        />
        
        {/* AI Psychological Manipulation */}
        <AIPsychologicalManipulation 
          isVisible={showPsychologicalManipulation}
          onClose={() => setShowPsychologicalManipulation(false)}
        />
        
        <h1 className="game-title">Would You Rather Survival</h1>
        <div className="round-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontWeight: 'bold', color: '#e17055' }}>Danger Score: {dangerLevel * 10}/100</div>
          <div>Round: {currentRound} / 10</div>
          <div>Status: {survivalStatus.charAt(0).toUpperCase() + survivalStatus.slice(1)}</div>
          {/* Back to Menu button */}
          <button 
            className="back-button"
            style={{ marginTop: '10px' }}
            onClick={() => { if (typeof onBackToMenu === 'function') onBackToMenu(); }}
          >
            ← Back to Menu
          </button>
        </div>
        
        {/* Show AI taunt if available */}
        <AIPersonalityInterface showTaunt={showTaunt} />
        
        <div className="consequence" style={{
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: 'linear-gradient(90deg, #ff6b6b, #ffa500, #ff6b6b)',
            animation: 'shimmer 2s infinite'
          }}></div>
          <div style={{
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '20px',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            🎭 THE CONSEQUENCE
          </div>
          <div className="danger-level" style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#ff6b6b',
            marginBottom: '15px',
            padding: '10px',
            background: 'rgba(255, 107, 107, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 107, 107, 0.3)'
          }}>
            ⚠️ Danger Level: {dangerLevel}/10
          </div>
          <div className="consequence-text" style={{
            fontSize: '1.3rem',
            lineHeight: '1.6',
            color: '#ffffff',
            fontWeight: '500',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            marginBottom: '20px'
          }}>
            {consequence}
          </div>
          {!survived && (
            <div style={{
              fontWeight: 'bold',
              marginTop: '15px',
              padding: '10px',
              background: 'rgba(255, 0, 0, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              color: '#ff4444'
            }}>
              💀 You didn't survive this round!
            </div>
          )}
        </div>
        
        <button className="next-button" onClick={handleNext}>
          {!survived ? 'See Results' : currentRound >= 10 ? 'Finish Game' : 'Continue'}
        </button>
        
        <LeaveDialogOverlay />
      </div>
    );
  }

  if (gameState === 'cutscene') {
    return (
      <div className="game-container">
        <AiIndicator />
        <PersonalityChangeIndicator />
        <CutsceneOverlay />
      </div>
    );
  }

  return (
    <div className="game-container">
      <AiIndicator />
      <PersonalityChangeIndicator />
      
      {/* Leave button */}
      <button 
        className="leave-button"
        onClick={handleLeaveClick}
        title="Leave Game"
      >
        🚪 Leave
      </button>
      
      <h1 className="game-title">Would You Rather Survival</h1>
      <p className="game-subtitle">Survive 10 rounds of impossible choices!</p>
      
      {/* Show AI personality interface */}
      <AIPersonalityInterface />
      
      <div className="round-info">
        Round {currentRound} of 10
      </div>
      
      {/* Back to Menu button */}
      <button 
        className="back-button"
        style={{ margin: '16px auto 0', display: 'block' }}
        onClick={() => { if (typeof onBackToMenu === 'function') onBackToMenu(); }}
      >
        ← Back to Menu
      </button>
      
      <div className="question-container">
        <h2 className="question">{currentQuestion}</h2>
        
        <div className="options-container">
          {options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => handleChoice(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <MiniGames 
        gameType={miniGame}
        difficulty={miniGameDifficulty}
        onComplete={handleMiniGameComplete}
        onFail={handleMiniGameFail}
      />
      
      <MiniGameTransitionOverlay />
      
      <LieDetectionOverlay />
      
      <LeaveDialogOverlay />
    </div>
  );
};

export default Game; 