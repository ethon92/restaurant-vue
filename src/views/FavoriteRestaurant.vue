<script setup>
import { favoriteList } from '@/api/modules/feature';
import FavoriteCard from '@/components/FavoriteCard.vue';
import { onMounted, ref } from 'vue';

const userId = ref();
const favoriteData = ref();
// 測試用的預設資料
userId.value = 1

// 獲取收藏餐廳清單
const fetchFavoriteRestaurant = async () => {
    try {
        const result = await favoriteList(userId.value);
        favoriteData.value = result.data.results;
        console.log(result)
    } catch(error) {
        console.warn(error)
    }
};

// 掛載時直接抓取資料
onMounted(() => fetchFavoriteRestaurant())
</script>


<template>
    <FavoriteCard :restaurants="favoriteData"></FavoriteCard>
</template>


<style scoped>
    /* TODO: 美化頁面 */
</style>