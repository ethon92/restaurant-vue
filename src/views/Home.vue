<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import LobbySearch from '@/components/LobbySearch.vue';
import RestaurantCarousel from '../components/HomeDetail/RestaurantCarousel.vue';
import SearchResults from '../components/HomeDetail/SearchResults.vue';
import restaurantApi from '@/api/modules/restaurant';

const recommendedRestaurants = ref([]);
const searchResults = ref([]);
const isSearching = ref(false);

const fetchRecommended = async () => {
  try {
    const res = await restaurantApi.getRestaurants(0, 2000); // 抓 100 筆抽 20 筆
    if (res?.data) {
      recommendedRestaurants.value = res.data.sort(() => Math.random() - 0.5).slice(0, 20);
    }
  } catch (e) { console.error(e); }
};

const handleSearch = (data) => {
  searchResults.value = data;
  isSearching.value = true;
};

onMounted(fetchRecommended);
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

    <section class="search-wrapper">
      <div class="container">
        <LobbySearch @search-result="handleSearch" />
      </div>
    </section>

    <div class="container">
      <RestaurantCarousel title="熱門推薦" :list="recommendedRestaurants" />

      <SearchResults v-if="isSearching" :results="searchResults" @close="isSearching = false" />
    </div>
  </div>
</template>

<style scoped>
/* 這裡只留下 Home 專用的 Hero 和基礎 Layout CSS 即可 */
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
}

.search-wrapper {
  background-color: #fff;
  padding: 30px 0;
  border-bottom: 1px solid #eee;
}
</style>