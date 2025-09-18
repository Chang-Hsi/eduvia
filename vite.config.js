// vite.config.js
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import fs from 'node:fs/promises'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  appType: 'mpa',

  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({ dts: 'src/components.d.ts' }),
    tailwindcss(),

    // ⬇️ DEV ONLY：讓 /class/123/ 在開發時吃到 /class/index.html
    {
      name: 'dev-rewrite-class-pretty-url',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = (req.url || '').split('?')[0]
          if (/^\/class\/[^/]+\/?$/.test(url)) {
            const htmlPath = resolve(__dirname, 'class/index.html')
            let html = await fs.readFile(htmlPath, 'utf8')
            html = await server.transformIndexHtml(req.originalUrl, html)
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(html)
            return
          }
          next()
        })
      },
    },
  ],

  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },

  build: {
    rollupOptions: {
      input: {
        main:   resolve(__dirname, 'index.html'),
        search: resolve(__dirname, 'search/index.html'),
        class:  resolve(__dirname, 'class/index.html'),
      },
    },
  },
})
