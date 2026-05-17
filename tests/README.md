# TTS Test Files

This folder contains test files for the Multilingual TTS system, specifically focusing on Microsoft Edge TTS (Azure Neural Voices).

## Files

### 1. `edgeTTS.html` - Banking Token Announcement System

Production-ready banking token announcement system with multilingual support.

**Features:**

- ✅ Professional banking interface
- ✅ Real-time token announcements
- ✅ Support for 4 languages: English, Bangla, French, Japanese
- ✅ Visual feedback and disabled states
- ✅ Error handling with user-friendly messages
- ✅ Optimized text formatting for each language

**Recent Improvements:**

- Fixed Bangla pronunciation by spacing out characters for better TTS clarity
- Corrected Bangla spelling: "টোকেন নম্বর" (not "নাম্বার")
- Added Japanese text formatting with 「」 quotes for clarity
- Improved error handling with detailed console logs
- Added button disabled states and visual feedback
- Optimized speech rate for each language (-10% for Bangla for better clarity)
- Added proper sentence endings (periods for Western languages, "।" for Bangla)
- Prevents multiple simultaneous announcements

**Usage:**

1. Open `edgeTTS.html` in any modern web browser
2. Enter token number (e.g., A001, B234)
3. Enter counter number (e.g., 1, 2, 3)
4. Select language from dropdown
5. Click "Announce Token"
6. Check browser console (F12) for detailed logs

### 2. `tts-language-test.html` - Comprehensive Language Test Suite

Diagnostic and testing tool for all supported languages.

**Features:**

- ✅ Individual language testing
- ✅ Test all languages sequentially
- ✅ Real-time connection status monitoring
- ✅ Detailed test logs with timestamps
- ✅ Pass/Fail statistics
- ✅ Voice engine information for each language
- ✅ Beautiful modern UI with visual feedback
- ✅ Error diagnostics and troubleshooting

**Usage:**

1. Open `tts-language-test.html` in a web browser
2. Wait for initialization (connection status will show ✓ Online)
3. Test individual languages using the "Test [Language]" buttons
4. Or click "🧪 Test All Languages" to run sequential tests
5. Review test logs at the bottom for detailed results

**Recommended for:**

- Verifying all languages work correctly
- Debugging TTS issues
- Comparing voice quality across languages
- Testing custom token/counter combinations

### 3. `test.html` - Original Test File

Legacy test file for backward compatibility.

## Language Configurations

### English (en)

- **Voice:** en-US-JennyNeural
- **Rate:** Normal (0%)
- **Format:** "Token Number A001. Counter Number 5."

### Bangla (bn) - বাংলা

- **Voice:** bn-BD-NabanitaNeural
- **Rate:** Slower (-10%) for better clarity
- **Format:** "টোকেন নম্বর এ ১ ২ ৩। কাউন্টার নম্বর ৫।"
- **Special:** Characters spaced out for better pronunciation

### French (fr) - Français

- **Voice:** fr-FR-DeniseNeural
- **Rate:** Normal (0%)
- **Format:** "Numéro de jeton A123. Numéro de comptoir 5."

### Japanese (ja) - 日本語

- **Voice:** ja-JP-NanamiNeural
- **Rate:** Normal (0%)
- **Format:** "トークン番号「A123」。カウンター番号「5」。"
- **Special:** Uses 「」 quotes for better clarity

## Known Issues and Solutions

### Issue: "Failed to play announcement audio"

**Causes:**

- No internet connection (Edge TTS requires online access)
- Firewall blocking Microsoft Azure TTS services
- Browser blocking audio autoplay

**Solutions:**

- Check internet connection
- Allow audio autoplay in browser settings
- Check browser console (F12) for detailed error messages

### Issue: Bangla not pronouncing correctly

**Cause:** Characters not properly spaced for TTS engine

**Solution:** The current implementation spaces out characters automatically:

```javascript
"এ ১ ২ ৩" instead of "এ123"
```

### Issue: Audio plays too fast or too slow

**Solution:** Adjust the `rate` parameter in language config:

- Slower: "-20%"
- Normal: "+0%"
- Faster: "+20%"

## Testing Checklist

Before deployment, verify:

- [ ] English announcements clear and natural
- [ ] Bangla characters pronounced correctly
- [ ] French accent and pronunciation accurate
- [ ] Japanese characters clear with proper pauses
- [ ] Numbers pronounced correctly in all languages
- [ ] No console errors during playback
- [ ] Button states update correctly
- [ ] Error messages display properly
- [ ] Multiple announcements queue properly

## Browser Compatibility

**Fully Supported:**

- ✅ Google Chrome (latest)
- ✅ Microsoft Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

**Requirements:**

- Modern browser with ES6+ support
- Internet connection for Edge TTS
- Audio autoplay enabled

## Troubleshooting

### Open Browser Console

Press `F12` and check the Console tab for detailed logs:

- `[TTS] Starting announcement...` - Normal operation
- `[TTS] ✓ Announcement completed` - Success
- `[TTS] ✗ Error details:` - Error with full details

### Common Console Messages

**Success:**

```
[TTS] Starting announcement in bn
[TTS] Using voice: bn-BD-NabanitaNeural
[TTS] Text: টোকেন নম্বর এ ১ ২ ৩। কাউন্টার নম্বর ৫।
[TTS] ✓ Announcement completed successfully
```

**Error:**

```
[TTS] ✗ Error details: {message: "Network error", ...}
[TTS] Troubleshooting: Make sure you have an active internet connection.
```

## Development Notes

### Voice Names

Edge TTS uses specific voice names. Always use exact names from Microsoft Azure:

- ✅ Correct: `bn-BD-NabanitaNeural`
- ❌ Wrong: `bn-BD-Nabanita` or `bn-Nabanita-Neural`

### Text Formatting Best Practices

1. **Add periods/punctuation** for natural pauses
2. **Space out mixed alphanumeric** in Bangla/Japanese
3. **Use native punctuation** (। for Bangla, 。 for Japanese)
4. **Test with real-world examples** before deployment

### Future Improvements

- [ ] Add more languages (Arabic, Hindi, Spanish)
- [ ] Support offline TTS fallback
- [ ] Add voice selection options (male/female)
- [ ] Queue management for multiple announcements
- [ ] Volume and pitch controls
- [ ] Save user preferences in localStorage

## Support

For issues or questions:

1. Check browser console for error details
2. Review this README for common issues
3. Test with `tts-language-test.html` for diagnostics
4. Check internet connection and browser compatibility

## License

Same as parent project.
