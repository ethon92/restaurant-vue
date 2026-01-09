<script setup>
import { ref } from 'vue';
import LobbySearch from '@/components/LobbySearch.vue';

const restaurants = ref([]);
</script>

<template>
    <h1>這是home</h1>
    
    <LobbySearch @search-result="data => restaurants = data" />

    <div v-for="r in restaurants" :key="r.ID" style="border:1px solid #ccc; margin:10px; padding:10px;">
            <h3>{{ r.Name }}</h3>
            
            <router-link :to="{ name: 'restaurant-detail', params: { name: r.Name } }">
                <button>查看詳情與預約</button>
            </router-link>
    </div>
</template>

<style scoped></style>