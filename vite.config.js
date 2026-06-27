import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Ngrok her seferinde farklı bir URL (subdomain) verdiği için
    // .ngrok-free.app ile biten TÜM domainlere izin veriyoruz.
    // Localhost ve 127.0.0.1 zaten varsayılan olarak izinlidir.
    allowedHosts: ['.ngrok-free.app'],
  }
})
