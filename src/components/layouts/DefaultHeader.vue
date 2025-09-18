<!-- src/layouts/DefaultHeader.vue -->
<!-- src/layouts/DefaultHeader.vue -->
<template>
  <header
    class="theme-fixed-light sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
      <button
        class="md:hidden inline-flex items-center p-2 -m-2"
        @click="mobileOpen = true"
        aria-label="Open menu"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <!-- 變更：Logo 用純 <a>，確保回到 / 會整頁載入 Home 的 MPA -->
      <a href="/" class="shrink-0 font-extrabold text-black tracking-tight text-xl"
        >eduvia</a
      >

      <div class="hidden md:flex">
        <Button
          size="small"
          variant="text"
          @click="toggleExplore"
          aria-haspopup="true"
          aria-controls="explore_menu"
        >
          探索
        </Button>
        <Menu
          ref="exploreMenu"
          id="explore_menu"
          :model="exploreItems"
          :popup="true"
          class="min-w-64"
        />
      </div>

      <div class="flex-1 mr-4 max-w-3xl w-full hidden md:block">
        <IconField iconPosition="left" class="w-full">
          <InputIcon class="pi pi-search" />
          <AutoComplete
            class="w-full block min-w-0"
            v-model.trim="keyword"
            :suggestions="acSuggestions"
            @complete="onAutoComplete"
            @item-select="onAutoSelect"
            @keyup.enter="onSearch"
            :inputStyle="{ width: '100%' }"
            forceSelection="false"
            :pt="autoPt"
            placeholder="搜尋任何事物"
          />
        </IconField>
      </div>

      <nav class="ml-auto hidden lg:flex items-center gap-4">
        <div
          class="text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
          @click.prevent="onMyLearningClick"
        >
          我的學習
        </div>

        <!-- teach 是 SPA，仍可用 RouterLink（在沒有 router 時由替身渲染成 <a>） -->
        <RouterLink to="/teach" class="text-sm text-gray-700 hover:text-gray-900">
          在 eduvia 上教學
        </RouterLink>

        <Button
          rounded
          text
          @click="goCart"
          aria-label="Cart"
          :pt="{ label: { class: 'hidden' } }"
        >
          <i class="pi pi-shopping-cart text-lg"></i>
        </Button>

        <template v-if="!isLoggedIn">
          <Button label="登入" size="small" variant="outlined" @click="goLogin" />
          <Button
            label="註冊"
            size="small"
            severity="primary"
            @click="goSignup"
            style="color: white"
          />
        </template>

        <template v-else>
          <button
            class="inline-flex items-center justify-center w-9 h-9 rounded-full ring-1 ring-gray-200 overflow-hidden"
            @click="toggleUserMenu"
            aria-haspopup="true"
            aria-controls="user_menu"
          >
            <img :src="user?.picture" alt="avatar" class="w-full h-full object-cover" />
          </button>
        </template>

        <Button
          size="small"
          variant="outlined"
          rounded
          @click="toggleLang"
          aria-haspopup="true"
          aria-controls="lang_menu"
        >
          <i class="pi pi-globe"></i>
        </Button>
        <Menu ref="langMenu" id="lang_menu" :model="langItems" :popup="true" />
      </nav>

      <OverlayPanel ref="myLearningPopover" appendTo="body" :dismissable="true">
        <div class="w-72 p-6 text-center">
          <img :src="SearchSvg" alt="探索課程" class="mx-auto mb-4 w-48 h-48" />
          <div class="font-semibold text-gray-900 mb-1">還沒開始學習！</div>
          <div class="text-gray-500 mb-4">前往探索課程，你那邊還來得及！</div>
          <Button
            label="探索課程"
            severity="primary"
            class="w-full"
            @click="goExploreCourses"
          />
        </div>
      </OverlayPanel>

      <OverlayPanel ref="userMenu" id="user_menu" appendTo="body" :dismissable="true">
        <div class="w-56">
          <button
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            @click="goProfile"
          >
            個人檔案
          </button>
          <button
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            @click="goOrders"
          >
            訂單紀錄
          </button>
          <div class="border-t border-gray-300"></div>
          <button
            class="w-full text-left px-4 pt-4 text-sm text-rose-600 hover:bg-rose-50"
            @click="logout"
          >
            登出
          </button>
        </div>
      </OverlayPanel>

      <div class="md:hidden ml-auto inline-flex items-center">
        <button
          class="p-2 -m-2"
          @click="mobileSearchOpen = !mobileSearchOpen"
          aria-label="Open search"
        >
          <i class="pi pi-search text-lg"></i>
        </button>
        <button class="p-2 -m-2" @click="goCart" aria-label="Cart">
          <i class="pi pi-shopping-cart text-lg"></i>
        </button>
      </div>
    </div>

    <div v-show="mobileSearchOpen" class="md:hidden border-t px-4 py-3">
      <IconField iconPosition="left" class="w-full">
        <InputIcon class="pi pi-search" />
        <InputText
          v-model.trim="keyword"
          @keyup.enter="onSearch"
          :pt="{
            root: {
              class:
                'w-full rounded-full border bg-white text-gray-900 placeholder-gray-400 h-11',
            },
          }"
          placeholder="搜尋任何事物"
        />
      </IconField>
    </div>

    <Drawer v-model:visible="mobileOpen" position="left" header="選單" class="!w-80">
      <div class="space-y-4">
        <div>
          <div class="text-sm font-semibold mb-2 text-gray-900">探索</div>
          <ul class="space-y-1">
            <li v-for="g in exploreGroups" :key="g.title">
              <div class="text-xs text-gray-500 mb-1">{{ g.title }}</div>
              <div class="flex flex-wrap gap-2 mb-2">
                <Button
                  v-for="it in g.items"
                  :key="it"
                  size="small"
                  variant="outlined"
                  class="!text-xs"
                  @click="onExplore(it)"
                  :label="it"
                />
              </div>
            </li>
          </ul>
        </div>

        <div class="border-t pt-4 grid grid-cols-2 gap-2">
          <Button label="方案與定價" size="small" variant="text" @click="goPricing" />
          <Button label="在 eduvia 上學習" size="small" variant="text" @click="goTeach" />
        </div>

        <div class="border-t pt-4 flex items-center gap-2">
          <Button
            label="登入"
            size="small"
            variant="outlined"
            class="flex-1"
            @click="goLogin"
          />
          <Button
            label="註冊"
            size="small"
            severity="primary"
            class="flex-1"
            @click="goSignup"
          />
          <Button
            size="small"
            variant="outlined"
            rounded
            @click="toggleLang"
            aria-haspopup="true"
            aria-controls="lang_menu_m"
          >
            <i class="pi pi-globe"></i>
          </Button>
          <Menu ref="langMenuMobile" id="lang_menu_m" :model="langItems" :popup="true" />
        </div>
      </div>
    </Drawer>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router"; // 變更：可能沒有安裝 router，下面會 try/catch
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Menu from "primevue/menu";
import Drawer from "primevue/drawer";
import AutoComplete from "primevue/autocomplete";
import OverlayPanel from "primevue/overlaypanel";
import SearchSvg from "@/assets/svg/Search.svg";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isLoggedIn);
const user = computed(() => auth.user);

