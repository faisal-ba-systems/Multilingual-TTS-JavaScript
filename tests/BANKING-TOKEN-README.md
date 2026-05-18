# Banking Token Announcement System - ResponsiveVoice Edition

## 🏦 Overview

Professional banking token announcement system using the ResponsiveVoice API for high-quality multilingual text-to-speech announcements. Designed for banking halls, customer service centers, and large display monitors including Smart TVs.

## ✨ Key Features

### 🎯 Core Functionality

- **Character-by-Character Pronunciation**: Numbers are announced digit-by-digit (e.g., "12" → "one, two" not "twelve")
- **Multilingual Support**: 10 languages with native voice options
- **Male & Female Voices**: Gender options for each language
- **Professional Banking UI**: Clean, modern interface matching banking standards
- **Smart TV Optimized**: Responsive design for large displays and Smart TVs
- **Real-Time Clock**: Live date and time display
- **Visual Feedback**: Animated announcement indicators

### 🌍 Supported Languages

| Language          | Code | Male Voice | Female Voice | Character Support |
| ----------------- | ---- | ---------- | ------------ | ----------------- |
| English           | `en` | ✅         | ✅           | A-Z, 0-9          |
| বাংলা (Bangla)    | `bn` | ✅         | ✅           | A-Z, ০-৯          |
| हिन्दी (Hindi)    | `hi` | ✅         | ✅           | A-Z, 0-9          |
| Español (Spanish) | `es` | ✅         | ✅           | A-Z, 0-9          |
| Français (French) | `fr` | ✅         | ✅           | A-Z, 0-9          |
| Deutsch (German)  | `de` | ✅         | ✅           | A-Z, 0-9          |
| العربية (Arabic)  | `ar` | ✅         | ✅           | A-Z, ٠-٩          |
| 中文 (Chinese)    | `zh` | ✅         | ✅           | A-Z, 0-9          |
| 日本語 (Japanese) | `ja` | ✅         | ✅           | A-Z, 0-9          |
| 한국어 (Korean)   | `ko` | ✅         | ✅           | A-Z, 0-9          |

## 🚀 Quick Start

### Method 1: GitHub Pages (Public Deployment)

Simply add your ResponsiveVoice API key to the URL:

```
https://your-username.github.io/your-repo/tests/banking-token.html?apikey=YOUR_API_KEY
```

**Example:**

```
https://faisal-ba-systems.github.io/Multilingual-TTS-JavaScript/tests/banking-token.html?apikey=6u9Ful8V
```

### Method 2: Local Development

1. **Copy the config file:**

   ```bash
   cd tests
   cp config.example.js config.js
   ```

2. **Add your API key to `config.js`:**

   ```javascript
   const RESPONSIVE_VOICE_CONFIG = {
     apiKey: "YOUR_API_KEY_HERE",
   };
   ```

3. **Open the page:**
   ```bash
   # Double-click banking-token.html
   # Or serve with a local server
   ```

## 🎙️ How It Works

### Character-by-Character Pronunciation

The system converts token and counter numbers into individual characters for clear announcement:

#### Examples:

**Token: `A024`**

- ❌ **NOT**: "A zero twenty-four" or "A oh twenty-four"
- ✅ **YES**: "A ... zero ... two ... four"

**Token: `123`**

- ❌ **NOT**: "One hundred twenty-three"
- ✅ **YES**: "One ... two ... three"

**Counter: `C5`**

- ❌ **NOT**: "C five"
- ✅ **YES**: "C ... five"

### Full Announcement Format

```
[Token Label], [Character1], [Character2], [Character3], ...
[Please go to counter], [Counter Character1], [Counter Character2], ...
```

**English Example:**

```
Token Number, A, zero, two, four. Please go to counter, five.
```

**Bangla Example:**

```
টোকেন নম্বর, এ, শূন্য, দুই, চার। অনুগ্রহ করে যান কাউন্টার, পাঁচ।
```

