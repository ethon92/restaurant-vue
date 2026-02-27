<script setup>
import { memberCommentList } from '@/api/modules/auth'
import CommentCard from '@/components/CommentCard.vue';
import { useAuthStore } from '@/stores/auth';
import { onMounted , ref , computed } from 'vue';

const authStore = useAuthStore();
const comments = ref([]);
const loading = ref(true);

const currentPage = ref(1);
const pageSize = ref(4);

// 計算當前頁面要顯示的評論
const displayedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return comments.value.slice(start, end);
});

// 計算總頁數
const totalPages = computed(() => {
  return Math.ceil(comments.value.length / pageSize.value);
});

// 處理換頁的函式
const handlePageChange = (page) => {
  currentPage.value = page;
};


const getComments = async () => {
  loading.value = true;
  try {
    if (!authStore.me) {
      await authStore.fetchMe();
    }
    const res = await memberCommentList(authStore.me.id);
    comments.value = res.data.results || [];
    currentPage.value = 1; // 每次獲取新資料時回到第一頁
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
    <CommentCard 
  :comments="displayedComments" 
  :loading="loading"
  :currentPage="currentPage"
  :totalPages="totalPages"
  @change-page="handlePageChange"
/>
  </div>
</template>
<style scoped>
</style>