// src/stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getProfile, logout as logoutAPI } from "@/api/modules/auth";

export const useAuthStore = defineStore("auth", () => {
  const userId = ref(Number(localStorage.getItem("auth_user_id")) || null);
  const me = ref(null);
  const loadingMe = ref(false);

  const isLoggedIn = computed(() => !!userId.value);

  function setSession({ userId: uid, me: user }) {
    userId.value = uid ?? null;

    if (userId.value)
      localStorage.setItem("auth_user_id", String(userId.value));
    else localStorage.removeItem("auth_user_id");

    if (user) me.value = user;
  }

  function clearSession() {
    me.value = null;
    setSession({ userId: null });
  }

  async function fetchMe() {
    if (!userId.value) {
      me.value = null;
      return null;
    }

    loadingMe.value = true;
    try {
      // 後端吃 user_id
      const res = await getProfile({ user_id: userId.value });

      // 依後端回傳格式二選一
      me.value = res.data;

      return me.value;
    } catch (e) {
      clearSession();
      throw e;
    } finally {
      loadingMe.value = false;
    }
  }

  async function logout() {
    try {
      await logoutAPI();
    } catch (e) {}
    clearSession();
  }

  return {
    userId,
    me,
    loadingMe,
    isLoggedIn,
    setSession,
    clearSession,
    fetchMe,
    logout,
  };
});
