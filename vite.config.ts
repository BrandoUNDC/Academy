import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({ plugins: [react(), tailwindcss(), VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['demo/fracciones.pdf', 'demo/lectura.pdf', 'demo/fracciones.svg', 'demo/ecosistemas.svg'],
  manifest: { name: 'Academia OS', short_name: 'Academia', description: 'Prototipo académico local', theme_color: '#171717', background_color: '#f7f7f5', display: 'standalone', start_url: '/' },
  workbox: { globPatterns: ['**/*.{js,css,html,pdf,svg,woff2,png}'], navigateFallback: '/index.html' },
})] })
