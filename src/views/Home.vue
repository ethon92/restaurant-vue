<script setup>
import { useRouter } from 'vue-router';
import LobbySearch from '@/components/LobbySearch.vue';
import Navbar from '@/components/Navbar.vue';
import TheFooter from '@/components/TheFooter.vue';
import RestaurantCarousel from '@/components/HomeDetail/RestaurantCarousel.vue';
import restaurantApi from '@/api/modules/restaurant';
import { restaurantCommentList } from '@/api/modules/restaurant';
import { onMounted, ref } from 'vue';

const recommendedRestaurants = ref([])
const router = useRouter();
const isSearching = ref()


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
  try {
    // 建立 FormData 物件
    const formData = new FormData();

    // 加入圖片檔案 (必填)
    formData.append('file', file.file);

    // 呼叫後端 API 進行圖片搜尋，並傳入選擇的縣市
    const res = await restaurantApi.searchByImage(formData, file.city);
    
    if (res.data.status === 'success') {
      // TODO: 根據後端回傳的搜尋結果進行處理，例如跳轉到搜尋結果頁面或顯示在當前頁面
      console.log("圖片搜尋結果:", res.data.results);
    }
  } catch (err) {
    console.error("圖片搜尋失敗:", err);
  }
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

    <div class="search-section">
      <LobbySearch @search-submit="handleSearch" @image-upload="handleImageSearch" />
      <hr />
    </div>
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
</style>