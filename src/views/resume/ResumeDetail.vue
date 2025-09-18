<template>
  <main class="min-h-screen bg-gray-100 py-6">
    <div class="mx-auto max-w-5xl px-4">
      <ResumePreview
        :resume="resume"
        :section-order="sectionOrder"
        :primary-color="ui.color"
        :template="ui.template"
        :theme="ui.theme"
        :lang="ui.lang"
      />
    </div>
  </main>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import ResumePreview from "@/components/resume/ResumePreview.vue";

const route = useRoute();
const routeId = computed(() => String(route.params.id || ""));

// 與建立頁同一組 key
const KEY = "resume:draft";
const SECTION_ORDER_KEY = "resume:sectionOrder";
const UI_KEY = "resume:ui";

// 預設空殼，掛上 reactive 方便渲染
const resume = reactive({
  basic: {
    name: "",
    gender: "不透露",
    birthday: null,
    phone: "",
    email: "",
    siteTitle: "",
    siteUrl: "",
    summary: "",
    avatarUrl: "",
  },
  educations: [],
  skillItems: [],
  experiences: [],
  projects: [],
  skills: [],
});

// UI（與 ThemeToolbar 對應）
const ui = reactive({
  theme: "classic",
  lang: "zh",
  color: "#1F6FB2",
  template: "Gradient",
});

// 區塊順序
const sectionOrder = computed(() => {
  try {
    const raw = localStorage.getItem(SECTION_ORDER_KEY);
    if (!raw) return ["edu", "skill", "exp", "proj"];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.map((i) => i.key) : ["edu", "skill", "exp", "proj"];
  } catch {
    return ["edu", "skill", "exp", "proj"];
  }
});

// 掛載時把本地草稿與 UI 狀態還原
onMounted(() => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      Object.assign(resume.basic, data.basic || {});
      resume.educations = Array.isArray(data.educations) ? data.educations : [];
      resume.skillItems = Array.isArray(data.skillItems) ? data.skillItems : [];
      resume.experiences = Array.isArray(data.experiences) ? data.experiences : [];
      resume.projects = Array.isArray(data.projects) ? data.projects : [];
      resume.skills = Array.isArray(data.skills) ? data.skills : [];
      // 清掉舊版 blob: 圖片（避免刷新失效）
      if (resume.basic.avatarUrl?.startsWith("blob:")) resume.basic.avatarUrl = "";
      for (const p of resume.projects)
        if (p.coverUrl?.startsWith("blob:")) p.coverUrl = "";
    }
  } catch {}

  try {
    const uiRaw = localStorage.getItem(UI_KEY);
    if (uiRaw) {
      const u = JSON.parse(uiRaw);
      if (u.theme) ui.theme = u.theme;
      if (u.lang) ui.lang = u.lang;
      if (u.color) ui.color = u.color;
      if (u.template) ui.template = u.template;
    }
  } catch {}
});
</script>
