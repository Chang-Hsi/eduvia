// vite.config.js
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

const ROOT = fileURLToPath(new URL('.', import.meta.url))

/** 開發用：/class/:id/ → 回傳 class/index.html（只在 HTML 導覽時攔截） */
function devRewriteClassPretty() {
  return {
    name: 'dev-rewrite-class-pretty-url',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET') return next()
        const url = (req.url || '').split('?')[0]
        const accept = req.headers.accept || ''
        // 只攔真正的頁面導覽
        if (!accept.includes('text/html')) return next()
        // 僅 /class/:id/（含尾斜線/不含皆可）
        if (!/^\/class\/[^/]+\/?$/.test(url)) return next()

        try {
          const htmlPath = path.join(ROOT, 'class', 'index.html')
          let html = await fs.readFile(htmlPath, 'utf8')
          html = await server.transformIndexHtml(url, html)
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(html)
        } catch (e) {
          next(e)
        }
      })
    }
  }
}

/** 開發用：SPA fallback，但排除 MPA (/class, /search) 與模組/靜態請求 */
function devSpaFallbackExceptMpa() {
  const MPA_PREFIXES = ['/class', '/search']
  const NEVER_INTERCEPT = [
    '/@vite', '/@id', '/__vite_ping', '/node_modules', '/assets', '/src', '/favicon'
  ]
  return {
    name: 'dev-spa-fallback-except-mpa',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET') return next()
        const url = (req.url || '').split('?')[0]
        const accept = req.headers.accept || ''

        // 模組/資源請求直接放行（避免回到 HTML 造成 MIME 錯）
        if (NEVER_INTERCEPT.some(p => url.startsWith(p))) return next()
        if (/\.[a-z0-9]+$/i.test(url)) return next()
        // 只攔頁面導覽
        if (!accept.includes('text/html')) return next()
        // /class /search 交給各自 HTML（MPA）
        if (MPA_PREFIXES.some(p => url.startsWith(p))) return next()

        try {
          let html = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8')
          html = await server.transformIndexHtml(url, html)
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(html)
        } catch (e) {
          next(e)
        }
      })
    }
  }
}

export default defineConfig({
  appType: 'mpa',
  plugins: [
    vue(),
    AutoImport({ imports: ['vue', 'vue-router', '@vueuse/core'], dts: 'src/auto-imports.d.ts' }),
    Components({ dts: 'src/components.d.ts' }),
    tailwindcss(),
    devRewriteClassPretty(),
    devSpaFallbackExceptMpa(),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    rollupOptions: {
      input: {
        main:   path.join(ROOT, 'index.html'),
        search: path.join(ROOT, 'search/index.html'),
        class:  path.join(ROOT, 'class/index.html'),
      },
    },
  },
})
