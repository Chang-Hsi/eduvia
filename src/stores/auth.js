// src/stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const idToken = ref("");

  const isLoggedIn = computed(() => !!user.value && !!idToken.value);

  // 開站時從 localStorage 初始化
  function initFromStorage() {
    try {
      const raw = localStorage.getItem("eduviaUserInfo");
      user.value = raw ? JSON.parse(raw) : null;
    } catch {
      user.value = null;
    }
    idToken.value = localStorage.getItem("idToken") || "";
  }

  // 登入（寫入狀態 + localStorage）
  function login(u, token) {
    user.value = u;
    idToken.value = token;
    localStorage.setItem("eduviaUserInfo", JSON.stringify(u));
    localStorage.setItem("idToken", token);
  }

  // 登出（清狀態 + localStorage）
  function logout() {
    user.value = null;
    idToken.value = "";
    localStorage.removeItem("eduviaUserInfo");
    localStorage.removeItem("idToken");
  }

  return { user, idToken, isLoggedIn, initFromStorage, login, logout };
});
