<template>
  <div class="auth-container">
    <h2>忘記密碼</h2>

    <form @submit.prevent="goVerify">
      <input v-model="email" type="email" placeholder="請輸入註冊 Email" required />
      <button type="submit">下一步</button>
    </form>

    <p>
      <router-link to="/login">回登入</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { forgotPassword } from '@/api/modules/auth'


const email = ref('')
const router = useRouter()

const goVerify = async () => {
  try {
    await forgotPassword({ email: email.value })
    router.push({
      path: '/verify-identity',
      query: { email: email.value }
    })
  } catch (error) {
    alert('驗證信箱失敗')
  }
}
</script>
