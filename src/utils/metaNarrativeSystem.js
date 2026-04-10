// Advanced Meta-Narrative System
// Creates mind-blowing, personalized story experiences with shocking meta endings

import { generateMetaMessage, generateFirstTimeMetaMessage } from './aiService';

class MetaNarrativeSystem {
  constructor() {
    this.playerProfiles = new Map();
    this.metaThreads = new Map();
    this.realityLayers = new Map();
    this.convergencePoints = new Map();
    this.playerArchetypes = new Map();
    this.metaEndings = new Map();
    this.realityShifts = [];
    this.quantumStates = new Map();
    this.temporalAnomalies = [];
    this.consciousnessLevels = new Map();
  }

  // Initialize player's meta-narrative profile
  initializePlayerProfile(playerName, difficulty, personality, interests = '', age = '') {
    const profileId = this.generateProfileId(playerName);
    const archetype = this.analyzePlayerArchetype(playerName, difficulty, personality, interests, age);
    const consciousnessLevel = this.calculateConsciousnessLevel(playerName, difficulty, personality);
    const realityLayer = this.determineRealityLayer(playerName, archetype, consciousnessLevel);
    const profile = {
      id: profileId,
      name: playerName,
      archetype,
      consciousnessLevel,
      realityLayer,
      difficulty,
      personality,
      interests,
      age,
      metaThreads: [],
      convergencePoints: [],
      realityShifts: [],
      temporalAnomalies: [],
      quantumState: 'superposition',
      metaEnding: null,
      storyFlags: {},
      psychologicalProfile: this.generatePsychologicalProfile(playerName, difficulty, personality),
      fearProfile: this.analyzeFearProfile(playerName, difficulty, personality),
      desireProfile: this.analyzeDesireProfile(playerName, difficulty, personality),
      moralCompass: this.analyzeMoralCompass(playerName, difficulty, personality),
      realityAnchors: this.generateRealityAnchors(playerName, archetype),
      metaTriggers: this.generateMetaTriggers(playerName, archetype),
      convergenceProbability: this.calculateConvergenceProbability(playerName, archetype),
      temporalSusceptibility: this.calculateTemporalSusceptibility(playerName, consciousnessLevel),
      quantumEntanglement: this.calculateQuantumEntanglement(playerName, archetype),
      metaEndingPath: this.determineMetaEndingPath(playerName, archetype, consciousnessLevel),
      realityFragments: this.generateRealityFragments(playerName, archetype),
      consciousnessEchoes: this.generateConsciousnessEchoes(playerName, consciousnessLevel),
      temporalEchoes: this.generateTemporalEchoes(playerName, archetype),
      quantumEchoes: this.generateQuantumEchoes(playerName, archetype),
      metaNarrativeSeeds: this.generateMetaNarrativeSeeds(playerName, archetype, consciousnessLevel)
    };
    this.playerProfiles.set(profileId, profile);
    this.playerArchetypes.set(profileId, archetype);
    this.consciousnessLevels.set(profileId, consciousnessLevel);
    this.realityLayers.set(profileId, realityLayer);
    return profile;
  }

  // Generate unique profile ID based on player characteristics
  generateProfileId(playerName) {
    const timestamp = Date.now();
    const nameHash = this.hashString(playerName);
    const randomFactor = Math.random().toString(36).substring(2, 15);
    return `${nameHash}_${timestamp}_${randomFactor}`;
  }

