<script setup>
import { createComment } from '@/api/modules/feature'
import { ref } from 'vue';

const userId = ref();
const restaurantId = ref();
const commentContent = ref('');
const rate = ref();

// 測試的預設資料
userId.value = 3;
restaurantId.value = 'C3_371020000A_000334';

const AddComment = async()=>{
    const trimmedComment = commentContent.value.trim()
    const comment_data = {
        user_id :userId.value,
        restaurant_id :restaurantId.value,
        comment_content : trimmedComment,
        rating : rate.value
    }
    try{
        const result = await createComment(comment_data)
        rate.value=''
        commentContent.value=''
        console.log(result)   
    }
    catch(error){
        console.log('msg:',error.response.data)
    }
}
</script>
<template>
  <div class="add-comment-container">
    <h3>新增評論</h3>
    
    <div class="form-group">
      <label for="rating">評分：</label>
      <select v-model="rate" id="rating" class="form-control">
        <option disabled value="">請選擇分數</option>
        <option v-for="n in 5" :key="n" :value="n">{{ n }} 星</option>
      </select>
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

    <button @click="AddComment" :disabled="!commentContent.trim() || !rate" class="btn-submit">
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
