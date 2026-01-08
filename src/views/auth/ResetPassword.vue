<template>
  <div class="auth-container">
    <h2>重設密碼</h2>

    <form @submit.prevent="resetPassword">
      <input
        v-model="password"
        type="password"
        placeholder="新密碼"
        required
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="確認新密碼"
        required
      />

      <button type="submit">確認修改</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = route.query.email
const password = ref('')
const confirmPassword = ref('')

const resetPassword = () => {
  if (password.value !== confirmPassword.value) {
    alert('密碼不一致')
    return
  }

  // 之後要呼叫後端更新密碼
  console.log(email, password.value)

  alert('密碼已更新')
  router.push('/login')
}
</script>
