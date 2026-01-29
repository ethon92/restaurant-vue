<template>
  <div class="auth-container">
    <h2>會員登入</h2>

    <form @submit.prevent="login">
      <input v-model.trim="email" type="email" placeholder="Email" required />
      <PasswordField v-model="password" placeholder="密碼" />
      <button type="submit">登入</button>
    </form>

    <p>
      <router-link to="/forgot-password">忘記密碼？</router-link>
    </p>
    <p>
      還沒有帳號？
      <router-link to="/register">前往註冊</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PasswordField from "@/components/PasswordField.vue";
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
    const user = res.data.user; // 後端 log in 回傳的 user
    auth.setSession({ userId: user.id, me: user }); // ✅ 存 userId 到 localStorage

    alert("登入成功");
    router.push("/profile");

  } catch (error) {
    console.log("login error:", error?.response?.data);
    alert("登入失敗");
  }
};

</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
}
</style>
