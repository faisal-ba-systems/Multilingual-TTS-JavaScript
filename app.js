/**
 * Main Application - Banking TTS Announcement System
 */

class BankingTTSApp {
  constructor() {
    this.ttsEngine = null;
    this.currentLanguage = CONFIG.defaultLanguage;
    this.isInitialized = false;

    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('Initializing Banking TTS Application...');

      // Initialize TTS Engine
      this.ttsEngine = new TTSEngine(CONFIG);

      // Wait for voices to load
      await this.ttsEngine.loadVoices();

      // Set up UI
      this.setupUI();
      this.setupEventListeners();
      this.setupTTSEventHandlers();

      // Apply environment settings if available
      this.applyEnvironmentSettings();

      // Update display
      this.updateDisplay();
      this.updateSystemInfo();
      
      // Start datetime update
      this.startDateTimeUpdate();

      this.isInitialized = true;
      console.log('Application initialized successfully');

      // Show welcome message (or audio unlock prompt for Smart TV)
      if (this.ttsEngine.isSmartTV && !this.ttsEngine.audioUnlocked) {
        this.showAudioUnlockPrompt();
      } else {
        this.showMessage('System ready for announcements');
      }
    } catch (error) {
      console.error('Application initialization failed:', error);
      this.showMessage('System initialization failed', 'error');
    }
  }

  /**
   * Set up UI elements
   */
  setupUI() {
    // Get DOM elements
    this.elements = {
      // Display
      tokenLabel: document.getElementById('tokenLabel'),
      tokenValue: document.getElementById('tokenValue'),
      counterLabel: document.getElementById('counterLabel'),
      counterValue: document.getElementById('counterValue'),
      messageText: document.getElementById('messageText'),
      announcementCard: document.getElementById('announcementCard'),
      queueCount: document.getElementById('queueCount'),
      
      // DateTime display
      timeDisplay: document.getElementById('timeDisplay'),
      dateDisplay: document.getElementById('dateDisplay'),

      // Controls
      languageSelect: document.getElementById('languageSelect'),
      voiceGender: document.getElementById('voiceGender'),
      voiceRate: document.getElementById('voiceRate'),
      voicePitch: document.getElementById('voicePitch'),
      voiceVolume: document.getElementById('voiceVolume'),
      notificationSound: document.getElementById('notificationSound'),
      testToken: document.getElementById('testToken'),
      testCounter: document.getElementById('testCounter'),
      announceBtn: document.getElementById('announceBtn'),
      pauseBtn: document.getElementById('pauseBtn'),
      resumeBtn: document.getElementById('resumeBtn'),
      stopBtn: document.getElementById('stopBtn'),
      diagnosticBtn: document.getElementById('diagnosticBtn'),

      // System info
      voiceCount: document.getElementById('voiceCount'),
      currentVoice: document.getElementById('currentVoice'),
      systemStatus: document.getElementById('systemStatus'),

      // Panel controls
      togglePanelBtn: document.getElementById('togglePanelBtn'),
      panelContent: document.getElementById('panelContent'),

      // Value displays
      rateValue: document.getElementById('rateValue'),
      pitchValue: document.getElementById('pitchValue'),
      volumeValue: document.getElementById('volumeValue'),
    };
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Language selection
    this.elements.languageSelect.addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });

    // Voice settings
    this.elements.voiceGender.addEventListener('change', (e) => {
      this.updateVoiceSettings({ gender: e.target.value });
    });

    this.elements.voiceRate.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.elements.rateValue.textContent = value.toFixed(1);
      this.updateVoiceSettings({ rate: value });
    });

    this.elements.voicePitch.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.elements.pitchValue.textContent = value.toFixed(1);
      this.updateVoiceSettings({ pitch: value });
    });

    this.elements.voiceVolume.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.elements.volumeValue.textContent = value.toFixed(1);
      this.updateVoiceSettings({ volume: value });
    });

    // Notification sound toggle
    this.elements.notificationSound.addEventListener('change', (e) => {
      CONFIG.notification.enabled = e.target.checked;
    });

    // Announce button
    this.elements.announceBtn.addEventListener('click', async () => {
      // Unlock audio on first interaction for Smart TV
      if (this.ttsEngine.isSmartTV && !this.ttsEngine.audioUnlocked) {
        console.log('[App] Unlocking audio on user interaction...');
        const unlocked = await this.ttsEngine.unlockAudio();
        
        if (unlocked) {
          this.showMessage('\u2713 Audio enabled! Making announcement...', 'success', 2000);
          this.hideAudioUnlockPrompt();
        } else {
          this.showMessage('\u26a0 Could not enable audio. Please try again.', 'warning', 3000);
          return;
        }
      }
      
      this.makeTestAnnouncement();
    });

    // Queue controls
    this.elements.pauseBtn.addEventListener('click', () => {
      this.ttsEngine.pause();
      this.showMessage('System paused');
    });

    this.elements.resumeBtn.addEventListener('click', () => {
      this.ttsEngine.resume();
      this.showMessage('System resumed');
    });

    this.elements.stopBtn.addEventListener('click', () => {
      this.ttsEngine.stop();
      this.clearDisplay();
      this.showMessage('All announcements stopped');
    });

    // Diagnostic button
    this.elements.diagnosticBtn.addEventListener('click', () => {
      console.log('\n======================================');
      console.log('🔧 VOICE DIAGNOSTIC TEST');
      console.log('======================================\n');
      
      const diagnosticInfo = this.ttsEngine.getDiagnosticInfo();
      
      // Show user-friendly message
      const banglaAvailable = diagnosticInfo.languageSupport.bn;
      if (banglaAvailable) {
        this.showMessage('✓ All voices available! Check console for details.', 'success', 10000);
      } else {
        this.showMessage('⚠ Bangla voice not found! Check console for installation guide.', 'warning', 0);
        console.log('\n📋 BANGLA VOICE INSTALLATION GUIDE:');
        console.log('1. Windows: Settings > Time & Language > Speech > Add voices');
        console.log('2. Search for "Bangla" or "Bengali"');
        console.log('3. Install Microsoft Bangla (Bangladesh) or (India)');
        console.log('4. Restart your browser');
        console.log('\n💡 Alternative: Use Google Chrome (has built-in Bangla voice)');
        console.log('\n📖 Full guide: See BANGLA-TTS-TROUBLESHOOTING.md\n');
      }
      
      console.log('======================================\n');
    });

    // Panel toggle
    this.elements.togglePanelBtn.addEventListener('click', () => {
      this.togglePanel();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'enter':
            e.preventDefault();
            this.makeTestAnnouncement();
            break;
          case 'p':
            e.preventDefault();
            this.ttsEngine.pause();
            break;
          case 's':
            e.preventDefault();
            this.ttsEngine.stop();
            break;
        }
      }
    });
  }

  /**
   * Set up TTS event handlers
   */
  setupTTSEventHandlers() {
    this.ttsEngine.on('start', (data) => {
      console.log('Announcement started:', data);
      this.elements.systemStatus.textContent = 'Speaking...';
      this.updateQueueStatus();
    });

    this.ttsEngine.on('end', (data) => {
      console.log('Announcement ended:', data);
      this.elements.systemStatus.textContent = 'Ready';
      this.updateQueueStatus();

      // Auto-hide display after duration
      if (CONFIG.display.autoHide) {
        setTimeout(() => {
          if (this.ttsEngine.getQueueStatus().queueLength === 0) {
            this.clearDisplay();
          }
        }, CONFIG.display.displayDuration);
      }
    });

    this.ttsEngine.on('error', (data) => {
      console.error('TTS error:', data);
      this.elements.systemStatus.textContent = 'Error';
      this.showMessage('Announcement failed: ' + (data.error?.error || 'Unknown error'), 'error');
    });

    this.ttsEngine.on('voiceNotFound', (data) => {
      console.warn('Voice not found for language:', data);
      const message = `⚠ ${data.languageName} voice not installed. Text may not be pronounced correctly.`;
      this.showMessage(message, 'warning', 8000);
      
      // Show diagnostic info in console
      console.log('🔧 To fix this issue:');
      console.log('1. Install a Bangla/Bengali TTS voice for your browser/OS');
      console.log('2. Chrome: Voices are provided by your OS');
      console.log('3. Windows: Settings > Time & Language > Speech > Add voices');
      console.log('4. Or try using Google Chrome with online voices');
      
      // Run diagnostic
      this.ttsEngine.getDiagnosticInfo();
    });

    this.ttsEngine.on('languageChanged', (data) => {
      console.log('Language changed:', data);
      this.updateDisplay();
      this.updateSystemInfo();
    });

    this.ttsEngine.on('audioLockDetected', (data) => {
      console.warn('Audio lock detected on Smart TV:', data);
      this.showAudioUnlockPrompt();
    });

    this.ttsEngine.on('audioUnlocked', (data) => {
      console.log('Audio unlocked:', data);
      this.hideAudioUnlockPrompt();
      this.showMessage('\u2713 Audio enabled for Smart TV', 'success', 2000);
    });
  }

  /**
   * Change language
   */
  changeLanguage(languageCode) {
    if (this.ttsEngine.setLanguage(languageCode)) {
      this.currentLanguage = languageCode;
      this.updateDisplay();
      this.showMessage(`Language changed to ${languageCode.toUpperCase()}`);
    }
  }

  /**
   * Update voice settings
   */
  updateVoiceSettings(settings) {
    this.ttsEngine.setVoiceSettings(settings);
    this.updateSystemInfo();
  }

  /**
   * Make test announcement
   */
  async makeTestAnnouncement() {
    // Get token and counter values as text (supports alphanumeric formats)
    const token = this.elements.testToken.value.trim() || 'A1';
    const counter = this.elements.testCounter.value.trim() || '1';

    try {
      // Update display
      this.updateAnnouncementDisplay(token, counter);

      // Make announcement
      await this.ttsEngine.announce(token, counter);

      // Show success message
      this.showMessage('Announcement complete', 'success');
    } catch (error) {
      console.error('Announcement failed:', error);
      this.showMessage('Announcement failed', 'error');
    }
  }

  /**
   * Update announcement display
   */
  updateAnnouncementDisplay(tokenNumber, counterNumber) {
    const langConfig = CONFIG.languages[this.currentLanguage];
    const formatter = langConfig.numberFormatter;

    // Update values
    this.elements.tokenValue.textContent = formatter(tokenNumber);
    this.elements.counterValue.textContent = formatter(counterNumber);

    // Add highlight animation
    this.elements.announcementCard.classList.remove('highlight');
    setTimeout(() => {
      this.elements.announcementCard.classList.add('highlight');
    }, 10);

    // Remove highlight after duration
    setTimeout(() => {
      this.elements.announcementCard.classList.remove('highlight');
    }, CONFIG.display.highlightDuration);
  }

  /**
   * Update display labels based on current language
   */
  updateDisplay() {
    const langConfig = CONFIG.languages[this.currentLanguage];
    const labels = langConfig.labels;

    // Update labels
    this.elements.tokenLabel.textContent = labels.tokenNumber;
    this.elements.counterLabel.textContent = labels.counterNumber;

    // Update HTML lang attribute
    document.documentElement.lang = langConfig.code;
    document.documentElement.dir = langConfig.direction;
  }

  /**
   * Clear display
   */
  clearDisplay() {
    this.elements.tokenValue.textContent = '--';
    this.elements.counterValue.textContent = '--';
    this.elements.announcementCard.classList.remove('highlight');
    this.showMessage('Waiting for announcement...');
  }

  /**
   * Show message
   */
  showMessage(message, type = 'info', duration = 5000) {
    this.elements.messageText.textContent = message;
    this.elements.messageText.className = `message-${type}`;
    
    // Clear any existing timeout
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    
    // Auto-clear message after duration (if not permanent)
    if (duration > 0 && type !== 'error' && type !== 'warning') {
      this.messageTimeout = setTimeout(() => {
        this.elements.messageText.textContent = 'Ready for announcements...';
        this.elements.messageText.className = '';
      }, duration);
    }
  }

  /**
   * Show audio unlock prompt for Smart TV
   */
  showAudioUnlockPrompt() {
    const prompt = '\u{1F50A} Smart TV Detected: Click "Announce" to enable audio';
    this.showMessage(prompt, 'info', 0);
    
    // Add pulsing effect to announce button
    if (this.elements.announceBtn) {
      this.elements.announceBtn.classList.add('pulse-attention');
      this.elements.announceBtn.textContent = '\u{1F50A} Enable Audio & Announce';
    }
    
    console.log('[App] Audio unlock prompt displayed');
  }

  /**
   * Hide audio unlock prompt
   */
  hideAudioUnlockPrompt() {
    // Remove pulsing effect from announce button
    if (this.elements.announceBtn) {
      this.elements.announceBtn.classList.remove('pulse-attention');
      this.elements.announceBtn.textContent = '\u{1F4E2} Make Announcement';
    }
    
    console.log('[App] Audio unlock prompt hidden');
  }

  /**
   * Update queue status
   */
  updateQueueStatus() {
    const status = this.ttsEngine.getQueueStatus();
    this.elements.queueCount.textContent = status.queueLength;
  }

  /**
   * Update system information
   */
  updateSystemInfo() {
    // Voice count
    const voiceCount = this.ttsEngine.voices.length;
    this.elements.voiceCount.textContent = voiceCount;

    // Current voice
    const currentVoice = this.ttsEngine.getVoiceForLanguage(
      this.currentLanguage
    );
    this.elements.currentVoice.textContent = currentVoice
      ? currentVoice.name
      : 'Default';

    // System status
    const status = this.ttsEngine.getQueueStatus();
    if (status.isSpeaking) {
      this.elements.systemStatus.textContent = 'Speaking...';
    } else if (status.isPaused) {
      this.elements.systemStatus.textContent = 'Paused';
    } else if (status.queueLength > 0) {
      this.elements.systemStatus.textContent = 'Processing...';
    } else {
      this.elements.systemStatus.textContent = 'Ready';
    }
  }

  /**
   * Toggle control panel
   */
  togglePanel() {
    const isVisible = this.elements.panelContent.style.display !== 'none';

    if (isVisible) {
      this.elements.panelContent.style.display = 'none';
      this.elements.togglePanelBtn.querySelector('span').textContent = '▲';
    } else {
      this.elements.panelContent.style.display = 'block';
      this.elements.togglePanelBtn.querySelector('span').textContent = '▼';
    }
  }

  /**
   * Apply environment settings (from .env or URL params)
   */
  applyEnvironmentSettings() {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    const language = urlParams.get('lang') || urlParams.get('language');
    if (language && CONFIG.languages[language]) {
      this.changeLanguage(language);
      this.elements.languageSelect.value = language;
    }

    const gender = urlParams.get('gender');
    if (gender && ['male', 'female'].includes(gender)) {
      this.elements.voiceGender.value = gender;
      this.updateVoiceSettings({ gender });
    }

    const rate = parseFloat(urlParams.get('rate'));
    if (rate && rate >= 0.5 && rate <= 2) {
      this.elements.voiceRate.value = rate;
      this.elements.rateValue.textContent = rate.toFixed(1);
      this.updateVoiceSettings({ rate });
    }

    // Check for localStorage settings
    const savedLanguage = localStorage.getItem('tts_language');
    if (savedLanguage && CONFIG.languages[savedLanguage] && !language) {
      this.changeLanguage(savedLanguage);
      this.elements.languageSelect.value = savedLanguage;
    }

    // Save language preference
    this.ttsEngine.on('languageChanged', (data) => {
      localStorage.setItem('tts_language', data.language);
    });
  }

  /**
   * Start datetime display updates
   */
  startDateTimeUpdate() {
    const updateDateTime = () => {
      const now = new Date();
      
      // Update time display (HH:MM:SS format)
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      if (this.elements.timeDisplay) {
        this.elements.timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
      }
      
      // Update date display (Day, Month DD, YYYY format)
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      if (this.elements.dateDisplay) {
        this.elements.dateDisplay.textContent = now.toLocaleDateString('en-US', options);
      }
    };
    
    // Update immediately
    updateDateTime();
    
    // Update every second
    setInterval(updateDateTime, 1000);
  }

  /**
   * Public API: Make announcement (for external integration)
   */
  announce(tokenNumber, counterNumber) {
    return this.ttsEngine.announce(tokenNumber, counterNumber);
  }

  /**
   * Public API: Set language
   */
  setLanguage(languageCode) {
    return this.changeLanguage(languageCode);
  }

  /**
   * Public API: Get queue status
   */
  getStatus() {
    return this.ttsEngine.getQueueStatus();
  }
}

// Initialize application when DOM is ready
let app;

document.addEventListener('DOMContentLoaded', () => {
  app = new BankingTTSApp();
});

// Expose app globally for external access
window.BankingTTSApp = app;
