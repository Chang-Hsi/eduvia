<!-- src/components/SearchBanner.vue -->
<template>
  <section class="relative" :style="bannerBgStyle">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div class="text-sm text-gray-500 mb-2">探索</div>
      <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
        所有領域
      </h1>

      <div class="flex flex-wrap gap-3 mb-10">
        <Button
          v-for="c in categories"
          :key="c"
          :label="c"
          size="small"
          :outlined="selectedCategory !== c"
          :severity="selectedCategory === c ? 'secondary' : null"
          class="!rounded-full"
          @click="selectCategory(c)"
        />
      </div>

      <h2 class="text-xl md:text-2xl font-semibold text-gray-900 mb-4">近期熱門</h2>

      <div class="relative">
        <Carousel
          :value="displayCourses"
          :numVisible="2"
          :numScroll="1"
          :circular="true"
          :responsiveOptions="carouselResponsive"
          class="rounded-2xl"
        >
          <template #item="{ data }">
            <article
              class="group rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden mx-3"
            >
              <div class="grid grid-cols-12 gap-4 p-4">
                <div class="col-span-12 md:col-span-5">
                  <img
                    :src="data.cover"
                    :alt="data.title"
                    class="w-full h-40 md:h-44 object-cover rounded-xl"
                    loading="lazy"
                  />
                </div>
                <div class="col-span-12 md:col-span-7 flex flex-col">
                  <div class="inline-flex items-center gap-2 text-xs font-semibold mb-1">
                    <span class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600"
                      >課程</span
                    >
                    <span
                      v-if="data.badge"
                      class="px-1.5 py-0.5 rounded bg-orange-50 text-orange-600"
                      >限時優惠</span
                    >
                  </div>
                  <div class="text-gray-900 font-semibold leading-snug mb-1">
                    {{ data.title }}
                  </div>
                  <div class="text-gray-500 text-sm mb-2">by {{ data.author }}</div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 mb-3">
                    <i class="pi pi-star-fill text-amber-400"></i>
                    <span>{{ data.rating }}</span>
                    <span>· {{ data.hours }} 小時</span>
                    <span>· {{ data.students.toLocaleString() }} 人</span>
                  </div>
                  <div class="mt-auto">
                    <div class="text-gray-900 font-bold">
                      NT$ {{ data.price.toLocaleString() }}
                    </div>
                    <div class="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-emerald-500"
                        :style="{ width: data.progress + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </template>
        </Carousel>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import Button from "primevue/button";
import Carousel from "primevue/carousel";
import searchBg from "@/assets/imgs/Search_bg.jpg";

const bannerBgStyle = {
  backgroundImage: `url(${searchBg})`,
  backgroundRepeat: "repeat",
  backgroundSize: "auto",
  backgroundPosition: "top center",
};

const categories = [
  "音樂",
  "語言",
  "攝影",
  "藝術",
  "設計",
  "人文",
  "行銷",
  "程式",
  "投資理財",
  "職場技能",
  "手作",
  "生活品味",
];

const selectedCategory = ref(null);
function selectCategory(c) {
  selectedCategory.value = selectedCategory.value === c ? null : c;
}

const courses = ref([
  {
    id: 1,
    category: "Python",
    title: "Python 6 小時初學者課程 (2023)",
    author: "邱惠文",
    rating: 4.8,
    hours: 5.4,
    students: 20257,
    price: 11000,
    progress: 38,
    badge: true,
    cover:
      "https://i.ytimg.com/vi/lvH4-4iYjgs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA7zswqUrSdzK4t5FfZXMsLvcFlKQ",
  },
  {
    id: 2,
    category: "健康",
    title: "Python 在機器學習和人工智慧領域的應用",
    author: "聯成電腦",
    rating: 4.7,
    hours: 6.2,
    students: 15893,
    price: 2180,
    progress: 72,
    badge: true,
    cover: "https://www.lccnet.com.tw/lccnet/Upload/Article/news-2400.jpg",
  },
  {
    id: 3,
    category: "程式",
    title: "Vue 3 + Vite 實戰：從零打造前端專案",
    author: "eduvia 前端團隊",
    rating: 4.9,
    hours: 8.0,
    students: 12035,
    price: 4980,
    progress: 55,
    badge: false,
    cover:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    category: "設計",
    title: "從零開始的 UI/UX：使用者流程與原型設計",
    author: "設計研究社",
    rating: 4.6,
    hours: 7.3,
    students: 8930,
    price: 6200,
    progress: 31,
    badge: false,
    cover: "https://images.hahow.in/images/58f318cc4909c907004ac575",
  },
]);

const displayCourses = computed(() =>
  selectedCategory.value
    ? courses.value.filter((c) => c.category === selectedCategory.value)
    : courses.value
);

const carouselResponsive = [
  { breakpoint: "1024px", numVisible: 2, numScroll: 1 },
  { breakpoint: "768px", numVisible: 2, numScroll: 1 },
  { breakpoint: "640px", numVisible: 1, numScroll: 1 },
];
</script>

<style scoped>
:deep(.p-carousel .p-carousel-prev),
:deep(.p-carousel .p-carousel-next) {
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  background: #ffffff;
  color: #111827;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
:deep(.p-carousel .p-carousel-prev:hover),
:deep(.p-carousel .p-carousel-next:hover) {
  transform: scale(1.04);
}

:deep(.p-carousel .p-carousel-indicators) {
  gap: 8px;
  padding-top: 14px;
}
:deep(.p-carousel .p-carousel-indicator button) {
  width: 8px;
  height: 8px;
  background: #d1fae5;
  opacity: 0.7;
}
:deep(.p-carousel .p-carousel-indicator.p-highlight button) {
  background: #10b981;
  opacity: 1;
}

:deep(.p-button.p-button-outlined) {
  border-color: rgb(229 231 235);
  color: #374151;
  background: #fff;
}
</style>
