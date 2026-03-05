<script setup>
import { memberCommentList } from '@/api/modules/auth'
import { updateComment , deleteComment} from '@/api/modules/feature'
import CommentCard from '@/components/CommentCard.vue';
import { useAuthStore } from '@/stores/auth';
import { onMounted , ref , computed } from 'vue';
import EditCommentModal from '@/components/editCommentModal.vue';

const authStore = useAuthStore();
const comments = ref([]);
const loading = ref(true);
const isModalShow = ref(false);
const currentEditComment = ref(null);
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
    console.log(comments.value)
  } catch (error) {
    console.error("獲取資料失敗", error);
  } finally {
    loading.value = false;
  }
};
// 當點擊更新按鈕時
const handleEditClick = (comment) => {
  currentEditComment.value = comment;
  isModalShow.value = true;
};
const onUpdateSubmit = async (formData) => {
  if (!currentEditComment.value) return;

  try {
    const payload = {
      user_id: Number(authStore.me.id),            
      comment_id: currentEditComment.value.comment_id, 
      comment_content: formData.comment_content.trim(), // 更新的文字內容
      rating: Number(formData.rating),
      restaurant_id: currentEditComment.value.restaurant_id              
    };

    console.log('準備發送更新資料：', payload);

    // 呼叫修正後的 API (不帶路徑參數)
    await updateComment(payload);
    
    alert('評論更新成功！');
    isModalShow.value = false;
    await getComments(); // 刷新列表
  } // <--- 你原本這裡少了一個收尾的大括號，請補上
  catch (error) {
    console.error('更新失敗:', error.response?.data || error);
    alert('更新失敗，請檢查輸入內容');
  }
};

const handleDelete = async (comment) => {
  // 彈出確認視窗，避免誤刪
  if (!confirm('確定要刪除這條評論嗎？')) return;
  const userId = authStore.me?.id; 
  const commentId = comment.comment_id;
  console.log(userId, commentId);
  if (!userId || !commentId) {
    alert("缺少必要的用戶或餐廳資訊");
    return;
  }
  try {
    await deleteComment(userId, commentId);
    alert('刪除成功！');

    await getComments(); 
  } catch (error) {
    console.error('刪除失敗:', error);
    alert('刪除失敗，請稍後再試');
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
  @edit="handleEditClick"
  @delete="handleDelete"
/>

<EditCommentModal 
      :show="isModalShow" 
      :comment="currentEditComment"
      @close="isModalShow = false"
      @submit="onUpdateSubmit"
    />
  </div>
</template>
<style scoped>
</style>