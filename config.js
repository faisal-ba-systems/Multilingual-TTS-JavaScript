/**
 * TTS Announcement System Configuration
 * Banking Token Management System
 */

const CONFIG = {
  // Default language (can be overridden by environment or user selection)
  defaultLanguage: 'en',

  // Available languages
  supportedLanguages: ['en', 'bn', 'fr', 'jp'],

  // Language configurations
  languages: {
    en: {
      code: 'en',
      name: 'English',
      displayName: 'English',
      locale: 'en-US',
      direction: 'ltr',
      labels: {
        tokenNumber: 'Token Number',
        counterNumber: 'Counter Number',
        pleaseGoTo: 'Please go to',
        thankYou: 'Thank you',
      },
      // Number conversion (for display)
      numberFormatter: (num) => num.toString(),
      // TTS voice settings
      tts: {
        voice: 'en-US',
        voiceURI: 'Microsoft David - English (United States)',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        preferredVoices: [
          'Microsoft David - English (United States)',
          'Microsoft Zira - English (United States)',
          'Google US English',
        ],
      },
    },
    bn: {
      code: 'bn',
      name: 'Bangla',
      displayName: 'বাংলা',
      locale: 'bn-BD',
      direction: 'ltr',
      labels: {
        tokenNumber: 'টোকেন নম্বর',
        counterNumber: 'কাউন্টার নম্বর',
        pleaseGoTo: 'অনুগ্রহ করে যান',
        thankYou: 'ধন্যবাদ',
      },
      // Convert numbers to Bangla numerals
      numberFormatter: (num) => {
        const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return num
          .toString()
          .split('')
          .map((digit) => banglaDigits[parseInt(digit)] || digit)
          .join('');
      },
      tts: {
        voice: 'bn-BD',
        voiceURI: 'Google বাংলা',
        rate: 0.9,
        pitch: 1.0,
        volume: 1.0,
        preferredVoices: ['Google বাংলা', 'Microsoft Bangla'],
      },
    },
    fr: {
      code: 'fr',
      name: 'French',
      displayName: 'Français',
      locale: 'fr-FR',
      direction: 'ltr',
      labels: {
        tokenNumber: 'Numéro de jeton',
        counterNumber: 'Numéro de comptoir',
        pleaseGoTo: 'Veuillez vous rendre au',
        thankYou: 'Merci',
      },
      numberFormatter: (num) => num.toString(),
      tts: {
        voice: 'fr-FR',
        voiceURI: 'Microsoft Hortense - French (France)',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        preferredVoices: [
          'Microsoft Hortense - French (France)',
          'Google français',
        ],
      },
    },
    jp: {
      code: 'jp',
      name: 'Japanese',
      displayName: '日本語',
      locale: 'ja-JP',
      direction: 'ltr',
      labels: {
        tokenNumber: 'トークン番号',
        counterNumber: 'カウンター番号',
        pleaseGoTo: 'カウンターへお越しください',
        thankYou: 'ありがとうございます',
      },
      numberFormatter: (num) => num.toString(),
      tts: {
        voice: 'ja-JP',
        voiceURI: 'Microsoft Haruka - Japanese (Japan)',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        preferredVoices: [
          'Microsoft Haruka - Japanese (Japan)',
          'Google 日本語',
        ],
      },
    },
  },

  // Voice customization options
  voice: {
    genderOptions: {
      male: {
        rate: 0.95,
        pitch: 0.9,
      },
      female: {
        rate: 1.0,
        pitch: 1.1,
      },
    },
    speedPresets: {
      slow: 0.7,
      normal: 1.0,
      fast: 1.3,
    },
    pitchRange: {
      min: 0.5,
      max: 2.0,
    },
    volumeRange: {
      min: 0.1,
      max: 1.0,
    },
  },

  // Queue management settings
  queue: {
    maxQueueSize: 10,
    announcementDelay: 2000, // ms between announcements
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // Display settings
  display: {
    autoHide: true,
    displayDuration: 10000, // ms to show each announcement
    animationDuration: 500, // ms for transitions
    highlightDuration: 3000, // ms to highlight new announcements
  },

  // Notification sound settings
  notification: {
    enabled: true,
    soundFile: './assets/notification.mp3',
    volume: 0.5,
    duration: 1000, // ms
  },

  // Debug and logging
  debug: false,
};

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
