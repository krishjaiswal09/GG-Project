import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    // CORS headers to allow cross-origin requests from the backend
    cors: true,
    // Cross-origin isolation settings to prevent browser errors
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
  },
  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Configure worker behavior to prevent issues
  worker: {
    format: 'es',
  },
  build: {
    // Sourcemap for debugging
    sourcemap: true,
    // Minification settings
    minify: 'terser',
    // Chunking strategy
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          // Separate chunk for large dependencies
          axios: ['axios']
        }
      }
    },
    // Cache-busting hashes for production
    assetsInlineLimit: 4096,
    // Config to ensure web workers run correctly
    target: 'es2020',
  }
}); 