// Ultra simple Express server for Render
const express = require('express');
const path = require('path');

// Create Express app
const app = express();

// Default to port 3000 if PORT is not a valid number
const PORT = Number(process.env.PORT) || 3000;

console.log('Running server on port:', PORT);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any request that doesn't match a static file, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});