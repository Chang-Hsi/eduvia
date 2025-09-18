// scripts/prerender-classes.mjs
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "dist");
const BASE_HTML = path.join(OUT_DIR, "class", "index.html");
const COURSES_DIR = path.join(ROOT, "public", "courses");

// ---- env loader：依 NODE_ENV 選檔 ----
(function loadEnv() {
  const mode = (process.env.BUILD_MODE || process.env.NODE_ENV || "production").toLowerCase();
  const candidates = [`.env.${mode}`, ".env"];
  for (const name of candidates) {
    const p = path.join(ROOT, name);
    if (fsSync.existsSync(p)) {
      dotenv.config({ path: p });
      break;
    }
  }
})();

const SITE_URL = (process.env.VITE_SITE_URL || "").replace(/\/+$/, "");
const SITE_NAME = process.env.VITE_SITE_NAME || "Eduvia";
const DEFAULT_OG = process.env.VITE_OG_IMAGE || "";
const SITE_DESC = process.env.VITE_SITE_DESC || "";
const TWITTER = process.env.VITE_TWITTER || "";

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

async function main() {
  // 1) 先讀 dist/class/index.html 當母版
  const baseHtml = await fs.readFile(BASE_HTML, "utf8");

  // 2) 列出 public/courses/*.json
  let files = [];
  try {
    files = (await fs.readdir(COURSES_DIR))
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.join(COURSES_DIR, f));
  } catch {
    console.warn("[prerender] 找不到 public/courses 目錄，跳過。");
    return;
  }

  const urls = [];

  for (const f of files) {
    const raw = await fs.readFile(f, "utf8");
    const course = JSON.parse(raw);
    const id = String(course.id ?? path.basename(f, ".json"));
    const url = `${SITE_URL}/class/${encodeURIComponent(id)}/`;
    const title = `${course.title}｜${SITE_NAME}`;
    const desc = course.seoDescription || course.summary || SITE_DESC || "";
    const ogImage = course.ogImage || DEFAULT_OG || "";

    const outDir = path.join(OUT_DIR, "class", id);
    await ensureDir(outDir);

    const html = injectSeo(baseHtml, {
      title, desc, url, ogImage,
      jsonLd: buildJsonLd(course, url)
    });

    await fs.writeFile(path.join(outDir, "index.html"), html, "utf8");
    urls.push(url);
    console.log(`[prerender] /class/${id}/ 已輸出`);
  }

  // 3) 選配：輸出簡易 sitemap
  if (urls.length) {
    const now = new Date().toISOString();
    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((u) =>
        `  <url>\n    <loc>${esc(u)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`
      ).join("\n") +
      `\n</urlset>\n`;
    await fs.writeFile(path.join(OUT_DIR, "sitemap-class.xml"), xml, "utf8");
    console.log(`[prerender] sitemap-class.xml 已輸出`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
