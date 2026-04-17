<template>
  <Navbar />
  <AuthLayout title="會員登入" subtitle="登入後即可查看訂位、收藏與個人資料" icon="🔑">
    <form class="form" @submit.prevent="login">
      <label class="label">
        Email
        <input v-model.trim="email" class="input" type="email" placeholder="your@email.com" required />
      </label>

      <label class="label">
        密碼
        <PasswordField v-model="password" placeholder="請輸入密碼" />
      </label>

      <button class="btn btn-primary" type="submit" :disabled="loading">
        {{ loading ? "登入中..." : "登入" }} <span aria-hidden="true">→</span>
      </button>
    </form>

    <template #footer>
      <div class="help-row">
        <RouterLink class="link" to="/forgot-password">忘記密碼？</RouterLink>
        <RouterLink class="link" to="/register">前往註冊</RouterLink>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import PasswordField from "@/components/PasswordField.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { login as loginAPI } from "@/api/modules/auth";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Navbar from "@/components/Navbar.vue";

const email = ref("");
const password = ref("");
const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);


/**
 * ✅ 登入流程
 * 登入流程
 * 1. 前端送 email / password 到後端
 * 2. 後端驗證成功後回傳：
 *    - access_token
 *    - token_type
 *    - user: { id, email, role }
 * 3. 前端把 token / id / role 存進 Pinia + localStorage
 * 4. 再呼叫 fetchMe 抓完整會員資料
 * 5. 最後依角色導頁
 */
const login = async () => {
  //登入前先檢查
  if (!email.value.includes("@")) {
    alert("請輸入正確 Email");
    return;
  }

  if (!password.value) {
    alert("請輸入密碼");
    return;
  }

  if (loading.value) return;
  loading.value = true;

  try {
    const res = await loginAPI({
      email: email.value,
      password: password.value,
    });


    /**
     * 後端回傳格式：
     * {
     *   message: "login ok",
     *   access_token: "...",
     *   token_type: "bearer",
     *   user: {
     *     id,
     *     email,
     *     role
     *   }
     * }
     */
    const token = res.data.access_token;
    const user = res.data.user;

    /**
     * 存登入資訊
     * - token：之後 axios 會自動帶上
     * - userId：目前會員自己的 id
     * - role：admin / user
     */
    auth.setSession({
      token,
      userId: user.id,
      role: user.role,
    });

    /**
     * 立刻抓完整會員資料
     * 讓 Profile / AccountDetail 一進去就能直接用
     */
    await auth.fetchMe();

    alert("登入成功");

    /**
     * 讓 admin 登入後直接跳去管理頁
     */
    if (user.role === "admin") {
      router.push("/adminPage");
    } else {
      router.push("/");
    }
  } catch (error) {
    console.log("login error:", error?.response?.data);
    alert(error?.response?.data?.detail || "登入失敗");
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped></style>
