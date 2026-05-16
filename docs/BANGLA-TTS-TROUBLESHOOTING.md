# Bangla TTS Troubleshooting Guide

## Issue: Bangla Announcements Not Working

### Symptoms

- ✅ English, French, and Japanese work fine
- ❌ Bangla announcements fail or sound incorrect
- ❌ Console error: "Audio playback failed"
- ❌ Bangla text like "টোকেন নম্বর" is not pronounced correctly
- ❌ Numbers work but Bangla characters don't

### Root Cause

Your system does not have a **Bangla/Bengali TTS voice** installed. The system falls back to an English voice which cannot pronounce Bangla Unicode characters properly.

---

## Solutions

### Option 1: Install Bangla Voice on Windows

#### Method A: Using Windows Settings

1. Open **Settings** (Win + I)
2. Go to **Time & Language** → **Speech**
3. Click **Add voices**
4. Search for **"Bangla"** or **"Bengali"**
5. Install: **Microsoft Bangla (Bangladesh)** or **Microsoft Bangla (India)**
6. Wait for download to complete
7. Restart your browser
8. Test the system again

#### Method B: Using Windows Optional Features

1. Open **Settings** → **Apps** → **Optional features**
2. Click **Add a feature**
3. Search for **"Bangla"**
4. Install **Bangla Supplemental Fonts** and **Speech Language Pack**
5. Restart computer
6. Test in browser

### Option 2: Use Google Chrome with Online Voices

Google Chrome has built-in cloud-based voices:

1. Open in **Google Chrome** (not Edge, Firefox, or Safari)
2. Chrome will automatically use Google's online Bangla voice
3. Requires internet connection
4. Should work without additional installation

### Option 3: Install Third-Party TTS Software

#### eSpeak NG (Free & Open Source)

1. Download from: https://github.com/espeak-ng/espeak-ng/releases
2. Install eSpeak NG
3. Includes Bangla (bn) voice
4. Restart browser after installation

#### Balabolka (Windows)

1. Download from: http://www.cross-plus-a.com/balabolka.htm
2. Install SAPI5 voices
3. Configure browser to use system voices

---

## Testing Voice Availability

### Check Available Voices in Browser Console

Open browser console (F12) and run:

```javascript
// List all available voices
window.speechSynthesis.getVoices().forEach((voice, i) => {
  console.log(`${i + 1}. ${voice.name} (${voice.lang})`);
});
```

**Look for voices containing:**

- `bn-BD` (Bangla - Bangladesh)
- `bn-IN` (Bangla - India)
- `Bangla`
- `Bengali`
- `বাংলা`

### Use Built-in Diagnostic Tool

The system now includes a diagnostic tool. In console, run:

```javascript
app.ttsEngine.getDiagnosticInfo();
```

This will show:

- ✅ Total available voices
- ✅ All voice names and languages
- ✅ Which languages have voices installed
- ✅ Bangla voice status

---

## Expected Voices by Browser

### Google Chrome

**Expected voices:**

- Google বাংলা (bn-BD)
- Google US English (en-US)
- Google français (fr-FR)
- Google 日本語 (ja-JP)

**Requirements:**

- Internet connection for cloud voices
- Chrome version 33+

### Microsoft Edge

**Expected voices:**

- Microsoft Bangla (Bangladesh) - if installed
- Microsoft Zira (English)
- Microsoft Hortense (French)

**Requirements:**

- Windows Speech Language Pack installed
- Edge version 79+

### Mozilla Firefox

**Uses system voices:**

- Depends on Windows Speech API
- Requires Bangla voice installed on system

### Safari (macOS)

**Limited support:**

- May not have Bangla voice
- Depends on macOS version
- Check System Preferences → Accessibility → Speech

---

## Verification Steps

### 1. Check Console for Voice Warnings

When you select Bangla, the console should show:

**✅ If voice is available:**

```
[TTS] ✓ Found preferred voice: Google বাংলা (bn-BD)
[TTS] Using voice: Google বাংলা for "টোকেন নম্বর..."
```

**❌ If voice is NOT available:**

```
[TTS] ⚠ No বাংলা voice found!
[TTS] ⚠ Bangla text may not be pronounced correctly with fallback voice.
```

### 2. Test Announcement

Try announcing: **Token: "A001"**, **Counter: "3"**

**Expected output in Bangla:**