onMounted(() => {
  auth.initFromStorage();
});

/* =========================
   路由輔助（關鍵改動）
   ========================= */
// 變更：router 成為可選；在 MPA（/、/class/）沒有安裝 vue-router 也不會爆
let router = null;
try {
  router = useRouter();
} catch (e) {
  router = null;
}

// 變更：定義 MPA 路徑集合；遇到它們一律整頁跳轉
const MPA_PATHS = new Set(["/", "/class/", "/search/"]);

// 變更：補尾斜線（/class → /class/；/search → /search/）
function ensureSlash(p) {
  if (p === "/class") return "/class/";
  if (p === "/search") return "/search/";
  return p;
}

// 變更：統一跳轉入口
function nav(path) {
  const full = ensureSlash(path);

  // 有 router 且不是 MPA → 走 SPA
  if (router && !MPA_PATHS.has(full)) {
    router.push(full);
    return;
  }

  // MPA 路徑 → 直接整頁
  if (MPA_PATHS.has(full)) {
    window.location.href = full;
    return;
  }

  // 沒有 router（例如正在 MPA 頁）但要去 SPA 路由 → 走橋接
  window.location.href = `/?r=${encodeURIComponent(full)}`;
}

// 變更：搜尋頁固定用 MPA（因為已拆成 MPA）
function navSearch(q) {
  const query = q ? `?q=${encodeURIComponent(q)}` : "";
  window.location.href = "/search/" + query;
}

/* ========================= */

const keyword = ref("");
const acSuggestions = ref([]);
function onAutoComplete(e) {
  const q = (e?.query || "").trim().toLowerCase();
  acSuggestions.value = q
    ? suggestPool.filter((s) => s.toLowerCase().includes(q)).slice(0, 8)
    : [];
}
function onAutoSelect(e) {
  const v = typeof e?.value === "string" ? e.value : e?.value?.label || keyword.value;
  keyword.value = v || "";
  onSearch();
}
function onSearch() {
  if (!keyword.value) return;
  // 變更：原本 router.push({ name: 'search', ... }) → 改用 MPA 導向
  navSearch(keyword.value);
}

