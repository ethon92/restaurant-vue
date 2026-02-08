<template>
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
        登入 <span aria-hidden="true">→</span>
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

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore();


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
    const user = res.data.user;
    /**
     * ✅ setSession 會做兩件事：
     * 1) 存 userId 到 Pinia state
     * 2) 同步 localStorage：key = "auth_user_id"
     *    -> router.beforeEach 用這個 key 判斷 requiresAuth
     */
    auth.setSession({ userId: user.id, me: user });

    alert("登入成功");
    // 登入成功之後，將網址推送至訂位紀錄頁面
    router.push("/profile/booking-record");

  } catch (error) {
    console.log("login error:", error?.response?.data);
    alert("登入失敗");
  }
};

</script>

<style scoped></style>
