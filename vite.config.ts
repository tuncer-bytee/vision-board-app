import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Ensures process.env.API_KEY is available in the client if the environment supports it,
    // otherwise it prevents syntax errors during build.
    'process.env': process.env
  }
});