/**
 * REST API Integration Examples
 * 
 * This file demonstrates various ways to integrate the TTS system
 * with backend APIs and external systems.
 */

// ==================================================
// 1. SIMPLE FETCH API INTEGRATION
// ==================================================

async function announceViaAPI(token, counter, language = 'en') {
  try {
    const response = await fetch('http://localhost:3000/api/announce', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, counter, language })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Announcement sent successfully');
      return data;
    } else {
      console.error('Announcement failed:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ==================================================
// 2. QUEUE SYSTEM INTEGRATION
// ==================================================

class QueueManager {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.queue = [];
    this.isProcessing = false;
  }
  
  async addToQueue(token, counter, language = 'en') {
    this.queue.push({ token, counter, language });
    console.log(`Added to queue: Token ${token}, Queue size: ${this.queue.length}`);
    
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }
  
  async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const announcement = this.queue.shift();
      
      try {
        await announceViaAPI(
          announcement.token,
          announcement.counter,
          announcement.language
        );
        
        // Wait between announcements
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error('Failed to announce:', error);
        // Optionally re-add to queue
      }
    }
    
    this.isProcessing = false;
  }
  
  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing
    };
  }
  
  clearQueue() {
    this.queue = [];
    console.log('Queue cleared');
  }
}

// Usage
const queueManager = new QueueManager('http://localhost:3000');

// Add multiple announcements
queueManager.addToQueue(13, 3, 'en');
queueManager.addToQueue(14, 5, 'bn');
queueManager.addToQueue(15, 2, 'fr');

// ==================================================
// 3. WEBSOCKET CLIENT INTEGRATION
// ==================================================

