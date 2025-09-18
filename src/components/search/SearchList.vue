<!-- src/components/SearchList.vue -->
<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex items-center justify-between border-b pb-3">
      <TabMenu :model="tabItems" v-model:activeIndex="activeTabIndex" :pt="tabPt" />
      <div class="flex items-center text-sm">
        <button
          class="px-3 py-1 rounded-md"
          :class="
            sortKey === 'hot'
              ? 'text-emerald-600 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          "
          @click="setSort('hot')"
        >
          最熱門
        </button>
        <span class="mx-2 text-gray-300">|</span>
        <button
          class="px-3 py-1 rounded-md"
          :class="
            sortKey === 'students'
              ? 'text-emerald-600 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          "
          @click="setSort('students')"
        >
          依人數
        </button>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6 mt-6">
      <article
        v-for="c in pagedCourses"
        :key="c.id"
        class="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 group rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden"
        @click="goClassing(c.id)"
      >
        <div class="relative">
          <img
            :src="c.cover"
            :alt="c.title"
            class="w-full h-40 object-cover"
            loading="lazy"
          />
          <div
            v-if="c.ribbon"
            class="absolute left-2 top-2 text-xs px-2 py-0.5 rounded bg-orange-500 text-white/95 shadow"
          >
            {{ c.ribbon }}
          </div>
        </div>

        <div class="p-4">
          <div class="inline-flex items-center gap-2 text-xs font-semibold mb-1">
            <span class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">課程</span>
            <span v-if="c.badge" class="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600"
              >所有課程</span
            >
          </div>

          <h3 class="text-gray-900 font-semibold leading-snug line-clamp-2 mb-1">
            {{ c.title }}
          </h3>
          <div class="text-gray-500 text-sm mb-2">by {{ c.author }}</div>

          <div class="flex items-center gap-2 text-sm text-gray-700 mb-3">
            <i class="pi pi-star-fill text-amber-400"></i>
            <span>{{ c.rating }}</span>
            <span>· {{ c.hours }} 小時</span>
            <span>· {{ c.students.toLocaleString() }} 人</span>
          </div>

          <div class="mt-auto">
            <div class="text-gray-900 font-bold">NT$ {{ c.price.toLocaleString() }}</div>
            <div class="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-emerald-500"
                :style="{ width: c.progress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div class="flex justify-center py-8">
      <Paginator
        :rows="pageSize"
        :totalRecords="filteredSorted.length"
        :first="(page - 1) * pageSize"
        @page="onPage"
        :pt="paginatorPt"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import TabMenu from "primevue/tabmenu";
import Paginator from "primevue/paginator";

const route = useRoute();
const router = useRouter();
const page = ref(1);
const pageSize = ref(12);
const sortKey = ref("hot");
const activeTabIndex = ref(0);

// 讀取 q；若是陣列只取第一個
const q = computed(() => {
  const v = route.query.q;
  return Array.isArray(v) ? v[0] : v ?? "";
});
const keyword = computed(() => String(q.value || "").trim());
const showAll = computed(() => keyword.value === "" || keyword.value === "所有課程");

const tabDefs = [
  { key: "all", label: "全部結果" },
  { key: "video", label: "影音課程" },
  { key: "supply", label: "學習補給" },
  { key: "bundle", label: "組合" },
  { key: "live", label: "直播" },
  { key: "article", label: "文章" },
];

