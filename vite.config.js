import {fileURLToPath, URL} from 'node:url'
import path from "path";

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './',
  css: {
    postcss: {
      plugins: [
      ]
    },
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://api.huanyin.xin',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '')
      }
    }
  }
})

