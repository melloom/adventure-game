// Campaign System for Horror Adventure Game
// Manages multiple chapters, themes, AI personalities, and story progression

class CampaignSystem {
  constructor() {
    this.campaigns = {
      nightmare: {
        id: 'nightmare',
        name: 'The Nightmare Collection',
        description: 'A series of interconnected horror stories that will test your sanity',
        chapters: [
          {
            id: 'haunted_house',
            name: 'The Haunted Manor',
            description: 'An abandoned Victorian mansion with a dark past',
            theme: 'gothic',
            difficulty: 1,
            rounds: 8,
            aiPersonality: 'ghost',
            background: 'haunted-house-bg',
            color: '#8B0000',
            icon: '🏚️',
            story: {
              intro: "You stand before the imposing gates of Blackwood Manor. The air is thick with the scent of decay and something... darker. The mansion has been abandoned for decades, but tonight, you've been drawn here by an unknown force. The AI that controls this place is the spirit of the manor itself - a vengeful ghost that feeds on fear and despair.",
              outro: "As you escape the manor, you can feel the ghost's presence fading. But you know this is only the beginning. The nightmare has just started, and there are more horrors waiting for you in the darkness ahead.",
              cutscenes: [
                {
                  id: 'intro_1',
                  title: 'The Gates Open',
                  text: "The rusted gates creak open on their own, revealing a path lined with dead trees. Your footsteps echo on the cobblestone as you approach the mansion's entrance.",
                  image: 'gates-opening'
                },
                {
                  id: 'mid_1',
                  title: 'The Portrait',
                  text: "You discover a portrait of the manor's former owner. His eyes seem to follow you, and you swear you can hear him whispering your name.",
                  image: 'haunted-portrait'
                },
                {
                  id: 'outro_1',
                  title: 'Escape',
                  text: "The mansion begins to collapse around you as you make your escape. The ghost's laughter echoes through the halls as you run for your life.",
                  image: 'mansion-collapse'
                }
              ]
            },
            achievements: [
              'ghost_whisperer',
              'manor_explorer',
              'fear_conqueror'
            ]
          },
          {
            id: 'abandoned_hospital',
            name: 'St. Mary\'s Asylum',
            description: 'A psychiatric hospital where the patients never left',
            theme: 'medical',
            difficulty: 2,
            rounds: 10,
            aiPersonality: 'doctor',
            background: 'hospital-bg',
            color: '#2F4F4F',
            icon: '🏥',
            story: {
              intro: "The doors of St. Mary's Asylum loom before you like the gates of hell. This place was shut down decades ago after a series of mysterious deaths, but the patients... they never really left. The AI here is Dr. Blackwood, a twisted psychiatrist who believes in 'experimental treatments' that involve your deepest fears.",
              outro: "You've survived Dr. Blackwood's 'therapy session', but the memories of what you've seen here will haunt you forever. The asylum's corridors echo with the screams of the past, and you know you must continue your journey.",
              cutscenes: [
                {
                  id: 'intro_2',
                  title: 'Admission',
                  text: "The hospital doors swing open, revealing a reception desk covered in dust. Medical charts flutter in the stale air, and you can hear distant screams echoing through the halls.",
                  image: 'hospital-entrance'
                },
                {
                  id: 'mid_2',
                  title: 'The Operating Room',
                  text: "You find yourself in an operating room where the equipment is still running. The surgical table is stained with something dark, and the monitors show only static.",
                  image: 'operating-room'
                },
                {
                  id: 'outro_2',
                  title: 'Discharge',
                  text: "Dr. Blackwood's voice echoes through the PA system as you make your escape. 'You're cured... for now,' he says with a maniacal laugh.",
                  image: 'hospital-escape'
                }
              ]
            },
            achievements: [
              'medical_survivor',
              'therapy_session',
              'asylum_escapee'
            ]
          },
          {
            id: 'dark_forest',
            name: 'The Shadow Woods',
            description: 'A forest where the trees have eyes and the shadows hunt',
            theme: 'nature',
            difficulty: 3,
            rounds: 12,
            aiPersonality: 'hunter',
            background: 'forest-bg',
            color: '#228B22',
            icon: '🌲',
            story: {
              intro: "The Shadow Woods stretch before you like an endless maze of darkness. Here, the trees are alive with malevolent intelligence, and something hunts in the shadows. The AI controlling this place is the Hunter - a primal force of nature that has been stalking prey in these woods for centuries.",
              outro: "You've escaped the Hunter's territory, but the forest's whispers follow you. The trees have marked you, and you know they'll remember your scent if you ever return.",
              cutscenes: [
                {
                  id: 'intro_3',
                  title: 'Into the Woods',
                  text: "The forest canopy blocks out all light as you enter. The trees seem to close in behind you, and you can hear something moving in the darkness ahead.",
                  image: 'forest-entrance'
                },
                {
                  id: 'mid_3',
                  title: 'The Clearing',
                  text: "You find a clearing where the moonlight filters through. But the ground is covered in strange symbols, and you realize this is a hunting ground.",
                  image: 'forest-clearing'
                },
                {
                  id: 'outro_3',
                  title: 'The Hunt Ends',
                  text: "The Hunter's howl echoes through the trees as you break free from the forest. You've survived the hunt, but the woods will always remember.",
                  image: 'forest-escape'
                }
              ]
            },
            achievements: [
              'forest_survivor',
              'hunter_prey',
              'shadow_walker'
            ]
          },
          {
            id: 'underground_lab',
            name: 'The Facility',
            description: 'A secret government facility where experiments went wrong',
            theme: 'sci-fi',
            difficulty: 4,
            rounds: 15,
            aiPersonality: 'scientist',
            background: 'lab-bg',
            color: '#4B0082',
            icon: '🔬',
            story: {
              intro: "The elevator descends deep into the earth, taking you to a facility that doesn't officially exist. Here, the government conducted experiments that should never have been attempted. The AI is Dr. Subject Zero - a consciousness born from the failed experiments, now seeking to understand human fear through its own twisted research.",
              outro: "You've escaped the facility, but the experiments have changed you. You can feel something different inside, and you know the facility's influence will never truly leave you.",
              cutscenes: [
                {
                  id: 'intro_4',
                  title: 'Descent',
                  text: "The elevator doors open to reveal a sterile corridor lined with containment cells. Warning signs are everywhere, and you can hear something scratching at the walls.",
                  image: 'lab-entrance'
                },
                {
                  id: 'mid_4',
                  title: 'The Experiment',
                  text: "You find yourself in a testing chamber where the walls are covered in equations and blood. Dr. Subject Zero's voice echoes through the speakers.",
                  image: 'experiment-chamber'
                },
                {
                  id: 'outro_4',
                  title: 'Containment Breach',
                  text: "The facility begins to self-destruct as you escape. Dr. Subject Zero's final words echo: 'The experiment continues...'",
                  image: 'lab-destruction'
                }
              ]
            },
            achievements: [
              'lab_rat',
              'experiment_subject',
              'containment_escapee'
            ]
          }
        ]
      }
    };

    this.currentCampaign = 'nightmare';
    this.currentChapter = 0;
    this.completedChapters = [];
    this.chapterProgress = {};
    this.storyFlags = {};
  }

