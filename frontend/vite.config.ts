
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  test: {
    environment: 'jsdom',          // simula un navegador
    setupFiles: './vitest.setup.ts', // archivo de configuración inicial
    globals: true,                 // permite usar describe/it/expect sin importar
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // backend Express
        changeOrigin: true,
      },
    },
  },
})