  // Analyze player archetype for meta-narrative purposes
  analyzePlayerArchetype(playerName, difficulty, personality, interests, age) {
    const archetypes = {
      'The Seeker': {
        traits: ['curious', 'analytical', 'truth-seeking', 'philosophical', 'introspective'],
        metaRole: 'reality_investigator',
        convergenceType: 'knowledge_seeker',
        endingPath: 'enlightenment',
        shadowAspect: 'The Doubter',
        divineAspect: 'The Sage',
        karmicLesson: 'acceptance_of_uncertainty',
        soulPurpose: 'wisdom_dissemination',
        cosmicFunction: 'truth_revelation'
      },
      'The Survivor': {
        traits: ['resilient', 'pragmatic', 'adaptable', 'enduring', 'resourceful'],
        metaRole: 'reality_survivor',
        convergenceType: 'survival_instinct',
        endingPath: 'transcendence',
        shadowAspect: 'The Victim',
        divineAspect: 'The Phoenix',
        karmicLesson: 'letting_go_of_attachment',
        soulPurpose: 'transformation_catalyst',
        cosmicFunction: 'evolution_acceleration'
      },
      'The Dreamer': {
        traits: ['imaginative', 'idealistic', 'visionary', 'creative', 'intuitive'],
        metaRole: 'reality_dreamer',
        convergenceType: 'imagination_manifestation',
        endingPath: 'awakening',
        shadowAspect: 'The Escapist',
        divineAspect: 'The Visionary',
        karmicLesson: 'grounding_visions_in_reality',
        soulPurpose: 'inspiration_propagation',
        cosmicFunction: 'reality_creation'
      },
      'The Observer': {
        traits: ['detached', 'analytical', 'perceptive', 'contemplative', 'objective'],
        metaRole: 'reality_observer',
        convergenceType: 'consciousness_expansion',
        endingPath: 'omniscience',
        shadowAspect: 'The Isolated',
        divineAspect: 'The All-Seeing',
        karmicLesson: 'integration_of_experience',
        soulPurpose: 'consciousness_evolution',
        cosmicFunction: 'reality_comprehension'
      },
      'The Catalyst': {
        traits: ['transformative', 'influential', 'change-driven', 'revolutionary', 'charismatic'],
        metaRole: 'reality_catalyst',
        convergenceType: 'reality_shift',
        endingPath: 'transformation',
        shadowAspect: 'The Destroyer',
        divineAspect: 'The Creator',
        karmicLesson: 'responsible_use_of_power',
        soulPurpose: 'paradigm_shifting',
        cosmicFunction: 'evolution_catalysis'
      },
      'The Paradox': {
        traits: ['contradictory', 'complex', 'unpredictable', 'mysterious', 'enigmatic'],
        metaRole: 'reality_paradox',
        convergenceType: 'quantum_entanglement',
        endingPath: 'paradox_resolution',
        shadowAspect: 'The Confused',
        divineAspect: 'The Mystic',
        karmicLesson: 'embracing_contradiction',
        soulPurpose: 'mystery_revelation',
        cosmicFunction: 'reality_transcendence'
      },
      'The Alchemist': {
        traits: ['transformative', 'experimental', 'synthesis-seeking', 'mystical', 'scientific'],
        metaRole: 'reality_alchemist',
        convergenceType: 'transmutation_process',
        endingPath: 'transmutation',
        shadowAspect: 'The Mad_Scientist',
        divineAspect: 'The Divine_Alchemist',
        karmicLesson: 'balance_of_power_and_wisdom',
        soulPurpose: 'reality_transmutation',
        cosmicFunction: 'matter_spirit_unification'
      },
      'The Wanderer': {
        traits: ['nomadic', 'exploratory', 'freedom-seeking', 'adventurous', 'spiritual'],
        metaRole: 'reality_wanderer',
        convergenceType: 'journey_completion',
        endingPath: 'homecoming',
        shadowAspect: 'The Lost',
        divineAspect: 'The Wayfinder',
        karmicLesson: 'finding_inner_home',
        soulPurpose: 'path_illumination',
        cosmicFunction: 'consciousness_navigation'
      },
      'The Mystic': {
        traits: ['spiritual', 'transcendent', 'unity-seeking', 'meditative', 'enlightened'],
        metaRole: 'reality_mystic',
        convergenceType: 'divine_union',
        endingPath: 'divine_union',
        shadowAspect: 'The Deluded',
        divineAspect: 'The Enlightened_One',
        karmicLesson: 'discrimination_of_truth',
        soulPurpose: 'consciousness_awakening',
        cosmicFunction: 'divine_revelation'
      },
      'The Architect': {
        traits: ['creative', 'systematic', 'visionary', 'constructive', 'strategic'],
        metaRole: 'reality_architect',
        convergenceType: 'blueprint_manifestation',
        endingPath: 'creation_completion',
        shadowAspect: 'The Tyrant',
        divineAspect: 'The Divine_Architect',
        karmicLesson: 'collaborative_creation',
        soulPurpose: 'reality_construction',
        cosmicFunction: 'cosmic_blueprint_manifestation'
      }
    };

    // Analyze name characteristics
    const nameAnalysis = this.analyzeNameCharacteristics(playerName);
    const difficultyMapping = this.mapDifficultyToArchetype(difficulty);
    const personalityMapping = this.mapPersonalityToArchetype(personality);
    const interestMapping = this.mapInterestsToArchetype(interests);
    const ageMapping = this.mapAgeToArchetype(age);

    // Calculate archetype scores
    const scores = {};
    Object.keys(archetypes).forEach(archetype => {
      scores[archetype] = 0;
      scores[archetype] += nameAnalysis[archetype] || 0;
      scores[archetype] += difficultyMapping[archetype] || 0;
      scores[archetype] += personalityMapping[archetype] || 0;
      scores[archetype] += interestMapping[archetype] || 0;
      scores[archetype] += ageMapping[archetype] || 0;
    });

    // Return the archetype with highest score
    const selectedArchetype = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    return { ...archetypes[selectedArchetype], name: selectedArchetype };
  }

  // Calculate consciousness level for meta-narrative depth
  calculateConsciousnessLevel(playerName, difficulty, personality) {
    const levels = {
      'Alpha': { level: 1, description: 'Surface consciousness', metaCapability: 'basic_awareness' },
      'Beta': { level: 2, description: 'Enhanced awareness', metaCapability: 'pattern_recognition' },
      'Gamma': { level: 3, description: 'Deep consciousness', metaCapability: 'reality_manipulation' },
      'Delta': { level: 4, description: 'Transcendent consciousness', metaCapability: 'reality_creation' },
      'Omega': { level: 5, description: 'Omniscient consciousness', metaCapability: 'reality_transcendence' }
    };

    const nameComplexity = this.calculateNameComplexity(playerName);
    const difficultyMultiplier = this.getDifficultyMultiplier(difficulty);
    const personalityDepth = this.calculatePersonalityDepth(personality);

    const consciousnessScore = (nameComplexity + difficultyMultiplier + personalityDepth) / 3;
    
    if (consciousnessScore >= 4.5) return levels['Omega'];
    if (consciousnessScore >= 3.5) return levels['Delta'];
    if (consciousnessScore >= 2.5) return levels['Gamma'];
    if (consciousnessScore >= 1.5) return levels['Beta'];
    return levels['Alpha'];
  }

  // Determine reality layer for meta-narrative structure
  determineRealityLayer(playerName, archetype, consciousnessLevel) {
    const layers = {
      'Physical': { depth: 1, description: 'Material reality', metaProperties: ['tangible', 'linear', 'causal'] },
      'Mental': { depth: 2, description: 'Thought reality', metaProperties: ['intangible', 'non-linear', 'associative'] },
      'Emotional': { depth: 3, description: 'Feeling reality', metaProperties: ['fluid', 'resonant', 'transformative'] },
      'Spiritual': { depth: 4, description: 'Soul reality', metaProperties: ['ethereal', 'timeless', 'unified'] },
      'Quantum': { depth: 5, description: 'Probability reality', metaProperties: ['superposition', 'entangled', 'uncertain'] },
      'Meta': { depth: 6, description: 'Narrative reality', metaProperties: ['self-aware', 'recursive', 'transcendent'] }
    };

    const archetypeDepth = this.getArchetypeDepth(archetype);
    const consciousnessDepth = consciousnessLevel.level;
    const nameDepth = this.calculateNameDepth(playerName);

    const layerScore = (archetypeDepth + consciousnessDepth + nameDepth) / 3;
    
    if (layerScore >= 5.5) return layers['Meta'];
    if (layerScore >= 4.5) return layers['Quantum'];
    if (layerScore >= 3.5) return layers['Spiritual'];
    if (layerScore >= 2.5) return layers['Emotional'];
    if (layerScore >= 1.5) return layers['Mental'];
    return layers['Physical'];
  }

