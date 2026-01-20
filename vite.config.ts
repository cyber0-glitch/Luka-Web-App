import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use /Luka-Web-App/ for GitHub Pages, / for Vercel and local dev
  base: process.env.VERCEL ? '/' : (process.env.NODE_ENV === 'production' ? '/Luka-Web-App/' : '/'),
})
