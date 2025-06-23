# Would You Rather Survival 🧠

A thrilling survival game where you face impossible choices and try to survive 10 rounds of AI-generated consequences!

## 🎮 Game Flow

1. **Player sees two options**: "Would you rather ___ or ___?"
2. **Player chooses one** of the presented options
3. **GPT responds with a consequence** based on the choice
4. **Survive 10 rounds** → win or lose based on "danger level" and random chance

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd would-you-rather-survival
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your OpenRouter API key**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
   
   To get an OpenRouter API key:
   1. Visit [OpenRouter](https://openrouter.ai/)
   2. Sign up for an account
   3. Go to your dashboard
   4. Copy your API key
   5. Paste it in the `.env` file

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to play the game!

## 🎯 How to Play

1. **Read the question** - You'll see a "Would you rather" question with two options
2. **Make your choice** - Click on one of the two options
3. **Face the consequence** - The AI will generate a consequence for your choice
4. **Check the danger level** - Each consequence has a danger level (1-10)
5. **Survive or perish** - Your survival depends on the danger level and round number
6. **Continue or restart** - Survive 10 rounds to win!

## 🛠️ Technical Details

### Built With

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **OpenRouter API** - AI-powered question and consequence generation
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

### Project Structure

```
would-you-rather-survival/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Game.jsx          # Main game component
│   ├── utils/
│   │   └── openRouter.js     # OpenRouter API utilities
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── package.json
├── vite.config.js
└── README.md
```

### API Integration

The game uses OpenRouter's API to generate:
- **Questions**: Creative "Would you rather" scenarios
- **Consequences**: Dramatic outcomes based on player choices
- **Danger Levels**: Risk assessment (1-10) that affects survival chances

### Fallback System

If the API is unavailable, the game includes fallback questions and consequences to ensure it always works.

## 🎨 Features

- **AI-Generated Content**: Every question and consequence is unique
- **Progressive Difficulty**: Later rounds are more dangerous
- **Beautiful UI**: Modern design with smooth animations
- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Smooth transitions between game states
- **Error Handling**: Graceful fallbacks if API fails

## 🔧 Customization

### Modifying Game Difficulty

Edit the `calculateSurvival` function in `src/utils/openRouter.js`:

```javascript
export const calculateSurvival = (dangerLevel, roundNumber) => {
  // Adjust these values to change difficulty
  const survivalChance = Math.max(0.1, 1 - (dangerLevel * 0.1) - (roundNumber * 0.05));
  return Math.random() < survivalChance;
};
```

### Changing AI Model

Modify the model in the API calls in `src/utils/openRouter.js`:

```javascript
model: 'anthropic/claude-3.5-sonnet' // Change to any OpenRouter model
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenRouter for providing AI capabilities
- React team for the amazing framework
- Vite for the fast build tool

## 🐛 Troubleshooting

### API Key Issues

- Make sure your `.env` file is in the root directory
- Verify your OpenRouter API key is correct
- Check that you have sufficient credits in your OpenRouter account

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 16+)

### Game Not Loading

- Check browser console for errors
- Verify all dependencies are installed
- Ensure the development server is running

---

**Have fun surviving the impossible choices! 🎮**
