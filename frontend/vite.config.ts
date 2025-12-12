
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
    host: true,  // escucha en todas las interfaces
    port: 5173,
    watch: {
      usePolling: true, // ⚠ fuerza a Vite a detectar cambios
      interval: 100     // revisar cada 100ms
    }
  }
})