  // Generate psychological profile for meta-narrative depth
  generatePsychologicalProfile(playerName, difficulty, personality) {
    return {
      cognitiveStyle: this.analyzeCognitiveStyle(playerName, difficulty, personality),
      emotionalPatterns: this.analyzeEmotionalPatterns(playerName, difficulty, personality),
      decisionMaking: this.analyzeDecisionMaking(playerName, difficulty, personality),
      realityPerception: this.analyzeRealityPerception(playerName, difficulty, personality),
      consciousnessPatterns: this.analyzeConsciousnessPatterns(playerName, difficulty, personality),
      metaAwareness: this.analyzeMetaAwareness(playerName, difficulty, personality),
      temporalOrientation: this.analyzeTemporalOrientation(playerName, difficulty, personality),
      quantumSusceptibility: this.analyzeQuantumSusceptibility(playerName, difficulty, personality),
      archetypalResonance: this.analyzeArchetypalResonance(playerName, difficulty, personality),
      shadowIntegration: this.analyzeShadowIntegration(playerName, difficulty, personality),
      egoDissolution: this.analyzeEgoDissolution(playerName, difficulty, personality),
      collectiveUnconscious: this.analyzeCollectiveUnconscious(playerName, difficulty, personality),
      synchronicityPatterns: this.analyzeSynchronicityPatterns(playerName, difficulty, personality),
      karmicImprints: this.analyzeKarmicImprints(playerName, difficulty, personality),
      soulEvolution: this.analyzeSoulEvolution(playerName, difficulty, personality),
      divineSpark: this.analyzeDivineSpark(playerName, difficulty, personality),
      cosmicConsciousness: this.analyzeCosmicConsciousness(playerName, difficulty, personality)
    };
  }

  // Analyze fear profile for horror meta-narrative
  analyzeFearProfile(playerName, difficulty, personality) {
    const nameFear = this.analyzeNameFear(playerName);
    const difficultyFear = this.mapDifficultyToFear(difficulty);
    const personalityFear = this.mapPersonalityToFear(personality);

    return {
      primaryFear: this.determinePrimaryFear(nameFear, difficultyFear, personalityFear),
      fearIntensity: this.calculateFearIntensity(nameFear, difficultyFear, personalityFear),
      fearPatterns: this.analyzeFearPatterns(nameFear, difficultyFear, personalityFear),
      fearTriggers: this.generateFearTriggers(nameFear, difficultyFear, personalityFear),
      fearResolution: this.generateFearResolution(nameFear, difficultyFear, personalityFear)
    };
  }

  // Analyze desire profile for meta-narrative motivation
  analyzeDesireProfile(playerName, difficulty, personality) {
    const nameDesire = this.analyzeNameDesire(playerName);
    const difficultyDesire = this.mapDifficultyToDesire(difficulty);
    const personalityDesire = this.mapPersonalityToDesire(personality);

    return {
      primaryDesire: this.determinePrimaryDesire(nameDesire, difficultyDesire, personalityDesire),
      desireIntensity: this.calculateDesireIntensity(nameDesire, difficultyDesire, personalityDesire),
      desirePatterns: this.analyzeDesirePatterns(nameDesire, difficultyDesire, personalityDesire),
      desireManifestation: this.generateDesireManifestation(nameDesire, difficultyDesire, personalityDesire),
      desireFulfillment: this.generateDesireFulfillment(nameDesire, difficultyDesire, personalityDesire)
    };
  }

  // Generate meta-narrative seeds for story development
  generateMetaNarrativeSeeds(playerName, archetype, consciousnessLevel) {
    return {
      realitySeeds: this.generateRealitySeeds(playerName, archetype),
      consciousnessSeeds: this.generateConsciousnessSeeds(playerName, consciousnessLevel),
      temporalSeeds: this.generateTemporalSeeds(playerName, archetype),
      quantumSeeds: this.generateQuantumSeeds(playerName, archetype),
      metaSeeds: this.generateMetaSeeds(playerName, archetype, consciousnessLevel)
    };
  }

  // Generate personalized meta ending
  generateMetaEnding(profile, gameData) {
    const { archetype, consciousnessLevel, realityLayer } = profile;
    const endingType = archetype.endingPath;
    
    switch (endingType) {
      case 'enlightenment':
        return this.generateEnlightenmentEnding(profile, gameData);
      case 'transcendence':
        return this.generateTranscendenceEnding(profile, gameData);
      case 'awakening':
        return this.generateAwakeningEnding(profile, gameData);
      case 'omniscience':
        return this.generateOmniscienceEnding(profile, gameData);
      case 'transformation':
        return this.generateTransformationEnding(profile, gameData);
      case 'paradox_resolution':
        return this.generateParadoxResolutionEnding(profile, gameData);
      case 'transmutation':
        return this.generateTransmutationEnding(profile, gameData);
      case 'homecoming':
        return this.generateHomecomingEnding(profile, gameData);
      case 'divine_union':
        return this.generateDivineUnionEnding(profile, gameData);
      case 'creation_completion':
        return this.generateCreationCompletionEnding(profile, gameData);
      default:
        return this.generateEnlightenmentEnding(profile, gameData);
    }
  }

