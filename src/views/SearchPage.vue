<script setup>
import { ref, onMounted, watch, computed } from 'vue';
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

// 有語意查詢或明確選縣市時，鎖定地圖，不讓移動地圖覆蓋搜尋結果
const isSemanticLocked = computed(() => !!(route.query.q || route.query.city));

const unlockToMapMode = () => {
  router.push({ query: {} });
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
  // 有語意查詢或明確選縣市時，結果已按相關度排序，地圖移動不重搜
  if (route.query.q || route.query.city) {
    return;
  }
  await searchByBounds({ ...bounds });
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

        <div class="list-wrapper">
          <RestaurantList :data="restaurants" @select-restaurant="handleSelect" />

          <div v-if="hasMore && restaurants.length > 0" class="load-more-container">
            <template v-if="isSemanticLocked">
              <p class="semantic-hint">找不到想要的？試試換個說法描述看看</p>
            </template>
            <template v-else>
              <button class="load-more-btn" @click="searchRestaurants(route.query, true)" :disabled="isLoading">
                {{ isLoading ? '搜尋中...' : '查看更多餐廳' }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </aside>

    <main class="map-container">
      <div v-if="isSemanticLocked" class="map-lock-hint">
        <span>🔒 顯示搜尋結果位置</span>
        <button class="unlock-btn" @click="unlockToMapMode">改用地圖範圍探索</button>
      </div>
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
  position: relative;
  z-index: 100;
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


/* SearchPage 專用：縮小 LobbySearch 進階搜尋面板 */
.sidebar-header :deep(.search-system-wrapper) {
  padding: 10px 0;
}

.sidebar-header :deep(.search-bar) {
  padding: 5px 8px 5px 15px;
}

.sidebar-header :deep(.search-bar input) {
  font-size: 0.95rem;
  padding: 6px;
}

.sidebar-header :deep(.search-btn) {
  padding: 7px 18px;
  font-size: 0.85rem;
}

.sidebar-header :deep(.floating-panel) {
  max-height: calc(100vh - 220px);
  overflow-y: auto;
}

.sidebar-header :deep(.panel-inner) {
  padding: 15px;
}

.sidebar-header :deep(.filter-group) {
  margin-bottom: 12px;
}

.sidebar-header :deep(.filter-group label) {
  font-size: 0.7rem;
  margin-bottom: 6px;
}

.sidebar-header :deep(.chip) {
  padding: 4px 10px;
  font-size: 0.75rem;
}

.sidebar-header :deep(.chip-grid) {
  gap: 5px;
}

.sidebar-header :deep(.custom-range) {
  margin-top: 5px;
}

.sidebar-header :deep(.panel-footer) {
  margin-top: 12px;
  padding-top: 10px;
}

.sidebar-header :deep(.apply-btn) {
  padding: 7px 18px;
  font-size: 0.85rem;
}

.sidebar-header :deep(.reset-link) {
  font-size: 0.8rem;
}

.map-lock-hint {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  color: #555;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  white-space: nowrap;
}

.unlock-btn {
  background: #f38332;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.unlock-btn:hover {
  background: #d66a1e;
}

.semantic-hint {
  color: #999;
  font-size: 0.85rem;
  text-align: center;
  padding: 10px 0;
  margin: 0;
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