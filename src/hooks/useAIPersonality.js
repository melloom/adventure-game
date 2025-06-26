import { useState, useEffect, useCallback } from 'react';
import aiPersonalitySystem from '../utils/aiPersonalitySystem';
import { useLocalStorage } from './useLocalStorage';

export const useAIPersonality = () => {
  const [personalityData, setPersonalityData] = useLocalStorage('aiPersonality', {});
  const [currentPersonality, setCurrentPersonality] = useState(aiPersonalitySystem.getCurrentPersonality());
  const [relationshipLevel, setRelationshipLevel] = useState(aiPersonalitySystem.relationshipLevel);
  const [playerMemory, setPlayerMemory] = useState(aiPersonalitySystem.playerMemory);
  const [isLoading, setIsLoading] = useState(true);

  // Load personality data on mount
  useEffect(() => {
    if (personalityData && Object.keys(personalityData).length > 0) {
      aiPersonalitySystem.loadData(personalityData);
      setCurrentPersonality(aiPersonalitySystem.getCurrentPersonality());
      setRelationshipLevel(aiPersonalitySystem.relationshipLevel);
      setPlayerMemory(aiPersonalitySystem.playerMemory);
    }
    setIsLoading(false);
  }, [personalityData]);

  // Save personality data when it changes
  useEffect(() => {
    if (!isLoading) {
      const data = aiPersonalitySystem.saveData();
      setPersonalityData(data);
    }
  }, [currentPersonality, relationshipLevel, playerMemory, isLoading, setPersonalityData]);

  // Change personality
  const changePersonality = useCallback((newPersonality) => {
    const success = aiPersonalitySystem.changePersonality(newPersonality);
    if (success) {
      setCurrentPersonality(aiPersonalitySystem.getCurrentPersonality());
      setRelationshipLevel(aiPersonalitySystem.relationshipLevel);
    }
    return success;
  }, []);

  // Random personality change (for chaotic AI)
  const randomPersonalityChange = useCallback(() => {
    const newPersonality = aiPersonalitySystem.randomPersonalityChange();
    setCurrentPersonality(newPersonality);
    setRelationshipLevel(aiPersonalitySystem.relationshipLevel);
    return newPersonality;
  }, []);

  // Update relationship
  const updateRelationship = useCallback((action, context = {}) => {
    const newLevel = aiPersonalitySystem.updateRelationship(action, context);
    setRelationshipLevel(newLevel);
    return newLevel;
  }, []);

  // Remember choice
  const rememberChoice = useCallback((choice, context = {}) => {
    aiPersonalitySystem.rememberChoice(choice, context);
    setPlayerMemory({ ...aiPersonalitySystem.playerMemory });
  }, []);

  // Get personalized taunt
  const getPersonalizedTaunt = useCallback(() => {
    return aiPersonalitySystem.getPersonalizedTaunt();
  }, []);

  // Generate fear-based question
  const generateFearBasedQuestion = useCallback((difficulty, baseQuestion) => {
    return aiPersonalitySystem.generateFearBasedQuestion(difficulty, baseQuestion);
  }, []);

  // Generate relationship message
  const generateRelationshipMessage = useCallback(() => {
    return aiPersonalitySystem.generateRelationshipMessage();
  }, []);

  // Get all personalities
  const getAllPersonalities = useCallback(() => {
    return aiPersonalitySystem.personalities;
  }, []);

  // Get relationship status
  const getRelationshipStatus = useCallback(() => {
    return aiPersonalitySystem.getRelationshipStatus();
  }, [relationshipLevel]);

  // Get personality color
  const getPersonalityColor = useCallback(() => {
    return aiPersonalitySystem.getPersonalityColor();
  }, [currentPersonality]);

  // Get personality icon
  const getPersonalityIcon = useCallback(() => {
    return aiPersonalitySystem.getPersonalityIcon();
  }, [currentPersonality]);

  // Get question style
  const getQuestionStyle = useCallback(() => {
    return aiPersonalitySystem.getQuestionStyle();
  }, [currentPersonality]);

  // Detect patterns
  const detectPattern = useCallback(() => {
    return aiPersonalitySystem.detectPattern();
  }, [playerMemory]);

  // Get player fears
  const getPlayerFears = useCallback(() => {
    return aiPersonalitySystem.playerMemory.fears;
  }, [playerMemory]);

  // Get choice patterns
  const getChoicePatterns = useCallback(() => {
    return aiPersonalitySystem.playerMemory.patterns;
  }, [playerMemory]);

  // Get recent choices
  const getRecentChoices = useCallback((count = 10) => {
    return aiPersonalitySystem.playerMemory.choices.slice(-count);
  }, [playerMemory]);

  // Reset personality system
  const resetPersonality = useCallback(() => {
    aiPersonalitySystem.reset();
    setCurrentPersonality(aiPersonalitySystem.getCurrentPersonality());
    setRelationshipLevel(aiPersonalitySystem.relationshipLevel);
    setPlayerMemory(aiPersonalitySystem.playerMemory);
  }, []);

  // Check if chaotic personality should change
  const shouldChangePersonality = useCallback(() => {
    if (currentPersonality.name === 'The Chaos') {
      // 15% chance to change personality each round
      return Math.random() < 0.15;
    }
    return false;
  }, [currentPersonality]);

  // Get personality insights
  const getPersonalityInsights = useCallback(() => {
    const fears = getPlayerFears();
    const patterns = getChoicePatterns();
    const recentChoices = getRecentChoices(5);
    
    return {
      topFear: Object.keys(fears).sort((a, b) => fears[b] - fears[a])[0] || null,
      fearCount: Object.keys(fears).length,
      totalChoices: aiPersonalitySystem.playerMemory.choices.length,
      relationshipStatus: getRelationshipStatus(),
      personalityName: currentPersonality.name,
      recentChoiceCount: recentChoices.length,
      patternCount: Object.keys(patterns).length
    };
  }, [currentPersonality, getPlayerFears, getChoicePatterns, getRecentChoices, getRelationshipStatus]);

  return {
    // State
    currentPersonality,
    relationshipLevel,
    playerMemory,
    isLoading,
    
    // Actions
    changePersonality,
    randomPersonalityChange,
    updateRelationship,
    rememberChoice,
    resetPersonality,
    
    // Getters
    getPersonalizedTaunt,
    generateFearBasedQuestion,
    generateRelationshipMessage,
    getAllPersonalities,
    getRelationshipStatus,
    getPersonalityColor,
    getPersonalityIcon,
    getQuestionStyle,
    detectPattern,
    getPlayerFears,
    getChoicePatterns,
    getRecentChoices,
    getPersonalityInsights,
    
    // Utilities
    shouldChangePersonality
  };
}; 