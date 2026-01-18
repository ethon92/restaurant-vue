<script setup>
import { createComment } from '@/api/modules/feature';
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
        rating : rating,value
    }
    try{
        const result = await AddComment(comment_data)
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


</template>
<style scoped>

</style>