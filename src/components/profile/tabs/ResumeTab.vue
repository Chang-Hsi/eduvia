<!-- src/components/profile/tabs/ResumeTab.vue 我的履歷tab -->
<template>
  <div class="space-y-6">
    <!-- 手動撰寫履歷卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="rounded-xl bg-[#feaa60] ring-1 ring-black/5 p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-[#feaa60] flex items-center justify-center"
            >
              <i class="pi pi-pencil text-white text-lg"></i>
            </div>
            <div class="text-xl font-semibold text-white">手動撰寫履歷</div>
          </div>
          <button
            class="w-9 h-9 rounded-full bg-white ring-1 ring-black/5 text-amber-600 hover:bg-amber-100"
            @click="onCreate('manual')"
            aria-label="manual resume"
          >
            <i class="pi pi-plus"></i>
          </button>
        </div>
        <p class="mt-3 text-lg text-white">從零開始撰寫，自由展現你的亮點。</p>
      </div>
    </div>

    <!-- 宣傳 Banner -->
    <div
      class="rounded-xl ring-1 ring-black/5 bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600 p-6 text-white"
    >
      <div class="text-2xl md:text-3xl font-extrabold tracking-wide">
        使用 eduvia 履歷編輯器，獲得夢想的工作！
        <span
          class="ml-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-base"
        >
          快速完成設置
        </span>
      </div>
      <div class="mt-1 opacity-90">快速產生、彈性微調，一鍵投遞</div>
    </div>

    <!-- 已建立的履歷 -->
    <div>
      <h3 class="font-bold text-gray-900 text-lg mb-3">已建立的履歷</h3>

      <div class="space-y-4">
        <article
          v-for="r in resumes"
          :key="r.id"
          class="rounded-xl ring-1 ring-black/5 bg-white p-4 flex items-center gap-4"
        >
          <!-- 縮圖 -->
          <div
            class="w-28 h-28 rounded-md bg-gray-100 ring-1 ring-black/5 overflow-hidden flex items-center justify-center text-gray-400"
          >
            <i class="pi pi-file text-xl"></i>
          </div>

          <!-- 中段資訊 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="font-semibold text-gray-900 truncate">{{ r.title }}</h4>
              <span
                v-if="r.progress === 100"
                class="text-xs inline-flex items-center gap-1 text-sky-700"
              >
                <i class="pi pi-check-circle"></i> 100%
              </span>
            </div>
            <div class="text-sm text-gray-500 mt-0.5">
              {{ r.lang }}・{{ r.updated }} 更新
            </div>

            <div class="mt-3 text-sm">
              <span
                v-if="!r.published"
                class="inline-flex items-center gap-1 text-rose-600"
              >
                <i class="pi pi-exclamation-circle"></i> 尚未發布
              </span>
              <span v-else class="inline-flex items-center gap-1 text-gray-600">
                <i class="pi pi-globe"></i> {{ r.visibility }}
              </span>
            </div>

            <div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <button
                class="hover:text-gray-700 inline-flex items-center gap-1"
                @click="download(r)"
              >
                <i class="pi pi-download"></i> 下載
              </button>
            </div>
          </div>

          <!-- 右側操作 -->
          <div class="shrink-0 flex items-center gap-2">
            <Button
              v-if="r.progress === 100"
              size="small"
              outlined
              @click="view(r)"
              label="查看"
            />
            <Button size="small" severity="primary" @click="edit(r)" label="編輯" />
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "primevue/button";
import { useRouter } from "vue-router";

const router = useRouter();

/* 靜態履歷清單 */
const resumes = ref([
  {
    id: "r1",
    title: "我的履歷",
    lang: "履歷標題",
    updated: "2025-09-17",
    published: false,
    visibility: "私密",
    progress: 60,
  },
]);

/* 行為（示意） */

function onCreate() {
  router.push({ name: "resumeCreate" });
}

function view(r) {
  router.push({ name: "resumeDetail", params: { id: r.id } });
}

function edit(r) {
  router.push({ name: "resumeEdit", params: { id: r.id } });
}

function download(r) {
  console.log("download:", r.id);
}
</script>
