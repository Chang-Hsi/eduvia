// scripts/prerender-classes.mjs
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "dist");
const BASE_HTML = path.join(OUT_DIR, "class", "index.html");   // build 後的母版
const COURSES_DIR = path.join(ROOT, "public", "courses");      // 假資料來源

// ── 讀取 .env（依據 BUILD_MODE / NODE_ENV） ───────────────────────────
(function loadEnv() {
  const mode = (process.env.BUILD_MODE || process.env.NODE_ENV || "production").toLowerCase();
  for (const name of [`.env.${mode}`, ".env"]) {
    const p = path.join(ROOT, name);
    if (fsSync.existsSync(p)) { dotenv.config({ path: p }); break; }
  }
})();

const SITE_URL   = (process.env.VITE_SITE_URL || "").replace(/\/+$/, ""); // 無尾斜線
const SITE_NAME  = process.env.VITE_SITE_NAME || "Eduvia";
const DEFAULT_OG = process.env.VITE_OG_IMAGE || "";
const SITE_DESC  = process.env.VITE_SITE_DESC || "";
const TWITTER    = process.env.VITE_TWITTER || "";

// ── 小工具 ─────────────────────────────────────────────────────────
function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildJsonLd(course, url) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.seoDescription || course.summary || SITE_DESC || "",
    "provider": { "@type": "Organization", "name": SITE_NAME, "sameAs": SITE_URL || undefined }
  };
  if (course.rating && course.ratingCount >= 0) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": Number(course.rating).toFixed(1),
      "reviewCount": course.ratingCount || 0
    };
  }
  if (course.video?.url) {
    ld.hasCourseInstance = {
      "@type": "CourseInstance",
      "courseMode": "online",
      "location": { "@type": "VirtualLocation", "url": url },
      "video": {
        "@type": "VideoObject",
        "name": course.title + " 預覽",
        "thumbnailUrl": course.video.thumb || DEFAULT_OG || undefined,
        "uploadDate": course.video.uploadDate || undefined,
        "contentUrl": course.video.url
      }
    };
  }
  return JSON.stringify(ld);
}

function injectSeo(baseHtml, { title, desc, url, ogImage, jsonLd }) {
  let html = baseHtml
    // 清掉舊 description / OG / Twitter / canonical / JSON-LD
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, "")
    .replace(/<meta\s+property="og:[^"]+"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "")
    .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi, "");

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);

  const block = [
    `<meta name="description" content="${esc(desc)}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : "",
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    TWITTER ? `<meta name="twitter:site" content="${esc(TWITTER)}">` : "",
    `<script type="application/ld+json">${jsonLd}</script>`,
    "<!-- prerender:course-meta -->"
  ].filter(Boolean).join("\n    ");

  return html.replace("</head>", `  ${block}\n</head>`);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

// ── sitemap 輸出工具 ───────────────────────────────────────────────
async function writeSitemap(filename, items) {
  const body = items.map(i => 
`  <url>
    <loc>${esc(i.loc)}</loc>
    ${i.lastmod ? `<lastmod>${i.lastmod}</lastmod>` : ""}
    ${i.changefreq ? `<changefreq>${i.changefreq}</changefreq>` : ""}
  </url>`).join("\n");

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  await fs.writeFile(path.join(OUT_DIR, filename), xml, "utf8");
}

async function writeSitemapIndex(filename, sitemapFiles) {
  const now = new Date().toISOString();
  const body = sitemapFiles.map(f => 
`  <sitemap>
    <loc>${esc(`${SITE_URL}/${f}`)}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join("\n");

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
  await fs.writeFile(path.join(OUT_DIR, filename), xml, "utf8");
}

async function writeRobotsTxt() {
  const robots = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml
`;
  await fs.writeFile(path.join(OUT_DIR, "robots.txt"), robots, "utf8");
}

// ── 主流程 ─────────────────────────────────────────────────────────
async function main() {
  // 1) 讀 dist/class/index.html 當母版
  const baseHtml = await fs.readFile(BASE_HTML, "utf8");

  // 2) 讀 public/courses/*.json（你現在用這邊的假資料；未來可改成打 API）
  let files = [];
  try {
    files = (await fs.readdir(COURSES_DIR))
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.join(COURSES_DIR, f));
  } catch {
    console.warn("[prerender] 找不到 public/courses 目錄，跳過。");
    return;
  }

  const classItems = []; // 用來寫 sitemap-class.xml
  const nowIso = new Date().toISOString();

  for (const f of files) {
    const raw = await fs.readFile(f, "utf8");
    const course = JSON.parse(raw);

    const id  = String(course.id ?? path.basename(f, ".json"));
    const url = `${SITE_URL}/class/${encodeURIComponent(id)}/`;
    const title   = `${course.title}｜${SITE_NAME}`;
    const desc    = course.seoDescription || course.summary || SITE_DESC || "";
    const ogImage = course.ogImage || DEFAULT_OG || "";

    // 預渲染出 /dist/class/:id/index.html
    const outDir = path.join(OUT_DIR, "class", id);
    await ensureDir(outDir);
    const html = injectSeo(baseHtml, {
      title, desc, url, ogImage,
      jsonLd: buildJsonLd(course, url)
    });
    await fs.writeFile(path.join(outDir, "index.html"), html, "utf8");
    console.log(`[prerender] /class/${id}/ 已輸出`);

    // 收集 sitemap item（lastmod 有就用，沒有用 build 時間）
    const lastmod = course.updatedAt ? new Date(course.updatedAt).toISOString() : nowIso;
    classItems.push({ loc: url, lastmod, changefreq: "weekly" });
  }

  // 3) 生成 sitemaps + index + robots.txt
  // 3-1) 靜態頁
  const staticItems = [
    { loc: `${SITE_URL}/`,       lastmod: nowIso, changefreq: "weekly" },
    { loc: `${SITE_URL}/class/`, lastmod: nowIso, changefreq: "weekly" },
  ];
  await writeSitemap("sitemap-static.xml", staticItems);

  // 3-2) 課程頁
  if (classItems.length) {
    await writeSitemap("sitemap-class.xml", classItems);
  }

  // 3-3) sitemap index（入口）
  const entries = ["sitemap-static.xml"];
  if (classItems.length) entries.push("sitemap-class.xml");
  await writeSitemapIndex("sitemap.xml", entries);

  // 3-4) robots.txt
  await writeRobotsTxt();

  console.log("[prerender] sitemap.xml、sitemap-static.xml、sitemap-class.xml、robots.txt 已輸出");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