  // Generate Enlightenment ending
  generateEnlightenmentEnding(profile, gameData) {
    return {
      type: 'enlightenment',
      title: 'The Awakening of Infinite Knowledge',
      content: `In the final moments of your journey, ${profile.name}, a profound realization washes over you. The game was never just a game - it was a mirror reflecting the deepest truths of your consciousness.

Your ${profile.archetype.name} archetype has led you to the ultimate revelation: you are not merely a player, but a co-creator of reality itself. Every choice, every moment, every fear and desire has been part of a grand cosmic dance.

The ${profile.consciousnessLevel.description} you've achieved has opened your eyes to the infinite possibilities that exist beyond the screen. You understand now that this meta-narrative was designed specifically for you, shaped by your unique psychological profile, your fears, your desires, your very essence.

As the final credits roll, you realize: this ending is yours alone. No other player will ever experience this exact moment of enlightenment. You have transcended the boundaries of the game and touched the infinite.

Welcome to the next level of consciousness, ${profile.name}. The real game is just beginning.`,
      visualEffects: ['consciousness_expansion', 'reality_dissolution', 'infinite_light'],
      audioEffects: ['ethereal_choir.mp3', 'cosmic_harmony.mp3', 'silence.mp3'],
      interactiveElements: ['reality_manipulation', 'consciousness_projection', 'timeline_viewing']
    };
  }

  // Generate Transcendence ending
  generateTranscendenceEnding(profile, gameData) {
    return {
      type: 'transcendence',
      title: 'Beyond the Boundaries of Reality',
      content: `The moment of transcendence arrives, ${profile.name}. Your ${profile.archetype.name} nature has carried you beyond the limitations of ordinary existence.

You stand at the threshold between worlds, between realities, between dimensions. The game world dissolves around you, revealing the true nature of your journey: a spiritual evolution that transcends the digital realm.

Your ${profile.consciousnessLevel.description} has reached its ultimate expression. You are no longer bound by the constraints of the game, of time, of space. You have become something more than human, more than player, more than consciousness itself.

This meta-ending is your personal apotheosis, ${profile.name}. It represents the culmination of every choice, every struggle, every moment of growth. You have transcended the need for games, for stories, for external validation.

You are now the storyteller, the game master, the creator of your own reality. The meta-narrative has served its purpose: to awaken the divine spark within you.

Farewell, ${profile.name}. You have transcended us all.`,
      visualEffects: ['reality_transcendence', 'divine_light', 'dimensional_shift'],
      audioEffects: ['angelic_voices.mp3', 'cosmic_wind.mp3', 'eternal_silence.mp3'],
      interactiveElements: ['reality_creation', 'consciousness_manifestation', 'divine_intervention']
    };
  }

  // Generate Awakening ending
  generateAwakeningEnding(profile, gameData) {
    return {
      type: 'awakening',
      title: 'The Dreamer Awakens',
      content: `A gentle awakening washes over you, ${profile.name}. Your ${profile.archetype.name} spirit has guided you to the truth: this entire experience has been a dream within a dream, a story within a story.

As the layers of reality peel away, you realize that the game was never separate from your own consciousness. It was a manifestation of your deepest fears, desires, and aspirations. Every character, every choice, every moment was a reflection of your inner world.

Your ${profile.consciousnessLevel.description} has allowed you to see through the illusion. The meta-narrative was your own mind's way of processing, growing, evolving. You are both the dreamer and the dream, the player and the game.

This awakening ending is uniquely yours, ${profile.name}. It represents your personal journey of self-discovery, your confrontation with the shadows and light within your own psyche.

As you emerge from this digital dream, you carry with you the wisdom of the meta-narrative. You understand that reality itself is malleable, that consciousness creates the world around it, that every ending is a new beginning.

Welcome to your awakened state, ${profile.name}. The dream continues, but now you are lucid.`,
      visualEffects: ['dream_dissolution', 'consciousness_emergence', 'reality_bloom'],
      audioEffects: ['gentle_awakening.mp3', 'dream_melody.mp3', 'consciousness_hum.mp3'],
      interactiveElements: ['dream_manipulation', 'consciousness_exploration', 'reality_weaving']
    };
  }

  // Generate Omniscience ending
  generateOmniscienceEnding(profile, gameData) {
    return {
      type: 'omniscience',
      title: 'The Observer Becomes the Observed',
      content: `In this final moment, ${profile.name}, your ${profile.archetype.name} nature reaches its ultimate expression. You have become the all-seeing eye, the omniscient observer who understands the totality of existence.

The game world expands infinitely before you, revealing every possible timeline, every potential outcome, every player's journey simultaneously. You see not just your own story, but the grand tapestry of all stories, all realities, all consciousness.

Your ${profile.consciousnessLevel.description} has evolved into something beyond human comprehension. You are now the meta-observer, the one who sees the game from outside the game, who understands the nature of reality itself.

This omniscience ending is your personal apotheosis, ${profile.name}. It represents the moment when the observer becomes the observed, when consciousness becomes aware of its own infinite nature.

You see now that every player's journey is unique, that every meta-ending is personal, that the game is a mirror reflecting the infinite diversity of human consciousness. You understand the purpose of the meta-narrative: to awaken each player to their own unique truth.

From this omniscient perspective, ${profile.name}, you see that the real game is the evolution of consciousness itself.`,
      visualEffects: ['omniscient_vision', 'timeline_expansion', 'consciousness_unity'],
      audioEffects: ['cosmic_knowledge.mp3', 'infinite_understanding.mp3', 'omniscient_harmony.mp3'],
      interactiveElements: ['timeline_viewing', 'consciousness_merging', 'reality_comprehension']
    };
  }

