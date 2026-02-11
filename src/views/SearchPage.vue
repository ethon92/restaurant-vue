<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RestaurantList from '@/components/SearchPage/RestaurantList.vue';
import RestaurantMap from '@/components/SearchPage/RestaurantMap.vue';
import { useRestaurantSearch } from '@/composables/useRestaurantSearch';
import LobbySearch from '@/components/LobbySearch.vue';
import Navbar from '@/components/Navbar.vue';
import TheFooter from '@/components/TheFooter.vue';

const route = useRoute();
const router = useRouter();
const mapRef = ref(null);

const { restaurants, isLoading, hasMore, searchRestaurants, searchByBounds } = useRestaurantSearch();

const handleLobbySearch = (params) => {
  console.log("收到 LobbySearch 的參數:", params);
  router.push({
    query: params
  });
};

// 處理列表點擊，叫地圖飛過去 (子組件聯動)
const handleSelect = (item) => {
  // 防止傳入陣列
  const target = Array.isArray(item) ? item[0] : item;
  if (!target) return;

  console.log("嘗試定位餐廳:", target.Name);

  if (mapRef.value) {
    const lat = target.Py;
    const lng = target.Px;

    if (lat && lng) {
      mapRef.value.flyTo(lat, lng);
    } else {
      console.warn(`${target.Name} 該餐廳沒有座標資料 (Px/Py 為 null)`);
    }
  }
};

// 呼叫searchByBounds
const handleMapMove = async (bounds) => {
  if (route.query.city && route.query.city.length > 0) {
    console.log("已有選定縣市，地圖移動不出發座標搜尋");
    return;
  }
  const combinedParams = {
    ...bounds,
    q: route.query.q || '',
    city: route.query.city || null,
    price_level: route.query.price_level || null,
    tags: route.query.tags || null
  };
  await searchByBounds(combinedParams);
}

// 執行搜尋邏輯
const performSearch = async () => {
  console.log("正在執行新搜尋...", route.query);
  await searchRestaurants(route.query);
  if (restaurants.value.length > 0 && mapRef.value) {
    setTimeout(() => {
      handleSelect(restaurants.value[0]);
    }, 300);
  }
};

onMounted(() => {
  performSearch();
});

// 監聽 URL 參數變化
watch(() => route.query, () => {
  performSearch();
}, { deep: true });
</script>

<template>
  <Navbar></Navbar>
  <div class="search-page-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h4>搜尋結果</h4>
        <div v-if="isLoading" class="loading-hint">載入中...</div>
        <p v-else-if="restaurants.length > 0" class="result-count">
          共找到 {{ restaurants.length }} 家餐廳
        </p>
        <p v-else class="no-result">沒有找到符合條件的餐廳</p>
        <LobbySearch @search-submit="(params) => router.push({ query: params })" />
      </div>


      <div class="list-wrapper" style="position: relative;">
        <div v-if="isLoading" class="loading-overlay">
          <div class="spinner-border text-warning" role="status"></div>
          <p>搜尋中...</p>
        </div>
        <RestaurantList :data="restaurants" @select-restaurant="handleSelect" />

        <div class="list-wrapper">
          <RestaurantList :data="restaurants" @select-restaurant="handleSelect" />

          <div v-if="hasMore && restaurants.length > 0" class="load-more-container">
            <button class="load-more-btn" @click="searchRestaurants(route.query, true)" :disabled="isLoading">
              {{ isLoading ? '搜尋中...' : '查看更多餐廳' }}
            </button>
          </div>
        </div>
      </div>
    </aside>

    <main class="map-container">
      <RestaurantMap ref="mapRef" :restaurants="restaurants" @bounds-changed="handleMapMove" />
    </main>
  </div>
      <TheFooter></TheFooter>
</template>

<style scoped>
.search-page-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.sidebar {
  width: 40%;
  ;
  min-width: 400px;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  z-index: 10;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
}

.loading-hint {
  color: #666;
  font-style: italic;
}

.list-wrapper {
  flex: 1;
  overflow-y: auto;
}

.load-more-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  background-color: #fdf3e4;
  /* 配合你原本的背景色 */
}

.load-more-btn {
  background-color: #f38332;
  color: white;
  border: none;
  padding: 10px 40px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.load-more-btn:hover {
  background-color: #d66a1e;
  transform: translateY(-2px);
}

.load-more-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.map-container {
  flex: 1;
  background-color: #f8f9fa;
  position: relative;
}


/* RWD 響應式 */
@media (max-width: 768px) {
  .search-page-container {
    flex-direction: column-reverse;
  }

  .sidebar {
    width: 100%;
    height: 45%;
  }

  .map-container {
    height: 55%;
  }
}
</style>