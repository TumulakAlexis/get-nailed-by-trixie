import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteSitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    ViteSitemap({
      hostname: 'https://www.getnailedbytrixie.online',
    }),
  ],
})