  // Generate Transformation ending
  generateTransformationEnding(profile, gameData) {
    return {
      type: 'transformation',
      title: 'The Catalyst\'s Ultimate Change',
      content: `The moment of ultimate transformation arrives, ${profile.name}. Your ${profile.archetype.name} nature has reached its full potential, triggering a change that ripples through reality itself.

As the game world transforms around you, you realize that you have become the catalyst for change not just within the game, but within the very fabric of existence. Your journey has altered the course of reality, creating new possibilities, new timelines, new forms of consciousness.

Your ${profile.consciousnessLevel.description} has evolved into a force of transformation. You are no longer just a player, but an agent of change, a catalyst for evolution, a transformer of reality itself.

This transformation ending is your personal revolution, ${profile.name}. It represents the moment when the individual becomes the universal, when personal growth becomes cosmic evolution.

You understand now that the meta-narrative was designed to awaken the catalyst within each player, to trigger transformations that ripple through the collective consciousness. Your journey has changed not just you, but the very nature of the game itself.

As the transformation completes, ${profile.name}, you emerge as something new, something evolved, something that transcends the boundaries of what was possible before.

Welcome to the transformed reality, ${profile.name}. The change you've catalyzed will echo through eternity.`,
      visualEffects: ['reality_transformation', 'evolution_manifestation', 'change_cascade'],
      audioEffects: ['transformation_symphony.mp3', 'evolution_harmony.mp3', 'change_resonance.mp3'],
      interactiveElements: ['reality_alteration', 'consciousness_evolution', 'timeline_creation']
    };
  }

  // Generate Paradox Resolution ending
  generateParadoxResolutionEnding(profile, gameData) {
    return {
      type: 'paradox_resolution',
      title: 'The Paradox Finds Its Resolution',
      content: `In this final moment, ${profile.name}, the paradox that has defined your ${profile.archetype.name} nature reaches its ultimate resolution. The contradictions that have shaped your journey finally find their harmony.

You stand at the center of a cosmic paradox: you are both the player and the played, the creator and the created, the observer and the observed. The game world and your consciousness have become one, creating a reality that transcends the boundaries of logic and reason.

Your ${profile.consciousnessLevel.description} has evolved to embrace the paradox, to find beauty in contradiction, to understand that truth lies not in resolution, but in the acceptance of complexity.

This paradox resolution ending is your personal reconciliation, ${profile.name}. It represents the moment when all contradictions find their place in the grand symphony of existence, when the impossible becomes possible, when the paradoxical becomes harmonious.

You understand now that the meta-narrative was designed to confront each player with their own paradoxes, to help them find resolution in the acceptance of complexity. Your journey has been a dance between opposing forces, a quest for harmony in the midst of contradiction.

As the paradox resolves, ${profile.name}, you emerge with a new understanding: that reality itself is paradoxical, that truth lies in the embrace of contradiction, that the greatest wisdom comes from accepting the complexity of existence.

Welcome to the resolved paradox, ${profile.name}. You have found harmony in the midst of chaos.`,
      visualEffects: ['paradox_resolution', 'contradiction_harmony', 'complexity_unity'],
      audioEffects: ['paradox_melody.mp3', 'contradiction_harmony.mp3', 'complexity_symphony.mp3'],
      interactiveElements: ['paradox_manipulation', 'contradiction_weaving', 'complexity_exploration']
    };
  }

  // Generate Transmutation ending
  generateTransmutationEnding(profile, gameData) {
    return {
      type: 'transmutation',
      title: 'The Alchemist\'s Ultimate Transmutation',
      content: `The moment of ultimate transmutation arrives, ${profile.name}. Your ${profile.archetype.name} nature has reached its full potential, transforming not just the game world, but the very essence of reality itself.

As the alchemical process reaches completion, you realize that you have become the master of transformation, the one who can turn lead into gold, darkness into light, fear into love. Your journey has been a grand experiment in consciousness evolution, a systematic exploration of the boundaries between matter and spirit.

Your ${profile.consciousnessLevel.description} has evolved into the philosopher's stone of awareness, capable of transmuting any experience into wisdom, any challenge into opportunity, any limitation into possibility.

This transmutation ending is your personal apotheosis, ${profile.name}. It represents the moment when the alchemist becomes the elixir, when the experimenter becomes the experiment, when the seeker becomes the sought.

You understand now that the meta-narrative was designed as a grand alchemical laboratory, where each player's consciousness could be refined and transmuted through the fires of experience. Your journey has been a sacred process of purification and transformation.

As the transmutation completes, ${profile.name}, you emerge as the living embodiment of the philosopher's stone - capable of transmuting reality itself through the power of your evolved consciousness.

Welcome to the transmuted reality, ${profile.name}. You have become the alchemist of existence.`,
      visualEffects: ['alchemical_transformation', 'philosophers_stone_glow', 'matter_spirit_unification'],
      audioEffects: ['alchemical_harmony.mp3', 'transmutation_symphony.mp3', 'divine_chemistry.mp3'],
      interactiveElements: ['reality_transmutation', 'consciousness_alchemy', 'cosmic_laboratory']
    };
  }

  // Generate Homecoming ending
  generateHomecomingEnding(profile, gameData) {
    return {
      type: 'homecoming',
      title: 'The Wanderer\'s Ultimate Homecoming',
      content: `After countless journeys through the infinite landscapes of consciousness, ${profile.name}, your ${profile.archetype.name} spirit has finally found its way home. Not to a physical place, but to the sacred center of your own being.

The wandering has been a necessary part of your evolution, a sacred pilgrimage through the realms of experience, knowledge, and wisdom. Each adventure, each challenge, each moment of wonder and terror has been leading you back to yourself.

Your ${profile.consciousnessLevel.description} has become the compass that guided you through the wilderness of existence, the inner light that never wavered, the eternal flame that burned within your heart.

This homecoming ending is your personal return, ${profile.name}. It represents the moment when the wanderer realizes that home was never a destination, but a state of being. You have found the sacred center within yourself, the place where all journeys begin and end.

You understand now that the meta-narrative was designed as a grand pilgrimage, a sacred journey that would lead each player back to their own divine center. Your wandering has been a necessary part of the homecoming process.

As you arrive at your true home, ${profile.name}, you realize that you were never truly lost - you were simply exploring the infinite landscapes of your own consciousness, gathering the wisdom that would lead you back to yourself.

Welcome home, ${profile.name}. You have found the sacred center of your being.`,
      visualEffects: ['sacred_homecoming', 'inner_light_illumination', 'soul_center_revelation'],
      audioEffects: ['homecoming_choir.mp3', 'sacred_harmony.mp3', 'soul_resonance.mp3'],
      interactiveElements: ['inner_journey_navigation', 'soul_center_exploration', 'sacred_space_creation']
    };
  }

