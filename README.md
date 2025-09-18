**build 時打後端 → 預渲染每門課SOP**。

---

# 整體流程

1. **後端提供 API**

   * `GET /api/courses?status=published` → 回傳課程清單（含 `id`、`updatedAt`）。
   * `GET /api/courses/:id` → 回傳單一課完整 SEO 需要欄位（`title, summary/seoDescription, ogImage, rating, ratingCount, video{url, thumb, uploadDate}`…）。

2. **前端 build**（本機或 CI 上）

   * 先跑 `vite build` 產生 `dist/`。
   * 再跑 **預渲染腳本**：呼叫後端拿資料，為每個 id 複製一份 `dist/class/<id>/index.html`，把 `<title> / <meta> / OG / JSON-LD` **寫死**進去。

3. **部署**（Netlify/Vercel/靜態主機）

   * 靜態主機直接把 `/class/<id>/` 的 `index.html` 端出；因為是靜態檔，SEO 完整、爬蟲開頁就看得到標籤。

4. **內容更新 → 觸發重建**

   * 後台按「發佈/更新」→ 打 **Build Hook**（Netlify/Vercel 皆有）→ CI 重新跑 build + 預渲染。
   * 若量很大，可做「**只重建變動的 id**」：靠 `updatedAt` 比對或由後端提供差異清單。

---

# 要準備的東西

## (A) 新增後端相關環境變數

`.env.development.local`（本機）與 **Netlify/Vercel 專案環境變數** 都要設：

```bash
# API 位置與認證（名稱自訂）
PRERENDER_API_BASE="http://localhost:8787"       # 例：你的後端 URL（不含尾斜線）
PRERENDER_API_TOKEN=""                           # 若需要 JWT / Token 就放這
# 可選：只渲染某些 id，逗號分隔（用於局部重建或測試）
PRERENDER_ONLY_IDS=""
```

> 注意：**這些不是 VITE\_** 開頭，避免被打包到前端程式；只在 Node 腳本中使用。

---

## (B) 更新預渲染腳本（scripts/prerender-classes.mjs）

