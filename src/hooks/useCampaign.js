import { useState, useEffect, useCallback } from 'react';
import campaignSystem from '../utils/campaignSystem';
import { useLocalStorage } from './useLocalStorage';

export const useCampaign = () => {
  const [campaignData, setCampaignData] = useLocalStorage('campaignData', {});
  const [currentCampaign, setCurrentCampaign] = useState(campaignSystem.getCurrentCampaign());
  const [currentChapter, setCurrentChapter] = useState(campaignSystem.getCurrentChapter());
  const [completedChapters, setCompletedChapters] = useState(campaignSystem.completedChapters);
  const [chapterProgress, setChapterProgress] = useState(campaignSystem.chapterProgress);
  const [storyFlags, setStoryFlags] = useState(campaignSystem.storyFlags);
  const [isLoading, setIsLoading] = useState(true);

  // Load campaign data on mount
  useEffect(() => {
    if (campaignData && Object.keys(campaignData).length > 0) {
      campaignSystem.loadData(campaignData);
      setCurrentCampaign(campaignSystem.getCurrentCampaign());
      setCurrentChapter(campaignSystem.getCurrentChapter());
      setCompletedChapters(campaignSystem.completedChapters);
      setChapterProgress(campaignSystem.chapterProgress);
      setStoryFlags(campaignSystem.storyFlags);
    }
    setIsLoading(false);
  }, [campaignData]);

  // Save campaign data when it changes
  useEffect(() => {
    if (!isLoading) {
      const data = campaignSystem.saveData();
      setCampaignData(data);
    }
  }, [currentCampaign, currentChapter, completedChapters, chapterProgress, storyFlags, isLoading, setCampaignData]);

  // Get all chapters
  const getChapters = useCallback(() => {
    return campaignSystem.getChapters();
  }, []);

  // Get chapter by ID
  const getChapter = useCallback((chapterId) => {
    return campaignSystem.getChapter(chapterId);
  }, []);

  // Get chapter-specific AI personality
  const getChapterAIPersonality = useCallback((chapterId) => {
    return campaignSystem.getChapterAIPersonality(chapterId);
  }, []);

  // Get chapter difficulty
  const getChapterDifficulty = useCallback((chapterId) => {
    return campaignSystem.getChapterDifficulty(chapterId);
  }, []);

  // Get chapter story
  const getChapterStory = useCallback((chapterId) => {
    return campaignSystem.getChapterStory(chapterId);
  }, []);

  // Get cutscene
  const getCutscene = useCallback((chapterId, cutsceneId) => {
    return campaignSystem.getCutscene(chapterId, cutsceneId);
  }, []);

  // Complete chapter
  const completeChapter = useCallback((chapterId) => {
    campaignSystem.completeChapter(chapterId);
    setCompletedChapters([...campaignSystem.completedChapters]);
    setChapterProgress({ ...campaignSystem.chapterProgress });
  }, []);

  // Get chapter progress
  const getChapterProgress = useCallback((chapterId) => {
    return campaignSystem.getChapterProgress(chapterId);
  }, [chapterProgress]);

  // Check if chapter is unlocked
  const isChapterUnlocked = useCallback((chapterId) => {
    return campaignSystem.isChapterUnlocked(chapterId);
  }, [completedChapters]);

  // Get next chapter
  const getNextChapter = useCallback(() => {
    return campaignSystem.getNextChapter();
  }, [currentChapter]);

  // Set story flag
  const setStoryFlag = useCallback((flag, value) => {
    campaignSystem.setStoryFlag(flag, value);
    setStoryFlags({ ...campaignSystem.storyFlags });
  }, []);

  // Get story flag
  const getStoryFlag = useCallback((flag) => {
    return campaignSystem.getStoryFlag(flag);
  }, [storyFlags]);

  // Get campaign progress
  const getCampaignProgress = useCallback(() => {
    return campaignSystem.getCampaignProgress();
  }, [completedChapters, currentChapter]);

  // Get chapter achievements
  const getChapterAchievements = useCallback((chapterId) => {
    return campaignSystem.getChapterAchievements(chapterId);
  }, []);

  // Set current chapter
  const setCurrentChapterIndex = useCallback((index) => {
    campaignSystem.currentChapter = index;
    setCurrentChapter(campaignSystem.getCurrentChapter());
  }, []);

  // Reset campaign
  const resetCampaign = useCallback(() => {
    campaignSystem.reset();
    setCurrentCampaign(campaignSystem.getCurrentCampaign());
    setCurrentChapter(campaignSystem.getCurrentChapter());
    setCompletedChapters(campaignSystem.completedChapters);
    setChapterProgress(campaignSystem.chapterProgress);
    setStoryFlags(campaignSystem.storyFlags);
  }, []);

  // Get campaign themes
  const getCampaignThemes = useCallback(() => {
    const chapters = getChapters();
    return chapters.map(chapter => ({
      id: chapter.id,
      name: chapter.name,
      theme: chapter.theme,
      color: chapter.color,
      icon: chapter.icon,
      difficulty: chapter.difficulty,
      unlocked: isChapterUnlocked(chapter.id),
      completed: completedChapters.includes(chapter.id)
    }));
  }, [getChapters, isChapterUnlocked, completedChapters]);

  // Get current chapter info
  const getCurrentChapterInfo = useCallback(() => {
    if (!currentChapter) return null;
    
    return {
      ...currentChapter,
      aiPersonality: getChapterAIPersonality(currentChapter.id),
      progress: getChapterProgress(currentChapter.id),
      story: getChapterStory(currentChapter.id),
      difficulty: getChapterDifficulty(currentChapter.id),
      unlocked: isChapterUnlocked(currentChapter.id),
      completed: completedChapters.includes(currentChapter.id)
    };
  }, [currentChapter, getChapterAIPersonality, getChapterProgress, getChapterStory, getChapterDifficulty, isChapterUnlocked, completedChapters]);

  return {
    // State
    currentCampaign,
    currentChapter,
    completedChapters,
    chapterProgress,
    storyFlags,
    isLoading,
    
    // Actions
    completeChapter,
    setStoryFlag,
    setCurrentChapterIndex,
    resetCampaign,
    
    // Getters
    getChapters,
    getChapter,
    getChapterAIPersonality,
    getChapterDifficulty,
    getChapterStory,
    getCutscene,
    getChapterProgress,
    isChapterUnlocked,
    getNextChapter,
    getStoryFlag,
    getCampaignProgress,
    getChapterAchievements,
    getCampaignThemes,
    getCurrentChapterInfo
  };
}; 