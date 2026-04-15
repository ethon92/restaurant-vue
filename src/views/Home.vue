<script setup>
import { useRouter } from 'vue-router';
import LobbySearch from '@/components/LobbySearch.vue';
import Navbar from '@/components/Navbar.vue';
import TheFooter from '@/components/TheFooter.vue';
import RestaurantCarousel from '@/components/HomeDetail/RestaurantCarousel.vue';
import restaurantApi from '@/api/modules/restaurant';
import { restaurantCommentList } from '@/api/modules/restaurant';
import { onMounted, ref } from 'vue';
import SearchByImageCard from '@/components/SearchPage/SearchByImageCard.vue';

const recommendedRestaurants = ref([])
const router = useRouter();
const imageSearchResults = ref([]);
const showResultModal = ref(false); // 控制結果彈窗
const isGlobalLoading = ref(false); // 全域讀取狀態


// 處理來自 LobbySearch 的搜尋事件
const handleSearch = (searchParams) => {
  console.log('Home 接收到搜尋條件，準備跳轉:', searchParams);

  router.push({
    name: 'Search',
    query: searchParams
  });
};

const fetchRecommended = async () => {
  try {
    const res = await restaurantApi.getRestaurants(0, 2000); // 抓 100 筆抽 20 筆
    if (res?.data) {
      // 隨機抽 20 筆
      const rawList = res.data.sort(() => Math.random() - 0.5).slice(0, 20);

      // 2. 遍歷這 20 筆，去抓取各自的 rating
      const listWithRatings = await Promise.all(
        rawList.map(async (restaurant) => {
          try {
            // 呼叫取得評論 API
            const commentRes = await restaurantCommentList(restaurant.ID);
            const comments = commentRes?.data?.results || []; // 取得 results 陣列

            let avgRating = 0;
            if (comments.length > 0) {
              // 加總所有評論的 rating 欄位
              const totalScore = comments.reduce((sum, item) => sum + (item.rating || 0), 0);
              // 計算平均並四捨五入到小數點第一位
              avgRating = Number((totalScore / comments.length).toFixed(1));
            }

            return {
              ...restaurant,
              rating: avgRating,
              commentCount: comments.length // 可選：記錄評論數
            };
          } catch (err) {
            console.error(`餐廳 ${restaurant.ID} 評分計算失敗:`, err);
            return { ...restaurant, rating: 0, commentCount: 0 };
          }
        })
      );
      recommendedRestaurants.value = listWithRatings;
    }
  } catch (e) { console.error(e); }
};

// 處理來自 LobbySearch 的圖片搜尋事件
const handleImageSearch = async (file) => {
  isGlobalLoading.value = true; 
  try {
    // 建立 FormData 物件
    const formData = new FormData();

    // 加入圖片檔案 (必填)
    formData.append('file', file.file);

    // 呼叫後端 API 進行圖片搜尋，並傳入選擇的縣市
    const res = await restaurantApi.searchByImage(formData, file.city);

    if (res.data.status === 'success') {
      imageSearchResults.value = res.data.results; 
      showResultModal.value = true;
      console.log("圖片搜尋結果:", res.data.results);
    }
  } catch (err) {
    console.error("圖片搜尋失敗:", err);
    alert("AI 辨識失敗，請稍後再試");
  } finally {
    isGlobalLoading.value = false;
  }
};

const closeMetadata = () => {
  showResultModal.value = false;
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
    <!--  以圖搜尋餐廳的 loading 狀態 -->
    <div v-if="isGlobalLoading" class="loading-overlay">
      <div class="loader"></div>
      <p>AI 正在分析圖片並比對餐廳...</p>
    </div>

    <div class="search-section">
      <LobbySearch @search-submit="handleSearch" @image-upload="handleImageSearch" />
      <hr />
    </div>
    <!-- 圖片搜尋結果彈窗 -->
    <Transition name="fade">
      <div v-if="showResultModal" class="result-modal-overlay" @click.self="closeMetadata">
        <div class="result-modal-content">
          <div class="modal-header">
            <h2>AI 辨識結果</h2>
            <button class="close-btn" @click="closeMetadata">✕</button>
          </div>

          <div class="result-grid" v-if="imageSearchResults.length > 0">
            <SearchByImageCard v-for="item in imageSearchResults" :key="item.id"
              :info="item" />
          </div>
          <div v-else class="no-result">
            <p>找不到相似的餐廳，請嘗試換張照片或調整縣市。</p>
          </div>
        </div>
      </div>
    </Transition>

    <div class="container">
      <RestaurantCarousel title="熱門推薦" :list="recommendedRestaurants" />
    </div>
  </div>
  <TheFooter></TheFooter>
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

/* 彈窗背景遮罩 */
.result-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  padding: 20px;
}

/* 彈窗主體 */
.result-modal-content {
  background: #f8f9fa;
  width: 90%;
  max-width: 1000px;
  max-height: 85vh;
  border-radius: 20px;
  overflow-y: auto;
  position: relative;
  padding: 30px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  position: sticky;
  background: #f8f9fa;
  z-index: 10;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

/* 結果網格排版 */
.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  justify-items: center;
}

/* Loading 效果 */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 4000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #f38332;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>