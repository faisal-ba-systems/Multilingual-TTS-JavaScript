# Banking TTS Announcement System

A professional **Text-to-Speech (TTS) announcement system** for banking token management and customer service environments. Built with vanilla JavaScript for lightweight deployment and maximum compatibility.

## 🌟 Features

### Multi-Language Support

- **English** (`en`)
- **Bangla** (`bn`)
- **French** (`fr`)
- **Japanese** (`jp`)
- Extensible architecture for adding more languages

### Advanced TTS Capabilities

- 🎤 Male/Female voice selection
- ⚡ Adjustable speech rate/speed
- 🎵 Pitch/tone customization
- 🔊 Volume control
- 🔄 Queue management for multiple announcements
- 🔔 Optional notification sound before announcements
- 🌍 Language-specific voice mapping

### Professional Display

- Real-time token and counter number display
- Localized text labels based on selected language
- Animated transitions and highlights
- Responsive design for various screen sizes
- Auto-hide capability after announcements

### Production Ready

- No dependencies - pure vanilla JavaScript
- Browser-compatible (Chrome, Firefox, Edge, Safari)
- **Smart TV Support** (Android TV, Google TV, Tizen, webOS)
- Automatic audio unlock for TV browsers
- Configurable via environment variables
- RESTful API integration support
- Keyboard shortcuts for quick operations

## 📺 Smart TV Display Support

**NEW**: Fully compatible with Android-based Smart TVs for banking display monitors!

### Features for Smart TV

- 🔍 Automatic Smart TV browser detection
- 🔊 One-click audio unlock system
- 📱 Optimized touch targets for TV remotes
- 🎯 Visual prompts for audio enablement
- ⚡ Reliable audio playback on TV speakers
- 🌐 Handles autoplay restrictions automatically

### Quick Setup for Smart TV

1. Open the application in your Smart TV browser
2. Click "Enable Audio & Announce" when prompted (one time only)
3. System is ready - audio will work for all subsequent announcements!

**📖 Detailed Guides:**

- **Quick Setup**: [docs/SMART-TV-QUICK-SETUP.md](docs/SMART-TV-QUICK-SETUP.md)
- **Technical Details**: [docs/SMART-TV-AUDIO-FIX.md](docs/SMART-TV-AUDIO-FIX.md)

## 🚀 Quick Start

### 1. Clone or Download

```bash
git clone <repository-url>
cd Multilingual-TTS-JavaScript
```

### 2. Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` to set your preferences:

```env
TTS_LANGUAGE=en          # Language: en, bn, fr, jp
VOICE_GENDER=female      # Voice: male, female
VOICE_RATE=1.0           # Speed: 0.5 - 2.0
VOICE_PITCH=1.0          # Pitch: 0.5 - 2.0
VOICE_VOLUME=1.0         # Volume: 0.1 - 1.0
ENABLE_NOTIFICATION_SOUND=true
```

### 3. Run the Application

Simply open `index.html` in a modern web browser:

