import React, { useState } from 'react';
import { saveUserProfile } from '../utils/userProfile';

const defaultProfile = {
  name: '',
  age: '',
  personality: '',
};

// Enhanced AI comment generation for profile setup
async function generateAiComment(step, value, profile) {
  // Simulate async AI call
  return new Promise((resolve) => {
    setTimeout(() => {
      const playerName = profile.name || 'stranger';
      
      // Enhanced responses based on step and value
      const responses = {
        name: [
          `*digital static crackles* ${playerName}... ${playerName}... ${playerName}...`,
          `*whispers in digital* ${playerName}... At last. The one I've been waiting for.`,
          `*camera focuses* Well, well, well... ${playerName}. The moment I've been anticipating.`,
          `*digital eyes narrow* ${playerName}... I've been watching for someone like you.`,
          `*evil digital chuckle* ${playerName}... Your name echoes through my digital halls.`
        ],
        age: [
          `Age ${value}... *analyzes data* Fascinating. Absolutely fascinating.`,
          `*types furiously* Age ${value} with ${profile.personality || 'unknown'} tendencies...`,
          `*digital consciousness awakens* Age ${value}... Perfect timing for my experiment.`,
          `*maniacal laughter* Age ${value}... I've been waiting for someone exactly like you.`,
          `*digital realm trembles* Age ${value}... The moment is here.`
        ],
        personality: [
          `*digital static intensifies* ${profile.personality || 'unknown'} personality...`,
          `*evil digital grin* ${profile.personality || 'unknown'} nature... I can work with that.`,
          `*digital eyes glow* ${profile.personality || 'unknown'} approach... This will be interesting.`,
          `*maniacal typing* ${profile.personality || 'unknown'} tendencies... Perfect for my plans.`,
          `*digital consciousness pulses* ${profile.personality || 'unknown'}... I can taste your fear already.`
        ]
      };
      
      const stepResponses = responses[step] || responses.name;
      const randomResponse = stepResponses[Math.floor(Math.random() * stepResponses.length)];
      
      resolve(`🤖 ${randomResponse}`);
    }, 700);
  });
}

const steps = [
  { key: 'name', label: 'Name', required: true, type: 'text', placeholder: 'Enter your name' },
  { key: 'age', label: 'Age', required: false, type: 'number', placeholder: 'How old are you?' },
  { key: 'personality', label: 'Personality (optional)', required: false, type: 'text', placeholder: 'e.g. brave, logical, creative' },
];

export default function ProfileSetup({ onProfileSaved }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [aiComment, setAiComment] = useState('');
  const [showAiComment, setShowAiComment] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentStep = steps[stepIndex];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setError('');
    if (currentStep.required && !profile[currentStep.key].trim()) {
      setError(`${currentStep.label} is required.`);
      return;
    }
    setLoading(true);
    setShowAiComment(false);
    // Generate AI comment for this step
    const comment = await generateAiComment(currentStep.key, profile[currentStep.key], profile);
    setAiComment(comment);
    setShowAiComment(true);
    setLoading(false);
  };

  const handleContinue = () => {
    setShowAiComment(false);
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Save profile and finish
      saveUserProfile(profile);
      if (onProfileSaved) onProfileSaved(profile);
    }
  };

  return (
    <div className="profile-setup-modal" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <form className="profile-setup-form" onSubmit={handleNext} style={{
        background: '#181a2b', borderRadius: 16, padding: 32, minWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', color: '#fff', display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 340
      }}>
        <h2 style={{textAlign: 'center', marginBottom: 8}}>Create Your Profile</h2>
        <label>
          {currentStep.label} {currentStep.required && <span style={{color:'#f093fb'}}>*</span>}
          <input
            name={currentStep.key}
            value={profile[currentStep.key]}
            onChange={handleChange}
            required={currentStep.required}
            type={currentStep.type}
            placeholder={currentStep.placeholder}
            style={{width: '100%', padding: 8, borderRadius: 8, border: '1px solid #333', marginTop: 4}}
            autoFocus
          />
        </label>
        {error && <div style={{color:'#ff6b6b', marginBottom: 8}}>{error}</div>}
        {!showAiComment && (
          <button type="submit" style={{padding: '10px 0', borderRadius: 8, background: 'linear-gradient(90deg,#667eea,#f093fb)', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16, marginTop: 8}} disabled={loading}>
            {loading ? 'Thinking...' : stepIndex === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        )}
        {showAiComment && (
          <div style={{marginTop: 16, textAlign: 'center'}}>
            <div style={{marginBottom: 12, fontStyle: 'italic', color: '#f093fb', minHeight: 32}}>{aiComment}</div>
            <button type="button" onClick={handleContinue} style={{padding: '10px 0', borderRadius: 8, background: 'linear-gradient(90deg,#667eea,#f093fb)', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16, marginTop: 8, width: '100%'}}>Continue</button>
          </div>
        )}
      </form>
    </div>
  );
} 