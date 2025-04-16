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
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf-8');
    html = html.replace('</head>', `${injectScript}</head>`);
    fs.writeFileSync(indexPath, html);
    console.log('Injected environment variables into index.html');
  } else {
    console.warn('Could not find index.html to inject environment variables');
  }
};

// Export the function to be used after build
module.exports = { injectEnvVars };