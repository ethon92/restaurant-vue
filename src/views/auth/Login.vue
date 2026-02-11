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

      <button class="btn btn-primary" type="submit">
        {{ loading ? "登入中..." : "登入 " }} <span aria-hidden="true">→</span>
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
import { ref } from 'vue'
import PasswordField from "@/components/PasswordField.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { login as loginAPI } from '@/api/modules/auth'
import { useRouter } from 'vue-router'
import { useAuthStore } from "@/stores/auth";
import Navbar from '@/components/Navbar.vue';

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore();
const loading = ref(false);


/**
 * ✅ 登入流程
 * 1) 呼叫 /auth/login 拿到 { id, email, role }
 * 2) 先 setSession 存 userId（讓後續 fetchMe 有 userId 可用）
 * 3) 立刻 await auth.fetchMe() 抓完整會員資料（name/birthday/phone）
 * 4) 等 me 有資料後再導頁 
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
     * ✅ 後端 /auth/login 回傳格式（約定）
     * res.data.user = { id, email, role, name?, birthday?, phone? }
     * 至少要有 id）
    */
    const user = res.data.user; // { id, email, role }
    /**
     * ✅ setSession 會做兩件事：
     * 1) 存 userId 到 Pinia state
     * 2) 同步 localStorage：key = "auth_user_id"
     *    -> router.beforeEach 用這個 key 判斷 requiresAuth
     */
    auth.setSession({ userId: user.id });

    // ✅ 立刻抓完整會員資料（讓 Profile/AccountDetail 一進去就有資料）
    await auth.fetchMe();

    alert("登入成功");
    // 登入成功之後，將網址推送至訂位紀錄頁面
    await router.push("/profile/booking-record");

  } catch (error) {
    console.log("login error:", error?.response?.data);
    alert(error?.response?.data?.detail || "登入失敗");
  }
  finally { loading.value = false; }
};

</script>

<style scoped></style>
