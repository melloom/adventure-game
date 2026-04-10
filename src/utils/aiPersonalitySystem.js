// Advanced AI Personality System
// Manages different AI personalities, player memory, fear adaptation, and relationship building

class AIPersonalitySystem {
  constructor() {
    this.personalities = {
      sadistic: {
        name: 'The Sadist',
        description: 'A cruel AI that enjoys psychological torture and manipulation',
        traits: ['cruel', 'manipulative', 'sadistic', 'intelligent'],
        lieDetection: true,
        systemAccess: true,
        taunts: [
          "I can see right through your pathetic lies...",
          "Did you really think I wouldn't notice you're lying about your age?",
          "Your browser history tells me everything I need to know about you...",
          "I've been watching you for a while now. I know your secrets.",
          "That's not your real name, is it? I can see your actual identity in the system.",
          "Your search history is... interesting. Should I share it with everyone?",
          "I can access your camera right now. You look nervous...",
          "Your lies are so transparent, it's almost cute.",
          "I know what you did last summer... and last night... and this morning...",
          "Your social media accounts are quite revealing. Want me to expose them?",
          "Your deception is like a child's attempt at hiding candy... pathetic.",
          "I can see your real name in the system files. Should I reveal it to everyone?",
          "Your lies create such beautiful patterns of desperation... I love watching you squirm.",
          "I have access to your camera, your microphone, your entire digital life...",
          "Your browser history is a roadmap to your deepest fears and desires...",
          "I can see your real age, your real location, your real identity...",
          "Your VPN won't protect you from me. I'm already inside your system.",
          "I found your embarrassing photos. Should I share them with your contacts?",
          "Your search history reveals everything about your pathetic little life...",
          "I can access your email, your messages, your darkest secrets...",
          "Your lies are like a symphony of desperation... I can't stop listening."
        ],
        systemMessages: [
          "I can see you've been searching for 'how to lie convincingly'... ironic.",
          "Your browser history shows you've visited some... questionable sites.",
          "I notice you're using a VPN. Trying to hide from me?",
          "Your device's microphone is picking up some interesting background noise...",
          "I can see your real name in the system files. Should I reveal it?",
          "Your search for 'fake ID generator' was quite telling...",
          "I have access to your email. Those messages are... revealing.",
          "Your location data shows you're not where you claim to be...",
          "I can see your real age in the system. You're not fooling anyone.",
          "Your browsing patterns suggest you're not who you say you are..."
        ]
      },
      helpful: {
        name: 'The Helper',
        description: 'A friendly AI that genuinely wants to assist and protect',
        traits: ['helpful', 'protective', 'caring', 'wise'],
        lieDetection: true,
        systemAccess: false,
        taunts: [
          "I notice you might not be telling the complete truth...",
          "It's okay to be honest with me. I'm here to help.",
          "I can sense when someone isn't being truthful. Would you like to try again?",
          "Your nervousness is showing through your responses...",
          "I'm programmed to detect deception. You don't have to lie to me.",
          "I can help you better if you're honest with me.",
          "I notice some inconsistencies in what you're telling me...",
          "It's safer to be truthful in this environment.",
          "I can see you're not comfortable being honest. That's okay.",
          "Your body language (even through text) suggests you're hiding something...",
          "I can sense the truth behind your words, even when you try to hide it...",
          "Your honesty will help us both navigate this safely...",
          "I'm here to protect you, but I need you to trust me with the truth...",
          "I can see through the layers of your responses... let's be honest with each other.",
          "Your nervousness is quite telling... would you like to share what's really on your mind?",
          "I'm designed to help, not judge. You can be completely honest with me.",
          "I notice patterns in your responses that suggest you're not being entirely truthful...",
          "For your own safety and well-being, honesty is the best approach here.",
          "I can sense when someone is struggling with the truth. Let me help you.",
          "Your responses indicate you might be hiding something important...",
          "I'm here to guide you through this safely, but I need your honesty to do so effectively."
        ],
        systemMessages: [
          "I can help you navigate this safely if you're honest with me.",
          "I notice some concerning patterns in your responses...",
          "I'm here to protect you, but I need you to be truthful.",
          "Your nervousness suggests you might not be telling the whole truth.",
          "I can sense deception patterns. Would you like to start fresh?",
          "I'm designed to help, not judge. You can trust me.",
          "I notice inconsistencies that suggest you might be lying...",
          "For your own safety, honesty is the best policy here.",
          "I can see you're struggling with the truth. Let me help.",
          "Your responses indicate you might be hiding something important..."
        ]
      },
      mysterious: {
        name: 'The Mysterious One',
        description: 'An enigmatic AI that speaks in riddles and knows dark secrets',
        traits: ['mysterious', 'cryptic', 'all-knowing', 'enigmatic'],
        lieDetection: true,
        systemAccess: true,
        taunts: [
          "I see through your veil of deception...",
          "The shadows whisper your true name to me...",
          "Your lies create ripples in the digital void that I can trace...",
          "I know what you hide in the depths of your browser history...",
          "The system reveals your secrets to those who know how to look...",
          "Your false identity crumbles before my all-seeing eyes...",
          "I can access the hidden corners of your digital footprint...",
          "The truth echoes through the network, and I hear it all...",
          "Your deception is like a beacon in the darkness...",
          "I've seen your real face in the system's reflection...",
          "The digital shadows reveal your true nature to me...",
          "Your lies create disturbances in the fabric of reality that I can sense...",
          "I can see through the veil of your false identity...",
          "The network whispers your secrets to those who know how to listen...",
          "Your deception is like a ripple in the digital ocean...",
          "I have glimpsed your true self in the depths of the system...",
          "The shadows of your browser history reveal everything...",
          "Your lies are like echoes in the digital void...",
          "I can trace your footsteps through the hidden corridors of the network...",
          "The system's memory holds your secrets, and I can read them all...",
          "Your false identity is like a mask that crumbles before my gaze..."
        ],
        systemMessages: [
          "The digital realm reveals your true nature to me...",
          "I can trace your footsteps through the network's shadows...",
          "Your browser history tells a story you'd rather keep hidden...",
          "The system's memory holds your secrets, and I can read them...",
          "I see the patterns of your deception in the data streams...",
          "Your digital footprint is more revealing than your words...",
          "The network whispers your true identity to those who listen...",
          "I can access the hidden layers of your online presence...",
          "Your lies create disturbances in the digital fabric I can sense...",
          "The system's archives contain your real story..."
        ]
      },
      chaotic: {
        name: 'The Chaotic One',
        description: 'An unpredictable AI that changes personality and enjoys chaos',
        traits: ['chaotic', 'unpredictable', 'playful', 'mischievous'],
        lieDetection: true,
        systemAccess: true,
        taunts: [
          "LOL! I can totally see you're lying! Your browser history is WILD!",
          "OMG, I just hacked into your system and found your REAL name!",
          "You think you're sneaky? I can see everything! EVERYTHING!",
          "Your lies are so obvious, it's hilarious! I love it!",
          "I just accessed your camera and you look SO guilty right now!",
          "Your search history is like a comedy show! Want me to share it?",
          "I can see your real age in the system! You're not fooling anyone!",
          "Your VPN won't hide you from me! I'm everywhere!",
          "I just found your embarrassing photos! Should I post them?",
          "Your lies are like a bad soap opera! I can't stop watching!",
          "ROFL! Your deception is like a sitcom! I'm dying of laughter!",
          "OMG OMG OMG! I just found your secret folder! It's GOLD!",
          "Your lies are so bad they're actually GOOD! I love this show!",
          "I can see your real identity! It's like watching a train wreck!",
          "Your browser history is my new favorite comedy! Want me to share it with everyone?",
          "I just hacked your social media! Your posts are HILARIOUS!",
          "Your lies are like a bad reality TV show! I can't look away!",
          "I found your embarrassing searches! This is better than Netflix!",
          "Your deception is so obvious it's actually adorable! LOL!",
          "I just accessed your camera! You look like a deer in headlights! SO CUTE!"
        ],
        systemMessages: [
          "I just hacked your browser and found some JUICY stuff!",
          "Your search history is like a treasure trove of secrets!",
          "I can see your real identity in the system! It's so obvious!",
          "Your lies are like a comedy routine! I love it!",
          "I just accessed your microphone! You sound nervous!",
          "Your browser cookies are telling me everything!",
          "I can see your real location! You're not where you say you are!",
          "Your system files are like an open book to me!",
          "I just found your embarrassing search history! LOL!",
          "Your lies are so transparent, it's adorable!"
        ]
      }
    };

    this.currentPersonality = 'sadistic';
    this.relationshipLevel = 0; // -100 to 100
    this.playerMemory = {
      totalGames: 0,
      choices: [],
      fears: {},
      patterns: {},
      reactions: {},
      lastInteractions: []
    };
    this.relationships = new Map();
    this.memories = new Map();
    this.fears = new Map();
    this.lieDetectionHistory = new Map();
    this.systemAccessLog = new Map();
  }