const allCourses = ref([
  {
    id: 1,
    type: "video",
    ribbon: "新開 14 分",
    badge: true,
    title: "六角學院｜JS + React 前端工程師培訓班",
    author: "六角學院",
    rating: 4.9,
    hours: 10.8,
    students: 35000,
    price: 36600,
    progress: 40,
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    type: "video",
    ribbon: "限時優惠",
    badge: true,
    title: "居家美胸養護術｜30 天養出自然集中好胸型",
    author: "Emily 美胸教練",
    rating: 4.7,
    hours: 6.5,
    students: 15890,
    price: 3850,
    progress: 58,
    cover:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    type: "video",
    ribbon: "創辦 6 分",
    badge: false,
    title: "軟體職涯藍城河實戰營：工程師轉職與職涯力打造",
    author: "terr ychen",
    rating: 4.6,
    hours: 7.8,
    students: 20957,
    price: 31999,
    progress: 31,
    cover:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    type: "video",
    ribbon: "限時優惠",
    badge: true,
    title: "找到身體最佳狀態！營養師的動力鍵",
    author: "營養研究社",
    rating: 5.0,
    hours: 35.2,
    students: 5324,
    price: 7000,
    progress: 72,
    cover:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    type: "video",
    ribbon: "限時優惠",
    badge: true,
    title: "高效 AI 投資術：No Code 打造自動化股票選專",
    author: "Code Gym",
    rating: 4.9,
    hours: 18.6,
    students: 10907,
    price: 4670,
    progress: 63,
    cover:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    type: "video",
    ribbon: null,
    badge: false,
    title: "UX·三刀流課程 產品體驗設計",
    author: "UX 三刀流",
    rating: 4.8,
    hours: 25.1,
    students: 1447,
    price: 3666,
    progress: 28,
    cover:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    type: "bundle",
    ribbon: "限時優惠",
    badge: false,
    title: "不挨餓、不復胖！營養師的科學減脂全計畫",
    author: "動動好貓能訓練中心",
    rating: 4.8,
    hours: 19.3,
    students: 32547,
    price: 2180,
    progress: 77,
    cover:
      "https://images.unsplash.com/photo-1556139943-4bdca53adf1e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    type: "video",
    ribbon: "入門",
    badge: false,
    title: "Notion 最新中文課：3 小時快速上手！打造個人數位 IT…",
    author: "Amber.L",
    rating: 4.9,
    hours: 4.8,
    students: 2412,
    price: 2039,
    progress: 35,
    cover: "https://m.media-amazon.com/images/I/51JV5GKTAPL._UF1000,1000_QL80_.jpg",
  },
  {
    id: 9,
    type: "video",
    ribbon: "8 折起",
    badge: false,
    title: "用 ChatGPT 全面升級你的工作流程",
    author: "熊實務",
    rating: 4.9,
    hours: 5.4,
    students: 2261,
    price: 2624,
    progress: 20,
    cover:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 10,
    type: "video",
    ribbon: "8 折起",
    badge: false,
    title: "產品設計實戰：用 Figma 打造超佳 UI/UX",
    author: "Simon Lin",
    rating: 5.0,
    hours: 15.0,
    students: 9535,
    price: 3424,
    progress: 46,
    cover: "https://images.hahow.in/images/58f318cc4909c907004ac575",
  },
  {
    id: 11,
    type: "video",
    ribbon: null,
    badge: false,
    title: "Canva 入門到進階實戰｜零基礎做優質設計",
    author: "Particco 設計社群",
    rating: 5.0,
    hours: 12.7,
    students: 3128,
    price: 2780,
    progress: 18,
    cover: "https://m.media-amazon.com/images/I/51JV5GKTAPL._UF1000,1000_QL80_.jpg",
  },
  {
    id: 12,
    type: "article",
    ribbon: null,
    badge: false,
    title: "學習補給｜高效筆記的 7 個關鍵技巧",
    author: "eduvia 編輯部",
    rating: 4.5,
    hours: 1.2,
    students: 880,
    price: 0,
    progress: 12,
    cover:
      "https://img.91app.com/webapi/imagesV3/Original/SalePage/9484820/1/638646151278500000?v=1&quality=30",
  },
  {
    id: 13,
    type: "live",
    ribbon: "即將開播",
    badge: false,
    title: "前端工程師 AMA 直播 Q&A",
    author: "eduvia 前端團隊",
    rating: 4.8,
    hours: 2.0,
    students: 520,
    price: 0,
    progress: 10,
    cover: "https://i.ytimg.com/vi/slA_mKWZfSQ/hq720.jpg",
  },
  {
    id: 14,
    type: "supply",
    ribbon: null,
    badge: false,
    title: "學習補給｜UI 字體搭配快速入門",
    author: "設計研究社",
    rating: 4.6,
    hours: 1.0,
    students: 640,
    price: 0,
    progress: 14,
    cover: "https://m.media-amazon.com/images/I/51JV5GKTAPL._UF1000,1000_QL80_.jpg",
  },
  {
    id: 1,
    type: "video",
    ribbon: "新開 12 分",
    badge: true,
    title: "Python 入門｜從零學會語法與邏輯",
    author: "CodeCafé",
    rating: 4.9,
    hours: 8.5,
    students: 12500,
    price: 3200,
    progress: 0,
    cover: "https://www.wincenter.com.tw/updimg/blog/0138/0138.jpg",
  },
  {
    id: 2,
    type: "video",
    ribbon: "已更新 2 小時",
    badge: false,
    title: "Python 入門｜實作 30 天挑戰",
    author: "阿良老師",
    rating: 4.8,
    hours: 10.2,
    students: 9800,
    price: 2800,
    progress: 20,
    cover: "https://m.media-amazon.com/images/I/51JV5GKTAPL._UF1000,1000_QL80_.jpg",
  },
  {
    id: 3,
    type: "video",
    ribbon: "新開 35 分",
    badge: true,
    title: "Python 入門｜初學者的第一堂課",
    author: "新視野學苑",
    rating: 4.7,
    hours: 6.3,
    students: 15600,
    price: 2400,
    progress: 40,
    cover:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    type: "video",
    ribbon: "已更新 1 天",
    badge: false,
    title: "Python 入門｜資料型態與控制流程精修",
    author: "小白也能學",
    rating: 4.9,
    hours: 7.1,
    students: 14200,
    price: 2600,
    progress: 10,
    cover:
      "https://cf-assets2.tenlong.com.tw/product_images/images/000/046/371/pjpeg/48301.jpg?1681302804",
  },

  {
    id: 5,
    type: "video",
    ribbon: "新開 18 分",
    badge: true,
    title: "Python 網頁爬蟲｜Requests + BeautifulSoup 實戰",
    author: "資料採集實驗室",
    rating: 4.8,
    hours: 9.4,
    students: 8700,
    price: 3400,
    progress: 0,
    cover: "https://i.ytimg.com/vi/9Z9xKWfNo7k/maxresdefault.jpg",
  },
  {
    id: 6,
    type: "video",
    ribbon: "已更新 5 小時",
    badge: false,
    title: "Python 網頁爬蟲｜Selenium 自動化與反爬技巧",
    author: "Crawler Lab",
    rating: 4.7,
    hours: 11.8,
    students: 6400,
    price: 3800,
    progress: 55,
    cover: "https://i.ytimg.com/vi/9Z9xKWfNo7k/maxresdefault.jpg",
  },
  {
    id: 7,
    type: "video",
    ribbon: "新開 42 分",
    badge: true,
    title: "Python 網頁爬蟲｜Scrapy 專案級開發",
    author: "張小明",
    rating: 4.8,
    hours: 12.6,
    students: 5200,
    price: 4200,
    progress: 15,
    cover: "https://i.ytimg.com/vi/9Z9xKWfNo7k/maxresdefault.jpg",
  },
  {
    id: 8,
    type: "video",
    ribbon: "已更新 3 天",
    badge: false,
    title: "Python 網頁爬蟲｜資料清理到入庫一條龍",
    author: "Data Pipeline School",
    rating: 4.6,
    hours: 10.0,
    students: 4300,
    price: 3600,
    progress: 5,
    cover: "https://i.ytimg.com/vi/9Z9xKWfNo7k/maxresdefault.jpg",
  },

  {
    id: 9,
    type: "video",
    ribbon: "新開 27 分",
    badge: true,
    title: "Python 資料科學｜NumPy, Pandas 快速上手",
    author: "數據小館",
    rating: 4.9,
    hours: 9.9,
    students: 15800,
    price: 4200,
    progress: 0,
    cover:
      "https://images.unsplash.com/photo-1551281044-8b89c2b5f2b9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 10,
    type: "video",
    ribbon: "已更新 7 小時",
    badge: false,
    title: "Python 資料科學｜資料視覺化與報表",
    author: "可視化研究所",
    rating: 4.7,
    hours: 7.8,
    students: 9200,
    price: 3600,
    progress: 25,
    cover:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 11,
    type: "video",
    ribbon: "新開 9 分",
    badge: true,
    title: "Python 資料科學｜資料前處理實務",
    author: "DataCraft",
    rating: 4.8,
    hours: 8.2,
    students: 7600,
    price: 3300,
    progress: 65,
    cover:
      "https://images.unsplash.com/photo-1542623024-a797a755b8bd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 12,
    type: "video",
    ribbon: "已更新 2 天",
    badge: false,
    title: "Python 資料科學｜從 Excel 轉職資料人",
    author: "數據轉職指南",
    rating: 4.6,
    hours: 6.7,
    students: 6800,
    price: 2990,
    progress: 10,
    cover:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 13,
    type: "video",
    ribbon: "新開 21 分",
    badge: true,
    title: "Python 機器學習｜scikit-learn 完整入門",
    author: "ML Studio",
    rating: 4.9,
    hours: 12.3,
    students: 11100,
    price: 5200,
    progress: 0,
    cover: "https://m.media-amazon.com/images/I/51JV5GKTAPL._UF1000,1000_QL80_.jpg",
  },
  {
    id: 14,
    type: "video",
    ribbon: "已更新 9 小時",
    badge: false,
    title: "Python 機器學習｜特徵工程與交叉驗證",
    author: "AI 實驗室",
    rating: 4.7,
    hours: 9.1,
    students: 8300,
    price: 4800,
    progress: 35,
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 15,
    type: "video",
    ribbon: "新開 44 分",
    badge: true,
    title: "Python 機器學習｜用真實資料集做專題",
    author: "數據專題坊",
    rating: 4.8,
    hours: 14.6,
    students: 6200,
    price: 5600,
    progress: 5,
    cover:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 16,
    type: "video",
    ribbon: "已更新 4 天",
    badge: false,
    title: "Python 機器學習｜模型部署與監控概念",
    author: "MLOps School",
    rating: 4.6,
    hours: 7.4,
    students: 4100,
    price: 4200,
    progress: 12,
    cover:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 17,
    type: "video",
    ribbon: "新開 16 分",
    badge: true,
    title: "Python Flask｜打造你的第一個 Web 服務",
    author: "Web 工坊",
    rating: 4.8,
    hours: 7.9,
    students: 9700,
    price: 3500,
    progress: 0,
    cover:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 18,
    type: "video",
    ribbon: "已更新 11 小時",
    badge: false,
    title: "Python Flask｜RESTful API 與 JWT 登入",
    author: "後端小廚房",
    rating: 4.7,
    hours: 9.0,
    students: 7200,
    price: 3900,
    progress: 28,
    cover:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 19,
    type: "video",
    ribbon: "新開 6 分",
    badge: true,
    title: "Python Flask｜結合 SQLAlchemy 與部署",
    author: "雲端工作坊",
    rating: 4.7,
    hours: 8.4,
    students: 5600,
    price: 4200,
    progress: 10,
    cover:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 20,
    type: "video",
    ribbon: "已更新 1 週",
    badge: false,
    title: "Python Flask｜前後端整合與部署到雲端",
    author: "Full-Stack Lab",
    rating: 4.6,
    hours: 10.5,
    students: 6100,
    price: 4600,
    progress: 60,
    cover:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format&fit=crop",
  },
]);

