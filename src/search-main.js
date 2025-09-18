// src/search-main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";
import MasonryWall from "@yeger/vue-masonry-wall";

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";
import "primeicons/primeicons.css";

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import SearchPage from "@/mpa/SearchPage.vue";

// 主題（與 main.js 相同）
const EduviaBlue = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{blue.50}",
      100: "{blue.100}",
      200: "{blue.200}",
      300: "{blue.300}",
      400: "{blue.400}",
      500: "{blue.500}",
      600: "{blue.600}",
      700: "{blue.700}",
      800: "{blue.800}",
      900: "{blue.900}",
      950: "{blue.950}",
    },
  },
});

const app = createApp(SearchPage);

// 迷你 router：目的只是讓 useRoute/useRouter 可用（讀取 query、支援 router.push）
const Dummy = { template: "<div/>" };
const router = createRouter({
  history: createWebHistory(), // 在 /search/ 下也能解析 query
  routes: [
    { path: "/search", component: Dummy, alias: ["/search/"] },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

// 若導向非 /search 的路徑（例如 router.push('/class')），改成整頁跳轉
router.beforeEach((to, from, next) => {
  if (!to.path.startsWith("/search")) {
    window.location.href = to.fullPath || "/";
    return;
  }
  next();
});

app.use(router);

// 全域外掛（與 SPA 同步）
app.use(createPinia());
app.use(MotionPlugin);
app.use(MasonryWall);

const auth = useAuthStore();
auth.initFromStorage();

app.use(PrimeVue, {
  theme: {
    preset: EduviaBlue,
    options: { cssLayer: false },
  },
});

// 全域樣式
import "./style.css";

app.mount("#app");
