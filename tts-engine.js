/**
 * TTS Engine - Text-to-Speech Engine with Multi-language Support
 * Handles voice synthesis, queue management, and language-specific announcements
 */

class TTSEngine {
  constructor(config = CONFIG) {
    this.config = config;
    this.currentLanguage = config.defaultLanguage;
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.queue = [];
    this.isProcessing = false;
    this.currentUtterance = null;
    this.eventHandlers = {};
    this.voiceSettings = {
      gender: 'female',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
    };
    
    // Audio unlock state for Smart TV compatibility
    this.audioUnlocked = false;
    this.audioContext = null;
    this.isSmartTV = this.detectSmartTV();
    this.audioTestPending = false;

    this.init();
  }

  /**
   * Detect if running on Smart TV browser
   */
  detectSmartTV() {
    const ua = navigator.userAgent.toLowerCase();
    const isTV = /smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast|nettv|tv|webos|web0s/i.test(ua);
    const isAndroidTV = /android.*tv|android.*television/i.test(ua);
    const isTizen = /tizen/i.test(ua);
    const isWebOS = /webos|web0s/i.test(ua);
    
    console.log('[TTS] Device Detection:', {
      isTV,
      isAndroidTV,
      isTizen,
      isWebOS,
      userAgent: ua.substring(0, 100)
    });
    
    return isTV || isAndroidTV || isTizen || isWebOS;
  }

