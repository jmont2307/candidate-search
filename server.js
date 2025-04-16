import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
try {
  dotenv.config({ path: './environment/.env' });
} catch (error) {
  console.log('No .env file found, using environment variables');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// Render assigns a port via the PORT environment variable
const PORT = process.env.PORT || 3000;

console.log(`Starting server with PORT=${PORT}`);

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// For any request that doesn't match a static file, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});