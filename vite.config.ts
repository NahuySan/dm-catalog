import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; 
import { fileURLToPath, URL } from 'node:url';
import { VitePWA } from 'vite-plugin-pwa'; // 1. Importamos el plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 2. CONFIGURACIÓN DE LA PWA
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'assets/**/*'],
      manifest: {
        name: 'Distribuidora Mauri - Catálogo',
        short_name: 'Mauri',
        description: 'Catálogo de preventa para Distribuidora Mauri',
        theme_color: '#14943b', // El verde que usamos en el PDF
        background_color: '#ffffff',
        display: 'standalone', // Esto hace que se vea como una app sin barra de navegador
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any' // El icono normal para cuando no hace falta máscara
          }
        ]
      },
      workbox: {
        // 3. CACHEO ESTRATÉGICO DE IMÁGENES Y FUENTES
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,ttf}'], 
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 año
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    allowedHosts: true, 
  },
});