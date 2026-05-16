# Quick Start Guide

Get your Banking TTS Announcement System up and running in 5 minutes!

## 📋 Prerequisites

- Modern web browser (Chrome, Edge, Firefox recommended)
- Basic text editor (VS Code, Notepad++, or any editor)
- Optional: Web server (Python, Node.js, or any HTTP server)

## 🚀 Installation Steps

### Step 1: Get the Files

Download or clone the project:

```bash
git clone <repository-url>
cd Multilingual-TTS-JavaScript
```

Or simply extract the ZIP file to a folder.

### Step 2: Quick Configuration (Optional)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` to set your preferences (or use defaults):

```env
TTS_LANGUAGE=en          # Your default language
VOICE_GENDER=female      # male or female
VOICE_RATE=1.0          # Speech speed (0.5 - 2.0)
```

### Step 3: Run the Application

#### Option A: Direct Browser (Easiest)

Double-click `index.html` or right-click and open with your browser.

⚠️ **Note**: Some features may not work without a web server due to browser security.

#### Option B: Using Python (Recommended)

```bash
# Python 3
python -m http.server 8000

# Then open browser to:
# http://localhost:8000
```

#### Option C: Using Node.js

```bash
# Install http-server (one time)
npm install -g http-server

# Run server
npx http-server -p 8000

# Open: http://localhost:8000
```

#### Option D: Using PHP

```bash
php -S localhost:8000

# Open: http://localhost:8000
```

## 🎯 First Announcement

1. **Open the application** in your browser
2. **Select language** from the dropdown (English, Bangla, French, Japanese)
3. **Enter token number** (e.g., 13)
4. **Enter counter number** (e.g., 3)
5. **Click "Announce Now"**

You should see the display update and hear the announcement!

## 🎨 Customization

### Change Language

Use the language selector in the control panel:

- English (en)
- বাংলা / Bangla (bn)
- Français / French (fr)
- 日本語 / Japanese (jp)

### Adjust Voice Settings

In the control panel:

- **Voice Gender**: Male or Female
- **Speech Rate**: Slider (0.5 = slower, 2.0 = faster)
- **Pitch**: Slider (0.5 = lower, 2.0 = higher)
- **Volume**: Slider (0.1 = quiet, 1.0 = loud)

### Enable/Disable Notification Sound

Check or uncheck "Enable Notification Sound" in the control panel.

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Make announcement
- `Ctrl/Cmd + P` - Pause speech
- `Ctrl/Cmd + S` - Stop all announcements

## 📱 Access from Other Devices

If you started a web server:

1. Find your computer's IP address:

   ```bash
   # Windows
   ipconfig

   # Mac/Linux
   ifconfig
   # or
   ip addr
   ```

2. Access from other devices on same network:

   ```
   http://YOUR_IP_ADDRESS:8000
   ```

   Example: `http://192.168.1.100:8000`

## 🔧 Common Issues

### No Sound?

- Check if browser audio is muted
- Ensure speakers/headphones are connected
- Try clicking the page first (browser autoplay policy)
- Check browser console for errors (F12)

### Wrong Language Voice?

- Voices depend on your operating system
- Install language packs in OS settings:
  - **Windows**: Settings → Time & Language → Language → Add language
  - **Mac**: System Preferences → Accessibility → Speech
  - **Linux**: Install `speech-dispatcher` and language packages

### Display Not Updating?

- Clear browser cache (Ctrl+F5)
- Check browser console for errors
- Try a different browser
- Ensure JavaScript is enabled

### Notification Sound Not Playing?

- Add a notification sound file to `assets/notification.mp3`
- See `assets/README.md` for instructions
- Or disable notification sound in settings

## 📚 Next Steps

### For Testing

- Open `tests/test.html` to run automated tests
- Test all languages: `http://localhost:8000/tests/test.html`

### For Integration

- Read `API.md` for integration examples
- Check `examples/` folder for sample code
- See `DEPLOYMENT.md` for production deployment

### For Production

- Configure `.env` for your environment
- Add custom notification sound
- Set up proper web server (nginx/Apache)
- Follow deployment guide in `DEPLOYMENT.md`

## 🎓 Learn More

- **Full Documentation**: See [README.md](README.md)
- **API Guide**: See [API.md](API.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)

## 💡 Tips

1. **Best Voice Quality**: Use Chrome or Edge for best TTS quality
2. **Multiple Displays**: Use WebSocket server for synchronized announcements
3. **Kiosk Mode**: Add `--kiosk` flag when launching browser for fullscreen
4. **Save Settings**: Language preference is saved automatically in browser

## 🆘 Need Help?

- Check the FAQ in README.md
- Review the troubleshooting section
- Check browser console for errors (F12)
- Verify all files are present

## ✅ Verification Checklist

- [ ] Application opens in browser
- [ ] Control panel is visible
- [ ] Can select different languages
- [ ] Display updates when announcing
- [ ] TTS voice is audible
- [ ] Queue system works
- [ ] Settings are saved

## 🎉 Success!

You're all set! The system is now ready to use for banking token management.

---

**Time to first announcement: ~5 minutes** ⏱️

Need more features? Check out the advanced documentation!
