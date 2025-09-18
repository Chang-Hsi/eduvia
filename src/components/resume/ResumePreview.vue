<template>
  <component
    :is="Current"
    :resume="resume"
    :section-order="sectionOrder"
    :primary-color="primaryColor"
    :template="template"
    :theme="theme"
    :lang="lang"
  />
</template>

<script setup>
// Host：依 template 載入對應的樣式元件
import { computed, defineAsyncComponent } from "vue";

const props = defineProps({
  resume: { type: Object, required: true },
  theme: { type: String, default: "classic" },
  lang: { type: String, default: "zh" },
  sectionOrder: { type: Array, default: () => ["edu", "skill", "exp", "proj"] },
  primaryColor: { type: String, default: "#314258" },
  template: { type: String, default: "Classic" }, // 由 ThemeToolbar 控制
});

// Lazy-load 各樣式
const variants = {
  classic: defineAsyncComponent(() => import("./variants/PreviewClassic.vue")),
  cards: defineAsyncComponent(() => import("./variants/PreviewCards.vue")),
  gradient: defineAsyncComponent(() => import("./variants/PreviewGradient.vue")),
};

// Template 名稱對應（目前實作 Classic / Cards，其他先用 Classic）
const Current = computed(() => {
  const t = String(props.template || "Classic").toLowerCase();
  if (t.includes("card")) return variants.cards;
  if (t.includes("grad")) return variants.gradient;
  return variants.classic;
});
</script>