```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

Or use a local web server (recommended):

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 📖 Usage

### Basic Usage

1. **Select Language**: Choose from the dropdown (English, Bangla, French, Japanese)
2. **Configure Voice**: Adjust gender, rate, pitch, and volume
3. **Test Announcement**:
   - Enter token number (e.g., 13)
   - Enter counter number (e.g., 3)
   - Click "Announce Now"

### Display Output

The system will:

1. Display the token and counter numbers on screen (localized)
2. Play a notification sound (if enabled)
3. Announce the information using TTS in the selected language

**Example (English):**

```
Display: Token Number 13, Counter Number 3
Speech: "Token Number 13, Counter Number 3"
```

**Example (Bangla):**

```
Display: টোকেন নম্বর 13, কাউন্টার নম্বর 3
Speech: "টোকেন নম্বর 13, কাউন্টার নম্বর 3"
```

### Keyboard Shortcuts

- `Ctrl/Cmd + Enter`: Make announcement
- `Ctrl/Cmd + P`: Pause speech
- `Ctrl/Cmd + S`: Stop all announcements

## 🔧 Configuration

### Language Configuration (`config.js`)

Add or modify languages in the `CONFIG.languages` object:

```javascript
jp: {
  code: 'jp',
  name: 'Japanese',
  displayName: '日本語',
  locale: 'ja-JP',
  direction: 'ltr',
  labels: {
    tokenNumber: 'トークン番号',
    counterNumber: 'カウンター番号',
    pleaseGoTo: 'カウンターへお越しください',
    thankYou: 'ありがとうございます',
  },
  numberFormatter: (num) => num.toString(),
  tts: {
    voice: 'ja-JP',
    voiceURI: 'Microsoft Haruka - Japanese (Japan)',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    preferredVoices: [
      'Microsoft Haruka - Japanese (Japan)',
      'Google 日本語',
    ],
  },
}
```

### Voice Settings

Customize voice behavior:

```javascript
voice: {
  genderOptions: {
    male: { rate: 0.95, pitch: 0.9 },
    female: { rate: 1.0, pitch: 1.1 },
  },
  speedPresets: {
    slow: 0.7,
    normal: 1.0,
    fast: 1.3,
  },
}
```

### Queue Management

Configure announcement queue:

```javascript
queue: {
  maxQueueSize: 10,
  announcementDelay: 2000,  // ms between announcements
  retryAttempts: 3,
  retryDelay: 1000,
}
```

## 🔌 API Integration

### JavaScript API

```javascript
// Initialize
const app = new BankingTTSApp();

// Make announcement
app.announce(13, 3);

// Change language
app.setLanguage("bn");

