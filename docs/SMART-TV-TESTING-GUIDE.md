# Smart TV Testing Guide

## Testing Checklist for Smart TV Audio Fix

Use this guide to systematically test the Smart TV audio functionality.

### Pre-Test Setup

**Equipment Needed:**

- Android Smart TV or Google TV device
- Internet connection (WiFi or Ethernet)
- TV remote control

**Software Requirements:**

- Modern web browser on Smart TV (Chrome-based preferred)
- Access to the application URL

---

## Test Cases

### Test 1: Initial Load & Detection

**Objective**: Verify Smart TV detection and UI adaptation

**Steps:**

1. Open the application URL in Smart TV browser
2. Wait for page to fully load

**Expected Results:**

- ✅ Page loads completely
- ✅ Visual interface displays correctly
- ✅ Message appears: "🔊 Smart TV Detected: Click 'Announce' to enable audio"
- ✅ Announce button has blue pulsing animation
- ✅ Button text shows: "🔊 Enable Audio & Announce"
- ✅ Browser console shows: `[TTS] Smart TV detected`

**Pass/Fail:** ****\_\_\_****

---

### Test 2: Audio Unlock

**Objective**: Verify audio unlock on first user interaction

**Steps:**

1. Click the pulsing "Enable Audio & Announce" button
2. Wait for audio unlock process

**Expected Results:**

- ✅ Success message appears: "✓ Audio enabled! Making announcement..."
- ✅ Pulsing animation stops
- ✅ Button text changes to: "📢 Make Announcement"
- ✅ Test announcement plays through TV speakers
- ✅ Browser console shows: `[TTS] ✓ Audio unlocked successfully`
- ✅ Console shows: `[TTS] AudioContext resumed`

**Pass/Fail:** ****\_\_\_****

---

### Test 3: TTS Audio Playback

**Objective**: Verify speech synthesis works correctly

**Steps:**

1. Enter token number: "A123"
2. Enter counter number: "5"
3. Click "Make Announcement"
4. Listen for audio output

**Expected Results:**

- ✅ Audio plays through TV speakers
- ✅ Speech is clear and understandable
- ✅ Token number pronounced digit-by-digit: "A, 1, 2, 3"
- ✅ Counter number pronounced: "5"
- ✅ No audio glitches or cutoffs
- ✅ Volume is adequate

**Pass/Fail:** ****\_\_\_****

---

### Test 4: Multiple Announcements

**Objective**: Verify queue processing works reliably

**Steps:**

1. Make first announcement (Token: "10", Counter: "1")
2. Immediately make second announcement (Token: "11", Counter: "2")
3. Make third announcement (Token: "12", Counter: "3")

**Expected Results:**

- ✅ All three announcements play in order
- ✅ No audio overlap
- ✅ Proper delays between announcements
- ✅ No queue failures
- ✅ Queue count updates correctly

**Pass/Fail:** ****\_\_\_****

---

### Test 5: Multi-Language Support

**Objective**: Verify different languages work on Smart TV

**Steps:**

1. Test English: Token "25", Counter "3"
2. Switch to Bangla and test: Token "২৫", Counter "৩"
3. Switch to French and test: Token "25", Counter "3"
4. Switch back to English

**Expected Results:**

- ✅ All languages produce audio output
- ✅ Language switches work smoothly
- ✅ Appropriate voices used for each language
- ✅ No errors in console
- ✅ Display text updates correctly

**Pass/Fail:** ****\_\_\_****

---

### Test 6: Voice Settings

**Objective**: Verify voice customization works on Smart TV

**Steps:**

1. Adjust speech rate to 0.8 (slower)
2. Make announcement
3. Adjust speech rate to 1.2 (faster)
4. Make announcement
5. Change gender from Female to Male
6. Make announcement

**Expected Results:**

- ✅ Rate changes are applied correctly
- ✅ Slower speech is noticeably slower
- ✅ Faster speech is noticeably faster
- ✅ Gender change produces different voice (if available)
- ✅ All settings persist between announcements

**Pass/Fail:** ****\_\_\_****

---

### Test 7: Page Refresh & Re-unlock

**Objective**: Verify audio unlock persists correctly

**Steps:**

1. Refresh the browser page (reload)
2. Wait for page to load
3. Observe unlock prompt
4. Click button to unlock again
5. Make announcement

**Expected Results:**

- ✅ Unlock prompt appears again after refresh
- ✅ Button shows pulsing animation
- ✅ Audio unlock works on button click
- ✅ Announcement plays successfully
- ✅ No persistent errors

**Pass/Fail:** ****\_\_\_****

---

### Test 8: Long Session Stability

