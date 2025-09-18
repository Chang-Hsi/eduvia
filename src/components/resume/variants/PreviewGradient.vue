<template>
  <div class="rounded-xl ring-1 ring-black/5 overflow-hidden bg-white">
    <!-- ============== 第一區：頂部 + 簡歷 + 聯絡資訊（同一個 section） ============== -->
    <section class="relative overflow-hidden">
      <!-- 背景點綴 -->

      <!-- 基本資料 -->
      <div class="flex gap-6 w-full p-10">
        <!-- 頭像 -->
        <div>
          <img :src="r.basic?.avatarUrl || fallback" class="w-48 object-cover" />
        </div>
        <div class="flex flex-col">
          <!-- 姓名 與 生日 -->
          <div class="flex w-full justify-between items-center py-3">
            <!-- 姓名 -->
            <h1 class="text-3xl font-extrabold tracking-wide text-black/80 truncate">
              {{ r.basic?.name || "姓名" }}
            </h1>
            <!-- 右上角：生日 / 性別 -->
            <div class="text-black/80 text-sm">
              <span v-if="r.basic?.birthday">{{ formatDate(r.basic.birthday) }}</span>
              <span v-if="r.basic?.gender" class="ml-2">{{ r.basic.gender }}</span>
            </div>
          </div>

          <!-- 簡歷 + 聯絡資訊（白底區） -->
          <div class="bg-white">
            <div class="prose rich max-w-none leading-relaxed" v-html="summaryHtml"></div>

            <!-- 聯絡資訊列 -->
            <div
              class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600"
            >
              <a
                v-if="r.basic?.siteUrl"
                :href="r.basic.siteUrl"
                target="_blank"
                class="inline-flex items-center gap-2 hover:underline"
                :style="{ color: primary }"
              >
                <i class="pi pi-link" />{{ r.basic.siteTitle || r.basic.siteUrl }}
              </a>
              <span v-if="r.basic?.phone" class="inline-flex items-center gap-2"
                ><i class="pi pi-phone" />{{ r.basic.phone }}</span
              >
              <span v-if="r.basic?.email" class="inline-flex items-center gap-2"
                ><i class="pi pi-envelope" />{{ r.basic.email }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============== 內容區 ============== -->
    <div class="p-6 space-y-10 px-10">
      <!-- 依排序渲染 -->
      <template v-for="sec in normalizedOrder" :key="sec">
        <!-- 工作經驗（條列） -->
        <section v-if="sec === 'exp' && hasExp">
          <SectionHeader text="工作經驗" :color="primary" />
          <div class="mt-4 space-y-8">
            <div
              v-for="(item, idx) in expEvents"
              :key="'exp-' + idx"
              class="relative pl-6"
            >
              <span class="absolute left-0 top-1.5 text-base" :style="{ color: primary }"
                >✦</span
              >
              <div class="text-xs text-gray-400">{{ item.range }}</div>
              <div class="mt-1 text-lg font-semibold text-gray-900">{{ item.title }}</div>
              <div class="text-sm text-gray-600">{{ item.company }}</div>
              <div
                v-if="item.desc"
                class="prose rich max-w-none mt-2"
                v-html="item.desc"
              ></div>
            </div>
          </div>
        </section>

        <!-- 專業技能（網格卡片） -->
        <section v-else-if="sec === 'skill' && hasSkillItems">
          <SectionHeader text="專業技能" :color="primary" />
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <article
              v-for="(s, i) in r.skillItems"
              :key="'skill-' + i"
              class="rounded-lg border border-gray-200 p-4 hover:shadow-sm transition bg-white"
            >
              <header class="mb-2">
                <div class="flex items-baseline gap-2">
                  <h3 class="text-base font-semibold text-gray-900">
                    {{ s.name || "技能名稱" }}
                  </h3>
                  <span v-if="s.title" class="text-xs text-gray-500"
                    >· {{ s.title }}</span
                  >
                  <span
                    v-if="s.level"
                    class="ml-auto text-[11px] px-2 py-0.5 rounded-full"
                    :style="{ backgroundColor: badgeBg, color: badgeFg }"
                  >
                    {{ s.level }}
                  </span>
                </div>

                <div v-if="s.keywords" class="mt-2 flex flex-wrap gap-2">
                  <span
                    v-for="(k, j) in s.keywords
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)"
                    :key="'kw-' + i + '-' + j"
                    class="px-2 py-0.5 rounded text-[11px]"
                    :style="{ backgroundColor: chipBg, color: chipFg }"
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

        <!-- 專案與作品集（左圖右文） -->
        <section v-else-if="sec === 'proj' && hasProjects">
          <SectionHeader text="專案與作品集" :color="primary" />
          <div class="mt-4 space-y-6">
            <div
              v-for="(p, i) in r.projects"
              :key="'proj-' + i"
              class="flex gap-4 items-start"
            >
              <div
                class="w-56 h-36 rounded-md overflow-hidden bg-gray-100 ring-1 ring-black/5 grid place-content-center shrink-0"
              >
                <img
                  v-if="p.coverUrl"
                  :src="p.coverUrl"
                  class="w-full h-full object-cover"
                />
                <i v-else class="pi pi-image text-3xl text-gray-300"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-baseline gap-2">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ p.title || "未命名專案" }}
                  </h3>
                  <a
                    v-if="p.link"
                    :href="p.link"
                    target="_blank"
                    class="text-sm hover:underline flex items-center gap-1"
                    :style="{ color: primary }"
                  >
                    <span>{{ shortLink(p.link) }}</span>
                    <i class="pi pi-external-link text-xs"></i>
                  </a>
                </div>
                <div v-if="p.desc" class="prose max-w-none mt-1" v-html="p.desc"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 學歷 -->
        <section v-else-if="sec === 'edu' && hasEdu">
          <SectionHeader text="學歷" :color="primary" />
          <div class="mt-4 space-y-8">
            <div v-for="(e, i) in r.educations" :key="'edu-' + i" class="relative pl-6">
              <span class="absolute left-0 top-1 text-base" :style="{ color: primary }"
                >✦</span
              >
              <div class="text-xs text-gray-400">
                {{ formatMonth(e.start) }} - {{ formatMonth(e.end) || "Present" }}
              </div>
              <div class="mt-1 text-base font-semibold text-gray-900">
                {{ e.school || "學校" }}
              </div>
              <div class="text-sm text-gray-600">
                {{ e.department || "系所" }}／{{ e.degree || "學位" }}
              </div>
              <div v-if="e.desc" class="prose rich max-w-none mt-2" v-html="e.desc"></div>
            </div>
          </div>
        </section>
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
  template: { type: String, default: "Gradient" },
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

