<!-- src/components/resume/ResumePreview.vue -->
<template>
  <div class="rounded-xl ring-1 ring-black/5 overflow-hidden bg-white">
    <!-- 頂部的頭像與名字 -->
    <section class="relative" :class="themeBg">
      <div
        class="absolute left-6 bottom-0 translate-y-1/2 w-24 h-24 rounded-full ring-4 ring-white overflow-hidden bg-gray-100 shadow"
      >
        <img :src="r.basic.avatarUrl || fallback" class="w-full h-full object-cover" />
      </div>
      <div class="px-6 py-4 pl-36 pt-10">
        <h1
          v-if="r.basic.name"
          class="text-3xl font-extrabold tracking-wide text-white truncate"
        >
          {{ r.basic.name }}
        </h1>
        <h1 v-else class="text-3xl font-extrabold tracking-wide text-white truncate">
          姓名
        </h1>
      </div>
    </section>

    <!-- 頂部的用戶基本資訊列 -->
    <section class="px-6 pt-2 pl-36">
      <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
        <span v-if="r.basic.gender" class="inline-flex items-center gap-2">
          <i class="pi pi-user" />{{ r.basic.gender }}
        </span>
        <span v-if="r.basic.birthday" class="inline-flex items-center gap-1"
          ><i class="pi pi-calendar" />{{ formatDate(r.basic.birthday) }}</span
        >

        <span v-if="r.basic.phone" class="inline-flex items-center gap-2">
          <i class="pi pi-phone" />{{ r.basic.phone }}
        </span>
        <span v-if="r.basic.email" class="inline-flex items-center gap-2 truncate">
          <i class="pi pi-envelope" /><span class="truncate">{{ r.basic.email }}</span>
        </span>
        <a
          v-if="r.basic.siteUrl"
          :href="r.basic.siteUrl"
          target="_blank"
          class="inline-flex items-center gap-2 text-sky-700 hover:underline"
        >
          <i class="pi pi-link" />{{ r.basic.siteTitle || r.basic.siteUrl }}
        </a>
      </div>
    </section>

    <!-- 用戶的簡歷資料 -->
    <div class="p-6 space-y-8 pt-16 px-10">
      <section>
        <h2 class="text-xl font-bold text-gray-900">簡歷</h2>
        <hr class="my-3 border-gray-200" />
        <div class="prose rich max-w-none leading-relaxed" v-html="summaryHtml"></div>
      </section>

      <template v-for="sec in normalizedOrder" :key="sec">
        <section v-if="sec === 'edu' && hasEdu">
          <h2 class="font-semibold text-gray-900 mb-3">學歷</h2>
          <div v-for="(e, i) in r.educations" :key="'edu-' + i" class="mb-4">
            <div class="flex items-center justify-between">
              <div class="font-medium text-gray-900">
                {{ e.school || "學校" }}
                <span class="text-gray-500"
                  >・{{ e.department || "系所" }}（{{ e.degree || "學位" }}）</span
                >
              </div>
              <div class="text-sm text-gray-500">
                {{ formatMonth(e.start) }} - {{ formatMonth(e.end) || "Present" }}
              </div>
            </div>
            <div v-if="e.desc" class="prose rich max-w-none mt-1" v-html="e.desc"></div>
          </div>
        </section>

        <section v-else-if="sec === 'exp' && hasExp">
          <h2 class="font-semibold text-gray-900 mb-3">工作經驗</h2>
          <Timeline :value="expEvents" layout="vertical" class="mt-2">
            <template #opposite="{ item }">
              <div class="w-40 text-right text-sm text-gray-400">{{ item.range }}</div>
            </template>
            <template #marker>
              <span
                class="inline-block w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white"
              ></span>
            </template>
            <template #content="{ item }">
              <div class="pb-6">
                <div class="flex items-baseline justify-between gap-3">
                  <div class="text-lg font-semibold text-gray-900">{{ item.title }}</div>
                  <div class="text-sm text-gray-500 whitespace-nowrap">
                    {{ item.company }}
                  </div>
                </div>
                <div
                  v-if="item.desc"
                  class="prose rich max-w-none mt-1"
                  v-html="item.desc"
                ></div>
              </div>
            </template>
          </Timeline>
        </section>

        <section v-else-if="sec === 'skill' && hasSkillItems">
          <h2 class="font-semibold text-gray-900 mb-3">專業技能</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            <article
              v-for="(s, i) in r.skillItems"
              :key="'skill-' + i"
              class="rounded-lg border border-gray-200 p-4 hover:shadow-sm transition"
            >
              <header class="mb-2">
                <div class="flex items-baseline gap-2 flex-wrap">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ s.name || "技能名稱" }}
                  </h3>
                  <span v-if="s.title" class="text-sm text-gray-500"
                    >· {{ s.title }}</span
                  >
                  <span
                    v-if="s.level"
                    class="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                    >{{ s.level }}</span
                  >
                </div>
                <div v-if="s.keywords" class="mt-2 flex flex-wrap gap-2">
                  <span
                    v-for="(k, j) in s.keywords
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)"
                    :key="'kw-' + i + '-' + j"
                    class="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs"
                  >
                    {{ k }}
                  </span>
                </div>
              </header>
              <div
                v-if="s.desc"
                class="prose rich max-w-none text-gray-700"
                v-html="s.desc"
              ></div>
            </article>
          </div>
        </section>

        <section v-else-if="sec === 'proj' && hasProjects">
          <h2 class="font-semibold text-gray-900 mb-3">專案與作品集</h2>
          <div
            v-for="(p, i) in r.projects"
            :key="'proj-' + i"
            class="flex gap-4 items-start mb-6"
          >
            <div
              class="w-40 h-32 rounded-md overflow-hidden bg-gray-100 ring-1 ring-black/5 grid place-content-center shrink-0"
            >
              <img
                v-if="p.coverUrl"
                :src="p.coverUrl"
                class="w-full h-full object-cover"
              />
              <i v-else class="pi pi-image text-3xl text-gray-300"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline justify-between gap-3">
                <h3 class="text-lg font-semibold text-gray-900 truncate">
                  {{ p.title || "未命名專案" }}
                </h3>
                <a
                  v-if="p.link"
                  :href="p.link"
                  target="_blank"
                  class="text-sm text-sky-600 hover:underline whitespace-nowrap"
                  >{{ shortLink(p.link) }}</a
                >
              </div>
              <div v-if="p.desc" class="prose max-w-none mt-1" v-html="p.desc"></div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, toRef, watch } from "vue";
