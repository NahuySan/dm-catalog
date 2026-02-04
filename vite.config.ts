import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; 
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  // --- AGREGAMOS ESTO PARA FIXEAR EL BUFFER ---
  define: {
    global: 'window',
  },
  // --------------------------------------------
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // Esto permite cualquier host, ideal para túneles como ngrok o Cloudflare
    allowedHosts: true, 
  },
});