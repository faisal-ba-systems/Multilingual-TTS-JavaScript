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

    this.init();
  }

  /**
   * Initialize the TTS engine
   */
  async init() {
    try {
      // Load voices
      await this.loadVoices();

      // Set up event listeners
      this.synth.addEventListener('voiceschanged', () => {
        this.loadVoices();
      });

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

    // Try to find a voice from the preferred list
    for (const preferredName of preferredVoices) {
      const voice = this.voices.find((v) =>
        v.name.toLowerCase().includes(preferredName.toLowerCase())
      );
      if (voice) {
        this.log(`Found preferred voice: ${voice.name}`);
        return voice;
      }
    }

    // Try to find a voice by locale
    const localeVoice = this.voices.find((v) => v.lang.startsWith(locale));
    if (localeVoice) {
      this.log(`Found locale voice: ${localeVoice.name}`);
      return localeVoice;
    }

    // Try to find a voice by language code
    const langVoice = this.voices.find((v) =>
      v.lang.toLowerCase().startsWith(languageCode.toLowerCase())
    );
    if (langVoice) {
      this.log(`Found language voice: ${langVoice.name}`);
      return langVoice;
    }

    // Fallback to first available voice
    this.log('Using fallback voice');
    return this.voices[0] || null;
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
   * Generate announcement text for token and counter
   */
  generateAnnouncementText(tokenNumber, counterNumber) {
    const langConfig = this.config.languages[this.currentLanguage];
    const labels = langConfig.labels;
    const formatter = langConfig.numberFormatter;

    // Format numbers according to language
    const formattedToken = formatter(tokenNumber);
    const formattedCounter = formatter(counterNumber);

    // Build announcement text
    const text = `${labels.tokenNumber} ${formattedToken}, ${labels.counterNumber} ${formattedCounter}`;

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

        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          console.warn('No suitable voice found, using default');
        }

        // Apply voice settings
        const langConfig = this.config.languages[this.currentLanguage];
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
          console.error('Speech error:', event);
          this.triggerEvent('error', { error: event, text });
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

        // Speak the utterance
        this.currentUtterance = item.utterance;
        this.synth.speak(item.utterance);

        // Wait for speech to complete
        await new Promise((resolve, reject) => {
          item.utterance.onend = () => {
            item.resolve();
            resolve();
          };
          item.utterance.onerror = (event) => {
            item.reject(event);
            reject(event);
          };
        });
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

        audio.onended = () => resolve();
        audio.onerror = () => {
          console.warn('Could not play notification sound');
          resolve(); // Continue even if sound fails
        };

        audio.play().catch(() => {
          console.warn('Audio playback failed');
          resolve();
        });

        // Fallback timeout
        setTimeout(resolve, this.config.notification.duration);
      } catch (error) {
        console.warn('Notification sound error:', error);
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
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TTSEngine;
}