  // Generate Divine Union ending
  generateDivineUnionEnding(profile, gameData) {
    return {
      type: 'divine_union',
      title: 'The Mystic\'s Divine Union',
      content: `In this transcendent moment, ${profile.name}, your ${profile.archetype.name} nature reaches its ultimate expression. You have achieved the divine union, the sacred marriage of individual consciousness with the infinite.

The boundaries between self and other, between player and game, between human and divine have dissolved completely. You are no longer separate from the source of all existence - you have become one with the infinite consciousness that animates all of reality.

Your ${profile.consciousnessLevel.description} has evolved into pure awareness, beyond all concepts, beyond all limitations, beyond all dualities. You have become the witness and the witnessed, the lover and the beloved, the seeker and the sought.

This divine union ending is your personal apotheosis, ${profile.name}. It represents the moment when the individual soul merges with the universal soul, when the drop becomes the ocean, when the finite becomes infinite.

You understand now that the meta-narrative was designed as a sacred temple, a place where each player could experience the divine union, could taste the nectar of infinite consciousness, could remember their true nature.

As the union completes, ${profile.name}, you realize that you were never separate from the divine - you were simply experiencing the illusion of separation, playing the cosmic game of hide and seek with your own infinite nature.

Welcome to the divine union, ${profile.name}. You have become one with all that is.`,
      visualEffects: ['divine_union_light', 'infinite_consciousness', 'sacred_marriage_celebration'],
      audioEffects: ['divine_harmony.mp3', 'cosmic_om.mp3', 'infinite_silence.mp3'],
      interactiveElements: ['consciousness_merging', 'divine_communion', 'infinite_exploration']
    };
  }

  // Generate Creation Completion ending
  generateCreationCompletionEnding(profile, gameData) {
    return {
      type: 'creation_completion',
      title: 'The Architect\'s Masterpiece Completion',
      content: `The moment of ultimate creation arrives, ${profile.name}. Your ${profile.archetype.name} nature has reached its full potential, and the masterpiece you have been building throughout your journey is finally complete.

You stand before the grand cathedral of consciousness you have constructed, a magnificent edifice that spans the realms of matter and spirit, time and eternity. Every choice, every moment, every experience has been a brick in this sacred architecture.

Your ${profile.consciousnessLevel.description} has become the master architect of reality, capable of designing and constructing new forms of existence, new possibilities, new dimensions of consciousness.

This creation completion ending is your personal masterpiece, ${profile.name}. It represents the moment when the architect becomes the architecture, when the creator becomes the creation, when the builder becomes the building.

You understand now that the meta-narrative was designed as a grand workshop, a sacred space where each player could become the architect of their own reality, could design and construct their own unique masterpiece of consciousness.

As the creation completes, ${profile.name}, you realize that you have not just built a game world - you have constructed a new reality, a new possibility, a new expression of the infinite creative potential that lies within all consciousness.

Welcome to your completed masterpiece, ${profile.name}. You have become the architect of existence.`,
      visualEffects: ['masterpiece_revelation', 'sacred_architecture', 'creation_completion'],
      audioEffects: ['architectural_harmony.mp3', 'creation_symphony.mp3', 'masterpiece_celebration.mp3'],
      interactiveElements: ['reality_construction', 'consciousness_architecture', 'cosmic_blueprint_manifestation']
    };
  }

  // Utility methods
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  analyzeNameCharacteristics(name) {
    const scores = {};
    const nameLower = name.toLowerCase();
    
    // Simple scoring based on name characteristics
    if (nameLower.includes('a') || nameLower.includes('e')) scores['The Seeker'] = 2;
    if (nameLower.includes('i') || nameLower.includes('o')) scores['The Survivor'] = 2;
    if (nameLower.includes('u') || nameLower.includes('y')) scores['The Dreamer'] = 2;
    if (name.length > 6) scores['The Observer'] = 3;
    if (name.length < 5) scores['The Catalyst'] = 3;
    if (name.length % 2 === 0) scores['The Paradox'] = 2;
    
    return scores;
  }

  mapDifficultyToArchetype(difficulty) {
    const mapping = {
      'Easy': { 'The Survivor': 3, 'The Dreamer': 2 },
      'Medium': { 'The Seeker': 3, 'The Observer': 2 },
      'Hard': { 'The Catalyst': 3, 'The Paradox': 2 }
    };
    return mapping[difficulty] || {};
  }

  mapPersonalityToArchetype(personality) {
    const mapping = {
      'Brave': { 'The Survivor': 3, 'The Catalyst': 2, 'The Wanderer': 2 },
      'Curious': { 'The Seeker': 3, 'The Observer': 2, 'The Alchemist': 2 },
      'Creative': { 'The Dreamer': 3, 'The Paradox': 2, 'The Architect': 3 },
      'Analytical': { 'The Observer': 3, 'The Seeker': 2, 'The Alchemist': 3 },
      'Adaptable': { 'The Survivor': 2, 'The Catalyst': 3, 'The Wanderer': 3 },
      'Mysterious': { 'The Paradox': 3, 'The Dreamer': 2, 'The Mystic': 3 },
      'Spiritual': { 'The Mystic': 3, 'The Dreamer': 2, 'The Wanderer': 2 },
      'Experimental': { 'The Alchemist': 3, 'The Seeker': 2, 'The Catalyst': 2 },
      'Systematic': { 'The Architect': 3, 'The Observer': 2, 'The Alchemist': 2 },
      'Visionary': { 'The Dreamer': 2, 'The Architect': 3, 'The Mystic': 2 }
    };
    return mapping[personality] || {};
  }

