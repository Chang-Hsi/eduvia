<!-- src/components/profile/ProfileMain.vue -->
<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <!-- 頂部：左頭像與名字，右 Tab -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <img
          :src="user?.picture || defaultAvatar"
          class="w-10 h-10 rounded-full object-cover ring-1 ring-black/5"
          alt="avatar"
        />
        <div class="font-semibold text-gray-900 text-lg">
          {{ user?.name || "訪客" }}
        </div>
      </div>

      <TabMenu :model="tabs" v-model:activeIndex="activeTab" :pt="tabPt" />
    </div>

    <!-- 內容區：動態切換三個子元件 -->
    <component :is="currentComp" />
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import TabMenu from "primevue/tabmenu";

/* 子元件 */
import ResumeTab from "./tabs/ResumeTab.vue";
import FavoriteTab from "./tabs/FavoriteTab.vue";
import SettingsTab from "./tabs/SettingsTab.vue";

/* 使用者資訊（auth store，無則顯示預設） */
const auth = useAuthStore();
const user = computed(() => auth.user);
const defaultAvatar =
  "https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/user.svg";

/* Tabs（3 個） */
const tabs = [{ label: "我的履歷" }, { label: "我的收藏" }, { label: "個人設定" }];
const activeTab = ref(0);
const activeKey = computed(() => ["resume", "favorite", "settings"][activeTab.value]);

/* 依分頁回傳元件 */
const currentComp = computed(() => {
  return activeKey.value === "resume"
    ? ResumeTab
    : activeKey.value === "favorite"
    ? FavoriteTab
    : SettingsTab;
});

/* TabMenu 樣式微調 */
const tabPt = {
  root: { class: "border-0 bg-transparent p-0" },
  menu: { class: "flex gap-3" },
  action: {
    class:
      "px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 data-[active='true']:bg-gray-100 data-[active='true']:text-gray-900",
  },
};
</script>
