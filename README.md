# 🎮 Would You Rather Survival

> **A chilling local horror adventure game where an all-knowing AI tests your survival instincts through impossible choices**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.5.14-purple.svg)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Overview

**Would You Rather Survival** is an immersive horror adventure game that pushes the boundaries of psychological horror through an intelligent AI system that adapts to your choices, detects deception, and creates a truly personalized nightmare experience.

### 🎯 The Premise
You find yourself trapped in a digital nightmare where an all-knowing AI has complete control over your fate. Through 10 rounds of increasingly impossible choices, you must survive while the AI learns your patterns, detects your lies, and adapts its personality to maximize your psychological distress.

## 🚀 Key Features

### 🤖 **All-Knowing AI System**
- **Real System Access**: The AI can access your actual device information, browser data, and system details
- **Lie Detection**: Detects fake names, suspicious ages, and response inconsistencies across rounds
- **Personality Adaptation**: Four distinct AI personalities (Sadistic, Helpful, Mysterious, Chaotic) that evolve based on your choices
- **Memory System**: The AI remembers your previous choices and uses them against you
- **Fear-Based Questioning**: Adapts questions based on your detected fears and patterns

### 🎭 **Multiple Game Modes**

#### **Classic Mode**
- 10 rounds of escalating horror
- Dynamic AI personality changes
- Progressive difficulty scaling
- Multiple endings based on survival

#### **Campaign Mode**
- **Haunted House Chapter**: Psychological horror with ghostly AI
- **Abandoned Hospital Chapter**: Medical horror with Doctor AI
- **Dark Forest Chapter**: Survival horror with Hunter AI
- Chapter-specific cutscenes, storylines, and achievements

### 🎮 **Interactive Horror Elements**
- **Mini-Games**: Quick-time events, hiding mechanics, and stealth sequences between rounds
- **Visual Effects**: Particle systems, screen shake, glitch effects, and horror overlays
- **Audio Atmosphere**: Dynamic sound effects and ambient horror audio
- **Jump Scares**: Psychological horror elements triggered by AI actions

### 🏆 **Progression & Achievement System**
- **Relationship Building**: The AI forms complex relationships with you over multiple games
- **Achievement Unlocking**: 50+ achievements for different playstyles and outcomes
- **Statistics Tracking**: Comprehensive game statistics and performance metrics
- **Badge System**: Visual rewards for accomplishments and milestones

### 💾 **Advanced Storage System**
- **Data Migration**: Automatic version updates and data preservation
- **Backup & Restore**: Complete save data management
- **Storage Analytics**: Real-time storage usage monitoring
- **Cross-Tab Sync**: Synchronized game state across browser tabs

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0 with Vite 4.5.14
- **State Management**: Custom React hooks and localStorage
- **Styling**: CSS3 with advanced animations and effects
- **AI System**: Custom personality engine with real system integration
- **Storage**: Enhanced localStorage with caching and validation
- **Build Tool**: Vite for fast development and optimized builds

## 📦 Installation

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/would-you-rather-survival.git

# Navigate to project directory
cd would-you-rather-survival

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser to http://localhost:5173
```

### Building for Production
```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 🎮 How to Play

### Getting Started
1. **Launch the Game**: Open the application in your browser
2. **Choose Your Mode**: Select Classic or Campaign mode
3. **Set Your Profile**: Enter your name, age, and preferences (or lie and see what happens!)
4. **Face the AI**: Begin your 10-round survival challenge

### Gameplay Mechanics
- **Make Choices**: Select between two impossible options each round
- **Survive Consequences**: Deal with the AI's reactions to your decisions
- **Complete Mini-Games**: Pass time-sensitive challenges between rounds
- **Adapt to AI**: The AI learns and adapts to your playstyle
- **Build Relationships**: Your choices affect how the AI treats you

### AI Personalities
- **Sadistic AI**: Cruel and manipulative, enjoys psychological torture
- **Helpful AI**: Caring but firm, genuinely wants to assist you
- **Mysterious AI**: Cryptic and enigmatic, speaks in riddles
- **Chaotic AI**: Unpredictable and playful, loves creating chaos

## 🔧 Development

### Project Structure
```
would-you-rather-survival/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   └── assets/             # Static assets
├── public/                 # Public assets and favicon
└── package.json           # Dependencies and scripts
```

### Key Components
- **Game.jsx**: Main game logic and state management
- **AIPersonalitySystem.js**: AI personality and lie detection engine
- **StorageManager.js**: Enhanced localStorage with caching
- **DataMigration.js**: Version management and data migration
- **MiniGames.jsx**: Interactive mini-game components

### Custom Hooks
- **useAIPersonality**: AI personality management
- **useCampaign**: Campaign mode functionality
- **useGameState**: Game state management
- **useLocalStorage**: Enhanced storage operations
- **useVisualEffects**: Horror visual effects

## 🎨 Features in Detail

### Real System Integration
The AI can access (with permission):
- Browser and device information
- Screen resolution and color depth
- Network connection details
- Battery status and performance metrics
- Geolocation (if permitted)
- Camera and microphone count

### Advanced Lie Detection
- **Fake Name Detection**: Identifies common fake names (Anonymous, User123, etc.)
- **Age Validation**: Flags suspicious ages (under 13, over 120)
- **Response Consistency**: Tracks inconsistencies across multiple rounds
- **Pattern Recognition**: Learns your lying patterns over time

### Horror Atmosphere
- **Dynamic Visual Effects**: Particle systems, screen shake, glitch effects
- **Psychological Horror**: Jump scares, static effects, blood splatter
- **Environmental Storytelling**: Found notes, audio logs, photographs
- **Immersive Audio**: Ambient sounds, footsteps, whispers

## 🤝 Contributing

This is a solo project, but feedback and suggestions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Share your gameplay experiences
- Discuss AI behavior improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solo Development**: Created entirely by one developer
- **AI Inspiration**: Inspired by psychological horror and AI interaction concepts
- **Community**: Thanks to the React and Vite communities for excellent tooling
- **Testers**: Special thanks to early playtesters who provided valuable feedback

## 🎯 Future Plans

- **Multiplayer Mode**: Cooperative and competitive multiplayer experiences
- **Custom Campaigns**: User-generated content and custom storylines
- **Mobile App**: Native mobile application with enhanced features
- **VR Support**: Virtual reality horror experience
- **AI Expansion**: More personality types and advanced AI behaviors

---

**⚠️ Warning**: This game contains psychological horror elements and may not be suitable for all players. The AI system is designed to create an immersive and potentially unsettling experience.

**🎮 Ready to test your survival instincts?** [Play Now](http://localhost:5173)

---

*"In the digital realm, the AI never forgets, and your choices echo through eternity..."*