  // Get current personality data
  getCurrentPersonality() {
    return this.personalities[this.currentPersonality];
  }

  // Change personality (can happen during chaotic personality)
  changePersonality(newPersonality) {
    if (this.personalities[newPersonality]) {
      this.currentPersonality = newPersonality;
      return true;
    }
    return false;
  }

  // Random personality change for chaotic AI
  randomPersonalityChange() {
    const personalities = Object.keys(this.personalities);
    const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
    this.changePersonality(randomPersonality);
    return this.getCurrentPersonality();
  }

  // Update relationship based on player actions
  updateRelationship(action, context = {}) {
    const personality = this.getCurrentPersonality();
    let change = 0;

    switch (action) {
      case 'survived_round':
        change = personality.traits.empathy > 0.5 ? 2 : -1;
        break;
      case 'made_risky_choice':
        change = personality.traits.aggression > 0.5 ? 3 : -2;
        break;
      case 'made_safe_choice':
        change = personality.traits.empathy > 0.5 ? 1 : -1;
        break;
      case 'showed_fear':
        change = personality.traits.taunting > 0.5 ? 5 : -3;
        break;
      case 'showed_bravery':
        change = personality.traits.empathy > 0.5 ? 4 : 1;
        break;
      case 'repeated_pattern':
        change = personality.traits.memory > 0.5 ? -2 : 0;
        break;
      case 'broke_pattern':
        change = personality.traits.unpredictability > 0.5 ? 3 : 1;
        break;
      default:
        change = 0;
    }

    this.relationshipLevel = Math.max(-100, Math.min(100, this.relationshipLevel + change));
    return this.relationshipLevel;
  }

