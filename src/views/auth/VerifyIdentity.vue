<template>
  <div class="auth-container">
    <h2>身分驗證</h2>

    <form @submit.prevent="verify">
      <input type="email" :value="email" disabled />

      <input
        v-model="birthday" type="date" required/>

      <button type="submit">驗證</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = route.query.email
const birthday = ref('')

const verify = async () => {
  // 這裡之後要接後端 API
  console.log(email, birthday.value)

  // 假設驗證成功
  router.push({
    path: '/reset-password',
    query: { email }
  })
}
</script>
