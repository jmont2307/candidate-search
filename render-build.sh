#!/bin/bash
# Print environment information
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "GitHub token exists: ${VITE_GITHUB_TOKEN:+yes}"

# Install dev dependencies for TypeScript
echo "Installing dev dependencies..."
npm install --save-dev @types/node

# Setup environment first
node environment-setup.js

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app
echo "Building the application..."
npm run build || {
  echo "Build failed, creating emergency index.html..."
  node -e "require('./environment-setup.js').createEmergencyHTML()"
}

# Inject environment variables into the built index.html
echo "Injecting environment variables..."
node -e "require('./environment-setup.js').injectEnvVars()"

echo "Listing files in dist directory:"
find dist -type f | sort

echo "Build completed successfully!"