  /**
   * Initialize Audio Context for Smart TV compatibility
   */
  initAudioContext() {
    if (!this.audioContext) {
      try {
        // Create AudioContext for better audio control
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioContext = new AudioContext();
          console.log('[TTS] AudioContext created, state:', this.audioContext.state);
        }
      } catch (error) {
        console.warn('[TTS] AudioContext not available:', error);
      }
    }
    return this.audioContext;
  }

  /**
   * Unlock audio for Smart TV browsers (requires user interaction)
   */
  async unlockAudio() {
    if (this.audioUnlocked) {
      console.log('[TTS] Audio already unlocked');
      return true;
    }

    console.log('[TTS] Unlocking audio for Smart TV...');
    
    try {
      // Method 1: Resume AudioContext
      if (!this.audioContext) {
        this.initAudioContext();
      }
      
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('[TTS] AudioContext resumed, state:', this.audioContext.state);
      }

      // Method 2: Play silent audio to unlock audio playback
      const silentAudio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4Qd8HxBAAAAAAD/+xDEAAPAAAGkAAAAIAAANIAAAARMQU1FMy4xMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+xDEHAPAAAGkAAAAIAAANIAAAARMQU1FMy4xMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+xDEHAPAAAGkAAAAIAAANIAAAARMQU1FMy4xMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==');
      silentAudio.volume = 0.01;
      
      try {
        await silentAudio.play();
        silentAudio.pause();
        silentAudio.currentTime = 0;
        console.log('[TTS] Silent audio played successfully');
      } catch (err) {
        console.warn('[TTS] Silent audio play failed:', err.message);
      }

      // Method 3: Test speechSynthesis
      if (this.synth) {
        // Cancel any pending speech
        this.synth.cancel();
        
        // Speak a very short silent utterance to unlock
        const testUtterance = new SpeechSynthesisUtterance(' ');
        testUtterance.volume = 0.01;
        testUtterance.rate = 10;
        this.synth.speak(testUtterance);
        
        // Wait a bit for it to process
        await this.delay(100);
        this.synth.cancel();
        
        console.log('[TTS] speechSynthesis test completed');
      }

      this.audioUnlocked = true;
      this.triggerEvent('audioUnlocked', { isSmartTV: this.isSmartTV });
      console.log('[TTS] ✓ Audio unlocked successfully');
      return true;
      
    } catch (error) {
      console.error('[TTS] Audio unlock failed:', error);
      this.audioUnlocked = false;
      return false;
    }
  }

  /**
   * Initialize the TTS engine
   */
  async init() {
    try {
      // Initialize AudioContext
      this.initAudioContext();
      
      // Load voices
      await this.loadVoices();

      // Set up event listeners
      this.synth.addEventListener('voiceschanged', () => {
        this.loadVoices();
      });

      // Log Smart TV detection
      if (this.isSmartTV) {
        console.log('[TTS] ⚠ Smart TV detected - Audio unlock will be required before first announcement');
        console.log('[TTS] User interaction (button click) needed to enable audio playback');
      }

      this.log('TTS Engine initialized successfully');
    } catch (error) {
      console.error('TTS Engine initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load available voices
   */
  loadVoices() {
    return new Promise((resolve) => {
      this.voices = this.synth.getVoices();

      if (this.voices.length === 0) {
        // Voices might not be loaded yet, wait a bit
        setTimeout(() => {
          this.voices = this.synth.getVoices();
          this.log(`Loaded ${this.voices.length} voices`);
          resolve(this.voices);
        }, 100);
      } else {
        this.log(`Loaded ${this.voices.length} voices`);
        resolve(this.voices);
      }
    });
  }

  /**
   * Get the best matching voice for a language
   */
  getVoiceForLanguage(languageCode) {
    const langConfig = this.config.languages[languageCode];
    if (!langConfig) {
      console.warn(`Language ${languageCode} not found in config`);
      return this.voices[0] || null;
    }

    const preferredVoices = langConfig.tts.preferredVoices;
    const locale = langConfig.locale;

    console.log(`[TTS] Looking for voice for language: ${languageCode} (${locale})`);
    console.log(`[TTS] Preferred voices:`, preferredVoices);

    // Try to find a voice from the preferred list
    for (const preferredName of preferredVoices) {
      const voice = this.voices.find((v) =>
        v.name.toLowerCase().includes(preferredName.toLowerCase())
      );
      if (voice) {
        console.log(`[TTS] ✓ Found preferred voice: ${voice.name} (${voice.lang})`);
        return voice;
      }
    }

    // Try to find a voice by locale (exact match)
    const localeVoice = this.voices.find((v) => v.lang === locale);
    if (localeVoice) {
      console.log(`[TTS] ✓ Found exact locale voice: ${localeVoice.name} (${localeVoice.lang})`);
      return localeVoice;
    }

    // Try to find a voice by locale prefix (e.g., bn-BD matches bn-IN)
    const localePrefix = locale.split('-')[0];
    const localePrefixVoice = this.voices.find((v) => 
      v.lang.toLowerCase().startsWith(localePrefix.toLowerCase())
    );
    if (localePrefixVoice) {
      console.log(`[TTS] ✓ Found locale prefix voice: ${localePrefixVoice.name} (${localePrefixVoice.lang})`);
      return localePrefixVoice;
    }

    // Try to find a voice by language code
    const langVoice = this.voices.find((v) =>
      v.lang.toLowerCase().startsWith(languageCode.toLowerCase())
    );
    if (langVoice) {
      console.log(`[TTS] ✓ Found language voice: ${langVoice.name} (${langVoice.lang})`);
      return langVoice;
    }

    // No suitable voice found - log warning
    console.warn(`[TTS] ⚠ No ${langConfig.displayName} voice found!`);
    console.warn(`[TTS] ⚠ Bangla text may not be pronounced correctly with fallback voice.`);
    console.warn(`[TTS] Available voices:`, this.voices.map(v => `${v.name} (${v.lang})`));
    
    // Trigger event for UI notification
    this.triggerEvent('voiceNotFound', { 
      language: languageCode, 
      languageName: langConfig.displayName,
      locale: locale
    });

    // Fallback to first available voice
    const fallbackVoice = this.voices[0] || null;
    console.log(`[TTS] Using fallback voice: ${fallbackVoice?.name || 'None'}`);
    return fallbackVoice;
  }

  /**
   * Set the current language
   */
  setLanguage(languageCode) {
    if (!this.config.languages[languageCode]) {
      console.error(`Language ${languageCode} not supported`);
      return false;
    }

    this.currentLanguage = languageCode;
    this.log(`Language set to: ${languageCode}`);
    this.triggerEvent('languageChanged', { language: languageCode });
    return true;
  }

  /**
   * Set voice settings (gender, rate, pitch, volume)
   */
  setVoiceSettings(settings = {}) {
    this.voiceSettings = {
      ...this.voiceSettings,
      ...settings,
    };

    // Apply gender-specific presets if available
    if (settings.gender && this.config.voice.genderOptions[settings.gender]) {
      const genderPreset = this.config.voice.genderOptions[settings.gender];
      this.voiceSettings.rate = genderPreset.rate;
      this.voiceSettings.pitch = genderPreset.pitch;
    }

    this.log('Voice settings updated:', this.voiceSettings);
  }

  /**
   * Convert a token or counter number into digit-by-digit format with pauses
   * Example: "23" → "2, , 3" or "A024" → "A, , 0, , 2, , 4"
   * The commas create natural pauses in speech synthesis
   */
  convertToDigitByDigit(value) {
    // Convert to string and split into individual characters
    const str = String(value);
    const chars = str.split('');
    
    // Join characters with double commas for a natural pause
    // The pause pattern ", , " creates a brief but clear separation
    return chars.join(', , ');
  }

  /**
   * Generate announcement text for token and counter
   * Now supports alphanumeric and multilingual formats (A001, B232, ক ১৫, etc.)
   * Pronounces each digit/character individually with pauses for clarity
   */
  generateAnnouncementText(tokenNumber, counterNumber) {
    const langConfig = this.config.languages[this.currentLanguage];
    const labels = langConfig.labels;

    // Convert to string if not already (supports text-based tokens)
    const tokenStr = String(tokenNumber);
    const counterStr = String(counterNumber);

    // Convert tokens and counters to digit-by-digit format with pauses
    const tokenDigitByDigit = this.convertToDigitByDigit(tokenStr);
    const counterDigitByDigit = this.convertToDigitByDigit(counterStr);

    // Build announcement text with digit-by-digit pronunciation
    const text = `${labels.tokenNumber} ${tokenDigitByDigit}, ${labels.counterNumber} ${counterDigitByDigit}`;

    return text;
  }

  /**
   * Announce token and counter information
   */
  announce(tokenNumber, counterNumber, options = {}) {
    const text = this.generateAnnouncementText(tokenNumber, counterNumber);

    return this.speak(text, {
      ...options,
      metadata: {
        tokenNumber,
        counterNumber,
        type: 'announcement',
      },
    });
  }

  /**
   * Speak text using TTS
   */
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = this.getVoiceForLanguage(this.currentLanguage);
        const langConfig = this.config.languages[this.currentLanguage];

        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
          console.log(`[TTS] Using voice: ${voice.name} for "${text.substring(0, 50)}..."`);
        } else {
          console.error('[TTS] ✗ No voice available! Speech may fail.');
          // Set language even without voice to help browser choose
          utterance.lang = langConfig.locale;
        }

        // Apply voice settings
        utterance.rate =
          options.rate ||
          this.voiceSettings.rate ||
          langConfig.tts.rate ||
          1.0;
        utterance.pitch =
          options.pitch ||
          this.voiceSettings.pitch ||
          langConfig.tts.pitch ||
          1.0;
        utterance.volume =
          options.volume ||
          this.voiceSettings.volume ||
          langConfig.tts.volume ||
          1.0;

        // Event handlers
        utterance.onstart = () => {
          this.log(`Speaking: ${text}`);
          this.triggerEvent('start', { text, metadata: options.metadata });
        };

        utterance.onend = () => {
          this.log('Speech finished');
          this.triggerEvent('end', { text, metadata: options.metadata });
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('[TTS] Speech synthesis error:', event);
          console.error('[TTS] Error details:', {
            error: event.error,
            text: text,
            voice: voice?.name,
            lang: utterance.lang,
            language: this.currentLanguage
          });
          this.triggerEvent('error', { error: event, text, voice: voice?.name });
          
          // Provide helpful error message
          if (!voice) {
            console.error('[TTS] ✗ This error may be caused by missing language-specific voice.');
            console.error('[TTS] Solution: Install a Bangla/Bengali TTS voice for your browser/OS.');
          }
          
          reject(event);
        };

        // Add to queue
        this.addToQueue({
          utterance,
          text,
          options,
          resolve,
          reject,
        });
      } catch (error) {
        console.error('Error creating utterance:', error);
        reject(error);
      }
    });
  }

  /**
   * Add announcement to queue
   */
  addToQueue(item) {
    if (this.queue.length >= this.config.queue.maxQueueSize) {
      console.warn('Queue is full, removing oldest item');
      this.queue.shift();
    }

    this.queue.push(item);
    this.log(`Added to queue. Queue size: ${this.queue.length}`);

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Process announcement queue
   */
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    // Check audio unlock status for Smart TV
    if (this.isSmartTV && !this.audioUnlocked) {
      console.warn('[TTS] ⚠ Audio not unlocked yet - Smart TV requires user interaction');
      this.triggerEvent('audioLockDetected', { message: 'Click button to enable audio' });
      
      // Keep queue but don't process yet
      return;
    }

    this.isProcessing = true;
    this.log('Processing queue...');

    while (this.queue.length > 0) {
      const item = this.queue.shift();

      try {
        // Play notification sound if enabled
        if (this.config.notification.enabled) {
          await this.playNotificationSound();
        }

        // Wait for announcement delay
        await this.delay(this.config.queue.announcementDelay);

        // Resume AudioContext if needed (Smart TV fix)
        if (this.audioContext && this.audioContext.state === 'suspended') {
          try {
            await this.audioContext.resume();
            console.log('[TTS] AudioContext resumed before speech');
          } catch (err) {
            console.warn('[TTS] Could not resume AudioContext:', err);
          }
        }

        // Cancel any previous speech (Smart TV compatibility)
        if (this.synth.speaking) {
          console.log('[TTS] Canceling previous speech...');
          this.synth.cancel();
          await this.delay(100);
        }

        // Speak the utterance
        this.currentUtterance = item.utterance;
        console.log('[TTS] Speaking utterance with voice:', item.utterance.voice?.name);
        this.synth.speak(item.utterance);

        // Wait for speech to complete
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.warn('[TTS] Speech timeout - forcing completion');
            resolve();
          }, 30000); // 30 second timeout

          item.utterance.onend = () => {
            clearTimeout(timeout);
            item.resolve();
            resolve();
          };
          
          item.utterance.onerror = (event) => {
            clearTimeout(timeout);
            console.error('[TTS] Speech error:', event.error);
            
            // Don't reject on network errors for Smart TV
            if (this.isSmartTV && event.error === 'network') {
              console.warn('[TTS] Network error on Smart TV - continuing anyway');
              resolve();
            } else {
              item.reject(event);
              reject(event);
            }
          };
        });
        
        // Small delay between announcements for Smart TV
        if (this.isSmartTV) {
          await this.delay(300);
        }
        
      } catch (error) {
        console.error('Error processing queue item:', error);
      }
    }

    this.isProcessing = false;
    this.currentUtterance = null;
    this.log('Queue processing completed');
  }

  /**
   * Play notification sound before announcement
   */
  playNotificationSound() {
    return new Promise((resolve) => {
      try {
        const audio = new Audio(this.config.notification.soundFile);
        audio.volume = this.config.notification.volume;
        
        // Add autoplay attributes for Smart TV
        audio.autoplay = false;
        audio.preload = 'auto';

        audio.onended = () => resolve();
        audio.onerror = (e) => {
          console.warn('[TTS] Could not play notification sound:', e);
          resolve(); // Continue even if sound fails
        };

        // Explicit play with error handling for Smart TV
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('[TTS] Notification sound playing');
            })
            .catch((err) => {
              console.warn('[TTS] Audio playback failed:', err.message || err);
              if (this.isSmartTV) {
                console.warn('[TTS] Smart TV may require user interaction for audio');
              }
              resolve();
            });
        }

        // Fallback timeout
        setTimeout(resolve, this.config.notification.duration);
      } catch (error) {
        console.warn('[TTS] Notification sound error:', error);
        resolve();
      }
    });
  }

  /**
   * Stop current speech and clear queue
   */
  stop() {
    this.synth.cancel();
    this.queue = [];
    this.isProcessing = false;
    this.currentUtterance = null;
    this.log('TTS stopped and queue cleared');
    this.triggerEvent('stopped');
  }

  /**
   * Pause speech
   */
  pause() {
    if (this.synth.speaking) {
      this.synth.pause();
      this.log('TTS paused');
      this.triggerEvent('paused');
    }
  }

  /**
   * Resume speech
   */
  resume() {
    if (this.synth.paused) {
      this.synth.resume();
      this.log('TTS resumed');
      this.triggerEvent('resumed');
    }
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
      isSpeaking: this.synth.speaking,
      isPaused: this.synth.paused,
    };
  }

  /**
   * Register event handler
   */
  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  /**
   * Trigger event
   */
  triggerEvent(event, data = {}) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach((handler) => handler(data));
    }
  }

  /**
   * Utility: delay
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Logging utility
   */
  log(...args) {
    if (this.config.debug) {
      console.log('[TTS Engine]', ...args);
    }
  }

  /**
   * Get available voices for current language
   */
  getAvailableVoicesForLanguage(languageCode = this.currentLanguage) {
    const langConfig = this.config.languages[languageCode];
    if (!langConfig) return [];

    const locale = langConfig.locale;
    return this.voices.filter(
      (v) =>
        v.lang.startsWith(locale) ||
        v.lang.toLowerCase().startsWith(languageCode.toLowerCase())
    );
  }

  /**
   * List all available languages
   */
  getAvailableLanguages() {
    return Object.keys(this.config.languages).map((code) => ({
      code,
      name: this.config.languages[code].name,
      displayName: this.config.languages[code].displayName,
    }));
  }

  /**
   * Check if a voice is available for a specific language
   */
  isVoiceAvailableForLanguage(languageCode) {
    const langConfig = this.config.languages[languageCode];
    if (!langConfig) return false;

    const locale = langConfig.locale;
    const localePrefix = locale.split('-')[0];

    // Check if any voice matches the language
    const hasVoice = this.voices.some((v) => {
      const voiceLang = v.lang.toLowerCase();
      return voiceLang.startsWith(localePrefix.toLowerCase()) ||
             voiceLang.startsWith(languageCode.toLowerCase());
    });

    return hasVoice;
  }

  /**
   * Get diagnostic information about available voices
   */
  getDiagnosticInfo() {
    console.log('\n========== TTS DIAGNOSTIC INFO ==========');
    console.log(`Total voices available: ${this.voices.length}`);
    console.log('\nAll available voices:');
    
    this.voices.forEach((voice, index) => {
      console.log(`${index + 1}. ${voice.name}`);
      console.log(`   Language: ${voice.lang}`);
      console.log(`   Local: ${voice.localService}`);
      console.log(`   Default: ${voice.default}`);
    });

    console.log('\nLanguage Voice Status:');
    Object.keys(this.config.languages).forEach((code) => {
      const hasVoice = this.isVoiceAvailableForLanguage(code);
      const langConfig = this.config.languages[code];
      const status = hasVoice ? '✓' : '✗';
      console.log(`${status} ${langConfig.displayName} (${code}): ${hasVoice ? 'Available' : 'NOT AVAILABLE'}`);
    });

    console.log('\n========================================\n');

    return {
      totalVoices: this.voices.length,
      voices: this.voices.map(v => ({
        name: v.name,
        lang: v.lang,
        localService: v.localService,
        default: v.default
      })),
      languageSupport: Object.keys(this.config.languages).reduce((acc, code) => {
        acc[code] = this.isVoiceAvailableForLanguage(code);
        return acc;
      }, {})
    };
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TTSEngine;
}
