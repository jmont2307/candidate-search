import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: './environment',
  plugins: [react()],
  preview: {
    port: 4173,
    strictPort: true,
    allowedHosts: ['candidate-search-mb9v.onrender.com', '*.onrender.com']
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  }
});