// 主色與漸層
const primary = computed(() => normalizeHex(props.primaryColor));
const primaryDark = computed(() => shadeHex(primary.value, -12));
const primaryLight = computed(() => shadeHex(primary.value, 14));

const headerStyle = computed(() => ({
  background: `linear-gradient(135deg, ${primaryDark.value} 0%, ${primary.value} 55%, ${primaryLight.value} 100%)`,
}));
const radialGradient = computed(
  () => `radial-gradient(circle at center, ${primaryLight.value}, transparent 60%)`
);

// 輔助色：分隔線 / 標籤
const badgeBg = computed(() => shadeHex(primary.value, 78));
const badgeFg = computed(() => shadeHex(primary.value, -80));
const chipBg = computed(() => shadeHex(primary.value, 88));
const chipFg = computed(() => shadeHex(primary.value, -85));
</script>

<script>
// 區塊標題：星號 + 長分隔線（依主色）
export default {
  components: {
    SectionHeader: {
      props: { text: String, color: String },
      template: `
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-gray-900">{{ text }}</h2>
          <span class="text-base" :style="{ color }">✷</span>
          <span class="flex-1 h-px" :style="{ backgroundColor: color, opacity: 0.35 }"></span>
        </div>
      `,
    },
  },
};
</script>

<style>
/* 不需要 Timeline；保留空樣式以防外部覆蓋 */
</style>
