<!-- src/views/Signup.vue -->
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
            註冊以開始您的學習旅程
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

            <Button type="submit" label="註冊" severity="primary" class="w-full h-11" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* 使用說明：
   - 僅做畫面：onSubmit 現在只做 console.log，之後接 API 再替換。
   - 插圖路徑：src/assets/svg/Login.svg
*/
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import LoginSvg from "@/assets/svg/Login.svg";

const account = ref("");
const password = ref("");

function onSubmit() {
  console.log("login clicked", { account: account.value, password: password.value });
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
