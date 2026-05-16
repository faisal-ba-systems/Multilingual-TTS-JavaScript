/**
 * WebSocket Server Example for Real-time Announcements
 * 
 * Requirements:
 * - npm install express socket.io cors
 * 
 * Usage:
 * - node examples/websocket-server.js
 * - Open multiple browser windows to see synchronized announcements
 */

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../'));

// Store connected clients
const connectedClients = new Map();

// Configuration
const PORT = process.env.PORT || 3000;

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    clients: connectedClients.size,
    uptime: process.uptime()
  });
});

// Announcement endpoint
app.post('/api/announce', (req, res) => {
  const { token, counter, language = 'en' } = req.body;
  
  // Validate input
  if (!token || !counter) {
    return res.status(400).json({
      success: false,
      error: 'Token and counter are required'
    });
  }
  
  if (token < 1 || token > 9999 || counter < 1 || counter > 99) {
    return res.status(400).json({
      success: false,
      error: 'Invalid token or counter number'
    });
  }
  
  // Broadcast to all connected clients
  const announcementData = {
    token,
    counter,
    language,
    timestamp: new Date().toISOString()
  };
  
  io.emit('announce', announcementData);
  
  console.log(`📢 Announcing: Token ${token} → Counter ${counter} [${language}]`);
  
  res.json({
    success: true,
    data: announcementData,
    clients: connectedClients.size
  });
});

// Get announcement queue
app.get('/api/queue', (req, res) => {
  // In production, this would fetch from a database or Redis
  res.json({
    queue: [],
    size: 0
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  
  // Store client info
  connectedClients.set(socket.id, {
    id: socket.id,
    connectedAt: new Date(),
    type: 'display' // or 'admin'
  });
  
  // Send connection confirmation
  socket.emit('connected', {
    id: socket.id,
    message: 'Connected to announcement server'
  });
  
  // Broadcast client count update
  io.emit('client-count', {
    count: connectedClients.size
  });
  
  // Handle announcement request from admin panel
  socket.on('request-announcement', (data) => {
    const { token, counter, language } = data;
    
    console.log(`📢 Admin request: Token ${token} → Counter ${counter} [${language}]`);
    
    // Validate
    if (!token || !counter) {
      socket.emit('error', { message: 'Token and counter required' });
      return;
    }
    
    // Broadcast to all displays
    io.emit('announce', {
      token,
      counter,
      language,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle language change
  socket.on('change-language', (data) => {
    console.log(`🌍 Language changed to: ${data.language}`);
    io.emit('language-changed', data);
  });
  
  // Handle control commands
  socket.on('control', (data) => {
    const { command } = data;
    console.log(`🎮 Control command: ${command}`);
    
    switch (command) {
      case 'pause':
        io.emit('pause-announcements');
        break;
      case 'resume':
        io.emit('resume-announcements');
        break;
      case 'stop':
        io.emit('stop-announcements');
        break;
      case 'clear':
        io.emit('clear-display');
        break;
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    connectedClients.delete(socket.id);
    
    // Broadcast updated client count
    io.emit('client-count', {
      count: connectedClients.size
    });
  });
  
  // Handle errors
  socket.on('error', (error) => {
    console.error(`⚠️ Socket error from ${socket.id}:`, error);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 WebSocket Server Started');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('=================================');
});

// Example: Simulate announcements every 10 seconds (for testing)
let tokenCounter = 1;
if (process.env.AUTO_ANNOUNCE === 'true') {
  setInterval(() => {
    const languages = ['en', 'bn', 'fr', 'jp'];
    const randomLang = languages[Math.floor(Math.random() * languages.length)];
    
    io.emit('announce', {
      token: tokenCounter,
      counter: Math.floor(Math.random() * 10) + 1,
      language: randomLang,
      timestamp: new Date().toISOString()
    });
    
    console.log(`🤖 Auto-announced: Token ${tokenCounter}`);
    tokenCounter++;
  }, 10000);
}

module.exports = { app, server, io };
