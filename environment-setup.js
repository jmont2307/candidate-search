/**
 * This script ensures environment variables are available at build time
 */

const fs = require('fs');
const path = require('path');

// Get the GitHub token from environment variables
const githubToken = process.env.VITE_GITHUB_TOKEN;

console.log(`GitHub token present in environment: ${!!githubToken}`);

// If the token exists, create a temporary env file for the build process
if (githubToken) {
  // Make sure the environment directory exists
  const envDir = path.join(__dirname, 'environment');
  if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
    console.log('Created environment directory');
  }

  // Write the token to a .env file
  const envFilePath = path.join(envDir, '.env');
  fs.writeFileSync(envFilePath, `VITE_GITHUB_TOKEN=${githubToken}\n`);
  console.log(`Created .env file with GitHub token at ${envFilePath}`);
} else {
  console.warn('No GitHub token found in environment variables');
  console.warn('Application may not function correctly without a valid token');
}

// Also add the token directly to import.meta.env for client-side access
const injectScript = `
<script>
  window.importMetaEnv = window.importMetaEnv || {};
  window.importMetaEnv.VITE_GITHUB_TOKEN = "${githubToken || ''}";
</script>
`;

// Function to inject the script into index.html after building
const injectEnvVars = () => {
  // Try to find the index.html file
  const distDir = path.join(__dirname, 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.warn('Dist directory not found. Creating it.');
    try {
      fs.mkdirSync(distDir, { recursive: true });
    } catch (err) {
      console.error('Error creating dist directory:', err);
      return;
    }
  }
  
  // Check if index.html exists in the dist directory
  const indexPath = path.join(distDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    try {
      let html = fs.readFileSync(indexPath, 'utf-8');
      html = html.replace('</head>', `${injectScript}</head>`);
      fs.writeFileSync(indexPath, html);
      console.log('Injected environment variables into index.html');
    } catch (err) {
      console.error('Error injecting environment variables:', err);
    }
  } else {
    console.warn('Could not find index.html to inject environment variables');
    
    // List files in the dist directory to help debug
    try {
      const files = fs.readdirSync(distDir);
      console.log('Files in dist directory:', files);
    } catch (err) {
      console.error('Error listing files in dist directory:', err);
    }
  }
};

// Create a hardcoded HTML file with the token if needed
const createEmergencyHTML = () => {
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Candidate Search</title>
  <script>
    window.importMetaEnv = {
      VITE_GITHUB_TOKEN: "${githubToken || ''}"
    };
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/assets/index.js"></script>
</body>
</html>`;
    
    fs.writeFileSync(indexPath, html);
    console.log('Created emergency index.html file');
  }
};

// Export the functions to be used after build
module.exports = { injectEnvVars, createEmergencyHTML };