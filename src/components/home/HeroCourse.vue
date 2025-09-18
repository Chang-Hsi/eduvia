<!-- src/components/HeroCourse.vue -->
<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <div
      class="text-sm text-gray-600 flex items-center gap-6 overflow-x-auto no-scrollbar"
    >
      <button
        v-for="c in chips"
        :key="c.key"
        @click="active = c.key"
        :class="[
          'shrink-0 h-12 px-5 rounded-full border flex items-center gap-2 transition',
          active === c.key
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-white text-gray-800 hover:bg-gray-50',
        ]"
      >
        <span class="font-semibold">{{ c.label }}</span>
        <span class="text-xs opacity-80">{{ c.learners }}</span>
      </button>
    </div>

    <div class="mt-6 relative">
      <button
        v-show="canScrollLeft"
        @click="scrollCards(-1)"
        class="absolute -left-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white border shadow flex items-center justify-center"
      >
        <i class="pi pi-angle-left"></i>
      </button>

      <div
        ref="cardsRef"
        class="grid grid-flow-col auto-cols-[minmax(280px,1fr)] gap-4 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar"
      >
        <article
          v-for="c in visibleCourses"
          :key="c.id"
          class="w-[280px] snap-start bg-white rounded-2xl ring-1 ring-black/10 overflow-hidden hover:shadow-md transition"
        >
          <div class="aspect-[16/9] bg-gray-100">
            <img :src="c.image" :alt="c.title" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <h3 class="line-clamp-2 font-semibold leading-snug text-gray-900">
              {{ c.title }}
            </h3>
            <div class="mt-1 text-sm text-gray-500">{{ c.author }}</div>
            <div class="mt-2 flex items-center gap-1 text-sm">
              <span class="font-semibold text-amber-600">{{ c.rating }}</span>
              <i class="pi pi-star-fill text-amber-400 text-xs"></i>
              <span class="text-gray-500">({{ formatNumber(c.reviews) }})</span>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <span class="text-gray-900 font-semibold">＄{{ c.price }}</span>
              <span class="text-gray-400 line-through" v-if="c.orig">＄{{ c.orig }}</span>
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
        v-show="canScrollRight"
        @click="scrollCards(1)"
        class="absolute -right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white border shadow flex items-center justify-center"
      >
        <i class="pi pi-angle-right"></i>
      </button>
    </div>

    <div class="mt-4">
      <Button
        size="small"
        variant="outlined"
        class="rounded-full"
        :label="`顯示所有${currentChipLabel}課程`"
        @click="goAll"
      />
    </div>
  </section>
</template>

<script setup>
// 說明：不在 <template> 放註解，所有說明集中在這裡。
// 這個元件做三件事：
// 1) 類別膠囊：可水平滑動，點擊切換 active 類別。
// 2) 卡片列：橫向可滑、帶左右箭頭，會依 active 類別篩選。
// 3) 底部按鈕：顯示所有該類別課程（此處以 console 模擬，可接路由）。

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Button from "primevue/button";

const chips = [
  { key: "chatgpt", label: "ChatGPT", learners: "4M+位學習者" },
  { key: "datasci", label: "資料科學", learners: "8M+位學習者" },
  { key: "python", label: "Python", learners: "49.9M+位學習者" },
  { key: "ml", label: "機器學習", learners: "9M+位學習者" },
  { key: "dl", label: "深度學習", learners: "2M+位學習者" },
  { key: "ai", label: "人工智慧 (AI)", learners: "4M+位學習者" },
  { key: "stat", label: "統計學", learners: "1M+位學習者" },
  { key: "nlp", label: "自然語言處理 (NLP)", learners: "866,900+位學習者" },
];

const courses = [
  {
    id: "c1",
    cat: "chatgpt",
    title:
      "2025 最新：企業內訓及職場新鮮人必學！ChatGPT 實戰應用 - 讓 AI 成為你的超級助理",
    author: "成曦 張",
    rating: 4.6,
    reviews: 13000,
    price: 370,
    orig: 440,
    badge: "暢銷課程",
    image:
      "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "c2",
    cat: "chatgpt",
    title: "ChatGPT：釋放 AI 生產力的無限潛能",
    author: "经本正一 HaitaoWang",
    rating: 4.6,
    reviews: 222,
    price: 370,
    orig: 440,
    badge: "暢銷課程",
    image:
      "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "c3",
    cat: "chatgpt",
    title: "Generative AI 第一部：從 LangChain 接入 ChatGPT 到製作你的第一個助手",
    author: "Ken Cen",
    rating: 4.7,
    reviews: 855,
    price: 370,
    orig: 440,
    badge: "暢銷課程",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "c4",
    cat: "chatgpt",
    title: "The Complete AI Guide: Learn ChatGPT, Generative AI & More",
    author: "Julian Melanson, Benza Maman",
    rating: 4.5,
    reviews: 52783,
    price: 380,
    orig: 450,
    badge: "暢銷課程",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
  },
  // 其它類別示範
  {
    id: "c5",
    cat: "python",
    title: "Python 從零到百：資料分析入門到實戰",
    author: "Alex Chen",
    rating: 4.7,
    reviews: 10450,
    price: 399,
    orig: 520,
    badge: "暢銷課程",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "c6",
    cat: "ml",
    title: "機器學習基石：監督式學習到模型評估",
    author: "Yi Wang",
    rating: 4.6,
    reviews: 3512,
    price: 420,
    orig: 560,
    image:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "c7",
    cat: "datasci",
    title: "資料科學工具箱：Pandas / NumPy / Matplotlib 一次搞懂",
    author: "Grace Lin",
    rating: 4.7,
    reviews: 9800,
    price: 399,
    orig: 499,
    image:
      "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "c8",
    cat: "ai",
    title: "AI 產品導論：從概念到落地",
    author: "Michael Wu",
    rating: 4.5,
    reviews: 1600,
    price: 360,
    orig: 460,
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop",
  },
];

const active = ref("chatgpt");
const cardsRef = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(true);

const visibleCourses = computed(() => courses.filter((c) => c.cat === active.value));
const currentChipLabel = computed(
  () => chips.find((c) => c.key === active.value)?.label || ""
);

function formatNumber(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function updateScrollState() {
  const el = cardsRef.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 0;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
}

function scrollCards(dir = 1) {
  const el = cardsRef.value;
  if (!el) return;
  const step = Math.max(320, el.clientWidth / 3);
  el.scrollBy({ left: dir * step, behavior: "smooth" });
}

function goAll() {
  console.log("顯示所有", currentChipLabel.value, "課程");
}

function onResize() {
  updateScrollState();
}

onMounted(() => {
  const el = cardsRef.value;
  updateScrollState();
  el?.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
});

onBeforeUnmount(() => {
  const el = cardsRef.value;
  el?.removeEventListener("scroll", updateScrollState);
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
