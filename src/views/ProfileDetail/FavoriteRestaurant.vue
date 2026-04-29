<script setup>
import { favoriteList, updateFavorite, deleteFavorite } from '@/api/modules/feature';
import LoadingState from '@/components/LoadingState.vue';
import FavoriteCard from '@/components/ProfileDetail/FavoriteCard.vue';
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';

// 從pinia引入useAuthStore，以獲取userId
const authStore = useAuthStore();
const favoriteData = ref();
const isLoading = ref(true);
const loadProgress = ref(0);

// 獲取收藏餐廳清單
const fetchFavoriteRestaurant = async () => {
    // 初始化進度條
    loadProgress.value = 20; 

    try {
        // 當me為空值時，先去打API拿資料
        if (!authStore.me) {
            await authStore.fetchMe();
        }

        // 此時會員資料已獲取完成
        loadProgress.value = 50; 

        const response = await favoriteList(authStore.me.id);

        if (response.data) {
            favoriteData.value = response.data.results;
            // API 資料成功回傳，進度條滿格
            loadProgress.value = 100; 
        }
    } catch (error) {
        console.warn('抓取收藏失敗:', error);
    } finally {
        // 確保在資料載入後，稍微延遲一點點關閉
        setTimeout(() => {
            isLoading.value = false;
        }, 300);
    }
};

// 更新收藏餐廳備註
const handleEdit = async (updateData) => {
    try {
        const result = await updateFavorite(updateData)
        console.log(result)
        if (result.data.status == 'Success') {
            fetchFavoriteRestaurant()
        }
    } catch (error) {
        console.warn(error)
    }
}

// 刪除收藏餐廳
const handleDelete = async (favId) => {
    try {
        const result = await deleteFavorite(favId)
        console.log(result)
        if (result.data.status == 'Success') {
            fetchFavoriteRestaurant()
        }
    } catch (error) {
        console.warn(error)
    }
}

onMounted(() => {
    fetchFavoriteRestaurant();
})
</script>


<template>
    <LoadingState v-if="isLoading" :progress="loadProgress" ></LoadingState>
    <FavoriteCard v-else :restaurants="favoriteData" @edit-note="handleEdit" @delete-fav="handleDelete"></FavoriteCard>
</template>


<style scoped></style>