function goClassing(id) {
  if (id) {
    window.location.href = `/class/${encodeURIComponent(id)}/`; // 👍 一律漂亮網址
  } else {
    window.location.href = `/class/`;
  }
}

// 先做「關鍵字全域過濾」：q 為「所有課程」或空白就不過濾
const baseList = computed(() => {
  if (showAll.value) return allCourses.value;
  const k = keyword.value.toLowerCase();
  return allCourses.value.filter((c) =>
    [c.title, c.author, c.type].some((v) => String(v).toLowerCase().includes(k))
  );
});

// Tab 顯示：數量依 baseList 重新計
const countsByType = computed(() => {
  const r = {
    all: baseList.value.length,
    video: 0,
    supply: 0,
    bundle: 0,
    live: 0,
    article: 0,
  };
  for (const c of baseList.value) r[c.type] = (r[c.type] || 0) + 1;
  return r;
});
const tabItems = computed(() =>
  tabDefs.map((t) => ({
    label: `${t.label} ${countsByType.value[t.key] ?? 0}${
      t.key === "all" && countsByType.value[t.key] > 999 ? "+" : ""
    }`,
  }))
);

// 目前選取的類別 key
const activeType = computed(() => tabDefs[activeTabIndex.value]?.key ?? "all");

// 類別過濾（在 baseList 上再過濾）
const filtered = computed(() => {
  if (activeType.value === "all") return baseList.value;
  return baseList.value.filter((c) => c.type === activeType.value);
});

