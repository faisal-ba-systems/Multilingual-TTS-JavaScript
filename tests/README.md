# ResponsiveVoice API Test Page

## 🔒 Security Setup

This test page uses a secure configuration system to protect your API key from being exposed on GitHub.

## 📋 Setup Instructions

### First Time Setup

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

## ✅ What's Protected

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
