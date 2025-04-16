const express = require('express');
const path = require('path');
const fs = require('fs');

// Configure environment variables
try {
  if (fs.existsSync('./environment/.env')) {
    console.log('Loading environment variables from .env file');
    require('dotenv').config({ path: './environment/.env' });
  }
} catch (err) {
  console.log('No .env file found or error loading it, using system environment variables');
}

const app = express();

// Ensure PORT is a number
let PORT;
try {
  PORT = parseInt(process.env.PORT) || 3000;
  if (isNaN(PORT)) {
    console.error('Invalid PORT value:', process.env.PORT);
    PORT = 3000;
  }
} catch (err) {
  console.error('Error parsing PORT:', err);
  PORT = 3000;
}

console.log(`Starting server on port ${PORT}`);
console.log(`GitHub Token is ${process.env.VITE_GITHUB_TOKEN ? 'configured' : 'NOT configured'}`);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    version: require('./package.json').version,
    port: PORT,
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasToken: !!process.env.VITE_GITHUB_TOKEN
    }
  });
});

// For any request that doesn't match a static file or API endpoint, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});