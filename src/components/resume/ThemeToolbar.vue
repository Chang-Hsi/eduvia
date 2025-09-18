<!-- src/components/resume/ThemeToolbar.vue -->
<template>
  <div
    class="inline-flex items-center gap-3 rounded-xl ring-1 ring-black/5 bg-white px-3 py-2 text-sm"
  >
    <div class="flex items-center gap-2">
      <i class="pi pi-palette text-gray-500"></i>
      <span class="text-gray-600">顏色：</span>
      <button
        class="w-5 h-5 rounded-full ring-1 ring-black/10 outline-none"
        :style="{ backgroundColor: colorValue }"
        @click="toggleOverlay"
        aria-label="選擇主色"
      />
      <OverlayPanel ref="op" :showCloseIcon="true" appendTo="body">
        <div class="p-2 w-[260px] space-y-3">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="c in presets"
              :key="c"
              class="w-6 h-6 rounded-full ring-1 ring-black/10 outline-none"
              :style="{ backgroundColor: c }"
              @click="onPickPreset(c)"
              aria-label="預設色"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">自訂：</span>
            <ColorPicker v-model="cpValue" format="hex" inline />
            <span class="text-xs text-gray-500">{{ colorValue.toUpperCase() }}</span>
          </div>
        </div>
      </OverlayPanel>
    </div>

    <span class="mx-3 h-5 w-px bg-gray-300"></span>

    <div class="flex items-center gap-2">
      <i class="pi pi-clone text-gray-500"></i>
      <span class="text-gray-600">模板：</span>
      <Dropdown
        v-model="templateValue"
        :options="templates"
        class="w-[140px]"
        size="small"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import OverlayPanel from "primevue/overlaypanel";
import ColorPicker from "primevue/colorpicker";
import Dropdown from "primevue/dropdown";

const props = defineProps({
  color: { type: String, default: "#1F6FB2" },
  template: { type: String, default: "Gradient" },
});
const emit = defineEmits(["update:color", "update:template"]);

// 雙向綁定（父層用 v-model:color / v-model:template）
const colorValue = computed({
  get: () => normalizeHex(props.color),
  set: (v) => emit("update:color", normalizeHex(v)),
});
const templateValue = computed({
  get: () => props.template,
  set: (v) => emit("update:template", v),
});

// PrimeVue ColorPicker 在 format="hex" 時回傳不含 '#' 的字串，這裡做轉換
const cpValue = computed({
  get: () => colorValue.value.replace(/^#/, "").toLowerCase(),
  set: (hex) =>
    (colorValue.value =
      "#" +
      String(hex || "")
        .replace(/^#/, "")
        .padStart(6, "0")),
});

// 常用色與模板清單
const presets = [
  "#1F6FB2",
  "#0EA5E9",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#A855F7",
  "#64748B",
  "#111827",
];
const templates = ["Gradient", "Classic", "Cards"];

// OverlayPanel 控制
const op = ref(null);
function toggleOverlay(e) {
  op.value?.toggle(e);
}

// 點預設色
function onPickPreset(c) {
  colorValue.value = c;
}

// 工具：把任何輸入轉成 #RRGGBB
function normalizeHex(v) {
  if (!v) return "#000000";
  let s = String(v).trim();
  s = s.startsWith("#") ? s.slice(1) : s;
  if (s.length === 3)
    s = s
      .split("")
      .map((x) => x + x)
      .join("");
  s = s
    .replace(/[^0-9a-fA-F]/g, "")
    .slice(0, 6)
    .padEnd(6, "0");
  return "#" + s.toUpperCase();
}
</script>

<style scoped>
/* 主要外觀以 Tailwind 為主，這裡不額外覆寫 */
</style>
