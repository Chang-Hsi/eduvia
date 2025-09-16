<!-- src/components/MyLearningDetail.vue -->
<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex items-center justify-between mb-4">
      <TabMenu :model="tabItems" v-model:activeIndex="activeTabIndex" :pt="tabPt" />
    </div>

    <div v-if="activeKey === 'course'" class="grid grid-cols-12 gap-6">
      <article
        v-for="c in courses"
        :key="c.id"
        class="col-span-12 md:col-span-6 xl:col-span-4 group rounded-lg bg-white shadow ring-1 ring-black/5 overflow-hidden"
      >
        <div class="relative">
          <img
            :src="c.cover"
            :alt="c.title"
            class="w-full aspect-video object-cover"
            loading="lazy"
          />
          <button
            class="absolute right-2 top-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow ring-1 ring-black/5 hover:bg-white"
            @click="openCardMenu($event, c)"
          >
            <i class="pi pi-ellipsis-v text-gray-600"></i>
          </button>
        </div>

        <div class="p-4">
          <h3 class="text-gray-900 font-semibold leading-snug line-clamp-2">
            {{ c.title }}
          </h3>
          <div class="text-xs text-gray-500 mt-1">{{ c.teacher }}</div>

          <div class="mt-4 flex items-end justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="text-xs text-gray-600">{{ c.progress }}% 完成</div>
              <div class="mt-1 h-1 rounded bg-gray-200 overflow-hidden">
                <div
                  class="h-full bg-purple-500"
                  :style="{ width: c.progress + '%' }"
                ></div>
              </div>
            </div>

            <div class="shrink-0 text-right">
              <Rating
                :modelValue="c.myRating"
                :cancel="false"
                readonly
                :pt="ratingPt"
                class="!align-middle"
              />
              <div v-if="c.myRating === 0" class="text-[11px] text-gray-500 mt-1">
                留下評等
              </div>
              <div v-else class="text-[11px] text-amber-600 mt-1">您的評等</div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div v-else-if="activeKey === 'note'" class="grid grid-cols-12 gap-6">
      <article
        v-for="n in notes"
        :key="n.id"
        class="col-span-12 md:col-span-6 xl:col-span-4 group rounded-lg bg-white shadow ring-1 ring-black/5 overflow-hidden"
      >
        <div class="p-4">
          <div class="text-xs text-emerald-600 font-semibold mb-1">我的講義</div>
          <h3 class="text-gray-900 font-semibold line-clamp-2">{{ n.title }}</h3>
          <img src="../../assets/imgs/PDF.png" alt="PDF" class="w-10 py-1" />
          <div class="text-xs text-gray-500 mt-1">更新於 {{ n.updatedAt }}</div>
          <div class="mt-4 flex items-center justify-between">
            <Button label="查看" size="small" outlined @click="openNote(n)" />
            <span class="text-xs text-gray-500">{{ n.pages }} 頁</span>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="grid grid-cols-12 gap-6">
      <article
        v-for="w in works"
        :key="w.id"
        class="col-span-12 md:col-span-6 xl:col-span-4 group rounded-lg bg-white shadow ring-1 ring-black/5 overflow-hidden"
      >
        <div class="p-4">
          <div class="text-xs text-sky-600 font-semibold mb-1">我的作品</div>
          <h3 class="text-gray-900 font-semibold line-clamp-2">{{ w.title }}</h3>
          <div class="text-xs text-gray-500 mt-1">上次修改：{{ w.updatedAt }}</div>
          <div class="mt-4 flex items-center justify-between">
            <Button label="開啟" size="small" outlined @click="openWork(w)" />
            <span class="text-xs text-gray-500">👍 {{ w.likes }}</span>
          </div>
        </div>
      </article>
    </div>

    <OverlayPanel ref="cardMenuRef" :dismissable="true" appendTo="body">
      <div class="w-44 py-1">
        <button
          class="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
          @click="continueLearn"
        >
          繼續學習
        </button>
        <button
          class="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
          @click="openCourse"
        >
          查看課程
        </button>
        <div class="my-1 border-t"></div>
        <button
          class="w-full px-3 py-2 text-sm text-left text-rose-600 hover:bg-rose-50"
          @click="removeCourse"
        >
          移除
        </button>
      </div>
    </OverlayPanel>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import TabMenu from "primevue/tabmenu";
import Button from "primevue/button";
import Rating from "primevue/rating";
import OverlayPanel from "primevue/overlaypanel";
import pdfExample1 from "@/assets/docs/PDF_example1.pdf";

const activeTabIndex = ref(0);
const tabItems = [{ label: "所有課程" }, { label: "我的講義" }, { label: "我的作品" }];
const activeKey = computed(
  () => ["course", "note", "work"][activeTabIndex.value] || "course"
);

const courses = ref([
  {
    id: 1,
    title: "2025 Python全攻略",
    teacher: "Wilson Ren",
    cover:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    progress: 45,
    myRating: 0,
  },
  {
    id: 2,
    title: "iOS & Swift - The Complete iOS App Development Bootcamp",
    teacher: "Dr. Angela Yu, Developer and Lead Instructor",
    cover:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop",
    progress: 17,
    myRating: 5,
  },
  {
    id: 3,
    title: "Vue 3 + Vite 實戰：從零打造前端專案",
    teacher: "eduvia 前端團隊",
    cover:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    progress: 62,
    myRating: 4,
  },
]);

const notes = ref([
  {
    id: "n1",
    title: "演算法速查講義（上）",
    pages: 36,
    updatedAt: "2025/09/10",
    url: pdfExample1,
  },
  {
    id: "n2",
    title: "CSS 版型設計筆記",
    pages: 24,
    updatedAt: "2025/08/28",
    url: pdfExample1,
  },
]);

const works = ref([
  {
    id: "w1",
    title: "前端作品集：交互式圖表",
    updatedAt: "2025/09/02",
    likes: 37,
  },
  {
    id: "w2",
    title: "UI/UX 流程原型",
    updatedAt: "2025/08/12",
    likes: 58,
  },
]);

const cardMenuRef = ref();
const currentCourse = ref(null);
function openCardMenu(e, course) {
  currentCourse.value = course;
  cardMenuRef.value?.toggle(e);
}
function continueLearn() {
  cardMenuRef.value?.hide();
  console.log("continue", currentCourse.value?.id);
}
function openCourse() {
  cardMenuRef.value?.hide();
  console.log("open course", currentCourse.value?.id);
}
function removeCourse() {
  cardMenuRef.value?.hide();
  console.log("remove", currentCourse.value?.id);
}

function openNote(n) {
  const url = n?.url || pdfExample1;
  window.open(url, "_blank", "noopener,noreferrer");
}

function openWork(w) {
  console.log("open work", w.id);
}

const tabPt = {
  root: { class: "border-0 bg-transparent p-0" },
  menu: { class: "flex gap-6" },
  action: {
    class:
      "relative text-gray-500 hover:text-gray-800 font-medium pb-2 data-[active='true']:text-emerald-600",
  },
  item: {
    class: "border-b-2 border-transparent data-[active='true']:border-emerald-500",
  },
};

const ratingPt = {
  onIcon: { class: "pi pi-star-fill text-amber-400 text-sm" },
  offIcon: { class: "pi pi-star text-amber-300 text-sm" },
};
</script>

<style scoped>
:deep(.p-tabmenu-nav) {
  border: none;
  background: transparent;
}
</style>
