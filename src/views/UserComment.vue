<script setup>
import { memberCommentList } from '@/api/modules/auth'
import CommentCard from '@/components/CommentCard.vue';
import { onMounted , ref } from 'vue';

const userId = ref();
const comments = ref([]);
const loading = ref(true);
//測試資料
userId.value = 4

const getComments = async () => {
loading.value = true;
    const res = await memberCommentList(userId.value);
    try{
    comments.value = res.data.results || []; 
    
    console.log("取得的評論列表:", comments.value);
  } catch (error) {
    console.error("獲取資料失敗", error);
  } finally {
    loading.value = false;
  }
};
onMounted(getComments);
</script>
<template>
  <div>
    <CommentCard :comments="comments" :loading="loading" />
  </div>
</template>
<style scoped>
</style>