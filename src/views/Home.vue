<script setup>
import { useRouter } from 'vue-router';
import LobbySearch from '@/components/LobbySearch.vue';
import Navbar from '@/components/Navbar.vue';

const router = useRouter();

// 處理來自 LobbySearch 的搜尋事件
const handleSearch = (searchParams) => {
  console.log('Home 接收到搜尋條件，準備跳轉:', searchParams);

  router.push({
    name: 'Search', 
    query: searchParams
  });
};
</script>

<template>
  <div class="page-container">
    <Navbar />
    <header class="hero">
      <div class="hero-content">
        <h1 class="hero-title">預訂您的下一頓美味</h1>
        <p class="hero-subtitle">全台 4,000+ 間頂級餐廳，一鍵即刻預定</p>
      </div>
    </header>
    
    <div class="search-section">
      <LobbySearch @search-submit="handleSearch" />
      <hr />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
}

.hero {
  background-color: #f8f9fa;
  padding: 60px 20px;
  text-align: center;
}

.hero-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.hero-subtitle {
  color: #666;
  font-size: 1.2rem;
}

.search-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>