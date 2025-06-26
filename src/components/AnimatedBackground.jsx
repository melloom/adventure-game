import React, { useEffect, useRef, useState } from 'react';

const AnimatedBackground = ({ 
  difficulty = 'medium',
  survivalStatus = 'safe',
  currentRound = 1,
  dangerScore = 0,
  isGameActive = false
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Theme configuration based on game state
    const themes = {
      safe: {
        primary: '#4CAF50',
        secondary: '#81C784',
        accent: '#2E7D32',
        particles: 20,
        speed: 0.5,
        opacity: 0.3
      },
      warning: {
        primary: '#FF9800',
        secondary: '#FFB74D',
        accent: '#F57C00',
        particles: 35,
        speed: 1,
        opacity: 0.4
      },
      danger: {
        primary: '#F44336',
        secondary: '#EF5350',
        accent: '#D32F2F',
        particles: 50,
        speed: 1.5,
        opacity: 0.5
      },
      critical: {
        primary: '#9C27B0',
        secondary: '#BA68C8',
        accent: '#7B1FA2',
        particles: 70,
        speed: 2,
        opacity: 0.6
      }
    };

    const currentTheme = themes[survivalStatus] || themes.safe;
    setTheme(survivalStatus);

    // Create background particles
    const createParticles = () => {
      particlesRef.current = [];
      const particleCount = currentTheme.particles + (currentRound * 2);

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * currentTheme.speed,
          vy: (Math.random() - 0.5) * currentTheme.speed,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * currentTheme.opacity + 0.1,
          color: [currentTheme.primary, currentTheme.secondary, currentTheme.accent][
            Math.floor(Math.random() * 3)
          ],
          pulse: Math.random() * Math.PI * 2
        });
      }
    };

    // Animate background
    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `${currentTheme.primary}20`);
      gradient.addColorStop(0.5, `${currentTheme.secondary}10`);
      gradient.addColorStop(1, `${currentTheme.accent}30`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += 0.02;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with pulse effect
        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5;
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        
        // Create glow effect for danger levels
        if (survivalStatus === 'danger' || survivalStatus === 'critical') {
          const glowGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, pulseSize * 2
          );
          glowGradient.addColorStop(0, particle.color);
          glowGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
          ctx.fillStyle = glowGradient;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Add difficulty-based effects
      if (difficulty === 'hard' && isGameActive) {
        // Add lightning effect for hard difficulty
        if (Math.random() < 0.01) {
          ctx.save();
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.moveTo(Math.random() * canvas.width, 0);
          ctx.lineTo(Math.random() * canvas.width, canvas.height);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Add danger-based effects
      if (dangerScore > 70) {
        // Add red overlay for high danger
        ctx.save();
        ctx.fillStyle = `rgba(255, 0, 0, ${(dangerScore - 70) / 30 * 0.1})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [difficulty, survivalStatus, currentRound, dangerScore, isGameActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default AnimatedBackground; 