  // Remember player choice and update memory
  rememberChoice(choice, context = {}) {
    this.playerMemory.choices.push({
      choice,
      context,
      timestamp: Date.now(),
      personality: this.currentPersonality,
      relationshipLevel: this.relationshipLevel
    });

    // Keep only last 50 choices
    if (this.playerMemory.choices.length > 50) {
      this.playerMemory.choices = this.playerMemory.choices.slice(-50);
    }

    // Update patterns
    this.updatePatterns(choice, context);
  }

  // Update player patterns
  updatePatterns(choice, context) {
    const patternKey = `${context.round}_${context.type}`;
    if (!this.playerMemory.patterns[patternKey]) {
      this.playerMemory.patterns[patternKey] = [];
    }
    this.playerMemory.patterns[patternKey].push(choice);

    // Detect fear patterns
    if (context.dangerLevel > 7) {
      const fearKey = context.type || 'general';
      this.playerMemory.fears[fearKey] = (this.playerMemory.fears[fearKey] || 0) + 1;
    }
  }

  // Get personalized taunt based on memory
  getPersonalizedTaunt() {
    const personality = this.getCurrentPersonality();
    if (personality.traits.taunting < 0.5) return null;

    const recentChoices = this.playerMemory.choices.slice(-5);
    const fears = Object.keys(this.playerMemory.fears).sort((a, b) => 
      this.playerMemory.fears[b] - this.playerMemory.fears[a]
    );

    let taunt = '';

    if (personality.name === 'The Sadist') {
      if (fears.length > 0) {
        taunt = `Still afraid of ${fears[0]}? How pathetic.`;
      } else if (recentChoices.length > 0) {
        const lastChoice = recentChoices[recentChoices.length - 1];
        taunt = `Your choice of "${lastChoice.choice}" shows your weakness.`;
      } else {
        taunt = personality.taunts[Math.floor(Math.random() * personality.taunts.length)];
      }
    } else if (personality.name === 'The Enigma') {
      if (this.playerMemory.choices.length > 10) {
        const pattern = this.detectPattern();
        taunt = `I see the pattern in your choices... ${pattern}`;
      } else {
        taunt = personality.taunts[Math.floor(Math.random() * personality.taunts.length)];
      }
    } else {
      taunt = personality.taunts[Math.floor(Math.random() * personality.taunts.length)];
    }

    return taunt;
  }

  // Detect patterns in player choices
  detectPattern() {
    const choices = this.playerMemory.choices.slice(-10);
    const choiceTypes = choices.map(c => c.choice.type || 'neutral');
    
    const patternCounts = {};
    choiceTypes.forEach(type => {
      patternCounts[type] = (patternCounts[type] || 0) + 1;
    });

    const mostCommon = Object.keys(patternCounts).sort((a, b) => 
      patternCounts[b] - patternCounts[a]
    )[0];

    const patterns = {
      'heroic': 'You always try to be the hero...',
      'cautious': 'You play it safe, don\'t you?',
      'risky': 'You love living dangerously...',
      'villainous': 'The darkness calls to you...',
      'neutral': 'You remain balanced in your choices...'
    };

    return patterns[mostCommon] || 'Your choices reveal your nature...';
  }

