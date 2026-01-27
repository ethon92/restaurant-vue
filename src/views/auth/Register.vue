<template>
  <div class="auth-container">
    <h2>會員註冊</h2>
    <form @submit.prevent="register">
      <input v-model.trim="name" type="text" placeholder="姓名" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="密碼" required />
      <input v-model="confirmPassword" type="password" placeholder="確認密碼" required />
      <input v-model="birthday" type="date" required />

      <button type="submit">註冊</button>
    </form>

    <p>
      已經有帳號？
      <router-link to="/login">回登入</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { register as registerAPI } from '@/api/modules/auth'
import { useRouter } from 'vue-router'


const name = ref("");
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const birthday = ref('')
const router = useRouter()


const register = async () => {
  if (!name.value) {
    alert("請輸入姓名");
    return;
  }
  if (!email.value.includes("@")) {
    alert("請輸入正確 Email");
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert('密碼不一致')
    return
  }
  try {
    console.log('註冊資料', email.value, password.value)
    await registerAPI({
      name: name.value,
      email: email.value,
      password: password.value,
      birthday: birthday.value, // YYYY-MM-DD
    })
    alert('註冊成功')
    router.push('/login')
  } catch (error) {
    console.log("register error:", error?.response?.data);
    alert('註冊失敗')
  }
}
</script>
