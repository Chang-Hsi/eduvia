// src/class-main.js
import { createApp, h } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";
import MasonryWall from "@yeger/vue-masonry-wall";

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";
import "primeicons/primeicons.css";

import { useAuthStore } from "@/stores/auth";
import ClassPage from "@/mpa/ClassPage.vue";

// 1) 主題（與 main.js 相同）
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

const app = createApp(ClassPage);

// 2) 安裝全域外掛
const pinia = createPinia();
app.use(pinia);
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

// 3) 提供一個「不依賴 vue-router」的 RouterLink 替身
//    讓 DefaultHeader 等元件裡的 <RouterLink to="/xxx"> 能變成原生 <a href="/xxx"> 完整跳轉
app.component("RouterLink", {
  props: { to: { type: [String, Object], required: true } },
  setup(props, { slots }) {
    // 僅支援字串 path；若傳物件且含 path 就取 path，否則退回 '#'
    const href =
      typeof props.to === "string"
        ? props.to
        : (props.to && (props.to.path || props.to.href)) || "#";
    return () => h("a", { href }, slots.default ? slots.default() : []);
  },
});

// 4) 全域樣式
import "./style.css";

app.mount("#app");
