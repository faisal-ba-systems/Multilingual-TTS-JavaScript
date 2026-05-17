# Smart TV Quick Setup Guide

## 🚀 Quick Start for Smart TV

### Step 1: Open the Application

Navigate to the application URL on your Smart TV browser.

### Step 2: Enable Audio

When you see this message:

```
🔊 Smart TV Detected: Click "Announce" to enable audio
```

**Click the glowing blue "Enable Audio & Announce" button** on the screen.

### Step 3: Confirm Audio Works

You should hear:

- A notification sound (optional)
- The token and counter announcement in your selected language

### Step 4: Continue Using

After the first click, audio will work automatically for all future announcements!

---

## ✅ Quick Check

**Visual Interface Loads?** ✓ Yes → Good!  
**Audio Unlock Prompt Appears?** ✓ Yes → Good!  
**Button is Pulsing/Glowing?** ✓ Yes → Good!  
**Audio Plays After Click?** ✓ Yes → **Perfect!** ✓ No → See troubleshooting below

---

## 🔧 Troubleshooting (30 Second Fix)

### No Audio After Clicking?

1. **Check TV Volume** 🔊
   - Is TV muted? Unmute it
   - Volume too low? Increase it

2. **Refresh & Try Again** 🔄
   - Press refresh on your TV browser
   - Click the button again

3. **Check Internet** 🌐
   - TTS voices need internet connection
   - Weak signal? Move closer to router

4. **Try Different Language** 🌍
   - Switch language in control panel
   - English usually has best compatibility

### Prompt Doesn't Appear?

The system will automatically detect your Smart TV. If not:

- Try closing and reopening the browser
- Clear browser cache
- Use Chrome-based browser if available

---

## 📱 Supported Smart TV Platforms

| Platform       | Status              | Notes              |
| -------------- | ------------------- | ------------------ |
| Android TV     | ✅ Fully Supported  | Tested and working |
| Google TV      | ✅ Fully Supported  | Tested and working |
| Samsung Tizen  | ✅ Expected to work | Not yet tested     |
| LG webOS       | ✅ Expected to work | Not yet tested     |
| Amazon Fire TV | ✅ Expected to work | Not yet tested     |

---

## 💡 Pro Tips

### Best Audio Quality

1. Use wired internet connection (not WiFi)
2. Set voice rate to 1.0 (normal speed)
3. Use English or Hindi for best voice quality
4. Keep browser updated

### Better Visibility on Large Displays

1. Use fullscreen mode (F11 on most browsers)
2. Increase browser zoom if text is too small
3. Adjust display brightness on TV settings

### Reliable Operation

1. Don't close the browser during announcements
2. Keep the page loaded and visible
3. Don't navigate away during speech
4. Stable internet required for TTS voices

---

## 🎯 Common Scenarios

### Scenario 1: Bank Display Monitor

**Setup:** TV mounted on wall showing token numbers

**Steps:**

1. Open application in fullscreen
2. Click "Enable Audio & Announce" once
3. Hide control panel (click toggle button)
4. Use API integration for automated announcements
5. Leave running 24/7

### Scenario 2: Customer Service Counter

**Setup:** TV behind counter showing current token

**Steps:**

1. Load application on TV browser
2. Enable audio with button click
3. Operator clicks "Announce" for each customer
4. Audio plays through TV speakers for customers to hear

### Scenario 3: Multi-Language Display

**Setup:** Bank with diverse customers

**Steps:**

1. Enable audio first
2. Switch languages as needed using dropdown
3. Each language uses appropriate TTS voice
4. Digit-by-digit pronunciation ensures clarity

---

## ⚙️ Advanced Settings

### Adjust Speech for TV Speakers

In the Control Panel, adjust:

- **Rate:** 0.9-1.0 for clarity (slower is clearer)
- **Pitch:** 1.0 (normal pitch works best)
- **Volume:** 1.0 (use TV volume control instead)

### Optimal Settings for Banking

```
Language: English / Bangla / Hindi (as needed)
Gender: Female (clearer on speakers)
Rate: 0.9 (slightly slower for clarity)
Pitch: 1.0 (normal)
Volume: 1.0 (maximum)
Notification Sound: ON (attention grabber)
```

---

## 📞 Need Help?

### Console Diagnostics

1. Press F12 (or TV browser equivalent)
2. Open Console tab
3. Look for `[TTS]` messages
4. Check for errors in red

### Test Audio Manually

1. Click "Run Diagnostic Test" button
2. Check console output
3. Verify voice availability
4. Test each language

### Still Not Working?

1. Check `docs/SMART-TV-AUDIO-FIX.md` for technical details
2. Review browser console logs
3. Try a different browser on the TV
4. Contact your IT support team

---

## 🎉 Success Checklist

- ✅ Application loads on Smart TV
- ✅ Visual interface displays correctly
- ✅ Audio unlock prompt appears automatically
- ✅ Button click enables audio successfully
- ✅ Token announcements play through TV speakers
- ✅ Multiple languages work correctly
- ✅ System runs reliably for extended periods

**Congratulations! Your Smart TV TTS system is ready!** 🎊

---

**Quick Reference Version:** 1.0  
**For Technical Details:** See `docs/SMART-TV-AUDIO-FIX.md`  
**For API Integration:** See `docs/API.md`
