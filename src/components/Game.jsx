import React, { useState, useEffect } from 'react';
import { generateQuestion, generateConsequence, calculateSurvival, generateDynamicGameMessage, testApiStatus } from '../utils/aiService';
import { useAIPersonality } from '../hooks/useAIPersonality';
import { useCampaign } from '../hooks/useCampaign';
import AIPersonalityInterface from './AIPersonalityInterface';
import aiPersonalitySystem from '../utils/aiPersonalitySystem';

const Game = ({ selectedChapter, onGameEnd }) => {
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

  // Initialize the game
  useEffect(() => {
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
      
      if (isCampaignMode && currentChapter) {
        // Campaign mode consequence generation
        consequenceData = await generateConsequence(
          choice,
          getChapterDifficulty(currentChapter.id),
          currentChapter.aiPersonality,
          currentRound
        );
      } else {
        // Classic mode consequence generation
        consequenceData = await generateConsequence(
          choice,
          difficulty,
          personality,
          currentRound
        );
      }
      
      setConsequence(consequenceData.consequence);
      setDangerLevel(consequenceData.dangerLevel);
      setSurvived(consequenceData.survived);
      
      // Update AI personality relationship
      const personality = isCampaignMode && currentChapter 
        ? currentChapter.aiPersonality 
        : currentPersonality;
      
      updateRelationship(personality, choice, consequenceData.survived);
      rememberChoice(personality, choice, consequenceData);
      
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
    
    if (result && result.type === 'quick_time' && result.score < 5) {
      setFearLevel(prev => prev + 2);
      horrorSystem.triggerJumpScare(0.7, 0);
      // Add consequence for failing quick-time
      setConsequence("You were too slow! The AI has gained more control over your system...");
    } else if (result && result.type === 'hiding' && !result.success) {
      setFearLevel(prev => prev + 3);
      horrorSystem.triggerJumpScare(1.0, 0);
      setConsequence("You chose poorly! The AI found you and now has full access to your device...");
    } else if (result && result.type === 'stealth' && result.noiseLevel >= 8) {
      setFearLevel(prev => prev + 2);
      horrorSystem.triggerJumpScare(0.8, 0);
      setConsequence("You made too much noise! The AI detected your presence and is now tracking you...");
    } else {
      // Success - reduce fear level
      setFearLevel(prev => Math.max(0, prev - 1));
      setConsequence("You survived the challenge! The AI's grip on your system has weakened slightly...");
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
    horrorSystem.triggerJumpScare(1.0, 0);
    
    // Severe consequences for failing mini-games
    const failMessages = [
      "Game over! The AI has complete control now. Your system is compromised...",
      "You failed the test! The AI is now monitoring your every move...",
      "Critical failure! The AI has breached your security completely...",
      "You've been caught! The AI now owns your digital life..."
    ];
    
    setConsequence(failMessages[Math.floor(Math.random() * failMessages.length)]);
    
    // Continue to next round after mini-game
    setTimeout(() => {
      handleNext();
    }, 3000);
  };

  const AiIndicator = () => (
    <div className="ai-indicator">
      <span className={`ai-status ${aiStatus}`}>
        {aiStatus === 'online' ? '🤖 AI Online' : '⚠️ AI Offline'}
      </span>
    </div>
  );

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

  // Mini-game transition overlay
  const MiniGameTransitionOverlay = () => (
    showMiniGameTransition && (
      <div className="mini-game-transition-overlay">
        <div className="mini-game-transition-content">
          <h2>⚠️ SYSTEM BREACH DETECTED ⚠️</h2>
          <p>The AI is attempting to gain control...</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
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
      </div>
    );
  }

  if (gameState === 'consequence') {
    return (
      <div className="game-container">
        <AiIndicator />
        <PersonalityChangeIndicator />
        <h1 className="game-title">Would You Rather Survival</h1>
        <div className="round-info">
          Round {currentRound} of 10
        </div>
        
        {/* Show AI taunt if available */}
        <AIPersonalityInterface showTaunt={showTaunt} />
        
        <div className="consequence">
          <div className="danger-level">
            Danger Level: {dangerLevel}/10
          </div>
          <p>{consequence}</p>
          {!survived && <p style={{fontWeight: 'bold', marginTop: '10px'}}>💀 You didn't survive this round!</p>}
        </div>
        
        <button className="next-button" onClick={handleNext}>
          {!survived ? 'See Results' : currentRound >= 10 ? 'Finish Game' : 'Continue'}
        </button>
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
      <h1 className="game-title">Would You Rather Survival</h1>
      <p className="game-subtitle">Survive 10 rounds of impossible choices!</p>
      
      {/* Show AI personality interface */}
      <AIPersonalityInterface />
      
      <div className="round-info">
        Round {currentRound} of 10
      </div>
      
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
    </div>
  );
};

export default Game; 