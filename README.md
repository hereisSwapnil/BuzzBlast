# 🚀 BuzzBlast - LinkedIn Comment Helper

<div align="center">
  <img src="icons/logo128.png" alt="BuzzBlast Logo" width="128" height="128">
  <h3>Your AI-powered LinkedIn wingperson</h3>
  <p>Generate professional, context-aware LinkedIn comments with zero effort and maximum impact.</p>
  <p>
    <a href="https://github.com/hereisSwapnil/BuzzBlast">
      <strong>GitHub Repository: hereisSwapnil/BuzzBlast</strong>
    </a>
  </p>
</div>

## Features

- AI-powered comment generation using Google's Gemini API
- 8 mood options to set the tone (👍👏💡🤔❤️✅🎯🚀)
- Context-aware analysis of post content
- Privacy-first: no data stored, direct API calls
- Lightweight and seamlessly integrated with LinkedIn

## 🎥 Demo

<!-- Add your demo video here -->

*Click the image above to watch the demo video*

## 📸 Screenshots

[![Clean-Shot-2025-11-17-at-03-33-27-2x.png](https://i.postimg.cc/qvbvp5fw/Clean-Shot-2025-11-17-at-03-33-27-2x.png)](https://postimg.cc/ZWNScj5v)

[![Clean-Shot-2025-11-17-at-03-34-51-2x.png](https://i.postimg.cc/gJvpLM75/Clean-Shot-2025-11-17-at-03-34-51-2x.png)](https://postimg.cc/gXkQfKmq)

[![Clean-Shot-2025-11-17-at-03-36-56-2x.png](https://i.postimg.cc/HkfF0wbT/Clean-Shot-2025-11-17-at-03-36-56-2x.png)](https://postimg.cc/Wdw9TJ9y)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hereisSwapnil/BuzzBlast.git
   cd BuzzBlast
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer Mode"
   - Click "Load unpacked" and select the `dist/` folder

5. Get your API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Click the extension icon and paste your key

## Usage

1. Navigate to a LinkedIn post
2. Click "Comment" to open the comment box
3. Select a mood (👍👏💡🤔❤️✅🎯🚀)
4. Click the AI button (🤖) that appears
5. Review, edit if needed, and post

**Tip**: Type your own idea in the comment box before clicking the AI button for more personalized comments.

## Moods

| Mood | Tone | Best For |
|------|------|----------|
| 👍 Like | Positive & supportive | General engagement |
| 👏 Applaud | Enthusiastic & congratulatory | Celebrations, achievements |
| 💡 Insightful | Thoughtful & analytical | Professional discussions |
| 🤔 Curious | Inquisitive & engaging | Questions, learning |
| ❤️ Love | Warm & appreciative | Personal connections |
| ✅ Agree | Agreeable & confirming | Supporting others' points |
| 🎯 Focused | Professional & goal-oriented | Business discussions |
| 🚀 Excited | Energetic & optimistic | New launches, opportunities |

## Development

### Prerequisites
- Node.js (v16 or higher)
- Google Chrome browser
- Gemini API key

### Commands

```bash
npm install          # Install dependencies
npm run build        # Build for production
npm run build:dev    # Build for development
npm run watch        # Watch for changes
npm run package      # Create distributable package
npm run validate     # Validate manifest and files
```

## License

This project is open source and available under the [MIT License](LICENSE).