- Should hear: "টোকেন নম্বর A zero zero one, কাউন্টার নম্বর three"
- Display should show: "A001" and "3" (not converted to Bangla numerals)

---

## Understanding the Error Messages

### Error: "Audio playback failed"

**Cause:** Missing notification sound file (`notification.mp3`)
**Impact:** Only affects the beep sound, NOT the speech
**Fix:** Not critical - speech will work without notification sound

### Error: "Speech synthesis error"

**Cause:** No compatible voice found for Bangla
**Impact:** Speech fails completely or uses wrong voice
**Fix:** Install Bangla voice (see solutions above)

### Warning: "No suitable voice found"

**Cause:** Voice detection couldn't find Bangla voice
**Impact:** Falls back to English voice, can't pronounce Bangla
**Fix:** Install Bangla voice and restart browser

---

## Quick Fix Checklist

- [ ] Using Google Chrome? (Easiest solution)
- [ ] Bangla voice installed on Windows?
- [ ] Browser restarted after installing voice?
- [ ] Internet connection active? (For Google voices)
- [ ] Console shows voice detection logs?
- [ ] Diagnostic tool run (`app.ttsEngine.getDiagnosticInfo()`)?
- [ ] System audio working for other languages?

---

## Advanced Configuration

### Modify Preferred Voices

If you have a custom Bangla voice, edit `config.js`:

```javascript
bn: {
  // ... other config
  tts: {
    preferredVoices: [
      'Google বাংলা',           // Try this first
      'Microsoft Bangla',        // Then this
      'Your Custom Voice Name'   // Add your voice here
    ],
    // ...
  }
}
```

### Fallback to Transliteration

If no Bangla voice is available and you need a temporary workaround, you could modify the labels to use English transliteration:

```javascript
labels: {
  tokenNumber: 'Token Number',     // Instead of 'টোকেন নম্বর'
  counterNumber: 'Counter Number', // Instead of 'কাউন্টার নম্বর'
}
```

**Note:** This is a workaround only. Installing proper Bangla voice is recommended.

---

## Browser-Specific Issues

### Chrome: "Voice not loaded"

- Wait 2-3 seconds after page load
- Voices load asynchronously
- The system automatically retries

### Edge: "Voice not found"

- Ensure Windows Speech Pack is installed
- Check Edge://settings/languages
- Enable "Use web services for spelling suggestions"

### Firefox: "No voices available"

- Firefox depends on OS voices
- No online voice fallback
- Must install Bangla voice on system

---

## Contact & Support

### Still Not Working?

1. **Run Diagnostic:**

   ```javascript
   app.ttsEngine.getDiagnosticInfo();
   ```

2. **Copy Console Output:** Include all errors and warnings

3. **System Info:**
   - OS: Windows 10/11?
   - Browser: Chrome/Edge/Firefox/Safari?
   - Version: ?
   - Voice installed: Yes/No?

4. **Test Other Languages:** Do French and Japanese work?

---

## Additional Resources

### Download Bangla Voices

- **Microsoft Bangla:** Windows Settings → Speech
- **Google Chrome:** Built-in (requires internet)
- **eSpeak NG:** https://github.com/espeak-ng/espeak-ng
- **ResponsiveVoice:** https://responsivevoice.org/

### Web Speech API Documentation

- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- Can I Use: https://caniuse.com/speech-synthesis

### Browser Compatibility

| Browser     | Support      | Notes         |
| ----------- | ------------ | ------------- |
| Chrome 33+  | ✅ Excellent | Cloud voices  |
| Edge 79+    | ✅ Good      | System voices |
| Firefox 49+ | ✅ Good      | System voices |
| Safari 14+  | ⚠️ Limited   | macOS voices  |

---

## Success Indicators

After applying fixes, you should see:

✅ **Console shows:**

```
[TTS] ✓ Found preferred voice: Google বাংলা (bn-BD)
✓ বাংলা (bn): Available
```

✅ **System displays:**

- Warning message disappears
- Bangla text pronounces correctly
- Token "A001" and Counter "3" are announced in Bangla

✅ **Audio plays:**

- Clear Bangla pronunciation
- No garbled or skipped text
- Smooth announcement from start to finish

---

**Last Updated:** May 2026  
**System Version:** 2.0.0 Professional  
**Compatibility:** All modern browsers with Web Speech API
