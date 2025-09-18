// src/home-main.js
import { createApp, h } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";
import MasonryWall from "@yeger/vue-masonry-wall";

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";
import "primeicons/primeicons.css";

import { useAuthStore } from "@/stores/auth";
import HomePage from "@/mpa/HomePage.vue";

// 與 main.js 相同的主題
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

const app = createApp(HomePage);

// 全域外掛
app.use(createPinia());
app.use(MotionPlugin);
app.use(MasonryWall);

const auth = useAuthStore();
auth.initFromStorage();

app.use(PrimeVue, {
  theme: { preset: EduviaBlue, options: { cssLayer: false } },
});

// RouterLink 替身：把 <RouterLink> 轉成 <a> 做整頁跳轉
app.component("RouterLink", {
  props: { to: { type: [String, Object], required: true } },
  setup(props, { slots }) {
    const href =
      typeof props.to === "string"
        ? props.to
        : (props.to && (props.to.path || props.to.href)) || "#";
    return () => h("a", { href }, slots.default ? slots.default() : []);
  },
});

// 全域樣式
import "./style.css";

app.mount("#app");
