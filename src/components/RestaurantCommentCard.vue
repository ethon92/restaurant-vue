<script setup>
import {restaurantCommentList} from '@/api/modules/restaurant'
import { onMounted , ref , computed } from 'vue';

const restaurantId = ref();
const resComments = ref([]);
const loading = ref(true);
//頁數功能
const pageSize = 3; // 每頁顯示 3 筆
const currentPage = ref(1); // 當前頁碼，預設第 1 頁

//測試資料
restaurantId.value = 'C3_371020000A_000334'

const props = defineProps({ resComments: Array , resLoading: Boolean})
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  
  // 取得年、月、日、時、分
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  
  return `${y}/${m}/${d} ${hh}:${mm}`;
};

const getResComments = async () => {
loading.value = true;
    try{
    const res = await restaurantCommentList(restaurantId.value);
    resComments.value = res.data.results || []; 
    
    console.log("取得的評論列表:", resComments.value);
  } catch (error) {
    console.error("獲取資料失敗", error);
  } finally {
    loading.value = false;
  }
};
//頁數
const totalPages = computed(() => {
return Math.ceil(resComments.value.length / pageSize);
});

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return resComments.value.slice(start, end);
});
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(getResComments);
</script>
<template>
<div class="comment-list">
    <div v-if="resLoading" class="loading">載入評論中...</div>
    <div v-else-if="paginatedComments.length > 0">

      <div v-for="resComment in paginatedComments" :key="resComment.comment_id" class="comment-card">
        <div class="comment-header">
           <small>用戶ID(用戶名稱): {{ resComment.user_id }}</small>
        </div>
        <div class="comment-body">
          <p>{{ resComment.comment_content }}</p>
        </div>
        <div class="comment-footer">
          <div class="rating">
      <span v-for="star in resComment.rating" :key="'solid-' + star" class="star">★</span>
      
      <span v-for="emptyStar in (5 - resComment.rating)" :key="'empty-' + emptyStar" class="star-empty">★</span>
      
      <small class="rating-number">({{ resComment.rating }})</small>
    </div>
          <span class="time">{{ formatDate(resComment.comment_time) }}</span>
        </div>
      </div>
    </div>
    <div v-else class="no-data">尚無評論紀錄</div>

    <div class="pagination">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
        >
          上一頁
        </button>

        <span class="page-info">第 {{ currentPage }} 頁 / 共 {{ totalPages }} 頁</span>

        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages" 
          @click="changePage(currentPage + 1)"
        >
          下一頁
        </button>
      </div>
    </div>
</template>
<style scoped>
.comment-list {
  max-width: 600px;
  margin: 20px auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 載入中與無資料的提示樣式 */
.loading, .no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* 評論卡片主體 */
.comment-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  /* 微妙的卡片陰影 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: transform 0.2s ease;
}

/* 滑鼠懸停效果 */
.comment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* 頭部：餐廳名稱 */
.comment-header {
  margin-bottom: 8px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 8px;
}

.comment-header small {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

/* 內容區 */
.comment-body {
  color: #4a4a4a;
  line-height: 1.6;
  font-size: 1rem;
  margin: 12px 0;
}

/* 底部：評分與時間 */
.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}
/* 評論星號 */
.rating {
  color: #f39c12; /* 經典星星金黃色 */
  font-weight: bold;
  background: #fff9e6;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.star-empty {
  color: #e0e0e0; /* 灰色，代表未得星 */
}

.rating-number {
  color: #999;
  margin-left: 5px;
  font-weight: normal;
}
/* 時間樣式 */
.time {
  color: #bbb;
  font-size: 0.85rem;
}

/* 頁數樣式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  padding-bottom: 2rem;
  gap: 20px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background-color: #fff;
  color: #4a5568;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.page-btn:hover:not(:disabled) {
  background-color: #edf2f7;
  border-color: #cbd5e0;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f7fafc;
}

.page-info {
  font-size: 0.9rem;
  color: #718096;
}

</style>