## 🎨 User Interface

### Display Components

1. **Header**
   - Bank branding logo
   - System title
   - Live clock (time + date)
   - System status indicator

2. **Announcement Display** (Main Area)
   - Current token number (large display)
   - Arrow indicator
   - Counter number (large display)
   - Status message
   - Visual animation during announcement

3. **Control Panel** (Right Sidebar)
   - Token number input
   - Counter number input
   - Language selector
   - Voice selection (Male/Female)
   - Announce button
   - Stop button

## 🔧 Configuration

### Voice Configuration Structure

The system uses a scalable configuration object for easy expansion:

```javascript
const VOICE_CONFIG = {
  languageCode: {
    name: "Language Name",
    nativeName: "Native Language Name",
    voices: [
      { name: "Display Name", voice: "ResponsiveVoice Name", gender: "male/female" }
    ],
    labels: {
      tokenNumber: "Translated Label",
      counterNumber: "Translated Label",
      pleaseGoTo: "Translated Phrase"
    },
    charMap: {
      "0": "zero", "1": "one", ...
      "a": "A", "b": "B", ...
    }
  }
};
```

### Adding New Languages

To add a new language, simply extend the `VOICE_CONFIG` object:

```javascript
VOICE_CONFIG.newLang = {
  name: "New Language",
  nativeName: "নতুন ভাষা",
  voices: [
    {
      name: "New Language Female",
      voice: "ResponsiveVoice Voice Name",
      gender: "female",
    },
    {
      name: "New Language Male",
      voice: "ResponsiveVoice Voice Name",
      gender: "male",
    },
  ],
  labels: {
    tokenNumber: "Translated: Token Number",
    counterNumber: "Translated: Counter Number",
    pleaseGoTo: "Translated: Please go to counter",
  },
  charMap: {
    0: "translated-zero",
    1: "translated-one",
    // ... add all characters
  },
};
```

### Adding More Voices

To add additional voice options for an existing language:

```javascript
VOICE_CONFIG.en.voices.push({
  name: "Australian English Female",
  voice: "Australian Female",
  gender: "female",
});
```

## 🎯 Usage Guide

### For Bank Operators

1. **Select Language**: Choose from the dropdown (default: English)
2. **Choose Voice**: Select male or female voice variant
3. **Enter Token**: Type token number (e.g., `A024`, `123`, `B45`)
4. **Enter Counter**: Type counter number (e.g., `5`, `12`, `C3`)
5. **Click "Announce Token"** or press `Ctrl+Enter`
6. **Visual Feedback**: Card will glow during announcement

### For System Administrators

#### Deployment Options

**Option 1: GitHub Pages**

- Upload files to repository
- Enable GitHub Pages in settings
- Share URL with `?apikey=YOUR_KEY` parameter
- ✅ Best for public demos and testing

**Option 2: Internal Server**

- Host on internal web server
- Use `config.js` for API key (gitignored)
- ✅ Best for production banking environment

**Option 3: Kiosk Mode**

- Run on dedicated display device
- Full-screen browser mode
- Auto-start on boot
- ✅ Best for customer-facing displays

#### Browser Compatibility

| Browser          | Desktop | Mobile | Smart TV | Status      |
| ---------------- | ------- | ------ | -------- | ----------- |
| Chrome           | ✅      | ✅     | ✅       | Recommended |
| Firefox          | ✅      | ✅     | ⚠️       | Supported   |
| Safari           | ✅      | ✅     | ❌       | Supported   |
| Edge             | ✅      | ✅     | ⚠️       | Supported   |
| Samsung Internet | ✅      | ✅     | ✅       | Good        |
| Android WebView  | ✅      | ✅     | ✅       | Good        |

#### Keyboard Shortcuts

- **Ctrl+Enter** / **Cmd+Enter**: Announce token
- **Escape**: Stop announcement

