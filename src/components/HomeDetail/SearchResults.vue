<script setup>
import RestaurantCard from './RestaurantCard.vue';


defineProps({
    results: Array
});

defineEmits(['close']);
</script>

<template>
    <div class="search-results-area">
        <hr class="divider" />
        <div class="section-header">
            <h2 class="section-title">搜尋結果 ({{ results.length }})</h2>
            <button class="close-search" @click="$emit('close')">清除搜尋 ×</button>
        </div>

        <div v-if="results.length > 0" class="results-grid">
            <RestaurantCard v-for="r in results" :key="'search-' + r.ID" :info="r" />
        </div>

        <div v-else class="no-data">
            <p>找不到符合條件的餐廳，換個關鍵字試試看！</p>
        </div>
    </div>
</template>

<style scoped>
.search-results-area {
    margin-top: 20px;
    padding-bottom: 60px;
}

.divider {
    border: 0;
    border-top: 1px solid #eee;
    margin-bottom: 40px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}

.close-search {
    background: #f3f4f6;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    color: #4b5563;
}

.no-data {
    text-align: center;
    color: #999;
    padding: 60px 0;
}
</style>