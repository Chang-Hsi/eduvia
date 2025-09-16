<template>
  <section class="w-full max-h-[60vh]">
    <!-- 輪播區 -->
    <div class="relative mx-auto max-w-7xl px-4 pt-10">
      <div
        class="relative overflow-visible rounded-[36px] bg-gray-100 px-4 py-8 md:px-8 md:py-12"
      >
        <!-- 自訂左右箭頭 -->
        <button
          ref="prevEl"
          aria-label="上一張"
          class="nav-btn absolute left-[-18px] top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 hover:bg-rose-700 text-white shadow-lg transition hover:brightness-110 md:left-[-22px]"
        >
          <!-- 左箭頭 SVG -->
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          ref="nextEl"
          aria-label="下一張"
          class="nav-btn absolute right-[-18px] top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 hover:bg-rose-700 text-white shadow-lg transition hover:brightness-110 md:right-[-22px]"
        >
          <!-- 右箭頭 SVG -->
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <!-- Swiper -->
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="1"
          :space-between="20"
          :breakpoints="breakpoints"
          :navigation="{ prevEl: prevEl, nextEl: nextEl }"
          :loop="true"
          @before-init="onBeforeInit"
        >
          <SwiperSlide v-for="(p, i) in posts" :key="i">
            <article class="overflow-hidden rounded-2xl">
              <div class="aspect-[16/9] overflow-hidden">
                <img
                  :src="p.img"
                  :alt="p.title"
                  class="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-125"
                />
              </div>
              <div class="p-5 md:p-6">
                <h3 class="mb-2 text-xl font-bold leading-snug text-gray-900 md:text-2xl">
                  {{ p.title }}
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  {{ p.excerpt }}
                </p>
              </div>
            </article>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<script setup>
/* 需求重點：
   - v-motion：頂部標籤淡入
   - Swiper：3 欄卡片輪播 + 自訂左右圓形箭頭
   - 圖片與文字你可自行替換 posts 陣列
*/
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";

const posts = ref([
  {
    img:
      "https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/093/26/0010932677.jpg&v=62ea4e36k&w=348&h=348",
    title: "Python 資料科學實戰教本",
    excerpt:
      "Python 資料科學實戰教本：爬蟲、清理、資料庫、視覺化、探索式分析、機器學習建模，數據工程一次搞定！",
  },
  {
    img: "https://static.accupass.com/eventbanner/1910010204251925594418.jpg",
    title: "Python網路爬蟲實務課程",
    excerpt:
      "Python簡潔易上手，非常適合程式語言初學者，也是協助專家加速處理大量資料的極佳工具。",
  },
  {
    img:
      "https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/E05/015/27/E050152781.jpg&v=63e0b0b0k&w=348&h=348",
    title: "實戰Python Flask開發",
    excerpt:
      "從如何建立一個Web應用程式到API與部署，獻給工程師與資料科學家的Flask入門書。",
  },
  {
    img: "https://www.iware.com.tw/upload/images/256.jpg",
    title: "關於我們頁面內容創建指南",
    excerpt:
      "好的『關於我們』能贏得信任。學習如何寫出真誠、專業的內容，展現品牌的核心價值。",
  },
]);

/* 自訂左右箭頭元素 */
const prevEl = ref(null);
const nextEl = ref(null);
const onBeforeInit = (swiper) => {
  swiper.params.navigation.prevEl = prevEl.value;
  swiper.params.navigation.nextEl = nextEl.value;
  swiper.navigation.init();
  swiper.navigation.update();
};

/* RWD：手機1張、平板2張、桌機3張 */
const breakpoints = {
  768: { slidesPerView: 2, spaceBetween: 24 },
  1024: { slidesPerView: 3, spaceBetween: 28 },
};
</script>

<style scoped>
/* 讓卡片與灰底之間留點呼吸 */
:deep(.swiper) {
  padding: 0.25rem;
}
</style>
