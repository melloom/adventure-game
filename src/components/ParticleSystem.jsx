import React, { useEffect, useRef } from 'react';

const ParticleSystem = ({ 
  active = false, 
  type = 'choice', 
  intensity = 1, 
  position = { x: 0, y: 0 },
  color = '#ffffff'
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Particle configuration based on type
    const config = {
      choice: {
        count: 50 * intensity,
        speed: 2,
        size: { min: 2, max: 6 },
        life: { min: 60, max: 120 },
        colors: [color, '#ffd700', '#ff6b6b', '#4ecdc4'],
        pattern: 'explosion'
      },
      consequence: {
        count: 80 * intensity,
        speed: 3,
        size: { min: 3, max: 8 },
        life: { min: 90, max: 180 },
        colors: [color, '#ff4757', '#ff3838', '#ff6348'],
        pattern: 'spiral'
      },
      danger: {
        count: 100 * intensity,
        speed: 4,
        size: { min: 4, max: 10 },
        life: { min: 120, max: 240 },
        colors: [color, '#ff0000', '#8b0000', '#dc143c'],
        pattern: 'chaos'
      },
      victory: {
        count: 150 * intensity,
        speed: 1.5,
        size: { min: 3, max: 8 },
        life: { min: 150, max: 300 },
        colors: [color, '#00ff00', '#32cd32', '#90ee90'],
        pattern: 'fireworks'
      }
    };

    const particleConfig = config[type] || config.choice;

    // Create particles
    const createParticles = () => {
      particlesRef.current = [];
      const centerX = position.x || canvas.width / 2;
      const centerY = position.y || canvas.height / 2;

      for (let i = 0; i < particleConfig.count; i++) {
        const angle = (Math.PI * 2 * i) / particleConfig.count;
        const speed = particleConfig.speed + Math.random() * 2;
        
        let vx, vy;
        
        switch (particleConfig.pattern) {
          case 'explosion':
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            break;
          case 'spiral':
            const spiralAngle = angle + Math.random() * Math.PI;
            vx = Math.cos(spiralAngle) * speed * 0.5;
            vy = Math.sin(spiralAngle) * speed * 0.5;
            break;
          case 'chaos':
            vx = (Math.random() - 0.5) * speed * 2;
            vy = (Math.random() - 0.5) * speed * 2;
            break;
          case 'fireworks':
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed - 2; // Upward bias
            break;
          default:
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
        }

        particlesRef.current.push({
          x: centerX,
          y: centerY,
          vx,
          vy,
          size: Math.random() * (particleConfig.size.max - particleConfig.size.min) + particleConfig.size.min,
          life: Math.random() * (particleConfig.life.max - particleConfig.life.min) + particleConfig.life.min,
          maxLife: particleConfig.life.max,
          color: particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)],
          alpha: 1,
          decay: 0.02 + Math.random() * 0.03
        });
      }
    };

    // Update and draw particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let activeParticles = 0;
      
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Add gravity for some effects
        if (type === 'fireworks') {
          particle.vy += 0.1;
        }
        
        // Update life
        particle.life--;
        particle.alpha = particle.life / particle.maxLife;
        
        if (particle.life > 0) {
          activeParticles++;
          
          // Draw particle
          ctx.save();
          ctx.globalAlpha = particle.alpha;
          ctx.fillStyle = particle.color;
          
          if (type === 'danger') {
            // Flame effect for danger
            const gradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, particle.size
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = gradient;
          }
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
      
      if (activeParticles > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      }
    };

    createParticles();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, type, intensity, position, color]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    />
  );
};

export default ParticleSystem; 