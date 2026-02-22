import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getProfile, logout as logoutAPI } from "@/api/modules/auth";

/**
 * Auth Store
 * ✅ 全站登入狀態的單一來源
 *
 * 登入旗標：
 * - localStorage key: "auth_user_id"
 * - router guard 用這個判斷 requiresAuth（見 src/router/index.js）
 */
export const useAuthStore = defineStore("auth", () => {
  const userId = ref(Number(localStorage.getItem("auth_user_id")) || null);
  const me = ref(null);
  const loadingMe = ref(false);

  const isLoggedIn = computed(() => !!userId.value);

  /**
   * setSession：登入成功後呼叫
   * - 寫入 userId（並同步 localStorage）
   * - 可選：直接帶入 me（少打一支 /profile）
   */
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

  /**
   * fetchMe：需要會員資料時呼叫（Profile 進頁會用）
   * 條件：
   * - 必須已登入（userId 存在），否則直接回 null
   * - 後端目前設計「吃 user_id」：getProfile({ user_id })
   */
  async function fetchMe() {
    if (!userId.value) {
      me.value = null;
      return null;
    }

    loadingMe.value = true;
    try {
      // 後端吃 user_id
      const res = await getProfile({ user_id: userId.value });
      me.value = res.data;
      return me.value;
    } catch (e) {
      clearSession(); // profile 拿不到就當作失效登入
      throw e;
    } finally {
      loadingMe.value = false;
    }
  }

  /**
   * logout：呼叫後端（若失敗也照樣清 session）
   */

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
