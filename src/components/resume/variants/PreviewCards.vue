<template>
  <div class="rounded-xl ring-1 ring-black/5 overflow-hidden bg-white">
    <header class="px-6 py-6 bg-white border-b border-gray-200">
      <div class="flex items-center gap-4">
        <div class="w-24 h-24 rounded-full overflow-hidden ring-1 ring-black/10 bg-white">
          <img :src="r.basic?.avatarUrl || fallback" class="w-full h-full object-cover" />
        </div>
        <div class="min-w-0">
          <h1 class="text-2xl font-bold text-gray-900 truncate">
            {{ r.basic?.name || "卡片名字" }}
          </h1>
          <div
            class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500"
          >
            <span v-if="r.basic?.gender" class="inline-flex items-center gap-1"
              ><i class="pi pi-user" />{{ r.basic.gender }}</span
            >
            <span v-if="r.basic?.birthday" class="inline-flex items-center gap-1"
              ><i class="pi pi-calendar" />{{ formatDate(r.basic.birthday) }}</span
            >
            <span v-if="r.basic?.phone" class="inline-flex items-center gap-1"
              ><i class="pi pi-phone" />{{ r.basic.phone }}</span
            >
            <span v-if="r.basic?.email" class="inline-flex items-center gap-1"
              ><i class="pi pi-envelope" />{{ r.basic.email }}</span
            >
            <a
              v-if="r.basic?.siteUrl"
              :href="r.basic.siteUrl"
              target="_blank"
              class="inline-flex items-center gap-1 text-sky-700 hover:underline"
              ><i class="pi pi-link" />{{ r.basic.siteTitle || r.basic.siteUrl }}</a
            >
          </div>
        </div>
      </div>
    </header>

    <div class="p-6 space-y-6">
      <article
        class="rounded-lg border shadow ring-1 ring-black/5 bg-white"
        :style="accentBorder"
      >
        <header class="px-5 py-3 border-b" :style="accentBorder">
          <h2 class="text-lg font-semibold text-gray-900">簡歷</h2>
        </header>
        <div class="p-5">
          <div class="prose rich max-w-none leading-relaxed" v-html="summaryHtml"></div>
        </div>
      </article>

      <template v-for="sec in normalizedOrder" :key="sec">
        <article
          v-if="sec === 'edu' && hasEdu"
          class="rounded-lg border shadow ring-1 ring-black/5 bg-white"
          :style="accentBorder"
        >
          <header class="px-5 py-3 border-b" :style="accentBorder">
            <h2 class="text-lg font-semibold text-gray-900">學歷</h2>
          </header>
          <div class="p-5 space-y-4">
            <div v-for="(e, i) in r.educations" :key="'edu-' + i">
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
          </div>
        </article>

        <article
          v-else-if="sec === 'exp' && hasExp"
          class="rounded-lg border shadow ring-1 ring-black/5 bg-white"
          :style="accentBorder"
        >
          <header class="px-5 py-3 border-b" :style="accentBorder">
            <h2 class="text-lg font-semibold text-gray-900">工作經驗</h2>
          </header>
          <div class="p-5">
            <div
              v-for="(item, idx) in expEvents"
              :key="'exp-' + idx"
              class="pb-5 last:pb-0"
            >
              <div class="flex items-baseline justify-between gap-3">
                <div class="text-base font-semibold text-gray-900">{{ item.title }}</div>
                <div class="text-sm text-gray-500 whitespace-nowrap">
                  {{ item.company }}
                </div>
              </div>
              <div class="text-xs text-gray-400">{{ item.range }}</div>
              <div
                v-if="item.desc"
                class="prose rich max-w-none mt-1"
                v-html="item.desc"
              ></div>
            </div>
          </div>
        </article>

        <article
          v-else-if="sec === 'skill' && hasSkillItems"
          class="rounded-lg border shadow ring-1 ring-black/5 bg-white"
          :style="accentBorder"
        >
          <header class="px-5 py-3 border-b" :style="accentBorder">
            <h2 class="text-lg font-semibold text-gray-900">專業技能</h2>
          </header>
          <div class="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
            <div
              v-for="(s, i) in r.skillItems"
              :key="'skill-' + i"
              class="rounded border border-gray-200 p-4"
            >
              <div class="flex items-baseline gap-2 flex-wrap">
                <h3 class="font-semibold text-gray-900">{{ s.name || "技能名稱" }}</h3>
                <span v-if="s.title" class="text-sm text-gray-500">· {{ s.title }}</span>
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
                  >{{ k }}</span
                >
              </div>
              <div
                v-if="s.desc"
                class="prose rich max-w-none text-gray-700 mt-2"
                v-html="s.desc"
              ></div>
            </div>
          </div>
        </article>

        <article
          v-else-if="sec === 'proj' && hasProjects"
          class="rounded-lg border shadow ring-1 ring-black/5 bg-white"
          :style="accentBorder"
        >
          <header class="px-5 py-3 border-b" :style="accentBorder">
            <h2 class="text-lg font-semibold text-gray-900">專案與作品集</h2>
          </header>
          <div class="p-5 space-y-5">
            <div
              v-for="(p, i) in r.projects"
              :key="'proj-' + i"
              class="flex gap-4 items-start"
            >
              <div
                class="w-36 h-28 rounded-md overflow-hidden bg-gray-100 ring-1 ring-black/5 grid place-content-center shrink-0"
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
                  <h3 class="font-semibold text-gray-900 truncate">
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
          </div>
        </article>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, toRef } from "vue";
import {
  useResumePreview,
  normalizeHex,
  shadeHex,
  formatDate,
  formatMonth,
  shortLink,
} from "@/composables/useResumePreview";

const props = defineProps({
  resume: { type: Object, required: true },
  sectionOrder: { type: Array, default: () => ["edu", "skill", "exp", "proj"] },
  primaryColor: { type: String, default: "#314258" },
  template: { type: String, default: "Cards" },
  theme: { type: String, default: "classic" },
  lang: { type: String, default: "zh" },
});

const {
  r,
  summaryHtml,
  hasEdu,
  hasExp,
  hasSkillItems,
  hasProjects,
  normalizedOrder,
  expEvents,
} = useResumePreview(toRef(props, "resume"), toRef(props, "sectionOrder"));

const fallback =
  "https://media.istockphoto.com/id/1337144146/zh/%E5%90%91%E9%87%8F/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=P_sadMdbYdrMxYXPHD1zLsjvxKrXcl3WoFYeFX1_rcc=";

// 卡片標題的主色重點線
const accentBorder = computed(() => {
  const base = normalizeHex(props.primaryColor);
  const dark = shadeHex(base, -12);
  return {
    borderColor: dark,
    boxShadow: `inset 4px 0 0 0 ${base}`,
  };
});
</script>
