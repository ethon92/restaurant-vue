<script setup>
import { createComment ,updateCommentStates } from '@/api/modules/feature'
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const props = defineProps(['restaurantIdProp', 'restaurantName','bookingIdProp']);
const emit = defineEmits(['close', 'submit-success']);

const authStore = useAuthStore();
const commentContent = ref('');
const rate = ref(0); 
const hoverRate = ref(0);
const setRate = (num) => {
    rate.value = num;
};
const AddComment = async () => {
    
    try {
      const comment_data = {
        user_id: authStore.me?.id,
        restaurant_id: String(props.restaurantIdProp), 
        comment_content: commentContent.value.trim(),
        rating: rate.value
    }
        await createComment(comment_data)
       if (props.bookingIdProp) {
            console.log("發出更新狀態請求，ID:", props.bookingIdProp);
            // 這裡發出的請求才會出現在網路面板
            await updateCommentStates({ 
                booking_id: Number(props.bookingIdProp) 
            });
        }
        emit('submit-success');
        rate.value = 0;
        commentContent.value = '';
    } catch (error) {
        console.log('API Error Detail:', error.response?.data);
    }
}
</script>
<template>
  <div class="add-comment-container">
    <h3>新增評論</h3>

    <div class="form-group">
      <label for="rating">評分：</label>
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

    <div class="form-group">
      <label for="comment">評論內容：</label>
      <textarea
        v-model="commentContent"
        id="comment"
        placeholder="分享您的用餐體驗..."
        rows="4"
        class="form-control"
      ></textarea>
    </div>

    <button
      @click="AddComment"
      :disabled="!commentContent.trim() || !rate"
      class="btn-submit"
    >
      送出評論
    </button>
  </div>
</template>
<style scoped>
/* 星星樣式 */
.star-rating {
  font-size: 1.5rem;
  display: flex;
  gap: 8px;
}
.star-rating i {
  cursor: pointer;
  color: #ddd;
  transition: color 0.2s;
}
.star-rating i.bi-star-fill {
  color: #ffc107; /* 金黃色星星 */
}
.add-comment-container {
  max-width: 500px;
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
.form-control {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.btn-submit {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-submit:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
