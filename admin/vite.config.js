import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Admin panel runs on port 5173
// Public site runs on port 3000
// Backend API runs on port 5000

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: '/login',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
