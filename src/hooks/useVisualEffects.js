import { useState, useEffect, useCallback } from 'react';

export const useVisualEffects = (settings = {}) => {
  const {
    effectsEnabled = true,
    performanceMode = false
  } = settings;

  // Particle effects state
  const [particleState, setParticleState] = useState({
    active: false,
    type: 'choice',
    intensity: 1,
    position: { x: 0, y: 0 },
    color: '#ffffff'
  });

  // Screen shake state
  const [shakeState, setShakeState] = useState({
    active: false,
    intensity: 1,
    duration: 500,
    type: 'danger'
  });

  // Mouse tracking for parallax
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);

  // Track mouse movement for parallax effects
  useEffect(() => {
    if (!effectsEnabled || performanceMode) return;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [effectsEnabled, performanceMode]);

  // Trigger particle effects
  const triggerParticles = useCallback((type = 'choice', intensity = 1, position = null, color = null) => {
    if (!effectsEnabled) return;

    const newPosition = position || { 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2 
    };

    setParticleState({
      active: true,
      type,
      intensity,
      position: newPosition,
      color: color || '#ffffff'
    });

    // Auto-disable after animation
    setTimeout(() => {
      setParticleState(prev => ({ ...prev, active: false }));
    }, 2000);
  }, [effectsEnabled]);

  // Trigger screen shake
  const triggerShake = useCallback((intensity = 1, duration = 500, type = 'danger') => {
    if (!effectsEnabled) return;

    setShakeState({
      active: true,
      intensity,
      duration,
      type
    });

    // Auto-disable after duration
    setTimeout(() => {
      setShakeState(prev => ({ ...prev, active: false }));
    }, duration);
  }, [effectsEnabled]);

  // Auto-trigger effects based on game events
  const handleGameEvent = useCallback((event, data = {}) => {
    if (!effectsEnabled || performanceMode) return;

    switch (event) {
      case 'choice_made':
        triggerParticles('choice', 1, data.position, '#4CAF50');
        break;
      
      case 'consequence_revealed':
        triggerParticles('consequence', 1.5, data.position, '#FF9800');
        triggerShake(0.5, 300, 'consequence');
        break;
      
      case 'danger_increased':
        if (data.dangerScore > 70) {
          triggerParticles('danger', 2, data.position, '#F44336');
          triggerShake(1, 800, 'danger');
        }
        break;
      
      case 'round_completed':
        triggerParticles('choice', 0.8, data.position, '#2196F3');
        break;
      
      case 'game_over':
        triggerParticles('consequence', 2, data.position, '#9C27B0');
        triggerShake(1.5, 1000, 'danger');
        break;
      
      case 'victory':
        triggerParticles('victory', 3, data.position, '#4CAF50');
        triggerShake(0.8, 600, 'victory');
        break;
      
      default:
        break;
    }
  }, [effectsEnabled, performanceMode, triggerParticles, triggerShake]);

  // Auto-trigger effects based on danger level
  const handleDangerChange = useCallback((dangerScore, survivalStatus) => {
    if (!effectsEnabled || performanceMode) return;

    if (dangerScore > 80 && survivalStatus === 'critical') {
      triggerParticles('danger', 1.5, null, '#FF0000');
      triggerShake(0.8, 400, 'danger');
    } else if (dangerScore > 60 && survivalStatus === 'danger') {
      triggerShake(0.5, 300, 'danger');
    }
  }, [effectsEnabled, performanceMode, triggerParticles, triggerShake]);

  return {
    // State
    particleState,
    shakeState,
    mousePosition,
    scrollPosition,
    
    // Actions
    triggerParticles,
    triggerShake,
    handleGameEvent,
    handleDangerChange,
    
    // Settings
    effectsEnabled,
    performanceMode
  };
}; 