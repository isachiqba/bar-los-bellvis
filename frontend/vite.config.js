import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Panel de Vue DevTools solo si se pide: DEVTOOLS=1 npm run dev
    process.env.DEVTOOLS && vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // En desarrollo, las llamadas a /api van al backend de Django
    // (API_URL permite usar otro puerto si el 8000 está ocupado)
    proxy: {
      '/api': process.env.API_URL ?? 'http://127.0.0.1:8000',
      '/media': process.env.API_URL ?? 'http://127.0.0.1:8000',
    },
  },
})