## 🔒 Security Considerations

### API Key Protection

1. **For Local Development**: Use `config.js` (gitignored)
2. **For GitHub Pages**: Use URL parameter `?apikey=...`
3. **For Production**: Use server-side proxy or environment variables

### Best Practices

- ✅ Restrict API key to specific domains in ResponsiveVoice dashboard
- ✅ Use HTTPS for production deployments
- ✅ Implement rate limiting if needed
- ✅ Monitor API usage and set alerts
- ❌ Never commit API keys to public repositories
- ❌ Don't expose API keys in client-side code for production

## 📊 Performance Optimization

### For Smart TVs and Large Displays

The system includes specific optimizations:

- **4K Display Support**: Scales properly on 1920px+ screens
- **Font Sizes**: Larger text for readability from distance
- **High Contrast**: Optimized color schemes
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Low Memory**: Efficient DOM management

### Recommended Settings

```css
/* Optimized for banking halls */
--primary-color: #1e40af; /* Professional blue */
--background: #f1f5f9; /* Soft gray */
--text-primary: #0f172a; /* High contrast */
```

## 🐛 Troubleshooting

### Issue: No API Key Found

**Symptoms:** Error message on page load
**Solutions:**

1. Add `?apikey=YOUR_KEY` to URL
2. Create `tests/config.js` with API key
3. Check console for specific error

### Issue: Voice Not Loading

**Symptoms:** No voices in selection grid
**Solutions:**

1. Check internet connection
2. Verify ResponsiveVoice API is loaded
3. Check browser console for errors
4. Try different voice options

### Issue: Incorrect Pronunciation

**Symptoms:** Numbers spoken as full words
**Solutions:**

1. Check `charMap` configuration for language
2. Verify character-by-character conversion logic
3. Test with different token formats

### Issue: Display Issues on Smart TV

**Symptoms:** UI not rendering correctly
**Solutions:**

1. Check browser compatibility
2. Enable hardware acceleration
3. Test with Chrome browser
4. Clear browser cache

## 📈 Future Enhancements

### Planned Features

- [ ] Queue management system
- [ ] Multiple token announcements
- [ ] Historical announcement log
- [ ] Custom voice speed controls
- [ ] Custom pause duration between characters
- [ ] Dark mode theme
- [ ] Waiting area display integration
- [ ] SMS/Email notification integration
- [ ] Statistics and analytics dashboard

### Extensibility

The system is designed for easy extension:

1. **Add Languages**: Extend `VOICE_CONFIG` object
2. **Custom Voices**: Add voice options to language config
3. **Custom Styling**: Modify CSS variables
4. **Integration**: Use as iframe or web component
5. **API Extension**: Add custom announcement formats

## 🔗 Related Files

- **Main Page**: `banking-token.html` - The complete system
- **Test Page**: `responsive-voice.html` - Voice testing tool
- **Config Template**: `config.example.js` - API key template
- **Config (Local)**: `config.js` - Your API key (gitignored)

## 📞 Support

### ResponsiveVoice API

- **Website**: https://responsivevoice.org/
- **API Docs**: https://responsivevoice.org/api/
- **Get API Key**: https://responsivevoice.org/pricing/

### Common Questions

**Q: Is ResponsiveVoice free?**
A: Yes, for non-commercial use. Commercial licenses available.

**Q: Can I use this offline?**
A: No, ResponsiveVoice requires internet connection.

**Q: How many announcements per day?**
A: Depends on your API plan. Check ResponsiveVoice pricing.

**Q: Can I customize the announcement format?**
A: Yes! Edit the `announceToken()` function logic.

**Q: Does it work on mobile devices?**
A: Yes, fully responsive design supports all screen sizes.

## 📄 License

This project follows the same license as the main repository. ResponsiveVoice API has its own licensing terms - please review at https://responsivevoice.org/

---

**Built for professional banking environments • Multilingual • Accessible • Modern**