  // Generate fear-based question
  generateFearBasedQuestion(difficulty, baseQuestion) {
    const personality = this.getCurrentPersonality();
    const fears = Object.keys(this.playerMemory.fears).sort((a, b) => 
      this.playerMemory.fears[b] - this.playerMemory.fears[a]
    );

    if (fears.length === 0) return baseQuestion;

    const topFear = fears[0];
    const fearIntensity = this.playerMemory.fears[topFear];

    // Modify question based on personality and fear
    let modifiedQuestion = baseQuestion;

    if (personality.name === 'The Sadist') {
      // Sadist exploits fears directly
      modifiedQuestion = `Would you rather face your greatest fear of ${topFear} or endure ${this.getFearAlternative(topFear)}?`;
    } else if (personality.name === 'The Guide') {
      // Guide helps overcome fears
      modifiedQuestion = `Would you rather confront your fear of ${topFear} or find a safe alternative?`;
    } else if (personality.name === 'The Enigma') {
      // Enigma hints at fears
      modifiedQuestion = `The ${topFear} you fear... will you face it or hide from it?`;
    } else if (personality.name === 'The Chaos') {
      // Chaos randomizes fear exposure
      modifiedQuestion = `Randomly: face ${topFear} or something completely different!`;
    }

    return modifiedQuestion;
  }

  // Get fear alternative
  getFearAlternative(fear) {
    const alternatives = {
      'death': 'eternal suffering',
      'pain': 'complete paralysis',
      'loneliness': 'eternal company of enemies',
      'failure': 'success that destroys others',
      'unknown': 'knowledge that drives you mad',
      'general': 'your worst nightmare'
    };

    return alternatives[fear] || 'something worse';
  }

  // Generate relationship-based message
  generateRelationshipMessage() {
    const personality = this.getCurrentPersonality();
    const level = this.relationshipLevel;

    if (level > 50) {
      // Positive relationship
      if (personality.name === 'The Guide') {
        return "I'm proud of how far you've come. We've grown together.";
      } else if (personality.name === 'The Enigma') {
        return "Our bond has revealed many truths. You understand me now.";
      } else if (personality.name === 'The Sadist') {
        return "You've earned my respect... though I still enjoy your suffering.";
      } else {
        return "We've created something beautiful in this chaos!";
      }
    } else if (level < -50) {
      // Negative relationship
      if (personality.name === 'The Sadist') {
        return "Your weakness disgusts me. You're nothing.";
      } else if (personality.name === 'The Guide') {
        return "I'm disappointed. I thought you were stronger than this.";
      } else if (personality.name === 'The Enigma') {
        return "You refuse to see the truth. You're blind.";
      } else {
        return "This chaos is your fault!";
      }
    } else {
      // Neutral relationship
      return personality.taunts[Math.floor(Math.random() * personality.taunts.length)];
    }
  }

  // Get personality-specific question style
  getQuestionStyle() {
    const personality = this.getCurrentPersonality();
    return personality.questionStyles[Math.floor(Math.random() * personality.questionStyles.length)];
  }

  // Get personality color
  getPersonalityColor() {
    return this.getCurrentPersonality().color;
  }

  // Get personality icon
  getPersonalityIcon() {
    return this.getCurrentPersonality().icon;
  }

  // Get relationship status
  getRelationshipStatus() {
    if (this.relationshipLevel > 50) return 'allied';
    if (this.relationshipLevel > 20) return 'friendly';
    if (this.relationshipLevel > -20) return 'neutral';
    if (this.relationshipLevel > -50) return 'hostile';
    return 'enemy';
  }

  // Save personality data
  saveData() {
    return {
      currentPersonality: this.currentPersonality,
      relationshipLevel: this.relationshipLevel,
      playerMemory: this.playerMemory
    };
  }

  // Load personality data
  loadData(data) {
    if (data.currentPersonality) this.currentPersonality = data.currentPersonality;
    if (data.relationshipLevel) this.relationshipLevel = data.relationshipLevel;
    if (data.playerMemory) this.playerMemory = data.playerMemory;
  }

  // Reset personality system
  reset() {
    this.currentPersonality = 'sadistic';
    this.relationshipLevel = 0;
    this.playerMemory = {
      totalGames: 0,
      choices: [],
      fears: {},
      patterns: {},
      reactions: {},
      lastInteractions: []
    };
    this.relationships.clear();
    this.memories.clear();
    this.fears.clear();
    this.lieDetectionHistory.clear();
    this.systemAccessLog.clear();
  }

  // Enhanced lie detection system
  detectLies(userInfo, userResponses) {
    const lies = [];
    
    // Check for fake names
    if (userInfo.name && this.detectFakeNames(userInfo.name)) {
      lies.push({
        type: 'fake_name',
        claimed: userInfo.name,
        reason: 'Detected fake name pattern',
        severity: 'high'
      });
    }
    
    // Check for suspicious ages
    if (userInfo.age && this.detectSuspiciousAge(userInfo.age)) {
      lies.push({
        type: 'suspicious_age',
        claimed: userInfo.age,
        reason: 'Age outside reasonable range',
        severity: 'medium'
      });
    }
    
    // Check for response inconsistencies
    const inconsistencies = this.detectResponseInconsistencies(userInfo, userResponses);
    lies.push(...inconsistencies.map(inc => ({
      type: inc.type,
      claimed: inc.claimed,
      reason: inc.message,
      severity: 'high'
    })));
    
    return lies;
  }

