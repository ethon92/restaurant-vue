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
    try {
        const response = await favoriteList(authStore.me.id);
        favoriteData.value = response.data.results;
        console.log(response.data);
    } catch (error) {
        console.warn(error);
    }
};

// 更新收藏餐廳備註
const handleEdit = async (updateData) => {
    try {
        const result = await updateFavorite(updateData)
        console.log(result)
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
    // 利用setInterval實現進度條功能
    const timer = setInterval(() => {
        // 進度條的速度
        loadProgress.value += 10;
        // 當loadProgress超過100時，
        if (loadProgress.value >= 100) {
            clearInterval(timer)
            isLoading.value = false;
        }
    }, 400)
})
</script>


<template>
    <LoadingState v-if="isLoading" :progress="loadProgress" message="正在載入您的收藏餐廳..." />
    <FavoriteCard v-else :restaurants="favoriteData" @edit-note="handleEdit" @delete-fav="handleDelete"></FavoriteCard>
</template>


<style scoped></style>