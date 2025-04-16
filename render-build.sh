#!/bin/bash
# Print environment information
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"

# Install dev dependencies for TypeScript
echo "Installing dev dependencies..."
npm install --save-dev @types/node @types/express

# Create environment directory
mkdir -p environment

# Setup environment variables
if [ -n "$VITE_GITHUB_TOKEN" ]; then
  echo "GitHub token exists in environment, creating .env file"
  echo "VITE_GITHUB_TOKEN=$VITE_GITHUB_TOKEN" > environment/.env
else
  echo "GitHub token not found in environment variables"
  echo "VITE_GITHUB_TOKEN=missing" > environment/.env
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app
echo "Building the application..."
npm run build

echo "Listing files in dist directory:"
find dist -type f | sort || echo "Dist directory not found"

echo "Build completed successfully!"