const suggestPool = [
  "Python 入門",
  "Python 網頁爬蟲",
  "Python 資料科學",
  "Python 機器學習",
  "Python Flask",
  "Python FastAPI",
  "Vue 3 教學",
  "Vue Router",
  "Pinia 狀態管理",
  "JavaScript 基礎",
  "TypeScript",
  "前端工程化",
  "React 基礎",
  "Node.js",
];

const mobileOpen = ref(false);
const mobileSearchOpen = ref(false);
const exploreMenu = ref();
const langMenu = ref();
const langMenuMobile = ref();

const exploreItems = [
  {
    label: "開發",
    items: [
      { label: "前端開發" },
      { label: "後端開發" },
      { label: "行動開發" },
      { label: "資料科學" },
    ],
  },
  {
    label: "設計",
    items: [
      { label: "UI/UX" },
      { label: "平面設計" },
      { label: "動態設計" },
      { label: "Figma" },
    ],
  },
  {
    label: "商業",
    items: [
      { label: "行銷" },
      { label: "創業" },
      { label: "專案管理" },
      { label: "財務" },
    ],
  },
];

const exploreGroups = [
  { title: "開發", items: ["前端開發", "後端開發", "行動開發", "資料科學"] },
  { title: "設計", items: ["UI/UX", "平面設計", "動態設計", "Figma"] },
  { title: "商業", items: ["行銷", "創業", "專案管理", "財務"] },
];

const langItems = [
  { label: "繁體中文", command: () => onLang("zh-TW") },
  { label: "English", command: () => onLang("en") },
  { label: "日本語", command: () => onLang("ja") },
];

const myLearningPopover = ref();
function onMyLearningClick(event) {
  if (isLoggedIn.value) {
    // SPA 路由，若在 MPA 也能 fallback 成整頁跳轉
    nav("/mylearning");
  } else {
    myLearningPopover.value?.toggle(event);
  }
}
function goExploreCourses() {
  myLearningPopover.value?.hide();
  // 變更：固定導到 MPA 搜尋頁
  navSearch("所有課程");
}

// 使用者選單
const userMenu = ref();
function toggleUserMenu(e) {
  userMenu.value?.toggle(e);
}
function goProfile() {
  userMenu.value?.hide();
  nav("/profile");
}
function goOrders() {
  userMenu.value?.hide();
  nav("/orders");
}
function logout() {
  auth.logout();
  userMenu.value?.hide();
  // 變更：回首頁用 MPA
  nav("/");
}

function toggleExplore(event) {
  exploreMenu.value?.toggle(event);
}
function toggleLang(event) {
  if (!event?.currentTarget) return;
  langMenu.value?.toggle?.(event);
  langMenuMobile.value?.toggle?.(event);
}
function onExplore(label) {
  // 變更：探索都導到 MPA 搜尋頁
  navSearch(label);
  mobileOpen.value = false;
}
function onLang(locale) {
  console.log("switch locale to", locale);
}
function goPricing() {
  nav("/pricing");
  mobileOpen.value = false;
}
function goBusiness() {
  nav("/business");
  mobileOpen.value = false;
}
function goTeach() {
  nav("/teach");
  mobileOpen.value = false;
}
function goCart() {
  nav("/cart");
  mobileOpen.value = false;
}
function goLogin() {
  nav("/login");
  mobileOpen.value = false;
}
function goSignup() {
  nav("/signup");
  mobileOpen.value = false;
}

const autoPt = {
  root: { class: "block w-full min-w-0" },
  input: {
    class: "w-full rounded-full border bg-white text-gray-900 placeholder-gray-400 h-11",
  },
  panel: { class: "bg-white border rounded-xl shadow-lg" },
  item: { class: "text-gray-900" },
};
</script>

<style scoped>
.theme-fixed-light {
  color-scheme: light;
}

/* 強制定義輸入與選單為淺色風格，避免系統深色模式改變外觀 */
:deep(.p-inputtext),
:deep(.p-autocomplete-input) {
  background: #fff;
  color: #111827; /* gray-900 */
}

:deep(.p-autocomplete-panel) {
  background: #fff;
  color: #111827;
  border-color: rgb(229 231 235); /* gray-200 */
}

/* PrimeVue Menu 的最小寬，讓群組標題不擠 */
:deep(.p-menu) {
  min-width: 16rem;
}

:deep(.p-autocomplete-input) {
  width: 100% !important;
}
</style>
