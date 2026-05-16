# API Integration Guide

## Overview

This document provides detailed information on integrating the Banking TTS Announcement System with your backend systems, queue management software, or other applications.

## JavaScript API

### Initialization

```javascript
// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const app = new BankingTTSApp();

  // App is now ready to use
  console.log("TTS System initialized");
});
```

### Making Announcements

```javascript
// Simple announcement
app.announce(tokenNumber, counterNumber);

// With promise handling
app
  .announce(13, 3)
  .then(() => {
    console.log("Announcement completed");
  })
  .catch((error) => {
    console.error("Announcement failed:", error);
  });

// Multiple announcements (will be queued)
app.announce(13, 3);
app.announce(14, 5);
app.announce(15, 2);
```

### Language Control

```javascript
// Change language
app.setLanguage("bn"); // Bangla
app.setLanguage("fr"); // French
app.setLanguage("jp"); // Japanese
app.setLanguage("en"); // English

// Get current language
const currentLang = app.ttsEngine.currentLanguage;
console.log("Current language:", currentLang);

// Get available languages
const languages = app.ttsEngine.getAvailableLanguages();
languages.forEach((lang) => {
  console.log(`${lang.code}: ${lang.displayName}`);
});
```

### Voice Customization

```javascript
// Set voice settings
app.ttsEngine.setVoiceSettings({
  gender: "female",
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
});

// Set individual properties
app.ttsEngine.setVoiceSettings({ rate: 0.8 }); // Slower
app.ttsEngine.setVoiceSettings({ pitch: 1.2 }); // Higher pitch
```

### Queue Management

```javascript
// Get queue status
const status = app.getStatus();
console.log(status);
// {
//   queueLength: 2,
//   isProcessing: true,
//   isSpeaking: true,
//   isPaused: false
// }

// Stop all announcements
app.ttsEngine.stop();

// Pause current announcement
app.ttsEngine.pause();

// Resume paused announcement
app.ttsEngine.resume();
```

### Event Handling

```javascript
// Listen to TTS events
app.ttsEngine.on("start", (data) => {
  console.log("Announcement started:", data.text);
  console.log("Token:", data.metadata.tokenNumber);
  console.log("Counter:", data.metadata.counterNumber);
});

app.ttsEngine.on("end", (data) => {
  console.log("Announcement completed");
});

app.ttsEngine.on("error", (data) => {
  console.error("TTS error:", data.error);
});

app.ttsEngine.on("languageChanged", (data) => {
  console.log("Language changed to:", data.language);
});
```

## REST API Integration

### Using Fetch API

```javascript
// Announcement endpoint example
async function announceToken(token, counter, language = "en") {
  try {
    const response = await fetch("/api/announce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        counter,
        language,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Trigger announcement on client
      app.setLanguage(language);
      app.announce(token, counter);
    }
  } catch (error) {
    console.error("API error:", error);
  }
}

// Usage
announceToken(13, 3, "en");
```

### Server-Side Example (Node.js + Express)

```javascript
const express = require("express");
const app = express();

app.use(express.json());

// Announcement endpoint
app.post("/api/announce", (req, res) => {
  const { token, counter, language } = req.body;

  // Validate input
  if (!token || !counter) {
    return res.status(400).json({
      success: false,
      error: "Token and counter are required",
    });
  }

  // Log announcement
  console.log(`Announcing: Token ${token} -> Counter ${counter} [${language}]`);

  // Broadcast to connected clients (see WebSocket section)
  io.emit("announce", { token, counter, language });

  res.json({
    success: true,
    data: { token, counter, language },
  });
});

app.listen(3000, () => {
  console.log("API server running on port 3000");
});
```

## WebSocket Integration

### Server (Node.js + Socket.IO)

```javascript
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static("public"));

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle announcement request from admin
  socket.on("request-announcement", (data) => {
    const { token, counter, language } = data;

    // Broadcast to all display clients
    io.emit("announce", { token, counter, language });

    // Log
    console.log(`Broadcasting: Token ${token} -> Counter ${counter}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("WebSocket server running on port 3000");
});
```

### Client (Display)

```javascript
// Connect to WebSocket server
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to announcement server");
});

socket.on("announce", (data) => {
  const { token, counter, language } = data;

  // Change language if needed
  if (language && app.ttsEngine.currentLanguage !== language) {
    app.setLanguage(language);
  }

  // Make announcement
  app.announce(token, counter);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
```

### Admin Panel Client

```javascript
// Send announcement from admin panel
function sendAnnouncement(token, counter, language) {
  socket.emit("request-announcement", {
    token,
    counter,
    language,
  });
}

// Usage
sendAnnouncement(13, 3, "en");
```

## URL Parameters

Control the system via URL parameters:

```javascript
// Parse URL parameters on page load
const urlParams = new URLSearchParams(window.location.search);

const language = urlParams.get("lang");
const token = urlParams.get("token");
const counter = urlParams.get("counter");
const autoAnnounce = urlParams.get("auto");

// Auto-announce if parameters provided
if (autoAnnounce === "true" && token && counter) {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      app.setLanguage(language || "en");
      app.announce(parseInt(token), parseInt(counter));
    }, 1000);
  });
}
```

Usage:

```
http://localhost:8000/?lang=bn&token=13&counter=3&auto=true
```

## Message Queue Integration (Redis)

```javascript
const redis = require("redis");
const client = redis.createClient();

