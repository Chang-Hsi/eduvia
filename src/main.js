// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import { useAuthStore } from "@/stores/auth";
import { MotionPlugin } from '@vueuse/motion'
import router from '@/router'
import MasonryWall from '@yeger/vue-masonry-wall'

// PrimeVue v4
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes' // ← 重點：引入 definePreset
import 'primeicons/primeicons.css'

// 建立自訂藍色預設：把 semantic.primary 改成 blue 調色盤
const EduviaBlue = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}', // 主色
      600: '{blue.600}', // hover / ring
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    }
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(MasonryWall)
app.use(MotionPlugin)

const auth = useAuthStore();
auth.initFromStorage();

// 用你自訂的藍色預設取代 Aura 預設（原本是 emerald）
app.use(PrimeVue, {
  theme: {
    preset: EduviaBlue,
    options: {
      cssLayer: false // 讓自訂樣式更容易覆蓋（維持你目前設定）
    }
  }
})

// 你的全域樣式最後載入
import './style.css'

app.mount('#app')
