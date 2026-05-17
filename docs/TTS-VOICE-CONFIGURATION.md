# TTS Voice Configuration Guide

This document explains the Text-to-Speech (TTS) configuration parameters used in the Banking Token Announcement System.

## Overview

Each language in the system has a `tts` configuration object that controls how the voice synthesis engine pronounces announcements. Understanding these parameters helps you fine-tune the voice output for optimal clarity in banking environments.

---

## Configuration Parameters

### 1. `voiceURI` - Voice Uniform Resource Identifier

**What it is:**

- A unique identifier string for a specific voice profile
- Acts like a "voice profile ID" for voices installed on the system
- Each TTS engine (Microsoft, Google, etc.) has its own voice URIs

**Example:**

```javascript
voiceURI: "Microsoft Zira - English (United States)";
```

**Purpose:**

- Identifies the exact voice to use when multiple voices are available
- Different browsers and operating systems have different voice URIs

---

### 2. `rate` - Speech Rate/Speed

**What it is:**

- Controls how fast or slow the voice speaks
- Measured as a multiplier of normal speech speed

**Range:** `0.1` to `10` (practical range: `0.5` to `2.0`)

**Values:**

- `0.5` = Very slow (50% of normal speed)
- `0.6` = Slightly slow (60% of normal speed) - **Recommended for announcements**
- `1.0` = Normal speed (default)
- `1.5` = 50% faster than normal
- `2.0` = Double speed (very fast)

**Example:**

```javascript
rate: 0.6; // Slower, clearer speech for banking announcements
```

**Use Cases:**

- **Slower (0.5-0.8)**: Banking announcements, elderly audiences, noisy environments
- **Normal (1.0)**: General purpose
- **Faster (1.2-1.5)**: Quick notifications, experienced users

---

### 3. `pitch` - Voice Pitch/Tone

**What it is:**

- Controls how high or low the voice sounds
- Similar to adjusting bass/treble on audio equipment

**Range:** `0` to `2.0`

**Values:**

- `0.5` = Lower pitch (deeper, bass-like voice)
- `1.0` = Normal pitch (default, natural voice)
- `1.5` = Higher pitch (treble-like voice)
- `2.0` = Very high pitch

**Example:**

```javascript
pitch: 1.0; // Natural, normal pitch
```

**Use Cases:**

- **Lower (0.7-0.9)**: Male voices, authoritative tone
- **Normal (1.0)**: Default, natural sound
- **Higher (1.1-1.3)**: Female voices, attention-grabbing

---

### 4. `volume` - Speech Volume/Loudness

**What it is:**

- Controls how loud the speech output is
- Relative to the system's master volume

**Range:** `0` to `1.0`

**Values:**

- `0.1` = Very quiet (10% volume)
- `0.5` = Half volume
- `0.8` = 80% volume
- `1.0` = Maximum volume (default)

**Example:**

```javascript
volume: 1.0; // Full volume
```

**Note:**

- This is relative to the user's system volume
- `1.0` doesn't necessarily mean "loud" - it means "use full TTS engine volume"

---

### 5. `preferredVoices` - Voice Priority List

**What it is:**

- An array of voice names the system should try to use
- Voices are tried in order until one is found installed on the system
- Provides fallback options for cross-platform compatibility

**Format:** Array of strings

```javascript
preferredVoices: [
  "Microsoft Zira - English (United States)", // 1st choice
  "Microsoft David - English (United States)", // 2nd choice
  "Google US English", // 3rd choice (fallback)
];
```

**Why it's needed:**

- Different operating systems have different voices installed:
  - **Windows**: Microsoft voices (Zira, David, etc.)
  - **macOS**: Apple voices (Samantha, Alex, etc.)
  - **Chrome/Edge**: Google voices + system voices
  - **Linux**: eSpeak, Festival voices
- The system tries each voice in the list until it finds an installed one

**Example for Chinese:**

```javascript
preferredVoices: [
  "Microsoft Huihui - Chinese (Simplified, PRC)", // Primary choice
  "Microsoft Kangkang - Chinese (Simplified, PRC)", // Alternative
  "Google 普通话（中国大陆）", // Google fallback
  "Chinese China", // Generic fallback
];
```

---

## Complete Example

Here's a complete TTS configuration for Chinese (Simplified):

