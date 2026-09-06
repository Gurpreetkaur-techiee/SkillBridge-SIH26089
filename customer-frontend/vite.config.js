import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  base: '/customer/',

  server: {
    port: 3000,
    strictPort: true,
    open: false,
  },
});