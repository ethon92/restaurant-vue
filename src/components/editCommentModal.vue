<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  comment: Object
});

const emit = defineEmits(['close', 'submit']);

const commentContent = ref('');
const rate = ref(0);
const hoverRate = ref(0);

// 初始化編輯資料
watch(() => props.comment, (newVal) => {
  if (newVal) {
    commentContent.value = newVal.comment_content || '';
    rate.value = newVal.rating || 0;
  }
}, { immediate: true });

const setRate = (num) => {
  rate.value = num;
};

const handleUpdate = () => {
  emit('submit', {
    rating: Number(rate.value),
    comment_content: commentContent.value.trim()
  });
};
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="custom-modal-overlay" @click.self="$emit('close')">
      <div class="custom-modal-content">
        <div class="modal-header-custom">
          <span class="restaurant-tag">
            {{ comment?.Name || '餐廳評論' }}
          </span>
        </div>

        <div class="modal-feature-box">
          <h2 class="form-title">更新評論</h2>

          <div class="form-section">
            <label class="form-label">評分：</label>
            <div class="star-rating">
              <i
                v-for="n in 5"
                :key="n"
                class="bi"
                :class="[n <= (hoverRate || rate) ? 'bi-star-fill' : 'bi-star']"
                @click="setRate(n)"
                @mouseenter="hoverRate = n"
                @mouseleave="hoverRate = 0"
              ></i>
            </div>
          </div>

          <div class="form-section">
            <label class="form-label">評論內容：</label>
            <textarea
              v-model="commentContent"
              placeholder="分享您的用餐體驗..."
              rows="6"
              class="custom-textarea"
            ></textarea>
          </div>

          <div class="button-group">
            <button
              @click="handleUpdate"
              :disabled="!commentContent.trim() || !rate"
              class="btn-send"
            >
              送出評論
            </button>
            <button @click="$emit('close')" class="btn-cancel-text">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 背景遮罩 */
.custom-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}

/* 外部容器 */
.custom-modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  padding: 15px 25px; /* 原為 30px，縮小上下間距至 15px */
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  animation: slideUp 0.3s ease-out;
}
.modal-header-custom {
  margin-bottom: 12px; /* 縮小與下方框線的距離 */
}
/* 餐廳標籤樣式 */
.restaurant-tag {
  background-color: #e7edff;
  color: #5c7cff;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
}

/* 核心功能區塊之內框 */
.modal-feature-box {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 15px 20px; /* 縮小內部上下內距 */
  background-color: #fff;
}
.form-section {
  margin-bottom: 12px; /* 縮小評分與評論內容之間的距離 */
}
.form-title {
  font-size: 22px; /* 稍微調小字體以節省空間 */
  font-weight: bold;
  color: #333;
  margin-bottom: 15px; /* 縮小標題下方的間距 */
}

.form-label {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 5px; /* 縮小標籤與星星/文字框的距離 */
  display: block;
}

/* 星星配色 */
.star-rating {
  font-size: 1.8rem; /* 稍微縮小星星，讓佈局更緊湊 */
  display: flex;
  gap: 8px;
  margin-bottom: 5px;
}
.star-rating i {
  cursor: pointer;
  color: #e0e0e0;
  transition: transform 0.2s;
}
.star-rating i.bi-star-fill {
  color: #ffc107;
}

/* 文字區域樣式 */
.custom-textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 15px;
  color: #444;
  resize: none;
  box-sizing: border-box;
  margin-bottom: 10px; /* 縮小與按鈕組的距離 */
}

/* 按鈕風格優化 */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 縮小送出與取消按鈕的間距 */
  align-items: center;
}

.btn-send {
  background-color: #72b262;
  color: white;
  border: none;
  width: 100%;
  padding: 10px; /* 縮小按鈕高度 */
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-send:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.btn-cancel-text {
  background: none;
  border: none;
  color: #888;
  font-size: 16px;
  cursor: pointer;
}

/* 動畫 */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>