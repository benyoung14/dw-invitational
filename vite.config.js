import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Netlify serves the site at the domain root. The GitHub Pages backup lives at
// benyoung14.github.io/dw-invitational/, so its workflow sets VITE_BASE.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
})
