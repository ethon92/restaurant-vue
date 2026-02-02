<script setup>
import { favoriteList, updateFavorite } from '@/api/modules/feature';
import FavoriteCard from '@/components/ProfileDetail/FavoriteCard.vue';
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';

// 從pinia引入useAuthStore，以獲取userId
const authStore = useAuthStore();
const favoriteData = ref();


// 獲取收藏餐廳清單
const fetchFavoriteRestaurant = async () => {
    try {
        const response = await favoriteList(authStore.me.id);
        favoriteData.value = response.data.results;
        console.log(response.data)
    } catch (error) {
        console.warn(error)
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

// 掛載時直接抓取資料
onMounted(() => fetchFavoriteRestaurant())
</script>


<template>
    <FavoriteCard :restaurants="favoriteData" @edit-note="handleEdit"></FavoriteCard>
</template>


<style scoped>
/* TODO: 美化頁面 */
</style>