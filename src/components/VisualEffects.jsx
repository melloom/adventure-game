import React, { useState, useEffect } from 'react';
import ParticleSystem from './ParticleSystem';
import ScreenShake from './ScreenShake';
import AnimatedBackground from './AnimatedBackground';
import ParallaxBackground from './ParallaxBackground';

const VisualEffects = ({
  // Game state
  difficulty = 'medium',
  survivalStatus = 'safe',
  currentRound = 1,
  dangerScore = 0,
  isGameActive = false,
  
  // Effect triggers
  showParticles = false,
  particleType = 'choice',
  particleIntensity = 1,
  particlePosition = { x: 0, y: 0 },
  particleColor = '#ffffff',
  
  // Screen shake
  screenShake = false,
  shakeIntensity = 1,
  shakeDuration = 500,
  shakeType = 'danger',
  
  // Mouse tracking for parallax
  mouseX = 0,
  mouseY = 0,
  scrollY = 0,
  
  // Settings
  effectsEnabled = true,
  performanceMode = false
}) => {
  const [effects, setEffects] = useState({
    particles: false,
    shake: false,
    background: true,
    parallax: true
  });

  // Update effects based on settings and performance
  useEffect(() => {
    if (!effectsEnabled) {
      setEffects({
        particles: false,
        shake: false,
        background: false,
        parallax: false
      });
      return;
    }

    if (performanceMode) {
      setEffects({
        particles: showParticles,
        shake: screenShake,
        background: true,
        parallax: false // Disable parallax in performance mode
      });
    } else {
      setEffects({
        particles: showParticles,
        shake: screenShake,
        background: true,
        parallax: true
      });
    }
  }, [effectsEnabled, performanceMode, showParticles, screenShake]);

  // Auto-trigger effects based on game state
  useEffect(() => {
    if (!effectsEnabled || performanceMode) return;

    // Auto-trigger particles for danger levels
    if (dangerScore > 80 && survivalStatus === 'critical') {
      // This would be handled by the parent component
      // through the showParticles prop
    }

    // Auto-trigger screen shake for high danger
    if (dangerScore > 70 && survivalStatus === 'danger') {
      // This would be handled by the parent component
      // through the screenShake prop
    }
  }, [dangerScore, survivalStatus, effectsEnabled, performanceMode]);

  if (!effectsEnabled) {
    return null;
  }

  return (
    <>
      {/* Animated Background */}
      {effects.background && (
        <AnimatedBackground
          difficulty={difficulty}
          survivalStatus={survivalStatus}
          currentRound={currentRound}
          dangerScore={dangerScore}
          isGameActive={isGameActive}
        />
      )}

      {/* Parallax Background */}
      {effects.parallax && (
        <ParallaxBackground
          scrollY={scrollY}
          mouseX={mouseX}
          mouseY={mouseY}
          difficulty={difficulty}
          survivalStatus={survivalStatus}
        />
      )}

      {/* Particle System */}
      {effects.particles && (
        <ParticleSystem
          active={showParticles}
          type={particleType}
          intensity={particleIntensity}
          position={particlePosition}
          color={particleColor}
        />
      )}

      {/* Screen Shake */}
      {effects.shake && (
        <ScreenShake
          active={screenShake}
          intensity={shakeIntensity}
          duration={shakeDuration}
          type={shakeType}
        />
      )}
    </>
  );
};

export default VisualEffects; 