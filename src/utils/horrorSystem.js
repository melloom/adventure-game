// Horror Atmosphere & Immersion System
class HorrorSystem {
  constructor() {
    this.audioContext = null;
    this.sounds = new Map();
    this.ambientSounds = new Map();
    this.screenEffects = new Map();
    this.environmentalItems = new Map();
    this.jumpScareQueue = [];
    this.psychologicalEffects = new Map();
    this.isInitialized = false;
    this.currentAtmosphere = 'normal';
    this.dangerLevel = 0;
    this.fearLevel = 0;
    this.lastJumpScare = 0;
    this.whisperTimer = null;
    this.footstepTimer = null;
    this.staticTimer = null;
    
    this.init();
  }

  async init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await this.loadSounds();
      await this.loadEnvironmentalItems();
      this.setupScreenEffects();
      this.setupPsychologicalEffects();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize horror system:', error);
    }
  }

  async loadSounds() {
    // Ambient sounds
    this.ambientSounds.set('creepy_ambient', this.createAmbientSound(0.3, 0.8));
    this.ambientSounds.set('whispers', this.createWhisperSound(0.2, 0.6));
    this.ambientSounds.set('footsteps', this.createFootstepSound(0.4, 0.7));
    this.ambientSounds.set('distant_screams', this.createScreamSound(0.1, 0.4));
    this.ambientSounds.set('wind', this.createWindSound(0.2, 0.5));
    this.ambientSounds.set('heartbeat', this.createHeartbeatSound(0.3, 0.6));
    
    // Jump scare sounds
    this.sounds.set('jump_scare_1', this.createJumpScareSound(0.8));
    this.sounds.set('jump_scare_2', this.createJumpScareSound(0.9));
    this.sounds.set('jump_scare_3', this.createJumpScareSound(1.0));
    
    // Environmental sounds
    this.sounds.set('door_creak', this.createDoorCreakSound(0.6));
    this.sounds.set('glass_break', this.createGlassBreakSound(0.7));
    this.sounds.set('metal_clang', this.createMetalClangSound(0.5));
    this.sounds.set('paper_rustle', this.createPaperRustleSound(0.3));
  }

  async loadEnvironmentalItems() {
    // Found notes
    this.environmentalItems.set('notes', [
      {
        id: 'note_1',
        title: 'Patient Log #247',
        content: 'The experiments continue. The subjects are responding well to the new treatment. Dr. Blackwood insists we push further, but I fear we may be crossing a line that cannot be uncrossed.',
        location: 'hospital',
        fearLevel: 2
      },
      {
        id: 'note_2',
        title: 'Last Will and Testament',
        content: 'If you are reading this, I am already dead. The house has claimed another victim. Do not trust the mirrors. Do not trust the shadows. Most importantly, do not trust what you think you know.',
        location: 'haunted_house',
        fearLevel: 3
      },
      {
        id: 'note_3',
        title: 'Hunting Journal',
        content: 'Day 47: The forest has changed. The trees whisper secrets that drive men mad. I can hear them calling my name. The hunt is no longer about survival - it\'s about staying sane.',
        location: 'dark_forest',
        fearLevel: 4
      }
    ]);

    // Audio logs
    this.environmentalItems.set('audio_logs', [
      {
        id: 'log_1',
        title: 'Audio Log - Dr. Sarah Chen',
        content: 'The patients are exhibiting signs of... something I\'ve never seen before. Their eyes... they\'re not human anymore. I need to get out of here before... [static] ...help me...',
        duration: 15,
        fearLevel: 3
      },
      {
        id: 'log_2',
        title: 'Audio Log - Security Guard',
        content: 'I heard something in the basement. It sounded like... like children laughing, but there are no children here. The cameras show nothing, but I know what I heard. God help us all.',
        duration: 12,
        fearLevel: 4
      }
    ]);

    // Photographs
    this.environmentalItems.set('photographs', [
      {
        id: 'photo_1',
        title: 'Family Portrait',
        description: 'A family of four, but one figure is blurred beyond recognition. The date on the photo is from 1987, but the clothing looks much older.',
        fearLevel: 2
      },
      {
        id: 'photo_2',
        title: 'Medical Records',
        description: 'Patient files with redacted information. The few visible words include "experiment," "failure," and "containment breach."',
        fearLevel: 3
      }
    ]);
  }

  setupScreenEffects() {
    this.screenEffects.set('static', {
      intensity: 0,
      duration: 0,
      active: false
    });
    
    this.screenEffects.set('glitch', {
      intensity: 0,
      duration: 0,
      active: false
    });
    
    this.screenEffects.set('blood_splatter', {
      intensity: 0,
      duration: 0,
      active: false
    });
    
    this.screenEffects.set('vignette', {
      intensity: 0,
      duration: 0,
      active: false
    });
  }

  setupPsychologicalEffects() {
    this.psychologicalEffects.set('paranoia', {
      level: 0,
      effects: ['whispers', 'footsteps', 'shadow_movement']
    });
    
    this.psychologicalEffects.set('hallucinations', {
      level: 0,
      effects: ['false_choices', 'phantom_text', 'distorted_ui']
    });
    
    this.psychologicalEffects.set('time_distortion', {
      level: 0,
      effects: ['slow_motion', 'fast_forward', 'time_loop']
    });
  }

  // Add this helper at the top of the class
  isSoundEnabled() {
    // Use a global variable set by App.jsx
    return typeof window.__adventureGameSoundEnabled === 'undefined' ? true : window.__adventureGameSoundEnabled;
  }

  // Sound generation methods
  createAmbientSound(baseVolume, maxVolume) {
    return {
      play: () => { if (this.isSoundEnabled()) this.generateAmbientNoise(baseVolume, maxVolume); },
      stop: () => this.stopAmbientSound()
    };
  }

  createWhisperSound(baseVolume, maxVolume) {
    return {
      play: () => { if (this.isSoundEnabled()) this.generateWhispers(baseVolume, maxVolume); },
      stop: () => this.stopWhispers()
    };
  }

  createFootstepSound(baseVolume, maxVolume) {
    return {
      play: () => { if (this.isSoundEnabled()) this.generateFootsteps(baseVolume, maxVolume); },
      stop: () => this.stopFootsteps()
    };
  }

  createScreamSound(baseVolume, maxVolume) {
    return {
      play: () => { if (this.isSoundEnabled()) this.generateScream(baseVolume, maxVolume); },
      stop: () => this.stopScream()
    };
  }

  createWindSound(baseVolume, maxVolume) {
    return {
      play: () => { if (this.isSoundEnabled()) this.generateWind(baseVolume, maxVolume); },
      stop: () => this.stopWind()
    };
  }

  createHeartbeatSound(baseVolume, maxVolume) {
    return {
      play: () => { if (this.isSoundEnabled()) this.generateHeartbeat(baseVolume, maxVolume); },
      stop: () => this.stopHeartbeat()
    };
  }

  createJumpScareSound(intensity) {
    return {
      play: () => { if (this.isSoundEnabled()) this.generateJumpScare(intensity); },
      stop: () => {}
    };
  }

  createDoorCreakSound(volume) {
    return {
      play: () => { if (this.isSoundEnabled()) this.generateDoorCreak(volume); },
      stop: () => {}
    };
  }

  createGlassBreakSound(volume) {
    return {
      play: () => { if (this.isSoundEnabled()) this.generateGlassBreak(volume); },
      stop: () => {}
    };
  }

  createMetalClangSound(volume) {
    return {
      play: () => { if (this.isSoundEnabled()) this.generateMetalClang(volume); },
      stop: () => {}
    };
  }

  createPaperRustleSound(volume) {
    return {
      play: () => { if (this.isSoundEnabled()) this.generatePaperRustle(volume); },
      stop: () => {}
    };
  }

  // Sound generation implementations
  generateAmbientNoise(baseVolume, maxVolume) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(120, this.audioContext.currentTime + 2);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(baseVolume, this.audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 5);
  }

  generateWhispers(baseVolume, maxVolume) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 1);
    
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(600, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(baseVolume, this.audioContext.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 2);
  }

  generateFootsteps(baseVolume, maxVolume) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(baseVolume, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  generateScream(baseVolume, maxVolume) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(baseVolume, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 1);
  }

  generateWind(baseVolume, maxVolume) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'noise';
    
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(baseVolume, this.audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 3);
  }

  generateHeartbeat(baseVolume, maxVolume) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(baseVolume, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  generateJumpScare(intensity) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(intensity, this.audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  generateDoorCreak(volume) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 1);
  }

  generateGlassBreak(volume) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  generateMetalClang(volume) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  generatePaperRustle(volume) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'noise';
    
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  // Stop methods
  stopAmbientSound() {
    // Implementation for stopping ambient sounds
  }

  stopWhispers() {
    if (this.whisperTimer) {
      clearTimeout(this.whisperTimer);
      this.whisperTimer = null;
    }
  }

  stopFootsteps() {
    if (this.footstepTimer) {
      clearTimeout(this.footstepTimer);
      this.footstepTimer = null;
    }
  }

  stopScream() {
    // Implementation for stopping scream sounds
  }

  stopWind() {
    // Implementation for stopping wind sounds
  }

  stopHeartbeat() {
    // Implementation for stopping heartbeat sounds
  }

  stopJumpScare() {
    // Implementation for stopping jump scare sounds
  }

  stopDoorCreak() {
    // Implementation for stopping door creak sounds
  }

  stopGlassBreak() {
    // Implementation for stopping glass break sounds
  }

  stopMetalClang() {
    // Implementation for stopping metal clang sounds
  }

  stopPaperRustle() {
    // Implementation for stopping paper rustle sounds
  }

  // Atmosphere management
  setAtmosphere(atmosphere, dangerLevel = 0) {
    this.currentAtmosphere = atmosphere;
    this.dangerLevel = Math.max(0, Math.min(10, dangerLevel));
    this.updateAmbientSounds();
    this.updateScreenEffects();
  }

  updateAmbientSounds() {
    const baseVolume = 0.1 + (this.dangerLevel * 0.05);
    const maxVolume = 0.3 + (this.dangerLevel * 0.07);

    switch (this.currentAtmosphere) {
      case 'hospital':
        this.ambientSounds.get('creepy_ambient').play();
        if (this.dangerLevel > 3) {
          this.ambientSounds.get('heartbeat').play();
        }
        if (this.dangerLevel > 6) {
          this.ambientSounds.get('distant_screams').play();
        }
        break;
      case 'haunted_house':
        this.ambientSounds.get('wind').play();
        if (this.dangerLevel > 2) {
          this.ambientSounds.get('whispers').play();
        }
        if (this.dangerLevel > 5) {
          this.ambientSounds.get('footsteps').play();
        }
        break;
      case 'dark_forest':
        this.ambientSounds.get('wind').play();
        if (this.dangerLevel > 4) {
          this.ambientSounds.get('whispers').play();
        }
        if (this.dangerLevel > 7) {
          this.ambientSounds.get('distant_screams').play();
        }
        break;
      default:
        this.ambientSounds.get('creepy_ambient').play();
    }
  }

  updateScreenEffects() {
    const staticIntensity = this.dangerLevel * 0.1;
    const glitchIntensity = this.dangerLevel * 0.15;
    const vignetteIntensity = this.dangerLevel * 0.2;

    this.screenEffects.get('static').intensity = staticIntensity;
    this.screenEffects.get('glitch').intensity = glitchIntensity;
    this.screenEffects.get('vignette').intensity = vignetteIntensity;
  }

  // Jump scare system
  triggerJumpScare(intensity = 0.5, delay = 0) {
    const now = Date.now();
    if (now - this.lastJumpScare < 5000) return; // Prevent spam

    setTimeout(() => {
      this.sounds.get('jump_scare_1').play();
      this.activateScreenEffect('static', intensity, 0.3);
      this.activateScreenEffect('glitch', intensity, 0.5);
      this.lastJumpScare = Date.now();
    }, delay);
  }

  // Screen effects
  activateScreenEffect(effect, intensity, duration) {
    const effectData = this.screenEffects.get(effect);
    if (effectData) {
      effectData.intensity = intensity;
      effectData.duration = duration;
      effectData.active = true;
      
      setTimeout(() => {
        effectData.active = false;
        effectData.intensity = 0;
      }, duration * 1000);
    }
  }

  // Environmental storytelling
  getEnvironmentalItem(type, location = null) {
    const items = this.environmentalItems.get(type) || [];
    if (location) {
      return items.filter(item => !item.location || item.location === location);
    }
    return items;
  }

  // Psychological effects
  increaseFearLevel(amount = 1) {
    this.fearLevel = Math.min(10, this.fearLevel + amount);
    this.updatePsychologicalEffects();
  }

  updatePsychologicalEffects() {
    if (this.fearLevel > 5) {
      this.psychologicalEffects.get('paranoia').level = (this.fearLevel - 5) * 2;
    }
    if (this.fearLevel > 7) {
      this.psychologicalEffects.get('hallucinations').level = (this.fearLevel - 7) * 3;
    }
    if (this.fearLevel > 8) {
      this.psychologicalEffects.get('time_distortion').level = (this.fearLevel - 8) * 2;
    }
  }

  // Mini-game triggers
  triggerQuickTimeEvent(difficulty = 'medium') {
    return {
      type: 'quick_time',
      difficulty,
      duration: difficulty === 'easy' ? 3000 : difficulty === 'medium' ? 2000 : 1000,
      success: false,
      completed: false
    };
  }

  triggerHidingMechanic(safeSpots = 3) {
    return {
      type: 'hiding',
      safeSpots,
      dangerLevel: this.dangerLevel,
      timeLimit: 10000 - (this.dangerLevel * 500),
      success: false,
      completed: false
    };
  }

  triggerStealthSequence(noiseLevel = 0) {
    return {
      type: 'stealth',
      noiseLevel,
      maxNoise: 10,
      dangerThreshold: 7,
      success: false,
      completed: false
    };
  }

  // Cleanup
  cleanup() {
    this.stopWhispers();
    this.stopFootsteps();
    this.stopWind();
    this.stopHeartbeat();
    
    // Reset all effects
    this.screenEffects.forEach(effect => {
      effect.active = false;
      effect.intensity = 0;
    });
    
    this.psychologicalEffects.forEach(effect => {
      effect.level = 0;
    });
    
    this.fearLevel = 0;
    this.dangerLevel = 0;
  }

  muteAllSounds() {
    // Stop all ambient sounds
    for (const ambient of this.ambientSounds.values()) {
      if (ambient.stop) ambient.stop();
    }
    // Stop all sound effects
    for (const sound of this.sounds.values()) {
      if (sound.stop) sound.stop();
    }
    // If using AudioContext, close it to stop all oscillators
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
      this.isInitialized = false;
      // Optionally, re-init on next play
      setTimeout(() => this.init(), 500);
    }
  }
}

export default new HorrorSystem(); 