<script setup>
import { ref } from 'vue';
import LobbySearch from '@/components/LobbySearch.vue';
import Navbar from '@/components/Navbar.vue';

// 初始化為空陣列
const restaurants = ref([]);

const isLoggedIn = ref(false);
const showLoginModal = ref(false);
</script>

<template>
  <div class="page-container">
    <Navbar></Navbar>
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