import { useCallback } from 'react';
import { generateQuestion, generateConsequence, calculateSurvival, testApiStatus } from '../utils/aiService';
import { getRandomQuestion } from '../utils/questionBank';

export const useOpenAI = () => {
  const fetchQuestion = useCallback(async (difficulty = 'medium', personality = 'balanced', currentRound = 1, previousChoices = []) => {
    try {
      const result = await generateQuestion(difficulty, personality, currentRound, previousChoices);

      console.log('OpenAI Response:', result);

      // generateQuestion now always returns a structured object:
      // { question, optionA, optionB, consequences: { A, B }, dangerLevels: { A, B } }
      if (result && typeof result === 'object' && result.question && result.optionA) {
        return result;
      }

      // Legacy path: if somehow we still get a raw string, fall back to question bank
      console.log('Unexpected format, using question bank fallback');
      return getRandomQuestion(difficulty);
    } catch (error) {
      console.error('Error fetching question:', error);
      return getRandomQuestion(difficulty);
    }
  }, []);

  const fetchConsequence = useCallback(async (choice, difficulty = 'medium', personality = 'balanced', round = 1, previousChoices = []) => {
    try {
      const consequence = await generateConsequence(choice, difficulty, personality, round, previousChoices);

      // Danger based on difficulty + round escalation
      const baseDangerMap = { easy: 3, medium: 5, hard: 7, nightmare: 9 };
      const base = baseDangerMap[difficulty] || 5;
      const roundBonus = Math.min(Math.floor(round * 0.5), 3);
      const dangerLevel = Math.min(base + roundBonus, 10);

      const survived = calculateSurvival(dangerLevel, round);

      return {
        consequence,
        dangerLevel,
        survived,
        storyUpdate: `Round ${round} leaves its mark.`
      };
    } catch (error) {
      console.error('Error fetching consequence:', error);
      return {
        consequence: "Something unexpected happens. The universe is watching.",
        dangerLevel: Math.min(3 + Math.floor(Math.random() * 5), 10),
        survived: Math.random() > 0.4,
        storyUpdate: "The story continues."
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