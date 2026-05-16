# Notification Sound Guide

Since audio files cannot be included in text format, you'll need to add your own notification sound.

## Quick Setup

### Option 1: Use a Simple Beep Sound

Create a simple notification sound using online tools:

1. Visit: https://www.freesound.org/
2. Search for "notification beep" or "ding"
3. Download a short (1-2 second) sound file
4. Save as `notification.mp3` in this folder

### Option 2: Create Your Own

Use audio editing software like Audacity:

1. Generate a short tone (1000Hz, 0.5 seconds)
2. Add fade in/out effects
3. Export as MP3, WAV, or OGG
4. Save as `notification.mp3` in this folder

### Option 3: Use Text-to-Speech

Generate a custom notification phrase:

1. Use Google Translate or similar TTS service
2. Generate audio for "Attention" or similar
3. Download and save in this folder

### Option 4: No Sound (Silent Mode)

If you don't want notification sounds:

1. Set `ENABLE_NOTIFICATION_SOUND=false` in `.env`
2. Or disable it in the control panel UI

## Supported Audio Formats

- MP3 (recommended)
- WAV
- OGG
- M4A

## File Naming

The default expected filename is:

```
notification.mp3
```

To use a different filename, update `config.js`:

```javascript
notification: {
  enabled: true,
  soundFile: './assets/your-custom-sound.mp3',
  volume: 0.5,
  duration: 1000,
}
```

## Sound Requirements

For best results:

- **Duration**: 0.5 - 2 seconds
- **Volume**: Not too loud (will be adjusted by volume setting)
- **Format**: MP3 for best compatibility
- **Bit rate**: 128-192 kbps
- **Sample rate**: 44.1 kHz

## Free Sound Resources

- [Freesound.org](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [Notification Sounds](https://notificationsounds.com/)
- [Mixkit](https://mixkit.co/free-sound-effects/)

## Testing

After adding your sound file:

1. Open the application
2. Enable "Notification Sound" in the control panel
3. Click "Announce Now"
4. You should hear the notification before the TTS announcement

## Troubleshooting

**Sound not playing?**

- Check file exists in `assets/` folder
- Verify filename matches config
- Check browser console for errors
- Try different audio format
- Ensure browser audio is not muted

**Sound too loud/quiet?**

- Adjust volume in control panel
- Or edit audio file to adjust base volume
- Or modify `volume` setting in `config.js`
