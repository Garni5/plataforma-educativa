import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
  environment: 'jsdom',
  setupFiles: ['vitest.setup.ts'],
  globals: true,
  deps: {
    inline: ['whatwg-url', 'webidl-conversions'],
  },
}
})