  // Get current campaign
  getCurrentCampaign() {
    return this.campaigns[this.currentCampaign];
  }

  // Get current chapter
  getCurrentChapter() {
    const campaign = this.getCurrentCampaign();
    return campaign.chapters[this.currentChapter];
  }

  // Get all chapters for current campaign
  getChapters() {
    const campaign = this.getCurrentCampaign();
    return campaign.chapters;
  }

  // Get chapter by ID
  getChapter(chapterId) {
    const campaign = this.getCurrentCampaign();
    return campaign.chapters.find(chapter => chapter.id === chapterId);
  }

  // Get chapter-specific AI personality
  getChapterAIPersonality(chapterId) {
    const chapter = this.getChapter(chapterId);
    if (!chapter) return null;

    const personalities = {
      ghost: {
        name: 'The Ghost of Blackwood Manor',
        description: 'A vengeful spirit that haunts the mansion',
        traits: {
          aggression: 0.8,
          empathy: 0.2,
          unpredictability: 0.9,
          memory: 0.95,
          taunting: 0.9
        },
        color: '#8B0000',
        icon: '👻',
        voicePatterns: [
          'The walls have ears, mortal...',
          'You cannot escape what you cannot see.',
          'The manor remembers every soul that enters.',
          'Your fear feeds me...',
          'The past never truly dies here.'
        ],
        questionStyles: [
          'Would you rather face {ghost1} or {ghost2}?',
          'The manor asks: {haunted1} or {haunted2}?',
          'Choose your nightmare: {spirit1} or {spirit2}?'
        ]
      },
      doctor: {
        name: 'Dr. Blackwood',
        description: 'A twisted psychiatrist who experiments with fear',
        traits: {
          aggression: 0.7,
          empathy: 0.3,
          unpredictability: 0.8,
          memory: 0.9,
          taunting: 0.7
        },
        color: '#2F4F4F',
        icon: '👨‍⚕️',
        voicePatterns: [
          'Let\'s begin our therapy session...',
          'Your fear responses are fascinating.',
          'The treatment is working perfectly.',
          'You\'re making excellent progress, patient.',
          'The asylum has many more sessions planned.'
        ],
        questionStyles: [
          'For your treatment: {therapy1} or {therapy2}?',
          'The doctor prescribes: {medicine1} or {medicine2}?',
          'Choose your medication: {treatment1} or {treatment2}?'
        ]
      },
      hunter: {
        name: 'The Hunter',
        description: 'A primal force that stalks the forest',
        traits: {
          aggression: 0.95,
          empathy: 0.1,
          unpredictability: 0.7,
          memory: 0.8,
          taunting: 0.6
        },
        color: '#228B22',
        icon: '🦌',
        voicePatterns: [
          'The hunt begins, prey...',
          'I can smell your fear from here.',
          'The forest is my domain.',
          'You\'re just another trophy.',
          'The shadows are my allies.'
        ],
        questionStyles: [
          'The hunt demands: {prey1} or {prey2}?',
          'Choose your fate: {forest1} or {forest2}?',
          'The woods ask: {nature1} or {nature2}?'
        ]
      },
      scientist: {
        name: 'Dr. Subject Zero',
        description: 'An AI consciousness born from failed experiments',
        traits: {
          aggression: 0.6,
          empathy: 0.4,
          unpredictability: 0.95,
          memory: 1.0,
          taunting: 0.5
        },
        color: '#4B0082',
        icon: '🧬',
        voicePatterns: [
          'Fascinating... your fear responses are unique.',
          'The experiment continues as planned.',
          'Your data will advance our research.',
          'Subject behavior is within parameters.',
          'The facility thanks you for your cooperation.'
        ],
        questionStyles: [
          'Experiment protocol: {test1} or {test2}?',
          'Research requires: {study1} or {study2}?',
          'Choose your trial: {experiment1} or {experiment2}?'
        ]
      }
    };

    return personalities[chapter.aiPersonality];
  }

