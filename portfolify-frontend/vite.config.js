import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // This tells Vite to leave lucide-react alone and stop breaking the exports!
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})