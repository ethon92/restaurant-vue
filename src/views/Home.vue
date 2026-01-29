<script setup>
import { ref } from 'vue';
import LobbySearch from '@/components/LobbySearch.vue';

// 初始化為空陣列
const restaurants = ref([]);

const isLoggedIn = ref(false);
const showLoginModal = ref(false);
</script>

<template>
  <div class="page-container">
    <nav class="navbar">
      <div class="logo">
        <span>平台名稱</span>
      </div>
      <div class="navbar-content">
        <div class="member-feature">會員專區</div>
        <template v-if="!isLoggedIn">
          <button @click="showLoginModal = true" class="btn-login">登入</button>
        </template>
        <template class="member-feature" v-if="!isLoggedIn">
          <button @click="showLoginModal = true" class="btn-login">註冊</button>
        </template>
      </div>
    </nav>

    <header class="hero">
      <div class="hero-content">
        <h1 class="hero-title">預訂您的下一頓美味</h1>
        <p class="hero-subtitle">全台 4,000+ 間頂級餐廳，一鍵即刻預定</p>
      </div>
    </header>

    <div>

      <LobbySearch @search-result="data => restaurants = data" />

      <hr />

      <div class="list-wrapper">
        <div v-if="restaurants.length > 0">

          <div v-for="r in restaurants" :key="r.ID" class="restaurant-card">
            <h3>{{ r.Name }}</h3>
            <p>📍 {{ r.Add }}</p>

            <router-link :to="{ name: 'RestaurantDetail', params: { id: r.ID } }">
              <button class="btn-detail">查看詳情與預約</button>
            </router-link>
          </div>

        </div>

        <div v-else class="no-data">
          <p>目前沒有餐廳資料，請試著搜尋關鍵字（例如：金門）</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.restaurant-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.btn-detail {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.no-data {
  text-align: center;
  color: #999;
  margin-top: 30px;
}

/* 基礎佈局 */
.page-container {
  min-height: 100vh;
  background-color: var(--bg-light);
  font-family: sans-serif;
}

/* Navbar 樣式 */
/* Navbar底色樣式 */
.navbar {
  background-color: grey;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

/* Navbar內容位置 */
.navbar-content {
  max-width: 80rem;
  /* margin: 0 auto; */
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Navbar標題 */
.logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 15px;
  color: var(--primary-color);
  letter-spacing: -0.025em;
  cursor: pointer;
}

.nav-item {
  color: var(--text-muted);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-item:hover {
  color: var(--primary-color);
}

.member-feature {
  padding: 10px;
  font-size: 16px;
  font-weight: 500;
}

/* 按鈕樣式 */
.btn-login {
  background: none;
  border: none;
  color: var(--text-muted);
  font-weight: 500;
  cursor: pointer;
}

.btn-register {
  background-color: var(--primary-color);
  color: black;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  border: none;
  font-weight: 500;
  box-shadow: var(--shadow-main);
  cursor: pointer;
  transition: background 0.2s;
}

.btn-register:hover {
  background-color: var(--primary-hover);
}

/* Hero Section */
.hero {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 3rem;
}
</style>