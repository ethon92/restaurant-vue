<script setup>
import { useRouter } from 'vue-router';
import LobbySearch from '@/components/LobbySearch.vue';
import Navbar from '@/components/Navbar.vue';


const router = useRouter();


const handleSearch = (searchParams) => {
  console.log('Home 接收到搜尋條件，準備跳轉:', searchParams);


  router.push({
    name: 'Search',
    query: searchParams
  });
};
</script>

<template>
  <Navbar></Navbar>
  <div class="home-container">
    <div class="hero-section">
      <h1>尋找您的下一頓美味</h1>
      <p>探索附近的熱門餐廳</p>
    </div>


    <LobbySearch @search-submit="handleSearch" />
    

  </div>
</template>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

.hero-section {
  margin-bottom: 30px;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  font-size: 1.2rem;
}
</style>