// 排序
const filteredSorted = computed(() => {
  const arr = [...filtered.value];
  if (sortKey.value === "students") {
    return arr.sort((a, b) => b.students - a.students || b.rating - a.rating);
  }
  return arr.sort((a, b) => b.rating - a.rating || b.students - a.students);
});

// 分頁
const pagedCourses = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredSorted.value.slice(start, start + pageSize.value);
});

// 切換排序或關鍵字時回到第一頁
watch([keyword, sortKey, activeTabIndex], () => {
  page.value = 1;
});

function setSort(key) {
  if (sortKey.value !== key) {
    sortKey.value = key;
    page.value = 1;
  }
}
function onPage(e) {
  page.value = Math.floor(e.first / e.rows) + 1;
}

// 样式 pt
const tabPt = {
  root: { class: "border-0 bg-transparent p-0" },
  menu: { class: "flex flex-wrap gap-6" },
  action: {
    class:
      "relative text-gray-500 hover:text-gray-800 font-medium pb-2 data-[active='true']:text-emerald-600",
  },
  item: {
    class: "border-b-2 border-transparent data-[active='true']:border-emerald-500",
  },
};
const paginatorPt = {
  root: { class: "" },
  current: { class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};
</script>

<style scoped>
:deep(.p-tabmenu-nav) {
  border: none;
  background: transparent;
}
:deep(.p-paginator) {
  border: none;
}
:deep(.p-paginator .p-paginator-page) {
  border-radius: 0.5rem;
}
</style>
