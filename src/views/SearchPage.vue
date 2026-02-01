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

const handleSelect = (item) => {
    if (!item) return;

    console.log("點擊餐廳:", item.Name); 
    
    if (mapRef.value) {
        const lat = item.Py; 
        const lng = item.Px;
        
        if (lat && lng) {
            mapRef.value.flyTo(lat, lng); 
        } else {
            console.warn(`${item.Name} 該餐廳沒有座標資料 (Px/Py 為 null)`);
        }
    }
};

const handleMapMove = (bounds) => {

    console.log("地圖範圍改變:", bounds);
};

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

        restaurants.value = res.data; 
        
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

watch(() => route.query, () => {
    performSearch();
});
</script>


<template>
  <div class="search-page-container">
    <!-- 左側：列表區塊 -->
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
  width: 400px;
  min-width: 320px; 
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

/* 右側地圖樣式 */
.map-container {
  flex: 1; 
  background-color: #f8f9fa;
  position: relative;
}

/* RWD 響應式：手機版變成上下排列 */
@media (max-width: 768px) {
  .search-page-container {
    flex-direction: column-reverse; 
  }
  .sidebar {
    width: 100%;
    height: 50%;
  }
  .map-container {
    height: 50%;
  }
}
</style>