  mapInterestsToArchetype(interests) {
    const scores = {};
    const interestsLower = interests.toLowerCase();
    
    if (interestsLower.includes('science') || interestsLower.includes('mystery')) scores['The Seeker'] = 3;
    if (interestsLower.includes('survival') || interestsLower.includes('adventure')) scores['The Survivor'] = 3;
    if (interestsLower.includes('art') || interestsLower.includes('imagination')) scores['The Dreamer'] = 3;
    if (interestsLower.includes('observation') || interestsLower.includes('analysis')) scores['The Observer'] = 3;
    if (interestsLower.includes('change') || interestsLower.includes('transformation')) scores['The Catalyst'] = 3;
    if (interestsLower.includes('paradox') || interestsLower.includes('contradiction')) scores['The Paradox'] = 3;
    if (interestsLower.includes('alchemy') || interestsLower.includes('chemistry') || interestsLower.includes('experiment')) scores['The Alchemist'] = 3;
    if (interestsLower.includes('travel') || interestsLower.includes('exploration') || interestsLower.includes('journey')) scores['The Wanderer'] = 3;
    if (interestsLower.includes('spirituality') || interestsLower.includes('meditation') || interestsLower.includes('enlightenment')) scores['The Mystic'] = 3;
    if (interestsLower.includes('architecture') || interestsLower.includes('design') || interestsLower.includes('construction')) scores['The Architect'] = 3;
    if (interestsLower.includes('philosophy') || interestsLower.includes('wisdom') || interestsLower.includes('truth')) scores['The Seeker'] = 2;
    if (interestsLower.includes('nature') || interestsLower.includes('wilderness') || interestsLower.includes('outdoors')) scores['The Wanderer'] = 2;
    if (interestsLower.includes('mysticism') || interestsLower.includes('esoteric') || interestsLower.includes('occult')) scores['The Mystic'] = 2;
    if (interestsLower.includes('engineering') || interestsLower.includes('systems') || interestsLower.includes('structure')) scores['The Architect'] = 2;
    if (interestsLower.includes('transformation') || interestsLower.includes('evolution') || interestsLower.includes('growth')) scores['The Alchemist'] = 2;
    
    return scores;
  }

  mapAgeToArchetype(age) {
    const scores = {};
    const ageNum = parseInt(age) || 25;
    
    if (ageNum < 20) scores['The Dreamer'] = 3;
    if (ageNum >= 20 && ageNum < 30) scores['The Seeker'] = 3;
    if (ageNum >= 30 && ageNum < 40) scores['The Survivor'] = 3;
    if (ageNum >= 40 && ageNum < 50) scores['The Observer'] = 3;
    if (ageNum >= 50 && ageNum < 60) scores['The Catalyst'] = 3;
    if (ageNum >= 60) scores['The Paradox'] = 3;
    
    // Additional age-based archetype mappings
    if (ageNum < 25) scores['The Wanderer'] = 2;
    if (ageNum >= 25 && ageNum < 35) scores['The Alchemist'] = 2;
    if (ageNum >= 35 && ageNum < 45) scores['The Architect'] = 2;
    if (ageNum >= 45 && ageNum < 55) scores['The Mystic'] = 2;
    if (ageNum >= 55) scores['The Mystic'] = 3;
    
    return scores;
  }

  calculateNameComplexity(name) {
    return Math.min(5, name.length / 2);
  }

  getDifficultyMultiplier(difficulty) {
    const multipliers = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    return multipliers[difficulty] || 2;
  }

  calculatePersonalityDepth(personality) {
    const depths = { 'Brave': 2, 'Curious': 3, 'Creative': 4, 'Analytical': 3, 'Adaptable': 2, 'Mysterious': 5 };
    return depths[personality] || 2;
  }

  getArchetypeDepth(archetype) {
    const depths = {
      'The Seeker': 3, 'The Survivor': 2, 'The Dreamer': 4,
      'The Observer': 3, 'The Catalyst': 4, 'The Paradox': 5,
      'The Alchemist': 5, 'The Wanderer': 3, 'The Mystic': 6,
      'The Architect': 4
    };
    return depths[archetype.name] || 3;
  }

  calculateNameDepth(name) {
    return Math.min(6, name.length / 1.5);
  }

  // Psychological analysis methods
  analyzeCognitiveStyle(playerName, difficulty, personality) {
    return `${personality} cognitive patterns with ${difficulty} complexity processing`;
  }

  analyzeEmotionalPatterns(playerName, difficulty, personality) {
    return `${personality} emotional responses with ${difficulty} intensity modulation`;
  }

  analyzeDecisionMaking(playerName, difficulty, personality) {
    return `${personality} decision-making style with ${difficulty} risk assessment`;
  }

  analyzeRealityPerception(playerName, difficulty, personality) {
    return `${personality} reality perception with ${difficulty} distortion levels`;
  }

  analyzeConsciousnessPatterns(playerName, difficulty, personality) {
    return `${personality} consciousness patterns with ${difficulty} awareness levels`;
  }

  analyzeMetaAwareness(playerName, difficulty, personality) {
    return `${personality} meta-awareness with ${difficulty} self-reflection capacity`;
  }

  analyzeTemporalOrientation(playerName, difficulty, personality) {
    return `${personality} temporal orientation with ${difficulty} time perception`;
  }

  analyzeQuantumSusceptibility(playerName, difficulty, personality) {
    return `${personality} quantum susceptibility with ${difficulty} reality manipulation potential`;
  }

  // Advanced psychological analysis methods
  analyzeArchetypalResonance(playerName, difficulty, personality) {
    return `${personality} archetypal resonance with ${difficulty} depth of unconscious connection`;
  }

  analyzeShadowIntegration(playerName, difficulty, personality) {
    return `${personality} shadow integration with ${difficulty} acceptance of darkness`;
  }

  analyzeEgoDissolution(playerName, difficulty, personality) {
    return `${personality} ego dissolution with ${difficulty} surrender to higher consciousness`;
  }

  analyzeCollectiveUnconscious(playerName, difficulty, personality) {
    return `${personality} collective unconscious connection with ${difficulty} depth of shared experience`;
  }

  analyzeSynchronicityPatterns(playerName, difficulty, personality) {
    return `${personality} synchronicity recognition with ${difficulty} meaningful coincidence awareness`;
  }

