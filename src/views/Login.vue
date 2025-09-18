<!-- src/views/Login.vue -->
<template>
  <div class="min-h-[60vh] flex items-center justify-center bg-white">
    <div class="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div class="hidden md:flex justify-center">
          <img
            :src="LoginSvg"
            alt="登入插圖"
            class="max-w-xl w-full h-auto select-none pointer-events-none"
          />
        </div>

        <div class="w-full max-w-md md:justify-self-start">
          <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">
            登入以繼續您的學習旅程
          </h1>

          <form class="space-y-4" @submit.prevent="onSubmit">
            <div>
              <label class="mb-1 block text-sm text-gray-700">帳號</label>
              <InputText
                v-model.trim="account"
                placeholder="輸入帳號"
                :pt="{ root: { class: 'w-full h-11 rounded-md' } }"
                class="w-full"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm text-gray-700">密碼</label>
              <Password
                v-model.trim="password"
                :feedback="false"
                toggleMask
                placeholder="輸入密碼"
                class="w-full"
              />
            </div>

            <Button type="submit" label="登入" severity="primary" class="w-full h-11" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 調整點：這頁是 SPA，但登入成功要導到「MPA 首頁或來源頁」→ 用 location.replace() 整頁跳轉
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import LoginSvg from "@/assets/svg/Login.svg";

// 使用 Pinia 的 auth store
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();

const account = ref("");
const password = ref("");

// 靜態假資料
const mockUserInfo = {
  email: "demo@eduvia.app",
  name: "王小明",
  given_name: "小明",
  family_name: "王",
  picture: "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png",
  locale: "zh-TW",
};
function createMockIdToken() {
  return `eduvia.mock.token.${Date.now()}`;
}

/* 新增：處理登入後要回到哪裡
   - 支援 ?r=/search/?q=xxx 這種 redirect 參數
   - 僅允許同站內部路徑（以 / 開頭）；異常或外站一律回 "/"
   - /class /search 自動補尾斜線
*/
function ensureSlash(p) {
  if (p === "/class") return "/class/";
  if (p === "/search") return "/search/";
  return p || "/";
}
function getRedirectTarget() {
  try {
    const url = new URL(window.location.href);
    const r = url.searchParams.get("r");
    if (!r) return "/";
    const decoded = decodeURIComponent(r);
    if (!decoded.startsWith("/")) return "/"; // 只允許站內路徑
    return ensureSlash(decoded);
  } catch {
    return "/";
  }
}

// 成功時呼叫 auth.login()，然後整頁跳轉（避免 SPA push 到不存在的 / 路由）
function onSubmit() {
  if (account.value === "1" && password.value === "1") {
    auth.login(mockUserInfo, createMockIdToken());
    const target = getRedirectTarget();
    // 用 replace 避免「返回」又回到登入頁的壞體驗
    window.location.replace(target);
  } else {
    console.log("Mock login failed. 使用帳號=1、密碼=1");
  }
}
</script>

<style scoped>
:deep(.p-inputtext),
:deep(.p-password-input) {
  background: #fff;
  color: #111827;
}
:deep(.p-password) {
  width: 100%;
}
:deep(.p-password-input) {
  width: 100% !important;
  padding-right: 2.5rem;
  height: 2.75rem;
  border-radius: 0.375rem;
}
:deep(.p-password-toggle-mask) {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  background: transparent;
  border: none;
  color: #9ca3af;
}
:deep(.p-password-toggle-mask:hover) {
  color: #4b5563;
}
</style>
