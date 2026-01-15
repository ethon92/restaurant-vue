<template>
  <div class="profile-container">
    <h2>會員資料</h2>

    <p><strong>Email：</strong>{{ user.email }}</p>
    <p><strong>角色：</strong>{{ user.role }}</p>

    <button @click="logout">登出</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getProfile, logout as logoutAPI } from '@/services/auth'

const router = useRouter()
const user = ref({
  email: '',
  role: ''
})

const fetchProfile = async () => {
  try {
    const data = await getProfile()
    user.value = data
  } catch (error) {
    alert('取得會員資料失敗')
  }
}

const logout = async () => {
  try {
    await logoutAPI()
    alert('已登出')
    router.push('/login')
  } catch (error) {
    alert('登出失敗')
  }
}

onMounted(() => {
  fetchProfile()
})
</script>
