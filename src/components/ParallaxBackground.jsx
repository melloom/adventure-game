import React, { useEffect, useRef, useState } from 'react';

const ParallaxBackground = ({ 
  scrollY = 0,
  mouseX = 0,
  mouseY = 0,
  difficulty = 'medium',
  survivalStatus = 'safe'
}) => {
  const containerRef = useRef(null);
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create parallax layers based on game state
    const createLayers = () => {
      const baseLayers = [
        {
          id: 'stars',
          depth: 0.1,
          elements: 50,
          color: '#ffffff',
          size: { min: 1, max: 3 },
          speed: 0.5
        },
        {
          id: 'clouds',
          depth: 0.3,
          elements: 8,
          color: '#ffffff',
          size: { min: 20, max: 60 },
          speed: 0.8
        },
        {
          id: 'mountains',
          depth: 0.6,
          elements: 5,
          color: '#2c3e50',
          size: { min: 100, max: 200 },
          speed: 1.2
        }
      ];

      // Add difficulty-specific layers
      if (difficulty === 'hard') {
        baseLayers.push({
          id: 'lightning',
          depth: 0.4,
          elements: 3,
          color: '#ffd700',
          size: { min: 5, max: 15 },
          speed: 1.5
        });
      }

      // Add danger-specific layers
      if (survivalStatus === 'danger' || survivalStatus === 'critical') {
        baseLayers.push({
          id: 'fire',
          depth: 0.7,
          elements: 12,
          color: '#ff4757',
          size: { min: 10, max: 30 },
          speed: 1.8
        });
      }

      return baseLayers;
    };

    setLayers(createLayers());
  }, [difficulty, survivalStatus]);

  const getParallaxOffset = (depth, baseOffset = 0) => {
    const mouseOffsetX = (mouseX - window.innerWidth / 2) * depth * 0.1;
    const mouseOffsetY = (mouseY - window.innerHeight / 2) * depth * 0.1;
    const scrollOffset = scrollY * depth;
    
    return {
      x: baseOffset + mouseOffsetX + scrollOffset,
      y: mouseOffsetY
    };
  };

  const renderLayer = (layer) => {
    const elements = [];
    const offset = getParallaxOffset(layer.depth);

    for (let i = 0; i < layer.elements; i++) {
      const x = (i * (window.innerWidth / layer.elements)) + offset.x;
      const y = (Math.sin(i * 0.5) * 100) + offset.y + (window.innerHeight * 0.7);
      const size = Math.random() * (layer.size.max - layer.size.min) + layer.size.min;
      const opacity = 0.3 + Math.random() * 0.4;

      elements.push(
        <div
          key={`${layer.id}-${i}`}
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: layer.color,
            borderRadius: layer.id === 'stars' ? '50%' : '0',
            opacity,
            transform: `translateZ(${layer.depth * 100}px)`,
            transition: 'all 0.3s ease-out'
          }}
        />
      );
    }

    return elements;
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        pointerEvents: 'none',
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {layers.map(layer => (
        <div
          key={layer.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `translateZ(${layer.depth * -100}px)`
          }}
        >
          {renderLayer(layer)}
        </div>
      ))}
    </div>
  );
};

export default ParallaxBackground; 