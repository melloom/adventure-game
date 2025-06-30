import React, { useEffect, useRef, useState } from 'react';
import horrorSystem from '../utils/horrorSystem';
import './HorrorEffects.css';

const HorrorEffects = ({ 
  atmosphere = 'normal', 
  dangerLevel = 0, 
  fearLevel = 0,
  showEnvironmentalItems = false,
  onEnvironmentalItemFound = null 
}) => {
  const canvasRef = useRef(null);
  const [effects, setEffects] = useState({
    static: { active: false, intensity: 0 },
    glitch: { active: false, intensity: 0 },
    bloodSplatter: { active: false, intensity: 0 },
    vignette: { active: false, intensity: 0 }
  });
  const [environmentalItems, setEnvironmentalItems] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const renderEffects = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply static effect
      if (effects.static.active) {
        applyStaticEffect(ctx, effects.static.intensity);
      }

      // Apply glitch effect
      if (effects.glitch.active) {
        applyGlitchEffect(ctx, effects.glitch.intensity);
      }

      // Apply blood splatter effect
      if (effects.bloodSplatter.active) {
        applyBloodSplatterEffect(ctx, effects.bloodSplatter.intensity);
      }

      // Apply vignette effect
      if (effects.vignette.active) {
        applyVignetteEffect(ctx, effects.vignette.intensity);
      }

      animationId = requestAnimationFrame(renderEffects);
    };

    renderEffects();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [effects]);

  useEffect(() => {
    // Update effects based on atmosphere and danger level
    const newEffects = {
      static: { 
        active: dangerLevel > 3, 
        intensity: Math.min(1, dangerLevel * 0.1) 
      },
      glitch: { 
        active: dangerLevel > 5, 
        intensity: Math.min(1, dangerLevel * 0.15) 
      },
      bloodSplatter: { 
        active: dangerLevel > 7, 
        intensity: Math.min(1, dangerLevel * 0.2) 
      },
      vignette: { 
        active: fearLevel > 2, 
        intensity: Math.min(1, fearLevel * 0.2) 
      }
    };

    setEffects(newEffects);
  }, [atmosphere, dangerLevel, fearLevel]);

  useEffect(() => {
    if (showEnvironmentalItems) {
      loadEnvironmentalItems();
    }
  }, [showEnvironmentalItems, atmosphere]);

  const loadEnvironmentalItems = () => {
    const notes = horrorSystem.getEnvironmentalItem('notes', atmosphere);
    const audioLogs = horrorSystem.getEnvironmentalItem('audio_logs', atmosphere);
    const photographs = horrorSystem.getEnvironmentalItem('photographs', atmosphere);
    
    setEnvironmentalItems([...notes, ...audioLogs, ...photographs]);
  };

  const applyStaticEffect = (ctx, intensity) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < intensity * 0.1) {
        const noise = Math.random() * 255 * intensity;
        data[i] = Math.min(255, data[i] + noise);     // Red
        data[i + 1] = Math.min(255, data[i + 1] + noise); // Green
        data[i + 2] = Math.min(255, data[i + 2] + noise); // Blue
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const applyGlitchEffect = (ctx, intensity) => {
    const glitchLines = Math.floor(intensity * 20);
    
    for (let i = 0; i < glitchLines; i++) {
      const y = Math.random() * ctx.canvas.height;
      const height = Math.random() * 10 + 1;
      const offset = (Math.random() - 0.5) * intensity * 50;
      
      const imageData = ctx.getImageData(0, y, ctx.canvas.width, height);
      ctx.putImageData(imageData, offset, y);
    }
  };

  const applyBloodSplatterEffect = (ctx, intensity) => {
    const splatters = Math.floor(intensity * 5);
    
    for (let i = 0; i < splatters; i++) {
      const x = Math.random() * ctx.canvas.width;
      const y = Math.random() * ctx.canvas.height;
      const radius = Math.random() * 50 + 10;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(139, 0, 0, ${intensity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(139, 0, 0, ${intensity * 0.4})`);
      gradient.addColorStop(1, 'rgba(139, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const applyVignetteEffect = (ctx, intensity) => {
    const gradient = ctx.createRadialGradient(
      ctx.canvas.width / 2, ctx.canvas.height / 2, 0,
      ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width / 2
    );
    
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
    gradient.addColorStop(0.7, `rgba(0, 0, 0, ${intensity * 0.3})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity * 0.8})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const handleEnvironmentalItemClick = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
    if (onEnvironmentalItemFound) {
      onEnvironmentalItemFound(item);
    }
  };

  const closeItemModal = () => {
    setShowItemModal(false);
    setSelectedItem(null);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="horror-effects-canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      />
      
      {showEnvironmentalItems && environmentalItems.length > 0 && (
        <div className="environmental-items-overlay">
          {environmentalItems.map((item, index) => (
            <div
              key={item.id}
              className="environmental-item"
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index * 10)}%`,
                animationDelay: `${index * 0.5}s`
              }}
              onClick={() => handleEnvironmentalItemClick(item)}
            >
              <div className="item-icon">
                {item.type === 'note' && '📄'}
                {item.type === 'audio_log' && '🎵'}
                {item.type === 'photograph' && '📷'}
              </div>
              <div className="item-title">{item.title}</div>
            </div>
          ))}
        </div>
      )}

      {showItemModal && selectedItem && (
        <div className="item-modal-overlay" onClick={closeItemModal}>
          <div className="item-modal" onClick={(e) => e.stopPropagation()}>
            <div className="item-modal-header">
              <h3>{selectedItem.title}</h3>
              <button className="close-btn" onClick={closeItemModal}>×</button>
            </div>
            <div className="item-modal-content">
              {selectedItem.content && (
                <p className="item-content">{selectedItem.content}</p>
              )}
              {selectedItem.description && (
                <p className="item-description">{selectedItem.description}</p>
              )}
              {selectedItem.duration && (
                <div className="audio-player">
                  <button className="play-btn">▶ Play Audio Log</button>
                  <span className="duration">Duration: {selectedItem.duration}s</span>
                </div>
              )}
              <div className="item-fear-level">
                Fear Level: {'😰'.repeat(selectedItem.fearLevel)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Psychological effect indicators */}
      {fearLevel > 5 && (
        <div className="psychological-effects">
          <div className="paranoia-indicator">
            <span>Paranoia Level: {Math.floor(fearLevel - 5)}</span>
          </div>
          {fearLevel > 7 && (
            <div className="hallucination-indicator">
              <span>Hallucinations Active</span>
            </div>
          )}
          {fearLevel > 8 && (
            <div className="time-distortion-indicator">
              <span>Time Distortion</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HorrorEffects; 