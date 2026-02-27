<script setup>
const props = defineProps({ comments: Array , loading: Boolean, currentPage: Number,
  totalPages: Number})
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
</script>
<template>
<div class="comment-list">
    <div v-if="loading" class="loading">載入評論中...</div>
    <div v-else-if="comments.length > 0">
      <div v-for="comment in comments" :key="comment.comment_id" class="comment-card">
        <div class="comment-header">
           <small>餐廳: {{ comment.Name }}</small>
        </div>
        <div class="comment-body">
          <p>{{ comment.comment_content }}</p>
        </div>
        <div class="comment-footer">
          <div class="rating">
      <span v-for="star in comment.rating" :key="'solid-' + star" class="star">★</span>
      
      <span v-for="emptyStar in (5 - comment.rating)" :key="'empty-' + emptyStar" class="star-empty">★</span>
      
      <small class="rating-number">({{ comment.rating }})</small>
    </div>
          <span class="time">{{ formatDate(comment.comment_time) }}</span>
        </div>
      </div>
    </div>
    <div class="pagination" v-if="totalPages > 1">
      <button 
        :disabled="currentPage === 1" 
        @click="$emit('change-page', currentPage - 1)"
      > 上一頁 </button>
      
      <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>

      <button 
        :disabled="currentPage === totalPages" 
        @click="$emit('change-page', currentPage + 1)"
      > 下一頁 </button>
    </div>
    <div v-else class="no-data">尚無評論紀錄</div>
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

.time {
  color: #bbb;
  font-size: 0.85rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  gap: 8px;
}

/* 基礎按鈕樣式 */
.pagination button {
  padding: 8px 16px;
  border: 1px solid #eee;
  background-color: #fff;
  color: #666;
  border-radius: 20px; /* 圓角與卡片風格呼應 */
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 輕微陰影 */
}

/* 滑鼠懸停效果 */
.pagination button:hover:not(:disabled) {
  border-color: #ff8d4d; /* 品牌橘色 */
  color: #ff8d4d;
  background-color: #fffaf7;
}

/* 當前頁碼激活狀態 */
.pagination button.active {
  background-color: #ff8d4d; /* 品牌橘色 */
  color: #fff;
  border-color: #ff8d4d;
  font-weight: bold;
}

/* 禁用狀態（例如在第一頁時點擊上一頁） */
.pagination button:disabled {
  background-color: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
  border-color: #eee;
  box-shadow: none;
}

/* 頁碼中間的文字標示 (選用) */
.page-info {
  margin: 0 10px;
  font-size: 14px;
  color: #999;
}
</style>