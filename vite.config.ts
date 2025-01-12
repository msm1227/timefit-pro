import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    assetsInclude: ['**/*.mp3'],
  },
  publicDir: 'public',
  server: {
    // Enable HMR
    hmr: true,
    // Watch for changes in these directories
    watch: {
      usePolling: true,
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
});