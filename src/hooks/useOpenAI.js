import { useCallback } from 'react';
import { generateQuestion, generateConsequence, calculateSurvival, testApiStatus } from '../utils/aiService';

export const useOpenAI = () => {
  const fetchQuestion = useCallback(async (difficulty = 'medium', personality = 'balanced', currentRound = 1, previousChoices = []) => {
    try {
      const question = await generateQuestion(difficulty, personality, currentRound, previousChoices);
      
      console.log('OpenAI Response:', question); // Debug: see what AI returns
      
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
        // Use fallback question based on difficulty
        const fallbackQuestions = {
          easy: {
            question: "Would you rather watch your childhood home burn to the ground or watch your childhood memories be erased from your mind forever?",
            options: ['Watch home burn', 'Lose all memories']
          },
          medium: {
            question: "Would you rather be tortured for 24 hours or watch your entire family be tortured for 1 hour?",
            options: ['Endure 24 hours of torture', 'Watch family tortured']
          },
          hard: {
            question: "Would you rather be responsible for the extinction of humanity or be the only human left alive in a world of monsters?",
            options: ['End humanity', 'Be last human alive']
          },
          nightmare: {
            question: "Would you rather be responsible for the creation of a new species that will torture and enslave humanity for eternity, or be responsible for the destruction of all life in the universe?",
            options: ['Create eternal torturers', 'Destroy all life']
          }
        };
        
        return fallbackQuestions[difficulty] || fallbackQuestions.medium;
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      // Use fallback question based on difficulty
      const fallbackQuestions = {
        easy: {
          question: "Would you rather watch your childhood home burn to the ground or watch your childhood memories be erased from your mind forever?",
          options: ['Watch home burn', 'Lose all memories']
        },
        medium: {
          question: "Would you rather be tortured for 24 hours or watch your entire family be tortured for 1 hour?",
          options: ['Endure 24 hours of torture', 'Watch family tortured']
        },
        hard: {
          question: "Would you rather be responsible for the extinction of humanity or be the only human left alive in a world of monsters?",
          options: ['End humanity', 'Be last human alive']
        },
        nightmare: {
          question: "Would you rather be responsible for the creation of a new species that will torture and enslave humanity for eternity, or be responsible for the destruction of all life in the universe?",
          options: ['Create eternal torturers', 'Destroy all life']
        }
      };
      
      return fallbackQuestions[difficulty] || fallbackQuestions.medium;
    }
  }, []);

  const fetchConsequence = useCallback(async (choice, difficulty = 'medium', personality = 'balanced', round = 1, previousChoices = []) => {
    try {
      const consequence = await generateConsequence(choice, difficulty, personality, round, previousChoices);
      
      // Generate a danger level based on difficulty and round
      const baseDangerLevels = {
        easy: 4,      // Increased from 2
        medium: 7,    // Increased from 5
        hard: 9,      // Increased from 7
        nightmare: 12 // Increased from 9 (will be capped at 10)
      };
      
      const baseDanger = baseDangerLevels[difficulty] || 7;
      const roundMultiplier = Math.min(round * 0.3, 1.5); // Increased from 0.2, max 1.5
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
        easy: Math.floor(Math.random() * 4) + 3,      // Increased from 1-3 to 3-6
        medium: Math.floor(Math.random() * 5) + 5,    // Increased from 3-6 to 5-9
        hard: Math.floor(Math.random() * 4) + 8,      // Increased from 6-9 to 8-11
        nightmare: Math.floor(Math.random() * 3) + 10 // Increased from 8-10 to 10-12
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
      console.log('OpenAI API Status Check:', status);
      return status; // Return the full status object, not just status.available
    } catch (error) {
      console.error('OpenAI API status check failed:', error);
      return {
        available: false,
        reason: 'API error',
        message: 'OpenAI API status check failed',
        service: 'openai'
      };
    }
  }, []);

  return {
    fetchQuestion,
    fetchConsequence,
    checkApiStatus
  };
}; 