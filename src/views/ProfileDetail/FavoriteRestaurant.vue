<script setup>
import { favoriteList, updateFavorite } from '@/api/modules/feature';
import FavoriteCard from '@/components/ProfileDetail/FavoriteCard.vue';
import { onMounted, ref } from 'vue';

// 傳入使用者id
const props = defineProps({ me: Object })
const favoriteData = ref();


// 獲取收藏餐廳清單
const fetchFavoriteRestaurant = async () => {
    try {
        const response = await favoriteList(props.me.id);
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