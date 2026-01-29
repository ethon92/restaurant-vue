<template>
  <div class="auth-container">
    <h2>重設密碼</h2>

    <form @submit.prevent="resetPassword">
      <PasswordField v-model="password" placeholder="新密碼" />
      <PasswordField v-model="confirmPassword" placeholder="確認新密碼" />
      <button type="submit">確認修改</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PasswordField from "@/components/PasswordField.vue";
import { useRoute, useRouter } from 'vue-router';
import { resetPassword as resetPasswordAPI } from '@/api/modules/auth';


const route = useRoute();
const router = useRouter();

const email = route.query.email;
const password = ref('');
const confirmPassword = ref('');



const resetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    alert('密碼不一致')
    return
  }

  try {
    await resetPasswordAPI({
      email,
      password: password.value
    })
    alert('密碼已更新')
    router.push('/login')
  } catch (error) {
    alert('更新密碼失敗')
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
}
</style>