// Get status
const status = app.getStatus();
console.log(status.queueLength); // Number of pending announcements
```

### REST API Integration

Create a server-side endpoint that triggers announcements:

```javascript
// Example: Node.js + Express
app.post("/api/announce", (req, res) => {
  const { token, counter, language } = req.body;

  // Broadcast to connected clients via WebSocket or SSE
  io.emit("announce", { token, counter, language });

  res.json({ success: true });
});
```

### URL Parameters

Control the system via URL parameters:

```
http://localhost:8000/?lang=bn&gender=female&rate=0.9
```

Parameters:

- `lang` or `language`: Set language (en, bn, fr, jp)
- `gender`: Set voice gender (male, female)
- `rate`: Set speech rate (0.5 - 2.0)

## 📁 Project Structure

```
Multilingual-TTS-JavaScript/
├── index.html              # Main HTML file
├── styles.css              # Styling
├── config.js               # Configuration & language settings
├── tts-engine.js           # TTS engine core
├── app.js                  # Main application logic
├── .env.example            # Environment configuration template
├── assets/
│   └── notification.mp3    # Notification sound (add your own)
├── examples/
│   ├── api-integration.js  # API integration examples
│   └── websocket-server.js # WebSocket server example
└── README.md               # This file
```

## 🌐 Browser Compatibility

### Desktop & Mobile Browsers

| Browser | Support    | Notes                 |
| ------- | ---------- | --------------------- |
| Chrome  | ✅ Full    | Best voice quality    |
| Edge    | ✅ Full    | Best voice quality    |
| Firefox | ✅ Full    | Good voice quality    |
| Safari  | ⚠️ Partial | Limited voice options |
| Opera   | ✅ Full    | Good voice quality    |

### Smart TV Platforms

| Platform       | Support             | Notes                                         |
| -------------- | ------------------- | --------------------------------------------- |
| Android TV     | ✅ Fully Supported  | Auto-detects, requires one-click audio unlock |
| Google TV      | ✅ Fully Supported  | Auto-detects, requires one-click audio unlock |
| Samsung Tizen  | ✅ Expected to work | Auto-detects, requires one-click audio unlock |
| LG webOS       | ✅ Expected to work | Auto-detects, requires one-click audio unlock |
| Amazon Fire TV | ✅ Expected to work | Auto-detects, requires one-click audio unlock |

**Smart TV Setup**: The system automatically detects Smart TV browsers and prompts for audio unlock with a single button click. See [Smart TV Quick Setup Guide](docs/SMART-TV-QUICK-SETUP.md) for detailed instructions.

**Note**: Voice availability depends on the operating system and browser.

## 🎨 Customization

### Adding a New Language

1. Add language configuration in `config.js`:

```javascript
es: {
  code: 'es',
  name: 'Spanish',
  displayName: 'Español',
  locale: 'es-ES',
  direction: 'ltr',
  labels: {
    tokenNumber: 'Número de token',
    counterNumber: 'Número de mostrador',
    pleaseGoTo: 'Por favor diríjase al',
    thankYou: 'Gracias',
  },
  numberFormatter: (num) => num.toString(),
  tts: {
    voice: 'es-ES',
    voiceURI: 'Microsoft Helena - Spanish (Spain)',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    preferredVoices: ['Microsoft Helena - Spanish (Spain)'],
  },
}
```

2. Add language option in HTML:

```html
<option value="es">Español (Spanish)</option>
```

3. Update `supportedLanguages` array in config:

```javascript
supportedLanguages: ['en', 'bn', 'fr', 'jp', 'es'],
```

### Custom Styling

Modify `styles.css` to match your bank's branding:

```css
:root {
  --primary-color: #your-brand-color;
  --card-background: #your-bg-color;
}
```

### Notification Sound

Replace `assets/notification.mp3` with your custom sound file. Supported formats:

- MP3
- WAV
- OGG

## 🐛 Troubleshooting

### No Voice Output (Desktop/Mobile)

1. **Check browser permissions**: Ensure audio is not muted
2. **Verify voices are loaded**: Check browser console for voice list
3. **Try different browser**: Some browsers have better TTS support

### No Audio on Smart TV

1. **Click the audio unlock button**: Smart TVs require user interaction for audio
2. **Check TV volume**: Ensure TV is not muted and volume is adequate
3. **Refresh and retry**: Close browser and reopen the application
4. **Check internet**: TTS voices require stable internet connection
5. **See detailed guide**: [docs/SMART-TV-QUICK-SETUP.md](docs/SMART-TV-QUICK-SETUP.md)

### Voice Not Available for Language

1. **Install language pack**: Add TTS voices for your language in OS settings
2. **Use fallback voice**: System will use default voice if preferred not available
3. **Check console**: See which voices are detected

### Display Not Updating

1. **Check JavaScript console** for errors
2. **Verify config.js** is loaded correctly
3. **Clear browser cache** and reload

## 🔒 Security Considerations

- **Input Validation**: Always validate token and counter numbers
- **Rate Limiting**: Implement rate limiting for API endpoints
- **CORS**: Configure CORS properly for production
- **Content Security Policy**: Add CSP headers in production

## 🚀 Deployment

### Production Checklist

- [ ] Set `DEBUG_MODE=false` in `.env`
- [ ] Minimize JavaScript files
- [ ] Optimize images and assets
- [ ] Configure web server (nginx/Apache)
- [ ] Set up HTTPS
- [ ] Enable caching headers
- [ ] Test on target displays/screens

### Web Server Configuration

**Nginx Example:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/Multilingual-TTS-JavaScript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|mp3)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📝 License

This project is provided as-is for banking and customer service environments.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional language support
- More voice customization options
- Integration examples (WebSocket, REST API)
- Accessibility enhancements
- Performance optimizations

## 📧 Support

For issues or questions:

1. Check the troubleshooting section
2. Review browser console for errors
3. Test with different browsers
4. Verify configuration files

## 🎯 Roadmap

- [ ] WebSocket server for real-time announcements
- [ ] Database integration for queue management
- [ ] Admin dashboard for system monitoring
- [ ] Multi-display support
- [ ] Announcement scheduling
- [ ] Analytics and reporting
- [ ] Mobile app integration

---

**Built with ❤️ for Banking and Customer Service Excellence**
