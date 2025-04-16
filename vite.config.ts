import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, './environment', '');
  
  console.log('Environment Directory:', resolve(__dirname, 'environment'));
  console.log('GitHub Token exists:', !!env.VITE_GITHUB_TOKEN);

  return {
    define: {
      // Pass the entire process.env to the client
      'process.env.VITE_GITHUB_TOKEN': JSON.stringify(env.VITE_GITHUB_TOKEN || ''),
    },
    envDir: './environment',
    plugins: [react()],
    preview: {
      port: 4173,
      strictPort: true,
      allowedHosts: ['candidate-search-mb9v.onrender.com', '*.onrender.com', 'localhost']
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
    }
  };
});
