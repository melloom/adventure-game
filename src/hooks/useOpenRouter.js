import { useCallback } from 'react';
import { generateQuestion, generateConsequence, calculateSurvival, testApiStatus } from '../utils/aiService';

export const useOpenRouter = () => {
  const fetchQuestion = useCallback(async (difficulty = 'medium', personality = 'balanced') => {
    try {
      const question = await generateQuestion(difficulty, personality);
      
      console.log('AI Response:', question); // Debug: see what AI returns
      
      // Try multiple parsing patterns
      let optionsMatch = question.match(/Would you rather (.+?) or (.+?)\?/);
      
      if (!optionsMatch) {
        // Try alternative patterns
        optionsMatch = question.match(/Would you rather (.+?) or (.+?)/);
      }
      
      if (!optionsMatch) {
        // Try pattern without question mark
        optionsMatch = question.match(/(.+?) or (.+?)/);
      }
      
      if (!optionsMatch) {
        // Try to split by common separators
        const parts = question.split(/[?.,!]/);
        if (parts.length >= 2) {
          const firstPart = parts[0].trim();
          const secondPart = parts[1].trim();
          
          // Look for "or" in either part
          const orMatch1 = firstPart.match(/(.+?) or (.+?)/);
          const orMatch2 = secondPart.match(/(.+?) or (.+?)/);
          
          if (orMatch1) {
            optionsMatch = orMatch1;
          } else if (orMatch2) {
            optionsMatch = orMatch2;
          }
        }
      }
      
      if (optionsMatch) {
        console.log('Parsed options:', optionsMatch[1], optionsMatch[2]); // Debug
        return {
          question: `Would you rather ${optionsMatch[1].trim()} or ${optionsMatch[2].trim()}?`,
          options: [optionsMatch[1].trim(), optionsMatch[2].trim()]
        };
      } else {
        console.log('Parsing failed, using fallback'); // Debug
        // Fallback if parsing fails
        return {
          question: `Would you rather ${question} or something else?`,
          options: [question, 'Something else']
        };
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      // Use fallback question based on difficulty
      const fallbackQuestions = {
        easy: {
          question: "Would you rather have unlimited pizza or unlimited ice cream?",
          options: ['Have unlimited pizza', 'Have unlimited ice cream']
        },
        medium: {
          question: "Would you rather fight 100 duck-sized horses or 1 horse-sized duck?",
          options: ['Fight 100 duck-sized horses', 'Fight 1 horse-sized duck']
        },
        hard: {
          question: "Would you rather save 100 strangers or 1 loved one?",
          options: ['Save 100 strangers', 'Save 1 loved one']
        },
        nightmare: {
          question: "Would you rather torture an innocent person to save 1000 lives or let 1000 people die to save one innocent?",
          options: ['Torture innocent to save 1000', 'Let 1000 die to save innocent']
        }
      };
      
      return fallbackQuestions[difficulty] || fallbackQuestions.medium;
    }
  }, []);

  const fetchConsequence = useCallback(async (choice, difficulty = 'medium', personality = 'balanced', round = 1) => {
    try {
      const consequence = await generateConsequence(choice, difficulty, personality, round);
      
      // Generate a danger level based on difficulty and round
      const baseDangerLevels = {
        easy: 2,
        medium: 5,
        hard: 7,
        nightmare: 9
      };
      
      const baseDanger = baseDangerLevels[difficulty] || 5;
      const roundMultiplier = Math.min(round * 0.2, 1); // Increase danger with rounds, max 100% increase
      const dangerLevel = Math.min(Math.floor(baseDanger * (1 + roundMultiplier)), 10);
      
      // Calculate survival based on danger level and round
      const survived = calculateSurvival(dangerLevel, round);
      
      return {
        consequence: consequence,
        dangerLevel: dangerLevel,
        survived: survived,
        storyUpdate: `Round ${round} brings new challenges.`
      };
    } catch (error) {
      console.error('Error fetching consequence:', error);
      // Use fallback consequence based on difficulty
      const fallbackDangerLevels = {
        easy: Math.floor(Math.random() * 3) + 1,
        medium: Math.floor(Math.random() * 4) + 3,
        hard: Math.floor(Math.random() * 4) + 6,
        nightmare: Math.floor(Math.random() * 3) + 8
      };
      
      const dangerLevel = fallbackDangerLevels[difficulty] || 5;
      return {
        consequence: "Something unexpected happens! The universe seems to be testing you.",
        dangerLevel: dangerLevel,
        survived: Math.random() > 0.5,
        storyUpdate: "The story continues with an unexpected twist."
      };
    }
  }, []);

  const checkApiStatus = useCallback(async () => {
    try {
      const status = await testApiStatus();
      console.log('API Status Check:', status);
      return status; // Return the full status object, not just status.available
    } catch (error) {
      console.error('API status check failed:', error);
      return {
        available: false,
        reason: 'API error',
        message: 'API status check failed',
        service: 'unknown'
      };
    }
  }, []);

  return {
    fetchQuestion,
    fetchConsequence,
    checkApiStatus
  };
}; 