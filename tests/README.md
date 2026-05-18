# ResponsiveVoice API Test Pages

This directory contains test pages and production-ready implementations using the ResponsiveVoice API for text-to-speech functionality.

## 📋 Available Pages

### 1. 🏦 Banking Token Announcement System

**File:** `banking-token.html`  
**Purpose:** Production-ready banking token announcement system

**Features:**

- ✅ Professional banking UI matching the main system
- ✅ Character-by-character pronunciation (e.g., "A024" → "A, zero, two, four")
- ✅ 10 languages with male/female voices
- ✅ Smart TV and large display optimized
- ✅ Real-time clock and status indicators
- ✅ Scalable voice configuration system

**Quick Start:**

```
https://your-site.github.io/tests/banking-token.html?apikey=YOUR_KEY
```

📖 **[Full Documentation](BANKING-TOKEN-README.md)**

---

### 2. 🔊 ResponsiveVoice API Test Page

**File:** `responsive-voice.html`  
**Purpose:** Testing and exploring ResponsiveVoice API capabilities

**Features:**

- Voice testing and exploration
- Parameter controls (rate, pitch, volume)
- Quick test phrases for multiple languages
- Voice selection and comparison

---

## 🔒 Security Setup

Both test pages use a flexible configuration system that works for local development and GitHub Pages deployment.

## 🚀 Quick Start (GitHub Pages / Online)

**Simplest method** - Just add your API key to the URL:

```
https://your-username.github.io/your-repo/tests/responsive-voice.html?apikey=YOUR_API_KEY
```

**Example:**

```
https://faisal-ba-systems.github.io/Multilingual-TTS-JavaScript/tests/responsive-voice.html?apikey=6u9Ful8V
```

That's it! The page will work immediately with the API key from the URL.

## 💻 Local Development Setup

## 💻 Local Development Setup

For local development without exposing your key in the URL:

1. **Copy the example config file:**

   ```bash
   cd tests
   copy config.example.js config.js
   ```

   (On Linux/Mac: `cp config.example.js config.js`)

2. **Edit config.js and add your API key:**

   ```javascript
   const RESPONSIVE_VOICE_CONFIG = {
     apiKey: "YOUR_API_KEY_HERE", // Replace with your actual key
     allowedDomains: ["localhost", "127.0.0.1"],
   };
   ```

3. **Get a free API key:**
   - Visit: https://responsivevoice.org/api/
   - Sign up for a free account
   - Copy your API key
   - Paste it in `config.js`

4. **Open the test page:**
   ```bash
   # Just double-click responsive-voice.html
   # Or open it in your browser
   ```

## 🎯 How It Works

The page tries to get the API key in this order:, for local use)

- ✅ **config.example.js** - Template file for others (committed to Git)
- ✅ Your local API key will NOT be pushed to GitHub
- ✅ Online visitors use URL parameter method
- ✅ Developers can use config.js locally without exposing keys

## 🔐 Usage Scenarios

### Scenario 1: GitHub Pages (Public Demo)

Share this URL with anyone:

```
https://your-site.github.io/path/responsive-voice.html?apikey=YOUR_KEY
```

- ✅ Works immediately
- ✅ No file setup needed
- ⚠️ API key visible in URL (use domain restrictions in ResponsiveVoice dashboard)

### Scenario 2: Local Development (Private)

Use config.js for development:

```
# Open without URL parameter
file:///path/to/responsive-voice.html
```

- ✅ API key hidden in gitignored file
- ✅ More secure for local work
- ✅ No key in browser history

### Scenario 3: Production Deploy

Create a server-side proxy or use environment variables to inject the key.

## 🔐 How It Works

1. The HTML page checks URL for `?apikey=...` parameter
2. If found, uses that key immediately
3. If not found, checks for `config.js` file
4. If neither exists,

- ✅ **config.js** - Contains your actual API key (gitignored)
- ✅ **config.example.js** - Template file for others (committed to Git)
- ✅ Your API key will NOT be pushed to GitHub
- ✅ Others can use your code with their own API keys

## 🔐 How It Works

1. The HTML page loads `config.js` (your private config)
2. It reads the API key from the config object
3. It dynamically loads ResponsiveVoice with your key
4. If `config.js` is missing, it shows setup instructions

## ⚠️ Important Notes

- **Never commit config.js** to Git (it's already in .gitignore)
- **Always commit config.example.js** so others know what to do
- **Restrict your API key** in ResponsiveVoice dashboard to specific domains

## 🚀 For Others Using This Code

If you cloned this repository:

1. You'll see `config.example.js` in the tests folder
2. Copy it to `config.js`
3. Add your own ResponsiveVoice API key
4. The test page will work with your key

## 📁 File Structure

```
tests/
├── responsive-voice.html    # Main test page
├── config.js               # Your private API key (gitignored)
├── config.example.js       # Template for others (in Git)
└── README.md              # This file
```

## 🛡️ Additional Security Tips

1. **Enable Domain Restrictions:**
   - Log in to ResponsiveVoice dashboard
   - Restrict your API key to specific domains only
   - This prevents unauthorized usage even if key is exposed

2. **Monitor Usage:**
   - Check your ResponsiveVoice dashboard regularly
   - Watch for unusual usage patterns
   - Set up usage alerts if available

3. **Rotate Keys:**
   - If you suspect your key is compromised
   - Generate a new key in the dashboard
   - Update your `config.js`

## 🆘 Troubleshooting

### "Configuration Error" message appears

**Problem:** config.js file not found

**Solution:**

```bash
cd tests
copy config.example.js config.js
# Edit config.js and add your API key
```

### No voices loading

**Problem:** Invalid or expired API key

**Solution:**

1. Check your API key in config.js
2. Verify it's active in ResponsiveVoice dashboard
3. Ensure you have internet connection

### API key in Git by accident

**Problem:** You committed config.js to Git

**Solution:**

```bash
# Remove from Git but keep local file
git rm --cached tests/config.js

# Commit the removal
git commit -m "Remove API key from repository"

# Generate new API key in ResponsiveVoice dashboard
# Update config.js with new key
```

## 📞 Support

- ResponsiveVoice API Docs: https://responsivevoice.org/api/
- ResponsiveVoice Support: https://responsivevoice.org/contact/

---

**Last Updated:** May 18, 2026