import Timeline from "primevue/timeline";

const props = defineProps({
  resume: { type: Object, required: true },
  theme: { type: String, default: "classic" },
  lang: { type: String, default: "zh" },
  // 新增：由父層傳入的區塊順序
  sectionOrder: {
    type: Array,
    default: () => ["edu", "skill", "exp", "proj"], // 預設順序
  },
});

const r = toRef(props, "resume");
const fallback =
  "https://media.istockphoto.com/id/1337144146/zh/%E5%90%91%E9%87%8F/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=P_sadMdbYdrMxYXPHD1zLsjvxKrXcl3WoFYeFX1_rcc=";

const themeBg = computed(() =>
  props.theme === "modern" ? "bg-indigo-600" : "bg-slate-700"
);

const summaryHtml = computed(
  () => r.value.basic?.summary || '<p class="text-gray-500">請在左側輸入個人簡介…</p>'
);

const hasEdu = computed(() => (r.value.educations?.length || 0) > 0);
const hasExp = computed(() => (r.value.experiences?.length || 0) > 0);
const hasSkillItems = computed(() => (r.value.skillItems?.length || 0) > 0);
const hasProjects = computed(() => (r.value.projects?.length || 0) > 0);

// 新增：把父層傳入的順序做正規化（去重、補齊缺漏、過濾無效 key）
const normalizedOrder = computed(() => {
  const ALL = ["edu", "skill", "exp", "proj"];
  const input = Array.isArray(props.sectionOrder) ? props.sectionOrder : [];
  const seen = new Set();
  const out = [];
  for (const k of input) {
    if (ALL.includes(k) && !seen.has(k)) {
      seen.add(k);
      out.push(k);
    }
  }
  for (const k of ALL) if (!seen.has(k)) out.push(k);
  return out;
});

// 工作經驗（保留原邏輯）
const expEvents = computed(() =>
  (r.value.experiences || [])
    .slice()
    .sort((a, b) => new Date(b.start) - new Date(a.start))
    .map((e) => ({
      range: `${formatMonth(e.start)} - ${formatMonth(e.end) || "現在"}`,
      title: e.title || "職稱",
      company: e.company || "公司",
      desc: e.desc || "",
    }))
);

function formatMonth(d) {
  if (!d) return "";
  try {
    const dd = new Date(d);
    return `${dd.getFullYear()}/${String(dd.getMonth() + 1).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

function formatDate(d) {
  try {
    const x = new Date(d);
    return `${x.getFullYear()}/${String(x.getMonth() + 1).padStart(2, "0")}/${String(
      x.getDate()
    ).padStart(2, "0")}`;
  } catch {
    return String(d).slice(0, 10);
  }
}

function shortLink(url) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

watch(
  r,
  (val) => {
    console.log("[Preview] resume =>", JSON.parse(JSON.stringify(val)));
  },
  { deep: true, immediate: true }
);
watch(
  () => ({ theme: props.theme, lang: props.lang }),
  (ui) => console.log("[Preview] ui =>", ui),
  { immediate: true }
);
</script>

<style>
.p-timeline-event-opposite {
  flex: none !important;
}
</style>
