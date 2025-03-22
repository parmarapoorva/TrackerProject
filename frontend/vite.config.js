import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Disable JS source maps
  },
  css: {
    devSourcemap: false, // Disable CSS source maps
  },
});
