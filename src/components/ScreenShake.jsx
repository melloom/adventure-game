import React, { useEffect, useState } from 'react';

const ScreenShake = ({ 
  active = false, 
  intensity = 1, 
  duration = 500,
  type = 'danger' 
}) => {
  const [shakeStyle, setShakeStyle] = useState({});

  useEffect(() => {
    if (!active) {
      setShakeStyle({});
      return;
    }

    // Shake configuration based on type
    const shakeConfig = {
      danger: {
        x: 10 * intensity,
        y: 8 * intensity,
        frequency: 0.1
      },
      consequence: {
        x: 6 * intensity,
        y: 4 * intensity,
        frequency: 0.15
      },
      choice: {
        x: 3 * intensity,
        y: 2 * intensity,
        frequency: 0.2
      },
      victory: {
        x: 5 * intensity,
        y: 3 * intensity,
        frequency: 0.08
      }
    };

    const config = shakeConfig[type] || shakeConfig.danger;
    const startTime = Date.now();

    const shake = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        setShakeStyle({});
        return;
      }

      // Easing function for natural shake decay
      const easeOut = 1 - Math.pow(progress, 2);
      
      const x = (Math.random() - 0.5) * config.x * easeOut;
      const y = (Math.random() - 0.5) * config.y * easeOut;
      
      setShakeStyle({
        transform: `translate(${x}px, ${y}px)`,
        transition: 'transform 0.05s ease-out'
      });

      requestAnimationFrame(shake);
    };

    shake();
  }, [active, intensity, duration, type]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        ...shakeStyle
      }}
    />
  );
};

export default ScreenShake; 