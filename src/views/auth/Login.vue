<template>
  <div class="auth-container">
    <h2>會員登入</h2>

    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="密碼" required />

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
import { login as loginAPI } from '@/services/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    console.log('登入成功', email.value, password.value)
    await loginAPI({
      email: email.value,
      password: password.value,
    });

    alert("登入成功");
    router.push('/profile')
  } catch (error) {
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