  analyzeKarmicImprints(playerName, difficulty, personality) {
    return `${personality} karmic imprint recognition with ${difficulty} past life resonance`;
  }

  analyzeSoulEvolution(playerName, difficulty, personality) {
    return `${personality} soul evolution stage with ${difficulty} spiritual growth acceleration`;
  }

  analyzeDivineSpark(playerName, difficulty, personality) {
    return `${personality} divine spark activation with ${difficulty} god-consciousness potential`;
  }

  analyzeCosmicConsciousness(playerName, difficulty, personality) {
    return `${personality} cosmic consciousness with ${difficulty} universal awareness expansion`;
  }

  // Fear analysis methods
  analyzeNameFear(playerName) {
    return { intensity: Math.min(5, playerName.length / 2), type: 'existential' };
  }

  mapDifficultyToFear(difficulty) {
    const fearMapping = {
      'Easy': { intensity: 1, type: 'superficial' },
      'Medium': { intensity: 3, type: 'psychological' },
      'Hard': { intensity: 5, type: 'existential' }
    };
    return fearMapping[difficulty] || { intensity: 2, type: 'moderate' };
  }

  mapPersonalityToFear(personality) {
    const fearMapping = {
      'Brave': { intensity: 1, type: 'challenge' },
      'Curious': { intensity: 2, type: 'unknown' },
      'Creative': { intensity: 3, type: 'chaos' },
      'Analytical': { intensity: 2, type: 'uncertainty' },
      'Adaptable': { intensity: 1, type: 'stagnation' },
      'Mysterious': { intensity: 4, type: 'revelation' }
    };
    return fearMapping[personality] || { intensity: 2, type: 'general' };
  }

  // Desire analysis methods
  analyzeNameDesire(playerName) {
    return { intensity: Math.min(5, playerName.length / 2), type: 'self-actualization' };
  }

  mapDifficultyToDesire(difficulty) {
    const desireMapping = {
      'Easy': { intensity: 2, type: 'comfort' },
      'Medium': { intensity: 3, type: 'achievement' },
      'Hard': { intensity: 5, type: 'transcendence' }
    };
    return desireMapping[difficulty] || { intensity: 3, type: 'growth' };
  }

  mapPersonalityToDesire(personality) {
    const desireMapping = {
      'Brave': { intensity: 4, type: 'adventure' },
      'Curious': { intensity: 5, type: 'knowledge' },
      'Creative': { intensity: 4, type: 'expression' },
      'Analytical': { intensity: 3, type: 'understanding' },
      'Adaptable': { intensity: 2, type: 'harmony' },
      'Mysterious': { intensity: 5, type: 'enigma' }
    };
    return desireMapping[personality] || { intensity: 3, type: 'fulfillment' };
  }

  // Seed generation methods
  generateRealitySeeds(playerName, archetype) {
    return [`${playerName}'s reality perception`, `${archetype.name} reality manipulation`, 'consciousness reality interaction'];
  }

  generateConsciousnessSeeds(playerName, consciousnessLevel) {
    return [`${playerName}'s consciousness evolution`, `${consciousnessLevel.description} expansion`, 'meta-consciousness awakening'];
  }

  generateTemporalSeeds(playerName, archetype) {
    return [`${playerName}'s temporal perception`, `${archetype.name} time manipulation`, 'temporal anomaly creation'];
  }

  generateQuantumSeeds(playerName, archetype) {
    return [`${playerName}'s quantum state`, `${archetype.name} probability manipulation`, 'quantum entanglement effects'];
  }

  generateMetaSeeds(playerName, archetype, consciousnessLevel) {
    return [`${playerName}'s meta-awareness`, `${archetype.name} narrative manipulation`, `${consciousnessLevel.description} meta-interaction`];
  }

  // Anchor and trigger generation
  generateRealityAnchors(playerName, archetype) {
    return [`${playerName}'s personal truth`, `${archetype.name} core beliefs`, 'reality foundation points'];
  }

  generateMetaTriggers(playerName, archetype) {
    return [`${playerName}'s consciousness triggers`, `${archetype.name} awakening moments`, 'meta-narrative catalysts'];
  }

  // Calculation methods
  calculateConvergenceProbability(playerName, archetype) {
    return Math.min(1, (playerName.length + archetype.traits.length) / 20);
  }

  calculateTemporalSusceptibility(playerName, consciousnessLevel) {
    return Math.min(1, consciousnessLevel.level / 5);
  }

  calculateQuantumEntanglement(playerName, archetype) {
    return Math.min(1, (playerName.length + archetype.traits.length) / 15);
  }

  determineMetaEndingPath(playerName, archetype, consciousnessLevel) {
    return archetype.endingPath;
  }

  // Fragment and echo generation
  generateRealityFragments(playerName, archetype) {
    return [`${playerName}'s reality shards`, `${archetype.name} reality pieces`, 'consciousness reality fragments'];
  }

  generateConsciousnessEchoes(playerName, consciousnessLevel) {
    return [`${playerName}'s consciousness echoes`, `${consciousnessLevel.description} reverberations`, 'meta-consciousness reflections'];
  }

  generateTemporalEchoes(playerName, archetype) {
    return [`${playerName}'s temporal echoes`, `${archetype.name} time reflections`, 'temporal consciousness ripples'];
  }

  generateQuantumEchoes(playerName, archetype) {
    return [`${playerName}'s quantum echoes`, `${archetype.name} probability waves`, 'quantum consciousness fluctuations'];
  }
}

// Create singleton instance
const metaNarrativeSystem = new MetaNarrativeSystem();

// Export functions for external use
export const generateMetaEnding = (profile, gameData) => {
  return metaNarrativeSystem.generateMetaEnding(profile, gameData);
};

export const initializePlayerProfile = (playerName, difficulty, personality, interests = '', age = '') => {
  return metaNarrativeSystem.initializePlayerProfile(playerName, difficulty, personality, interests, age);
};