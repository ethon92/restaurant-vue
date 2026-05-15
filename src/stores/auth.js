import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getProfile, logout as logoutAPI } from "@/api/modules/auth";

/**
 * Auth Store
 * 這裡是全站登入狀態唯一來源
 *
 * 我們現在會在 localStorage 保存：
 * - auth_access_token：JWT token
 * - auth_user_id：登入者 id
 * - auth_role：admin / user
 */
export const useAuthStore = defineStore("auth", () => {
  /** JWT token */
  const accessToken = ref(localStorage.getItem("auth_access_token") || "");

  /** 目前登入者 ID */
  const userId = ref(Number(localStorage.getItem("auth_user_id")) || null);

  /** 角色：admin / user */
  const role = ref(localStorage.getItem("auth_role") || "");

  /** 完整會員資料 */
  const me = ref(null);

  /** 是否正在抓會員資料 */
  const loadingMe = ref(false);

  /** 是否已登入：只要 token 存在就算 */
  const isLoggedIn = computed(() => !!accessToken.value);

  /** 是否為管理員 */
  const isAdmin = computed(() => role.value === "admin");

  /**
   * setSession：登入成功後呼叫
   * 會同步更新：
   * - Pinia state
   * - localStorage
   */
  function setSession({ token, userId: uid, role: userRole, me: user }) {
    accessToken.value = token ?? "";
    userId.value = uid ?? null;
    role.value = userRole ?? "";

    if (accessToken.value) {
      localStorage.setItem("auth_access_token", accessToken.value);
    } else {
      localStorage.removeItem("auth_access_token");
    }

    if (userId.value) {
      localStorage.setItem("auth_user_id", String(userId.value));
    } else {
      localStorage.removeItem("auth_user_id");
    }

    if (role.value) {
      localStorage.setItem("auth_role", role.value);
    } else {
      localStorage.removeItem("auth_role");
    }

    if (user) me.value = user;
  }

  /**
   * clearSession
   * 清除登入資訊
   */
  function clearSession() {
    me.value = null;
    setSession({
      token: "",
      userId: null,
      role: "",
    });
  }

  /**
   * fetchMe：需要會員資料時呼叫（Profile 進頁會用）
   *
   * 條件：
   * - 必須已登入（userId 存在），否則直接回 null
   * * 目前先沿用原本後端 /auth/profile 的寫法：
   * POST /auth/profile 送 { user_id }
   *
   * 注意：
   * 雖然 body 還是帶 user_id
   * 但後端現在會再用 JWT 驗證，避免別人亂查
   */
  async function fetchMe() {
    if (!userId.value || !accessToken.value) {
      me.value = null;
      return null;
    }

    loadingMe.value = true;
    try {
      // 後端吃 user_id
      const res = await getProfile({ user_id: userId.value });
      me.value = res.data;

      /**
       * 保險同步一次角色
       * 因為 profile 也會回 role
       */
      if (res.data?.role) {
        role.value = res.data.role;
        localStorage.setItem("auth_role", res.data.role);
      }

      return me.value;
    } catch (e) {
      clearSession(); // profile 拿不到就當作失效登入
      throw e;
    } finally {
      loadingMe.value = false;
    }
  }

  /**
   * logout：呼叫後端（若失敗也照樣清前端 session）
   */

  async function logout() {
    try {
      await logoutAPI();
    } catch (e) {
      // JWT 現階段主要是前端刪 token 即登出
      // 所以後端失敗也不影響本地登出
    }
    clearSession();
  }

  return {
    accessToken,
    userId,
    role,
    me,
    loadingMe,
    isLoggedIn,
    isAdmin,
    setSession,
    clearSession,
    fetchMe,
    logout,
  };
});