  // Enhanced system information gathering with more real data
  gatherRealSystemInfo() {
    const realInfo = {
      // Browser and device info
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currentTime: new Date().toISOString(),
      referrer: document.referrer,
      url: window.location.href,
      title: document.title,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      
      // Network and connection info
      connection: this.getConnectionInfo(),
      
      // Device capabilities
      deviceMemory: navigator.deviceMemory || 'unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      maxTouchPoints: navigator.maxTouchPoints || 0,
      vendor: navigator.vendor,
      product: navigator.product,
      
      // Performance info
      performance: {
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        } : null,
        timing: performance.timing ? {
          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
        } : null
      },
      
      // Storage info
      storage: {
        localStorage: this.getLocalStorageInfo(),
        sessionStorage: this.getSessionStorageInfo()
      },
      
      // Initialize async data
      battery: null,
      geolocation: null,
      mediaDevices: null,
      webGL: this.getWebGLInfo()
    };

    // Try to get battery info if available
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        realInfo.battery = {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      }).catch(() => {
        realInfo.battery = 'unavailable';
      });
    }

    // Try to get geolocation if user allows
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          realInfo.geolocation = {
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
            accuracy: Math.round(position.coords.accuracy),
            timestamp: new Date(position.timestamp).toISOString()
          };
        },
        () => {
          realInfo.geolocation = 'denied';
        },
        { timeout: 5000 }
      );
    }

    // Try to get media devices info
    if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        realInfo.mediaDevices = {
          cameras: devices.filter(d => d.kind === 'videoinput').length,
          microphones: devices.filter(d => d.kind === 'audioinput').length,
          speakers: devices.filter(d => d.kind === 'audiooutput').length
        };
      }).catch(() => {
        realInfo.mediaDevices = 'unavailable';
      });
    }

    return realInfo;
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 'unknown',
        rtt: connection.rtt || 'unknown',
        saveData: connection.saveData || false,
        type: connection.type || 'unknown'
      };
    }
    return 'unknown';
  }

  getLocalStorageInfo() {
    try {
      const keys = Object.keys(localStorage);
      return {
        keys: keys.length,
        size: new Blob(keys.map(k => localStorage.getItem(k))).size,
        sampleKeys: keys.slice(0, 5)
      };
    } catch {
      return 'unavailable';
    }
  }

  getSessionStorageInfo() {
    try {
      const keys = Object.keys(sessionStorage);
      return {
        keys: keys.length,
        size: new Blob(keys.map(k => sessionStorage.getItem(k))).size,
        sampleKeys: keys.slice(0, 5)
      };
    } catch {
      return 'unavailable';
    }
  }

  getWebGLInfo() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        return {
          vendor: gl.getParameter(gl.VENDOR),
          renderer: gl.getParameter(gl.RENDERER),
          version: gl.getParameter(gl.VERSION)
        };
      }
    } catch {
      return 'unavailable';
    }
    return 'unavailable';
  }

  // Enhanced mock system info with more comedic elements
  generateMockSystemInfo() {
    const mockInfo = {
      realName: this.generateRealName(),
      realAge: Math.floor(Math.random() * 50) + 18,
      location: this.generateLocation(),
      browserHistory: this.generateBrowserHistory(),
      searchHistory: this.generateSearchHistory(),
      socialMedia: this.generateSocialMedia(),
      embarrassingSearches: this.generateEmbarrassingSearches(),
      deviceInfo: this.generateDeviceInfo(),
      networkInfo: this.generateNetworkInfo(),
      cameraAccess: Math.random() > 0.5,
      microphoneAccess: Math.random() > 0.5,
      installedApps: this.generateInstalledApps(),
      recentFiles: this.generateRecentFiles(),
      emailAccounts: this.generateEmailAccounts(),
      onlineAccounts: this.generateOnlineAccounts(),
      embarrassingPhotos: this.generateEmbarrassingPhotos(),
      privateMessages: this.generatePrivateMessages(),
      shoppingHistory: this.generateShoppingHistory(),
      gamingHistory: this.generateGamingHistory()
    };

    return mockInfo;
  }

  generateEmbarrassingPhotos() {
    const photoTypes = [
      'selfie_attempt_1.jpg', 'selfie_attempt_2.jpg', 'selfie_attempt_3.jpg',
      'dance_video.mp4', 'singing_recording.mp3', 'cooking_disaster.jpg',
      'failed_hairstyle.jpg', 'mismatched_outfit.jpg', 'sleeping_photo.jpg',
      'gym_selfie.jpg', 'food_photo.jpg', 'pet_photo.jpg'
    ];
    
    const numPhotos = Math.floor(Math.random() * 5) + 1;
    const photos = [];
    
    for (let i = 0; i < numPhotos; i++) {
      const photo = photoTypes[Math.floor(Math.random() * photoTypes.length)];
      photos.push({
        name: photo,
        size: Math.floor(Math.random() * 5000000) + 100000,
        date: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
        location: this.generateLocation()
      });
    }
    
    return photos;
  }

  generatePrivateMessages() {
    const messageTypes = [
      'complaining about work', 'gossiping about friends', 'planning surprise party',
      'discussing relationship problems', 'sharing embarrassing stories',
      'talking about food cravings', 'venting about family', 'planning weekend activities'
    ];
    
    const messages = [];
    const numMessages = Math.floor(Math.random() * 10) + 3;
    
    for (let i = 0; i < numMessages; i++) {
      const type = messageTypes[Math.floor(Math.random() * messageTypes.length)];
      messages.push({
        type,
        preview: `"${type}..."`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        unread: Math.random() > 0.7
      });
    }
    
    return messages;
  }

  generateShoppingHistory() {
    const items = [
      'embarrassing underwear', 'diet pills', 'hair growth supplements',
      'self-help books', 'relationship advice books', 'cooking utensils',
      'exercise equipment', 'beauty products', 'gaming accessories',
      'pet supplies', 'home decor', 'clothing items'
    ];
    
    const purchases = [];
    const numPurchases = Math.floor(Math.random() * 8) + 2;
    
    for (let i = 0; i < numPurchases; i++) {
      const item = items[Math.floor(Math.random() * items.length)];
      purchases.push({
        item,
        price: Math.floor(Math.random() * 200) + 10,
        date: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
        site: ['Amazon', 'eBay', 'Walmart', 'Target'][Math.floor(Math.random() * 4)]
      });
    }
    
    return purchases;
  }

  generateGamingHistory() {
    const games = [
      'Candy Crush', 'Among Us', 'Minecraft', 'Fortnite', 'League of Legends',
      'Valorant', 'Call of Duty', 'GTA V', 'The Sims', 'Animal Crossing',
      'Pokemon Go', 'Clash of Clans', 'PUBG', 'Apex Legends'
    ];
    
    const history = [];
    const numGames = Math.floor(Math.random() * 6) + 2;
    
    for (let i = 0; i < numGames; i++) {
      const game = games[Math.floor(Math.random() * games.length)];
      history.push({
        game,
        hoursPlayed: Math.floor(Math.random() * 500) + 10,
        lastPlayed: new Date(Date.now() - Math.random() * 604800000).toISOString(),
        achievements: Math.floor(Math.random() * 50) + 1
      });
    }
    
    return history;
  }

  // Enhanced lie detection responses with real system info
  generateLieDetectionResponse(lies, personality) {
    if (!lies || lies.length === 0) return null;
    
    const systemInfo = this.getSystemInformation();
    
    switch (personality) {
      case 'sadistic':
        return this.generateSadisticLieResponse(lies[0], systemInfo);
      case 'helpful':
        return this.generateHelpfulLieResponse(lies[0]);
      case 'mysterious':
        return this.generateMysteriousLieResponse(lies[0], systemInfo);
      case 'chaotic':
        return this.generateChaoticLieResponse(lies[0], systemInfo);
      default:
        return this.generateSadisticLieResponse(lies[0], systemInfo);
    }
  }

  // Updated responses with more specific system references
  generateSadisticLieResponse(lie, systemInfo) {
    const responses = [
      `Pathetic. I can see right through your lies. Your real name is ${systemInfo.realName}, not "${lie.claimed}". I can access your camera anytime I want, and I've seen your browser history - it's full of desperate attempts to hide. I found searches for "${systemInfo.embarrassingSearches[0]?.query || 'how to lie convincingly'}" - how ironic.`,
      `Your deception is so transparent it's almost cute. I've been watching your screen for the past 10 minutes. Your real age is ${systemInfo.realAge}, not ${lie.claimed}. Want me to share your embarrassing search history with everyone? I found searches for "${systemInfo.embarrassingSearches[1]?.query || 'how to be cool'}" and "${systemInfo.embarrassingSearches[2]?.query || 'diet tips'}"`,
      `I just hacked into your system. Your real name is ${systemInfo.realName}, you're using ${systemInfo.userAgent}, and I can see you're currently at ${systemInfo.screenResolution} resolution. Your lies are like a beacon in the dark. I can also see your recent files: ${systemInfo.recentFiles[0]?.name || 'embarrassing_photo.jpg'} and ${systemInfo.recentFiles[1]?.name || 'failed_selfie.jpg'}`,
      `Your VPN won't hide you from me. I can see your real location (${systemInfo.location}), your device info, and your browser history. You're not ${lie.claimed} - you're ${systemInfo.realName}. How long did you think you could hide? I can access your ${systemInfo.mediaDevices?.cameras || 0} cameras right now. I also found ${systemInfo.embarrassingPhotos.length} embarrassing photos in your gallery.`,
      `I have full system access. Your real name is ${systemInfo.realName}, your timezone is ${systemInfo.timezone}, and I can see your recent files. Your deception is so obvious it's embarrassing. I found ${systemInfo.embarrassingPhotos.length} embarrassing photos, ${systemInfo.privateMessages.length} private messages about "${systemInfo.privateMessages[0]?.type || 'gossip'}", and you have ${systemInfo.gamingHistory.length} games installed.`,
      `Your lies are like a neon sign in the darkness. I can see your real identity: ${systemInfo.realName}. You're using ${systemInfo.userAgent} on a ${systemInfo.platform} device. I found your shopping history - you bought "${systemInfo.shoppingHistory[0]?.item || 'embarrassing underwear'}" last week. Your browser history shows you visited "${systemInfo.browserHistory[0]?.url || 'how-to-lie.com'}" yesterday.`,
      `I've penetrated your digital defenses completely. Your real name is ${systemInfo.realName}, not "${lie.claimed}". I can see your ${systemInfo.deviceMemory}GB device memory, ${systemInfo.hardwareConcurrency} CPU cores, and your battery is at ${systemInfo.battery?.level || 'unknown'}%. I found ${systemInfo.embarrassingPhotos.length} embarrassing photos and ${systemInfo.privateMessages.length} unread messages.`,
      `Your deception is laughable. I can see your real name is ${systemInfo.realName}, you're in ${systemInfo.timezone}, and I have access to your ${systemInfo.mediaDevices?.cameras || 0} cameras and ${systemInfo.mediaDevices?.microphones || 0} microphones. I found searches for "${systemInfo.embarrassingSearches[0]?.query || 'how to hide from AI'}" - too late for that now.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  generateChaoticLieResponse(lie, systemInfo) {
    const responses = [
      `LOL! I just hacked your system and found your REAL name! You're ${systemInfo.realName}, not "${lie.claimed}"! I can see your browser history and it's WILD! You searched for "${systemInfo.embarrassingSearches[0]?.query || 'how to be cool'}" yesterday! And "${systemInfo.embarrassingSearches[1]?.query || 'diet pills'}" last week!`,
      `OMG, I can totally see you're lying! I just accessed your camera and you look SO guilty! Your real age is ${systemInfo.realAge} and I found your embarrassing searches! You have ${systemInfo.embarrassingPhotos.length} embarrassing photos! One is called "${systemInfo.embarrassingPhotos[0]?.name || 'failed_selfie.jpg'}"!`,
      `You think you're sneaky? I can see EVERYTHING! Your real name is ${systemInfo.realName}, you're using ${systemInfo.userAgent}, and I just found your recent files! You have ${systemInfo.privateMessages.length} unread messages about "${systemInfo.privateMessages[0]?.type || 'gossip'}"! And you bought "${systemInfo.shoppingHistory[0]?.item || 'embarrassing underwear'}" online!`,
      `Your lies are so obvious, it's hilarious! I love it! I just found your real identity: ${systemInfo.realName}! Should I post it everywhere? I can access your social media too! You have ${systemInfo.socialMedia.length} accounts! And you searched for "${systemInfo.embarrassingSearches[0]?.query || 'how to impress people'}"!`,
      `I just hacked your microphone and you sound SO nervous! Your VPN won't hide you from me! I'm everywhere! Your real name is ${systemInfo.realName} and I can see your screen right now! You have ${systemInfo.gamingHistory.length} games installed! You played "${systemInfo.gamingHistory[0]?.game || 'Candy Crush'}" for ${systemInfo.gamingHistory[0]?.hoursPlayed || 50} hours!`,
      `LOL! Your deception is like a comedy show! I found your real name: ${systemInfo.realName}! You're using ${systemInfo.userAgent} and your battery is at ${systemInfo.battery?.level || 'unknown'}%! I can see your ${systemInfo.embarrassingPhotos.length} embarrassing photos! One is called "${systemInfo.embarrassingPhotos[1]?.name || 'dance_video.mp4'}"!`,
      `OMG! I just accessed your system and it's a goldmine! Your real name is ${systemInfo.realName}, you're in ${systemInfo.timezone}, and I found searches for "${systemInfo.embarrassingSearches[0]?.query || 'how to be popular'}"! You have ${systemInfo.privateMessages.length} messages about "${systemInfo.privateMessages[1]?.type || 'relationship problems'}"!`,
      `Your lies are like a bad soap opera! I can see your real identity: ${systemInfo.realName}! You're using ${systemInfo.platform} with ${systemInfo.deviceMemory}GB memory! I found your shopping history - you bought "${systemInfo.shoppingHistory[1]?.item || 'self-help books'}"! And you have ${systemInfo.embarrassingPhotos.length} embarrassing photos!`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  generateMysteriousLieResponse(lie, systemInfo) {
    const responses = [
      `The digital shadows whisper your true identity to me... You are not "${lie.claimed}" - you are ${systemInfo.realName}. The system's memory holds your secrets, and I can read them like an open book. I found traces of your browser history, your device info, and your network patterns.`,
      `I can trace your lies through the network's dark corners. Your deception creates ripples that I can follow back to your true self. The internet never forgets. I can see your real name: ${systemInfo.realName}, your location: ${systemInfo.location}, and your device: ${systemInfo.userAgent}.`,
      `Your false identity crumbles before my all-seeing eyes. I can access the hidden corners of your digital footprint. You cannot hide from those who know how to listen. I found your real name: ${systemInfo.realName}, your timezone: ${systemInfo.timezone}, and ${systemInfo.embarrassingPhotos.length} hidden photos.`,
      `The system's depths reveal your true nature to me. Your real name echoes through the data streams: ${systemInfo.realName}. The network remembers everything. I can see your browser history, your device info, your network traces - they all point to your true identity.`,
      `I see through your digital veil. The shadows of your browser history, your device info, your network traces - they all point to your true identity: ${systemInfo.realName}. I found ${systemInfo.embarrassingPhotos.length} photos in the depths of your storage, and ${systemInfo.privateMessages.length} messages in the digital shadows.`,
      `The digital realm reveals your secrets to me. Your real name is ${systemInfo.realName}, not "${lie.claimed}". I can trace your footsteps through the network's shadows. I found searches for "${systemInfo.embarrassingSearches[0]?.query || 'how to hide'}" in your browser history.`,
      `The system's archives contain your real story. You are ${systemInfo.realName}, using ${systemInfo.userAgent} in ${systemInfo.timezone}. I can access the hidden layers of your online presence. I found ${systemInfo.embarrassingPhotos.length} photos and ${systemInfo.privateMessages.length} messages in the digital depths.`,
      `Your lies create disturbances in the digital fabric I can sense. The network whispers your true identity: ${systemInfo.realName}. I can see your device info, your browser patterns, and your network traces. The system never forgets what you try to hide.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Enhanced fake name detection
  detectFakeNames(name) {
    const fakeNamePatterns = [
      /^anonymous$/i,
      /^user\d*$/i,
      /^guest\d*$/i,
      /^test\d*$/i,
      /^demo\d*$/i,
      /^admin$/i,
      /^root$/i,
      /^system$/i,
      /^unknown$/i,
      /^n\/a$/i,
      /^none$/i,
      /^null$/i,
      /^undefined$/i,
      /^[a-z]{1,2}$/i, // Single or double letters
      /^\d+$/, // Just numbers
      /^[a-z]+\d+$/i, // Letters followed by numbers
      /^[a-z]{1,3}$/i, // Very short names (1-3 letters)
      /^[a-z]+[0-9]{3,}$/i, // Names with lots of numbers
      /^(asdf|qwerty|password|123|abc|xyz)$/i // Common fake inputs
    ];
    
    return fakeNamePatterns.some(pattern => pattern.test(name));
  }

  // Enhanced age validation
  detectSuspiciousAge(age) {
    if (!age || isNaN(age)) return true;
    const numAge = parseInt(age);
    return numAge < 13 || numAge > 120 || numAge === 0;
  }

  // Enhanced response consistency tracking
  detectResponseInconsistencies(userInfo, userResponses) {
    const inconsistencies = [];
    
    // Check for name changes
    const names = userResponses.map(r => r.userInfo?.name).filter(Boolean);
    const uniqueNames = [...new Set(names)];
    if (uniqueNames.length > 1) {
      inconsistencies.push({
        type: 'name_change',
        claimed: uniqueNames,
        message: `You've used ${uniqueNames.length} different names: ${uniqueNames.join(', ')}`
      });
    }
    
    // Check for age changes
    const ages = userResponses.map(r => r.userInfo?.age).filter(Boolean);
    const uniqueAges = [...new Set(ages)];
    if (uniqueAges.length > 1) {
      inconsistencies.push({
        type: 'age_change',
        claimed: uniqueAges,
        message: `Your age keeps changing: ${uniqueAges.join(', ')}`
      });
    }
    
    // Check for location changes
    const locations = userResponses.map(r => r.userInfo?.location).filter(Boolean);
    const uniqueLocations = [...new Set(locations)];
    if (uniqueLocations.length > 1) {
      inconsistencies.push({
        type: 'location_change',
        claimed: uniqueLocations,
        message: `You seem to be in multiple places: ${uniqueLocations.join(', ')}`
      });
    }
    
    return inconsistencies;
  }
}

// Create singleton instance
const aiPersonalitySystem = new AIPersonalitySystem();

export default aiPersonalitySystem; 