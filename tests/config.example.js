/**
 * ResponsiveVoice API Configuration (Example Template)
 * 
 * INSTRUCTIONS:
 * 1. Copy this file and rename it to 'config.js'
 * 2. Replace 'YOUR_API_KEY_HERE' with your actual ResponsiveVoice API key
 * 3. Get your free API key from: https://responsivevoice.org/api/
 * 
 * NOTE: config.js is gitignored and will not be committed to the repository.
 */

const RESPONSIVE_VOICE_CONFIG = {
  apiKey: 'YOUR_API_KEY_HERE',
  
  // Optional: Add domain restrictions here if configured in your ResponsiveVoice dashboard
  allowedDomains: [
    'localhost',
    '127.0.0.1',
    // Add your production domain here
  ]
};
