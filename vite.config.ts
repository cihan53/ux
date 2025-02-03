import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'YourLibraryName',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['vue', 'pinia', '@nuxt/ui'],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          '@nuxt/ui': 'NuxtUI'
        }
      }
    }
  }
}) 