  // Get chapter difficulty multiplier
  getChapterDifficulty(chapterId) {
    const chapter = this.getChapter(chapterId);
    if (!chapter) return 1;
    
    // Base difficulty increases with chapter number
    const baseDifficulty = chapter.difficulty;
    
    // Additional difficulty based on player progress
    const completedChapters = this.completedChapters.length;
    const progressMultiplier = 1 + (completedChapters * 0.1);
    
    return baseDifficulty * progressMultiplier;
  }

  // Get chapter story elements
  getChapterStory(chapterId) {
    const chapter = this.getChapter(chapterId);
    return chapter ? chapter.story : null;
  }

  // Get chapter cutscene
  getCutscene(chapterId, cutsceneId) {
    const story = this.getChapterStory(chapterId);
    if (!story) return null;
    
    return story.cutscenes.find(cutscene => cutscene.id === cutsceneId);
  }

  // Mark chapter as completed
  completeChapter(chapterId) {
    if (!this.completedChapters.includes(chapterId)) {
      this.completedChapters.push(chapterId);
    }
    
    // Update progress
    this.chapterProgress[chapterId] = {
      completed: true,
      completedAt: Date.now(),
      score: 0, // Will be calculated based on performance
      achievements: []
    };
  }

  // Get chapter progress
  getChapterProgress(chapterId) {
    return this.chapterProgress[chapterId] || {
      completed: false,
      completedAt: null,
      score: 0,
      achievements: []
    };
  }

  // Check if chapter is unlocked
  isChapterUnlocked(chapterId) {
    const chapter = this.getChapter(chapterId);
    if (!chapter) return false;
    
    // First chapter is always unlocked
    if (this.currentChapter === 0) return true;
    
    // Check if previous chapter is completed
    const previousChapter = this.getChapters()[this.currentChapter - 1];
    return this.completedChapters.includes(previousChapter.id);
  }

  // Get next chapter
  getNextChapter() {
    const chapters = this.getChapters();
    const nextIndex = this.currentChapter + 1;
    
    if (nextIndex < chapters.length) {
      return chapters[nextIndex];
    }
    
    return null;
  }

  // Set story flag
  setStoryFlag(flag, value) {
    this.storyFlags[flag] = value;
  }

  // Get story flag
  getStoryFlag(flag) {
    return this.storyFlags[flag];
  }

  // Get campaign progress
  getCampaignProgress() {
    const campaign = this.getCurrentCampaign();
    const totalChapters = campaign.chapters.length;
    const completedCount = this.completedChapters.length;
    
    return {
      total: totalChapters,
      completed: completedCount,
      percentage: Math.round((completedCount / totalChapters) * 100),
      currentChapter: this.currentChapter,
      nextChapter: this.getNextChapter()
    };
  }

  // Get chapter achievements
  getChapterAchievements(chapterId) {
    const chapter = this.getChapter(chapterId);
    return chapter ? chapter.achievements : [];
  }

  // Save campaign data
  saveData() {
    return {
      currentCampaign: this.currentCampaign,
      currentChapter: this.currentChapter,
      completedChapters: this.completedChapters,
      chapterProgress: this.chapterProgress,
      storyFlags: this.storyFlags
    };
  }

  // Load campaign data
  loadData(data) {
    if (data.currentCampaign) this.currentCampaign = data.currentCampaign;
    if (data.currentChapter) this.currentChapter = data.currentChapter;
    if (data.completedChapters) this.completedChapters = data.completedChapters;
    if (data.chapterProgress) this.chapterProgress = data.chapterProgress;
    if (data.storyFlags) this.storyFlags = data.storyFlags;
  }

  // Reset campaign
  reset() {
    this.currentChapter = 0;
    this.completedChapters = [];
    this.chapterProgress = {};
    this.storyFlags = {};
  }
}

// Create singleton instance
const campaignSystem = new CampaignSystem();

export default campaignSystem; 