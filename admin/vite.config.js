import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Admin panel — port 5173, no auto-open (access manually when needed)
// Public site  — port 3000 (opens automatically)
// Backend API  — port 5000

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: false,      
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
