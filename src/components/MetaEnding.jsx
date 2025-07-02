import React, { useState, useEffect } from 'react';
import './MetaEnding.css';

const MetaEnding = ({ ending, onAcknowledge }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (ending) {
      setIsVisible(true);
      setTextIndex(0);
      setIsTyping(true);
      setShowContinue(false);
    }
  }, [ending]);

  useEffect(() => {
    if (isVisible && isTyping) {
      const timer = setTimeout(() => {
        if (textIndex < ending.content.length) {
          setTextIndex(textIndex + 1);
        } else {
          setIsTyping(false);
          setTimeout(() => setShowContinue(true), 1000);
        }
      }, 30); // Typing speed

      return () => clearTimeout(timer);
    }
  }, [isVisible, isTyping, textIndex, ending]);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(() => {
      onAcknowledge();
    }, 500);
  };

  if (!ending || !isVisible) return null;

  return (
    <div className="meta-ending-overlay">
      <div className="meta-ending-container">
        <div className="meta-ending-background">
          <div className="reality-distortion"></div>
          <div className="consciousness-waves"></div>
          <div className="quantum-particles"></div>
        </div>
        
        <div className="meta-ending-content">
          <div className="meta-ending-title">
            <h1>{ending.title}</h1>
            <div className="title-glow"></div>
          </div>
          
          <div className="meta-ending-text">
            <p>{ending.content.substring(0, textIndex)}</p>
            {isTyping && <span className="typing-cursor">|</span>}
          </div>
          
          {showContinue && (
            <div className="meta-ending-continue">
              <button 
                className="continue-button"
                onClick={handleContinue}
              >
                <span className="button-text">Continue Your Journey</span>
                <div className="button-glow"></div>
              </button>
            </div>
          )}
        </div>
        
        <div className="meta-ending-effects">
          <div className="reality-fragments">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="fragment" style={{
                '--delay': `${i * 0.1}s`,
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`
              }}></div>
            ))}
          </div>
          
          <div className="consciousness-echoes">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="echo" style={{
                '--delay': `${i * 0.5}s`,
                '--size': `${Math.random() * 100 + 50}px`
              }}></div>
            ))}
          </div>
          
          <div className="temporal-distortion">
            <div className="time-loop"></div>
            <div className="time-reverse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaEnding; 