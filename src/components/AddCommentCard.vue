<script setup>
import { createComment } from '@/api/modules/feature'
import { ref } from 'vue';

const user_id = ref();
const restaurant_id = ref();
const comment_content = ref('');
const rating = ref();

// 測試的預設資料
// userId.value = 2;
// restaurantId.value = 'C3_371020000A_000334';

const AddComment = async()=>{
    const trimmedComment = comment_content.value.trim()

    const comment_data = {
        user_id :user_id.value,
        restaurant_id :restaurant_id.value,
        comment_content : trimmedComment,
        rating : rating.value
    }
    try{
        const result = await createComment(comment_data)
        comment_content.value=''
        rating.value=''
        console.log(result)   
    }
    catch(error){
        console.log('msg:',error.response.comment_data)
    }
}
</script>
<template>
  <div class="add-comment-container">
    <h3>新增評論</h3>
    
    <div class="form-group">
      <label for="rating">評分：</label>
      <select v-model="rating" id="rating" class="form-control">
        <option disabled value="">請選擇分數</option>
        <option v-for="n in 5" :key="n" :value="n">{{ n }} 星</option>
      </select>
    </div>

    <div class="form-group">
      <label for="comment">評論內容：</label>
      <textarea 
        v-model="comment_content" 
        id="comment" 
        placeholder="分享您的用餐體驗..."
        rows="4"
        class="form-control"
      ></textarea>
    </div>

    <button @click="AddComment" :disabled="!comment_content.trim() || !rating" class="btn-submit">
      送出評論
    </button>
  </div>
</template>
<style scoped>

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
  background-color: #4CAF50;
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
