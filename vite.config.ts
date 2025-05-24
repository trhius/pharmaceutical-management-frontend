import path from 'path';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: false,
      eslint: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
