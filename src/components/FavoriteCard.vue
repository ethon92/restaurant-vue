<script setup>
const props = defineProps({ restaurants: Array })
const baseUrl = "http://localhost:8000/static"
</script>


<template>
    <h1 class="m-2 text-center">我的收藏</h1>
    <div class="row row-cols-4">
        <div class="col" v-for="restaurant in restaurants" :key="restaurant.fav_id">
            <div class="card m-2">
                <img class="card-img-top" :src="baseUrl + restaurant.CoverImage" alt="餐廳照片">
                <div class="card-body">
                    <h5 class="card-title">{{ restaurant.RestaurantName }}</h5>
                    <p class="card-text">{{ restaurant.fav_note }}</p>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* 控制image高度 */
.card>img {
    height: 10rem;
}
/* TODO: 美化頁面 */
</style>