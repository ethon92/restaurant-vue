<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios'; 
import RestaurantList from '@/components/SearchPage/RestaurantList.vue';
import RestaurantMap from '@/components/SearchPage/RestaurantMap.vue'; 

const route = useRoute();
const restaurants = ref([]);
const isLoading = ref(false);
const mapRef = ref(null);

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

const handleMapMove = (bounds) => {
    console.log("地圖範圍改變:", bounds);
};

// 執行搜尋邏輯
const performSearch = async () => {
    isLoading.value = true;
    try {
        let rawTags = route.query.tags;
        let tagsArray = [];
        
        if (Array.isArray(rawTags)) {
            tagsArray = rawTags;
        } else if (rawTags) {
            tagsArray = [rawTags]; 
        }

        const apiParams = {
            q: route.query.q,
            city: route.query.city,
            price_level: route.query.price_level,
            tags: tagsArray 
        };

        const res = await axios.get('http://localhost:8000/api/search', {
            params: apiParams,
            paramsSerializer: {
                indexes: null 
            }
        });

        // 過濾掉完全沒有座標的餐廳，避免地圖渲染出錯
        restaurants.value = res.data; 
        
        // 搜尋完後自動定位到第一筆
        if (restaurants.value.length > 0 && mapRef.value) {
            setTimeout(() => {
                handleSelect(restaurants.value[0]); 
            }, 500);
        }

    } catch (err) {
        console.error("搜尋發生錯誤:", err);
    } finally {
        isLoading.value = false;
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
  <div class="search-page-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h4>搜尋結果</h4>
        <div v-if="isLoading" class="loading-hint">載入中...</div>
        <p v-else-if="restaurants.length > 0" class="result-count">
          共找到 {{ restaurants.length }} 家餐廳
        </p>
        <p v-else class="no-result">沒有找到符合條件的餐廳</p>
      </div>
      
      <div class="list-wrapper">
        <RestaurantList 
          :data="restaurants" 
          @select-restaurant="handleSelect" 
        />
      </div>
    </aside>

    <main class="map-container">
      <RestaurantMap 
        ref="mapRef"
        :restaurants="restaurants" 
        @bounds-changed="handleMapMove" 
      />
    </main>
  </div>
</template>

<style scoped>
.search-page-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 60px); 
  overflow: hidden;
}

.sidebar {
  width: 800px;
  min-width: 600px; 
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  z-index: 10;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
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