```javascript
zh: {
  code: 'zh',
  name: 'Chinese',
  displayName: '中文',
  locale: 'zh-CN',
  direction: 'ltr',
  labels: {
    tokenNumber: '号码牌',
    counterNumber: '柜台号',
    pleaseGoTo: '请前往',
    thankYou: '谢谢',
  },
  tts: {
    voice: 'zh-CN',                                     // Locale identifier
    voiceURI: 'Microsoft Huihui - Chinese (Simplified, PRC)',  // Primary voice URI
    rate: 1.0,                                          // Normal speed
    pitch: 1.0,                                         // Normal pitch
    volume: 1.0,                                        // Full volume
    preferredVoices: [
      'Microsoft Huihui - Chinese (Simplified, PRC)',   // Try this first
      'Microsoft Kangkang - Chinese (Simplified, PRC)', // Then this
      'Google 普通话（中国大陆）',                       // Then this
      'Chinese China',                                  // Last resort
    ],
  },
}
```

**When announcing token "A023":**

- System speaks: "号码牌 A ... 0 ... 2 ... 3, 柜台号 ..."
- At normal speed (`rate: 1.0`)
- Using the first available Chinese voice from the preferred list
- At normal pitch and full volume
- Each character pronounced individually with pauses

---

## Practical Usage in Banking

### Recommended Settings for Clear Announcements

```javascript
// For banking announcements - prioritize clarity
tts: {
  rate: 0.6,    // 40% slower than normal - easier to understand
  pitch: 1.0,   // Natural pitch
  volume: 1.0,  // Full volume
}
```

### Language-Specific Adjustments

Different languages may benefit from different settings:

**English:**

```javascript
rate: 0.6,   // Slower for clarity
pitch: 1.0,  // Natural
```

**Bangla:**

```javascript
rate: 0.9,   // Slightly slower (Bangla TTS tends to be fast)
pitch: 1.0,  // Natural
```

**Arabic:**

```javascript
rate: 1.0,   // Normal (Arabic pronunciation is naturally slower)
pitch: 1.0,  // Natural
```

---

## Customization in UI

Users can override these settings through the control panel:

1. **Rate Slider**: Adjust speech speed (0.5 - 2.0)
2. **Pitch Slider**: Adjust voice tone (0.5 - 2.0)
3. **Volume Slider**: Adjust loudness (0.1 - 1.0)
4. **Gender Selection**: Automatically applies preset rate/pitch values

These UI controls override the default configuration values in real-time.

---

## Voice Installation

If a preferred voice is not found:

### Windows

1. Go to **Settings** → **Time & Language** → **Speech**
2. Click **Add voices**
3. Search for desired language (e.g., "Bangla", "Arabic", "Chinese")
4. Install the voice pack
5. Restart your browser

### macOS

1. Go to **System Preferences** → **Accessibility** → **Spoken Content**
2. Click **System Voice** → **Manage Voices**
3. Download desired language voices

### Linux

```bash
# Install eSpeak voices
sudo apt-get install espeak espeak-data

# Install Festival voices
sudo apt-get install festival festival-voices
```

### Browser-Based (Google Chrome)

- Chrome includes built-in Google voices for many languages
- No installation required - voices download automatically

---

## Troubleshooting

### Voice Not Speaking

- Check if a voice is installed for the selected language
- Run the **Voice Diagnostic** button in the control panel
- Check browser console for voice availability messages

### Speech Too Fast/Slow

- Adjust the `rate` parameter in config or use the UI slider
- Banking environments typically benefit from `rate: 0.6` to `0.8`

### Wrong Language Voice

- Check the `preferredVoices` array order
- Ensure language-specific voices are installed
- The system will fall back to the first available voice if none match

---

## References

- **Web Speech API**: [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- **SpeechSynthesisUtterance**: [API Reference](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance)
- **Voice Installation Guides**: See `BANGLA-TTS-TROUBLESHOOTING.md`

---

## Summary

| Parameter         | Purpose                   | Range    | Banking Recommendation             |
| ----------------- | ------------------------- | -------- | ---------------------------------- |
| `voiceURI`        | Identifies specific voice | String   | Primary voice name                 |
| `rate`            | Speech speed              | 0.1 - 10 | **0.6 - 0.8** (slower for clarity) |
| `pitch`           | Voice tone                | 0 - 2    | **1.0** (natural)                  |
| `volume`          | Loudness                  | 0 - 1    | **1.0** (full)                     |
| `preferredVoices` | Voice fallback list       | Array    | 3-4 alternatives for compatibility |

**Key Takeaway:** For banking announcements, prioritize **clarity over speed**. Use slower rates (0.6-0.8) and ensure multiple voice fallbacks for cross-platform compatibility.
