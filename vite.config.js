import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    headers: {
      'Content-Security-Policy': "script-src * 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; worker-src 'self' blob:;"
    }
  }
})