**Objective**: Verify system stability over extended use

**Steps:**

1. Make 10 announcements over 5 minutes
2. Leave browser open for 10 minutes
3. Make additional announcement
4. Monitor for any degradation

**Expected Results:**

- ✅ All announcements play successfully
- ✅ No memory leaks (check Task Manager if available)
- ✅ No audio dropouts over time
- ✅ System remains responsive
- ✅ No accumulated errors in console

**Pass/Fail:** ****\_\_\_****

---

### Test 9: Error Recovery

**Objective**: Verify system handles errors gracefully

**Steps:**

1. Disable internet connection temporarily
2. Try to make announcement
3. Re-enable internet
4. Make another announcement

**Expected Results:**

- ✅ Error message displayed when offline
- ✅ System doesn't crash
- ✅ Audio works again when back online
- ✅ No permanent state corruption
- ✅ Console shows helpful error messages

**Pass/Fail:** ****\_\_\_****

---

### Test 10: TV Remote Navigation

**Objective**: Verify TV remote controls work with UI

**Steps:**

1. Use TV remote to navigate between UI elements
2. Use remote to change language dropdown
3. Use remote to adjust sliders
4. Use remote to click buttons

**Expected Results:**

- ✅ All UI elements are accessible via remote
- ✅ Focus indicators are visible
- ✅ Navigation is smooth and predictable
- ✅ Buttons respond to remote "Enter/OK" button
- ✅ No navigation dead-ends

**Pass/Fail:** ****\_\_\_****

---

## Console Diagnostic Commands

Run these commands in browser console (F12) to diagnose issues:

```javascript
// Check if Smart TV detected
console.log("Smart TV:", app.ttsEngine.isSmartTV);

// Check audio unlock status
console.log("Audio Unlocked:", app.ttsEngine.audioUnlocked);

// Check AudioContext state
console.log("AudioContext State:", app.ttsEngine.audioContext?.state);

// Check available voices
console.log("Voices:", app.ttsEngine.voices.length);

// Get queue status
console.log("Queue Status:", app.ttsEngine.getQueueStatus());

// Manual audio unlock (if needed)
app.ttsEngine
  .unlockAudio()
  .then((result) => console.log("Unlock Result:", result));

// Run diagnostic test
document.getElementById("diagnosticBtn").click();
```

---

## Performance Benchmarks

Record these values during testing:

| Metric                        | Target       | Actual   | Pass/Fail |
| ----------------------------- | ------------ | -------- | --------- |
| Page Load Time                | < 3 seconds  | **\_\_** | **\_**    |
| Audio Unlock Time             | < 1 second   | **\_\_** | **\_**    |
| First Announcement Delay      | < 2 seconds  | **\_\_** | **\_**    |
| Subsequent Announcement Delay | < 1 second   | **\_\_** | **\_**    |
| Language Switch Time          | < 500ms      | **\_\_** | **\_**    |
| Queue Processing (10 items)   | < 30 seconds | **\_\_** | **\_**    |
| Memory Usage (after 1 hour)   | < 100MB      | **\_\_** | **\_**    |

---

## Known Issues & Workarounds

### Issue: Audio Not Playing

**Workaround**:

1. Refresh page
2. Click unlock button again
3. Check TV volume

### Issue: Voice Quality Poor

**Workaround**:

1. Use English for best quality
2. Slow down speech rate to 0.9
3. Ensure good internet connection

### Issue: Remote Not Working Well

**Workaround**:

1. Use wireless mouse/keyboard if available
2. Try different browser on TV
3. Check for browser updates

---

## Test Summary

**Date:** ******\_\_\_******  
**Tester:** ******\_\_\_******  
**TV Model:** ******\_\_\_******  
**Browser:** ******\_\_\_******  
**Browser Version:** ******\_\_\_******

**Tests Passed:** **\_** / 10  
**Tests Failed:** **\_** / 10  
**Overall Status:** ⬜ PASS ⬜ FAIL ⬜ NEEDS REVIEW

**Notes:**

```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

**Recommended Action:**
⬜ Deploy to Production  
⬜ Fix Issues and Retest  
⬜ Request Technical Support

---

## Troubleshooting Contact

**For Issues:**

1. Check console logs and screenshot
2. Note exact TV model and browser version
3. Document steps to reproduce
4. Review [SMART-TV-AUDIO-FIX.md](SMART-TV-AUDIO-FIX.md)
5. Contact IT support with above information

**Quick Links:**

- [Smart TV Quick Setup](SMART-TV-QUICK-SETUP.md)
- [Technical Details](SMART-TV-AUDIO-FIX.md)
- [API Documentation](API.md)
