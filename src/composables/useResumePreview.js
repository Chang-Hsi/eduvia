import { computed, unref } from "vue";

/** 整理履歷資料給預覽用（共用邏輯） */
export function useResumePreview(resumeRef, sectionOrderRef) {
  const r = resumeRef;

  const summaryHtml = computed(
    () =>
      (r.value && r.value.basic && r.value.basic.summary) ||
      '<p class="text-gray-500">請在左側輸入個人簡介…</p>'
  );

  const hasEdu = computed(() => ((r.value && r.value.educations) || []).length > 0);
  const hasExp = computed(() => ((r.value && r.value.experiences) || []).length > 0);
  const hasSkillItems = computed(() => ((r.value && r.value.skillItems) || []).length > 0);
  const hasProjects = computed(() => ((r.value && r.value.projects) || []).length > 0);

  const normalizedOrder = computed(() => {
    const ALL = ["edu", "skill", "exp", "proj"];
    const input = Array.isArray(unref(sectionOrderRef)) ? unref(sectionOrderRef) : [];
    const seen = new Set();
    const out = [];
    for (const k of input) if (ALL.includes(k) && !seen.has(k)) { seen.add(k); out.push(k); }
    for (const k of ALL) if (!seen.has(k)) out.push(k);
    return out;
  });

  const expEvents = computed(() =>
    ((r.value && r.value.experiences) || [])
      .slice()
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
      .map((e) => ({
        range: `${formatMonth(e.start)} - ${formatMonth(e.end) || "現在"}`,
        title: e.title || "職稱",
        company: e.company || "公司",
        desc: e.desc || "",
      }))
  );

  return {
    r,
    summaryHtml,
    hasEdu,
    hasExp,
    hasSkillItems,
    hasProjects,
    normalizedOrder,
    expEvents,
    formatDate,
    formatMonth,
    shortLink,
  };
}

/* -------- 小工具 -------- */
export function formatMonth(d) {
  if (!d) return "";
  try {
    const dd = new Date(d);
    return `${dd.getFullYear()}/${String(dd.getMonth() + 1).padStart(2, "0")}`;
  } catch {
    return "";
  }
}
export function formatDate(d) {
  try {
    const x = new Date(d);
    return `${x.getFullYear()}/${String(x.getMonth() + 1).padStart(2, "0")}/${String(
      x.getDate()
    ).padStart(2, "0")}`;
  } catch {
    return String(d ?? "").slice(0, 10);
  }
}
export function shortLink(url) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/* -------- 顏色工具（樣式元件會用到） -------- */
export function normalizeHex(v) {
  if (!v) return "#314258";
  let s = String(v).trim().replace(/^#/, "");
  if (s.length === 3) s = s.split("").map((x) => x + x).join("");
  s = s.replace(/[^0-9a-f]/gi, "").slice(0, 6).padEnd(6, "0");
  return "#" + s.toUpperCase();
}
export function shadeHex(hex, percent = -10) {
  const base = normalizeHex(hex);
  const p = Math.max(-100, Math.min(100, percent)) / 100;
  const n = parseInt(base.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 0xff, b = n & 0xff;
  const adj = (c) => Math.round(c + (p < 0 ? c : 255 - c) * p);
  const out = (adj(r) << 16) | (adj(g) << 8) | adj(b);
  return "#" + out.toString(16).padStart(6, "0").toUpperCase();
}
