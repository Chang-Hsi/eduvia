<!-- src/components/LearnersViewingRow.vue -->
<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <h2 class="text-2xl md:text-[28px] font-bold text-gray-900 mb-4">學習者正在檢視</h2>

    <div class="relative">
      <div
        ref="trackRef"
        class="grid grid-flow-col auto-cols-[minmax(280px,1fr)] gap-4 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar"
      >
        <article
          v-for="c in courses"
          :key="c.id"
          class="w-[280px] bg-white rounded-2xl ring-1 ring-black/10 overflow-hidden hover:shadow-md transition snap-start"
        >
          <div class="aspect-[16/9] bg-gray-100">
            <img :src="c.image" :alt="c.title" class="w-full h-full object-cover" />
          </div>

          <div class="p-4">
            <h3 class="font-semibold leading-snug text-gray-900 line-clamp-2">
              {{ c.title }}
            </h3>
            <div class="mt-1 text-sm text-gray-600">{{ c.author }}</div>

            <div class="mt-2 flex items-center gap-1 text-sm">
              <span class="font-semibold text-amber-600">{{ c.rating }}</span>
              <i class="pi pi-star-fill text-amber-400 text-xs"></i>
              <span class="text-gray-500">({{ formatNumber(c.reviews) }})</span>
            </div>

            <div class="mt-2 flex items-center gap-2">
              <span class="text-gray-900 font-semibold">＄{{ c.price }}</span>
              <span v-if="c.orig" class="text-gray-400 line-through">＄{{ c.orig }}</span>
              <span
                v-if="c.badge"
                class="ml-auto text-xs px-2 py-0.5 rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] ring-1 ring-[var(--brand-200)]"
              >
                {{ c.badge }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <button
        v-show="canScrollLeft"
        @click="scroll(-1)"
        class="absolute -left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border shadow flex items-center justify-center hover:bg-gray-50 active:scale-95"
        aria-label="上一頁"
      >
        <i class="pi pi-angle-left text-gray-700"></i>
      </button>

      <button
        v-show="canScrollRight"
        @click="scroll(1)"
        class="absolute -right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border shadow flex items-center justify-center hover:bg-gray-50 active:scale-95"
        aria-label="下一頁"
      >
        <i class="pi pi-angle-right text-gray-700"></i>
      </button>
    </div>
  </section>
</template>

<script setup>
// 重點：加上 canScrollLeft 與共用 scroll(dir)；監聽 resize/scroll 即時更新。
// 若你要固定顯示箭頭，移除 v-show，並在 scroll() 內判斷到邊界就不再移動即可。
import { ref, onMounted, onBeforeUnmount } from "vue";

const trackRef = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(true);

const courses = [
  {
    id: "a1",
    title: "2025 Python全攻略",
    author: "Wilson Ren",
    rating: 4.8,
    reviews: 2335,
    price: 370,
    orig: 440,
    badge: "暢銷課程",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "a2",
    title: "2025 網頁全端開發",
    author: "Wilson Ren",
    rating: 4.8,
    reviews: 2117,
    price: 370,
    orig: 440,
    badge: "暢銷課程",
    image:
      "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "a3",
    title: "AI 大模型應用開發：從小白到高手（LLM Application Development）",
    author: "乾坤 林",
    rating: 4.6,
    reviews: 768,
    price: 370,
    orig: 440,
    badge: "暢銷課程",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "a4",
    title: "AI Agent 最強組合！企業 AI 落地應用聖經：集成 DifyAI、n8n、…",
    author: "成曦 張",
    rating: 4.7,
    reviews: 186,
    price: 400,
    orig: 470,
    badge: "暢銷課程",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "a5",
    title: "MBA 完整商業課程（MBA in a Box in Chinese）",
    author: "365 Careers, Edu Fancy",
    rating: 4.5,
    reviews: 1293,
    price: 370,
    orig: 440,
    badge: "暢銷課程",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "a6",
    title: "資料視覺化實戰：從 0 到圖表講故事",
    author: "Grace Lin",
    rating: 4.7,
    reviews: 4521,
    price: 399,
    orig: 520,
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
  },
];

function formatNumber(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function updateArrows() {
  const el = trackRef.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 0;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
}

function scroll(dir = 1) {
  const el = trackRef.value;
  if (!el) return;
  const step = Math.max(280, Math.floor(el.clientWidth * 0.9)); // 針對 w-[280px] 調整步長
  el.scrollBy({ left: dir * step, behavior: "smooth" });
}

function onScroll() {
  updateArrows();
}

function onResize() {
  updateArrows();
}

onMounted(() => {
  const el = trackRef.value;
  updateArrows();
  el?.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
});

onBeforeUnmount(() => {
  const el = trackRef.value;
  el?.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
});
</script>

<style scoped>
.no-scrollbar {
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
