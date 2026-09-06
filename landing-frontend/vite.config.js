import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    strictPort: true,

    proxy: {
      '/customer': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },

      '/worker': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      },
    },
  },
});