class AnnouncementClient {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }
  
  connect() {
    // Using Socket.IO client
    this.socket = io(this.serverUrl);
    
    this.socket.on('connect', () => {
      console.log('Connected to announcement server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });
    
    this.socket.on('announce', (data) => {
      console.log('Received announcement:', data);
      this.handleAnnouncement(data);
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
      this.attemptReconnect();
    });
    
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
    
    this.socket.on('client-count', (data) => {
      console.log(`Connected clients: ${data.count}`);
    });
  }
  
  handleAnnouncement(data) {
    const { token, counter, language } = data;
    
    // Change language if needed
    if (window.app && language) {
      window.app.setLanguage(language);
    }
    
    // Make announcement
    if (window.app) {
      window.app.announce(token, counter);
    }
  }
  
  requestAnnouncement(token, counter, language = 'en') {
    if (this.isConnected) {
      this.socket.emit('request-announcement', {
        token,
        counter,
        language
      });
    } else {
      console.error('Not connected to server');
    }
  }
  
  changeLanguage(language) {
    if (this.isConnected) {
      this.socket.emit('change-language', { language });
    }
  }
  
  sendControl(command) {
    if (this.isConnected) {
      this.socket.emit('control', { command });
    }
  }
  
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, 2000 * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }
}

// Usage
const client = new AnnouncementClient('http://localhost:3000');
client.connect();

// Request announcement from admin panel
client.requestAnnouncement(13, 3, 'en');

// ==================================================
// 4. POLLING-BASED INTEGRATION
// ==================================================

class PollingClient {
  constructor(apiUrl, interval = 5000) {
    this.apiUrl = apiUrl;
    this.interval = interval;
    this.isPolling = false;
    this.lastAnnouncementId = null;
  }
  
  startPolling() {
    if (this.isPolling) {
      console.log('Already polling');
      return;
    }
    
    this.isPolling = true;
    this.poll();
  }
  
  stopPolling() {
    this.isPolling = false;
  }
  
  async poll() {
    while (this.isPolling) {
      try {
        const response = await fetch(`${this.apiUrl}/api/announcements/latest`);
        const data = await response.json();
        
        if (data.id && data.id !== this.lastAnnouncementId) {
          this.lastAnnouncementId = data.id;
          this.handleNewAnnouncement(data);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
      
      await new Promise(resolve => setTimeout(resolve, this.interval));
    }
  }
  
  handleNewAnnouncement(data) {
    console.log('New announcement:', data);
    
    if (window.app) {
      window.app.setLanguage(data.language || 'en');
      window.app.announce(data.token, data.counter);
    }
  }
}

// Usage
const pollingClient = new PollingClient('http://localhost:3000', 3000);
pollingClient.startPolling();

// ==================================================
// 5. DATABASE INTEGRATION EXAMPLE
// ==================================================

// Server-side (Node.js with MySQL)
/*
const mysql = require('mysql2/promise');

class DatabaseIntegration {
  constructor(config) {
    this.pool = mysql.createPool(config);
  }
  
  async logAnnouncement(token, counter, language) {
    const query = `
      INSERT INTO announcements 
      (token_number, counter_number, language, announced_at, status)
      VALUES (?, ?, ?, NOW(), 'announced')
    `;
    
    try {
      const [result] = await this.pool.execute(query, [token, counter, language]);
      return result.insertId;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
  
  async getAnnouncementHistory(limit = 100) {
    const query = `
      SELECT * FROM announcements
      ORDER BY announced_at DESC
      LIMIT ?
    `;
    
    const [rows] = await this.pool.execute(query, [limit]);
    return rows;
  }
  
  async getAnnouncementStats() {
    const query = `
      SELECT 
        COUNT(*) as total,
        language,
        DATE(announced_at) as date
      FROM announcements
      GROUP BY language, DATE(announced_at)
      ORDER BY date DESC
    `;
    
    const [rows] = await this.pool.execute(query);
    return rows;
  }
}

// Usage
const db = new DatabaseIntegration({
  host: 'localhost',
  user: 'root',
  database: 'queue_system',
  password: 'your_password'
});

// Log announcement
await db.logAnnouncement(13, 3, 'en');

// Get history
const history = await db.getAnnouncementHistory(50);
*/

// ==================================================
// 6. CUSTOM EVENT SYSTEM
// ==================================================

class AnnouncementEventSystem {
  constructor() {
    this.handlers = {};
  }
  
  on(event, handler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }
  
  emit(event, data) {
    if (this.handlers[event]) {
      this.handlers[event].forEach(handler => handler(data));
    }
  }
  
  off(event, handler) {
    if (this.handlers[event]) {
      this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }
  }
}

const events = new AnnouncementEventSystem();

// Register handlers
events.on('announcement-received', (data) => {
  console.log('Processing announcement:', data);
  if (window.app) {
    window.app.announce(data.token, data.counter);
  }
});

events.on('announcement-completed', (data) => {
  console.log('Announcement completed:', data);
  // Log to analytics, update UI, etc.
});

events.on('announcement-failed', (data) => {
  console.error('Announcement failed:', data);
  // Retry, log error, notify admin, etc.
});

// Emit events
events.emit('announcement-received', { token: 13, counter: 3, language: 'en' });

// ==================================================
// 7. LOCAL STORAGE CACHE
// ==================================================

class AnnouncementCache {
  constructor() {
    this.cacheKey = 'tts_announcements';
    this.maxCacheSize = 100;
  }
  
  saveAnnouncement(announcement) {
    const cache = this.getCache();
    cache.unshift({
      ...announcement,
      timestamp: new Date().toISOString()
    });
    
    // Keep only the latest items
    if (cache.length > this.maxCacheSize) {
      cache.splice(this.maxCacheSize);
    }
    
    localStorage.setItem(this.cacheKey, JSON.stringify(cache));
  }
  
  getCache() {
    const data = localStorage.getItem(this.cacheKey);
    return data ? JSON.parse(data) : [];
  }
  
  getRecentAnnouncements(count = 10) {
    const cache = this.getCache();
    return cache.slice(0, count);
  }
  
  clearCache() {
    localStorage.removeItem(this.cacheKey);
  }
  
  getStatistics() {
    const cache = this.getCache();
    
    const stats = {
      total: cache.length,
      byLanguage: {},
      byCounter: {}
    };
    
    cache.forEach(item => {
      // Count by language
      stats.byLanguage[item.language] = (stats.byLanguage[item.language] || 0) + 1;
      
      // Count by counter
      stats.byCounter[item.counter] = (stats.byCounter[item.counter] || 0) + 1;
    });
    
    return stats;
  }
}

const cache = new AnnouncementCache();

// Save announcement
cache.saveAnnouncement({ token: 13, counter: 3, language: 'en' });

// Get recent
const recent = cache.getRecentAnnouncements(5);
console.log('Recent announcements:', recent);

// Get statistics
const stats = cache.getStatistics();
console.log('Statistics:', stats);

// ==================================================
// Export for use in other modules
// ==================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    announceViaAPI,
    QueueManager,
    AnnouncementClient,
    PollingClient,
    AnnouncementEventSystem,
    AnnouncementCache
  };
}
