<script setup>
import { useRouter } from 'vue-router';
import LobbySearch from '@/components/LobbySearch.vue';
import Navbar from '@/components/Navbar.vue';
import TheFooter from '@/components/TheFooter.vue';
import RestaurantCarousel from '@/components/HomeDetail/RestaurantCarousel.vue';
import RestaurantCard from '@/components/HomeDetail/RestaurantCard.vue';
import restaurantApi from '@/api/modules/restaurant';
import { restaurantCommentList } from '@/api/modules/restaurant';
import { onMounted, ref } from 'vue';
import ImageSearchResultModal from '@/components/SearchPage/ImageSearchResultModal.vue';
import { useSearchStore } from '@/stores/searchStore';

import { useAuthStore } from "@/stores/auth";
import { getRecommendRestaurants } from "@/api/modules/recommend";

const recommendedRestaurants = ref([])
const router = useRouter();
const searchStore = useSearchStore();
// 全域讀取狀態
const isGlobalLoading = ref(false);



const authStore = useAuthStore();
const recommendList = ref([]);

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
      // 將結果存入 Store，這會自動觸發彈窗顯示
      searchStore.setSearchResults(res.data.results);
      console.log("圖片搜尋結果:", res.data.results);
    }
  } catch (err) {
    console.error("圖片搜尋失敗:", err);
    alert("搜尋失敗，請稍後再試");
  } finally {
    isGlobalLoading.value = false;
  }
};


// 個人化推薦
const fetchRecommendRestaurants = async () => {
  try {
    // 沒登入就不抓個人化推薦
    if (!authStore.userId) return;

    const res = await getRecommendRestaurants(authStore.userId);

    // 後端回傳格式：
    // {
    //   data: [餐廳陣列],
    //   debug: {...}
    // }
    recommendList.value = res.data.data || [];

    // ✅ 檢查每筆推薦的原因來源
    console.log("推薦餐廳：", recommendList.value);

    // ✅ 這行可以清楚看到每筆餐廳是因為 click / favorite / booking / age
    console.table(
      recommendList.value.map((item) => ({
        ID: item.ID,
        Name: item.Name,
        source: item.recommend_source,
        reason: item.recommend_reason,
        tags: item.recommend_reason_tags,
        score: item.recommend_score,
      }))
    );

    // ✅ 如果後端有 debug，也一起看
    console.log("推薦 debug：", res.data.debug);
  } catch (error) {
    console.warn("取得推薦餐廳失敗", error);
  }
};

onMounted(() => {
  fetchRecommended();          // 熱門推薦
  fetchRecommendRestaurants(); // 個人化推薦
});

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
      <p>正在分析圖片並比對餐廳...</p>
    </div>

    <div class="search-section">
      <LobbySearch @search-submit="handleSearch" @image-upload="handleImageSearch" />
      <hr />
    </div>

    <!-- 圖片搜尋結果彈窗 -->
    <ImageSearchResultModal :show="searchStore.showResultModal" :results="searchStore.imageSearchResults"
      @close="searchStore.closeSearchModal" />

    <div class="container">
      <RestaurantCarousel title="熱門推薦" :list="recommendedRestaurants" />
    </div>

    <!-- 個人化推薦-->
    <div class="container" v-if="recommendList.length > 0">
      <RestaurantCarousel title="為你推薦" :list="recommendList" />
    </div>
    <!-- <section v-if="recommendList.length > 0" class="recommend-section">
      <h2>為你推薦</h2>

      <div class="recommend-grid">
        <RestaurantCard v-for="item in recommendList" :key="item.ID" :restaurant="item" />
      </div>
    </section> -->
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

/* 以圖搜尋餐廳的 Loading 效果 */
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
</style>