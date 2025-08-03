# 🚀 BuzzBlast - LinkedIn Comment Helper

<div align="center">
  <img src="icons/logo128.png" alt="BuzzBlast Logo" width="128" height="128">
  <h3>Your AI-powered LinkedIn wingperson</h3>
  <p>Generate professional, context-aware LinkedIn comments with zero effort and maximum impact.</p>
</div>

## ✨ Features

- 🤖 **AI-Powered Comments**: Generate professional LinkedIn comments using Google's Gemini API
- 😊 **8 Mood Options**: Choose from 👍👏💡🤔❤️✅🎯🚀 to set the perfect tone
- 🎯 **Smart Context Analysis**: Analyzes post content and your input for better suggestions
- 🔒 **Privacy-First**: No data stored - everything processed securely via Gemini API
- ⚡ **Lightweight**: Minimal impact on LinkedIn page performance
- 🎨 **Seamless Integration**: Blends naturally with LinkedIn's design

## 🚀 Quick Start

### Option 1: Clone and Build (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/LinkedIn-Comment-Chrome-Extension.git
   cd LinkedIn-Comment-Chrome-Extension
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```

4. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer Mode" (toggle in top right)
   - Click "Load unpacked" and select the `dist/` folder
   - The extension will appear in your extensions list

5. **Get your API key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Click the extension icon and paste your key

### Option 2: Download ZIP

1. Download the ZIP file from the repository
2. Extract to a folder
3. Follow steps 3-5 from Option 1

## 🎯 How to Use

1. **Navigate to LinkedIn** and find a post to comment on
2. **Click "Comment"** to open the comment input box
3. **Select a mood** by clicking one of the emotion buttons (👍👏💡🤔❤️✅🎯🚀)
4. **Click the AI button** (🤖) that appears next to the emotion buttons
5. **Review and edit** the generated comment
6. **Post your comment** when satisfied

**Pro tip**: Type your own idea in the comment box before clicking the AI button for more personalized comments!

### Available Moods

| Mood | Tone | Best For |
|------|------|----------|
| 👍 **Like** | Positive & supportive | General engagement |
| 👏 **Applaud** | Enthusiastic & congratulatory | Celebrations, achievements |
| 💡 **Insightful** | Thoughtful & analytical | Professional discussions |
| 🤔 **Curious** | Inquisitive & engaging | Questions, learning |
| ❤️ **Love** | Warm & appreciative | Personal connections |
| ✅ **Agree** | Agreeable & confirming | Supporting others' points |
| 🎯 **Focused** | Professional & goal-oriented | Business discussions |
| 🚀 **Excited** | Energetic & optimistic | New launches, opportunities |

## 🔧 Development

### Prerequisites
- Node.js (v16 or higher)
- Google Chrome browser
- Gemini API key

### Development Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Build for development (faster)
npm run build:dev

# Watch for changes and auto-rebuild
npm run watch

# Create distributable package
npm run package

# Validate manifest and files
npm run validate
```

### Project Structure
```
├── manifest.json          # Extension configuration
├── content.js            # Main content script
├── content.css           # Styles for injected elements
├── popup.html            # Settings popup
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── icons/                # Extension icons
│   ├── logo*.png         # Logo files
│   └── icon*.svg         # SVG source files
├── scripts/              # Build scripts
│   ├── generate-icons.js # Icon generation
│   └── validate-manifest.js # Manifest validation
├── dist/                 # Built extension (generated)
└── package.json          # NPM configuration
```

## 🔒 Privacy & Security

- ✅ **Local Storage**: API keys stored securely in Chrome's storage
- ✅ **No Data Collection**: No user data collected or transmitted
- ✅ **Direct API Calls**: All requests go directly to Google's servers
- ✅ **No Tracking**: No analytics or tracking scripts

## 🛠️ Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| Extension not working | Ensure you're on LinkedIn.com and API key is set |
| Comments not generating | Check internet connection and API key quota |
| Button not appearing | Refresh the page or try a different post |
| API key errors | Verify key is valid in Google AI Studio |

### Getting Help

1. Check that you're on a LinkedIn page (`linkedin.com`)
2. Verify your API key is correctly set in extension settings
3. Test your API key in [Google AI Studio](https://makersuite.google.com/app/apikey)
4. Refresh the LinkedIn page if buttons don't appear

## 📦 Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: 
  - `storage`: Save API key locally
  - `activeTab`: Interact with LinkedIn pages
- **Host Permissions**: `https://www.linkedin.com/*`
- **AI Integration**: Google Gemini Pro API

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with ❤️ for the LinkedIn community
- Powered by Google's Gemini AI
- Icons and design created with care

---

<div align="center">
  <p><strong>Made with ❤️ for better LinkedIn engagement</strong></p>
  <p>⭐ Star this repo if it helps you!</p>
</div> 