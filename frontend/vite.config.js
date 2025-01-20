import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
//add "proxy": "http://192.168.163.217:5000" to vite.config.js
//add "scripts": { "dev": "vite", "build": "vite build" } to package.json