> 位置：專案根目錄的 `scripts/`（你之前就有）。這版會「**打後端 API**」而不是讀 public JSON；同時保留「**讀不到就退回 public/courses/**」的保險。

```js
// scripts/prerender-classes.mjs
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const baseClassHtml = path.join(distDir, 'class', 'index.html');

const API_BASE = process.env.PRERENDER_API_BASE?.replace(/\/+$/, '') || '';
const API_TOKEN = process.env.PRERENDER_API_TOKEN || '';
const ONLY_IDS = (process.env.PRERENDER_ONLY_IDS || '').split(',').map(s => s.trim()).filter(Boolean);

// ---- 後端取資料 ----
async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : undefined,
    // 依需要可加 timeout signal
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function getCourseList() {
  if (!API_BASE) return []; // 沒設定 API 就讓它走 fallback
  try {
    const list = await fetchJSON(`${API_BASE}/api/courses?status=published`);
    // 預期 list: [{ id: "10", updatedAt: "2025-09-16T..." }, ...]
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.warn('[prerender] fetch course list failed, fallback to local JSON.', e.message);
    return [];
  }
}

async function getCourseById(id) {
  // 1) 試 API
  if (API_BASE) {
    try {
      const c = await fetchJSON(`${API_BASE}/api/courses/${encodeURIComponent(id)}`);
      return normalizeCourse(c);
    } catch (e) {
      console.warn(`[prerender] fetch course ${id} failed: ${e.message}`);
    }
  }
  // 2) Fallback：public/courses/<id>.json（開發期保險）
  try {
    const p = path.join(root, 'public', 'courses', `${id}.json`);
    const txt = await fs.readFile(p, 'utf8');
    return normalizeCourse(JSON.parse(txt));
  } catch {
    return null;
  }
}

// ---- 正規化成需要的欄位 ----
function normalizeCourse(c) {
  if (!c) return null;
  return {
    id: String(c.id ?? c.slug ?? ''),
    title: c.title || '',
    seoDescription: c.seoDescription || c.summary || '',
    summary: c.summary || '',
    rating: typeof c.rating === 'number' ? c.rating : undefined,
    ratingCount: typeof c.ratingCount === 'number' ? c.ratingCount : undefined,
    ogImage: c.ogImage || c.video?.thumb || '',
    video: c.video ? {
      url: c.video.url || '',
      thumb: c.video.thumb || '',
      uploadDate: c.video.uploadDate || ''
    } : undefined,
    updatedAt: c.updatedAt || '',
  };
}

// ---- 產生 <meta> + JSON-LD ----
function renderHeadMeta(course, siteUrl, siteName) {
  const site = siteUrl.replace(/\/+$/, '');
  const url = `${site}/class/${course.id}/`;
  const title = `${course.title}｜${siteName}`;
  const desc = course.seoDescription || course.summary || '';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": desc,
    "provider": { "@type": "Organization", "name": siteName, "sameAs": site },
    ...(course.rating ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": String(course.rating.toFixed(1)),
        "reviewCount": course.ratingCount || 0
      }
    } : {}),
    ...(course.video?.url ? {
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "location": { "@type": "VirtualLocation", "url": url },
        "video": {
          "@type": "VideoObject",
          "name": `${course.title} 預覽`,
          "thumbnailUrl": course.video.thumb || course.ogImage || '',
          "uploadDate": course.video.uploadDate || undefined,
          "contentUrl": course.video.url
        }
      }
    } : {})
  };

  return `
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}">
  <link rel="canonical" href="${escapeHtml(url)}">
  <meta property="og:site_name" content="${escapeHtml(siteName)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(desc)}">
  ${course.ogImage ? `<meta property="og:image" content="${escapeHtml(course.ogImage)}">` : ''}
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <!-- prerender:course-meta -->
  `.trim();
}

function escapeHtml(s='') {
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

// ---- 寫檔：複製 class/index.html → class/<id>/index.html 並替換 meta ----
async function writeCoursePage(course) {
  const siteUrl = process.env.VITE_SITE_URL || '';
  const siteName = process.env.VITE_SITE_NAME || 'Eduvia';
  const htmlPath = path.join(distDir, 'class', course.id, 'index.html');

  // 確保目錄存在
  await fs.mkdir(path.dirname(htmlPath), { recursive: true });

  // 以 dist/class/index.html 為基底
  let base = await fs.readFile(baseClassHtml, 'utf8');

  const metaBlock = renderHeadMeta(course, siteUrl, siteName);

  // 有占位就替換，沒有就插在 </head> 前
  if (base.includes('<!-- prerender:course-meta -->')) {
    base = base.replace('<!-- prerender:course-meta -->', metaBlock);
  } else {
    base = base.replace('</head>', `\n${metaBlock}\n</head>`);
  }

  // 順手把「預設（無 id 時）」的 <title> 移除避免重複（保險）
  base = base.replace(/<title>[^<]*<\/title>/i, (m) =>
    metaBlock.includes('<title>') ? '' : m
  );

  await fs.writeFile(htmlPath, base, 'utf8');
  return htmlPath;
}

async function main() {
  // 檢查 base 檔
  try { await fs.access(baseClassHtml); } 
  catch { throw new Error(`找不到 ${baseClassHtml}，請先跑：vite build`); }

  // 取得要處理的 id 清單
  let ids = ONLY_IDS.length ? ONLY_IDS : (await getCourseList()).map(x => String(x.id));

  // 若後端沒提供清單，就沿用 public/courses/*.json 的檔名
  if (!ids.length) {
    try {
      const files = await fs.readdir(path.join(root, 'public', 'courses'));
      ids = files.filter(f => f.endsWith('.json')).map(f => path.basename(f, '.json'));
    } catch {}
  }

  if (!ids.length) {
    console.warn('[prerender] 沒有可處理的課程 id，跳過。');
    return;
  }

  console.log(`[prerender] 處理 ${ids.length} 門課：`, ids.join(', '));

  // 逐一拉資料、寫檔（可視需求改成並發）
  for (const id of ids) {
    const c = await getCourseById(id);
    if (!c || !c.id) {
      console.warn(`[prerender] 略過 id=${id}（無法取得資料）`);
      continue;
    }
    const out = await writeCoursePage(c);
    console.log('  ✔', out.replace(root + path.sep, ''));
  }

  // 額外：可在這裡順手生成 sitemap.xml（略）
}

main().catch((e) => {
  console.error('[prerender] 失敗：', e);
  process.exit(1);
});
```

---

## (C) 調整 `package.json` scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:prerender": "node scripts/prerender-classes.mjs",
    "build:all": "npm run build && npm run build:prerender",
    "preview": "vite preview"
  }
}
```

> 本機測試：
>
> * 完整流程：`npm run build:all` → `npm run preview` → 打開 `http://localhost:4173/class/10/`
> * 只渲染特定 id：
>   `PRERENDER_ONLY_IDS=10,11 npm run build:all`

---
