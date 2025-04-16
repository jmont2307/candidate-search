// Simple server for production environment
const express = require('express');
const path = require('path');

const app = express();

// Parse the PORT environment variable as an integer
let PORT = 10000; // Default port

// Ensure PORT is a number
if (process.env.PORT) {
  try {
    const parsedPort = parseInt(process.env.PORT);
    if (!isNaN(parsedPort) && parsedPort > 0) {
      PORT = parsedPort;
    } else {
      console.error('Invalid PORT value, using default 10000');
    }
  } catch (error) {
    console.error('Error parsing PORT, using default 10000');
  }
}

console.log('Starting production server on port:', PORT);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});