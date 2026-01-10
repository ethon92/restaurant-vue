<script setup>
import { createFavorite } from '@/api/modules/feature';
import { ref } from 'vue';

const userId = ref();
const restaurantId = ref();
const favNote = ref('');
// 測試的預設資料
// userId.value = 1;
// restaurantId.value = 'C3_371020000A_000331';

// 餐廳加入收藏函式
const addFavorite = async () => {
    // 刪除文字前後的空白
    const trimmedNote = favNote.value.trim()
    
    const data = {
        user_id: userId.value,
        restaurant_id: restaurantId.value,
        fav_note: trimmedNote
    }

    try {
        const result = await createFavorite(data)
        // 清空note欄位的文字
        favNote.value = ''
        console.log(result)
        // TODO: 加入成功訊息
    }
    catch (error) {
        console.log('message:', error.response.data)
        // TODO: 重複加入訊息
    }

    // TODO: 轉移至下一個畫面
}



</script>


<template>
    <div class="mb-3">
        <h1>餐廳名稱</h1>
        <label for="exampleFormControlTextarea1" class="form-label">備註：</label>
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="favNote"></textarea>
        <button type="button" class="btn btn-primary mt-3"
            @click="addFavorite">加入收藏</button>
    </div>
</template>


<style scoped></style>