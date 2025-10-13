import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',         // simula un navegador
    setupFiles: './vitest.setup.ts', // archivo de configuración inicial
    globals: true,                // para usar "describe", "it", "expect" sin importar
  },
  
})

