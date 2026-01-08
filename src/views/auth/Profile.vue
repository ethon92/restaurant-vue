<template>
  <div class="profile-container">
    <h2>會員資料</h2>

    <p><strong>Email：</strong>{{ user.email }}</p>
    <p><strong>角色：</strong>{{ user.role }}</p>

    <button @click="logout">登出</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { logout as logoutAPI } from '@/services/auth'

const user = ref({
  email: 'test@example.com',
  role: 'user'
})

const logout = () => {
  console.log('登出')
  alert('已登出（模擬）')
}
</script>