// Subscribe to announcement channel
client.subscribe("announcements");

client.on("message", (channel, message) => {
  if (channel === "announcements") {
    const data = JSON.parse(message);

    // Broadcast to WebSocket clients
    io.emit("announce", data);
  }
});

// Publish announcement (from queue management system)
function publishAnnouncement(token, counter, language) {
  const message = JSON.stringify({ token, counter, language });
  client.publish("announcements", message);
}
```

## Database Integration

```javascript
const mysql = require("mysql2/promise");

// Database connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "queue_system",
  waitForConnections: true,
  connectionLimit: 10,
});

// Log announcement to database
async function logAnnouncement(token, counter, language) {
  const query = `
    INSERT INTO announcements (token_number, counter_number, language, announced_at)
    VALUES (?, ?, ?, NOW())
  `;

  try {
    const [result] = await pool.execute(query, [token, counter, language]);
    console.log("Announcement logged:", result.insertId);
    return result.insertId;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Get announcement history
async function getAnnouncementHistory(limit = 100) {
  const query = `
    SELECT * FROM announcements
    ORDER BY announced_at DESC
    LIMIT ?
  `;

  const [rows] = await pool.execute(query, [limit]);
  return rows;
}
```

## MQTT Integration (IoT)

```javascript
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to announcement topic
  client.subscribe("bank/announcements", (err) => {
    if (!err) {
      console.log("Subscribed to announcements topic");
    }
  });
});

client.on("message", (topic, message) => {
  if (topic === "bank/announcements") {
    const data = JSON.parse(message.toString());

    // Broadcast to display clients
    io.emit("announce", data);
  }
});

// Publish announcement
function publishToMQTT(token, counter, language) {
  const message = JSON.stringify({ token, counter, language });
  client.publish("bank/announcements", message);
}
```

## Advanced Features

### Batch Announcements

```javascript
async function announceBatch(announcements) {
  for (const announcement of announcements) {
    const { token, counter, language } = announcement;

    if (language) {
      app.setLanguage(language);
    }

    await app.announce(token, counter);

    // Wait between announcements
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.queue.announcementDelay),
    );
  }
}

// Usage
announceBatch([
  { token: 13, counter: 3, language: "en" },
  { token: 14, counter: 5, language: "bn" },
  { token: 15, counter: 2, language: "fr" },
]);
```

### Scheduled Announcements

```javascript
function scheduleAnnouncement(token, counter, language, delay) {
  setTimeout(() => {
    app.setLanguage(language);
    app.announce(token, counter);
  }, delay);
}

// Announce in 5 seconds
scheduleAnnouncement(13, 3, "en", 5000);
```

### Custom Text Announcement

```javascript
// Announce custom text (beyond token/counter)
function announceCustom(text, language = "en") {
  app.ttsEngine.setLanguage(language);
  return app.ttsEngine.speak(text);
}

// Usage
announceCustom("Welcome to ABC Bank", "en");
announceCustom("ব্যাংক বন্ধ হওয়ার সময় ৫ মিনিট", "bn");
```

## Error Handling

```javascript
// Global error handler
app.ttsEngine.on("error", (data) => {
  // Log to server
  fetch("/api/log-error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      error: data.error.message,
      text: data.text,
      timestamp: new Date().toISOString(),
    }),
  });

  // Show user notification
  console.error("TTS Error:", data.error);

  // Retry announcement
  setTimeout(() => {
    app.announce(data.metadata.tokenNumber, data.metadata.counterNumber);
  }, 3000);
});
```

## Security Best Practices

```javascript
// Input validation
function validateAnnouncement(token, counter) {
  if (!Number.isInteger(token) || token < 1 || token > 9999) {
    throw new Error("Invalid token number");
  }

  if (!Number.isInteger(counter) || counter < 1 || counter > 99) {
    throw new Error("Invalid counter number");
  }

  return true;
}

// Rate limiting (simple example)
const rateLimiter = {
  lastAnnouncement: 0,
  minInterval: 1000, // 1 second

  canAnnounce() {
    const now = Date.now();
    if (now - this.lastAnnouncement >= this.minInterval) {
      this.lastAnnouncement = now;
      return true;
    }
    return false;
  },
};

// Usage
function safeAnnounce(token, counter, language) {
  try {
    validateAnnouncement(token, counter);

    if (!rateLimiter.canAnnounce()) {
      console.warn("Rate limit exceeded");
      return;
    }

    app.setLanguage(language);
    app.announce(token, counter);
  } catch (error) {
    console.error("Announcement error:", error.message);
  }
}
```

## Testing

```javascript
// Test all languages
async function testAllLanguages() {
  const languages = ["en", "bn", "fr", "jp"];

  for (const lang of languages) {
    console.log(`Testing ${lang}...`);
    app.setLanguage(lang);
    await app.announce(1, 1);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  console.log("All tests completed");
}

// Test queue with multiple announcements
function testQueue() {
  for (let i = 1; i <= 5; i++) {
    app.announce(i, i);
  }
}
```

---

For more examples, check the `examples/` directory in the project.
