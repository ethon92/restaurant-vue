<script setup>
defineProps({
    info: {
        type: Object,
        required: true
    }
});

const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300x180'; // 預防沒圖
    if (path.startsWith('http')) return path;
    return `http://127.0.0.1:8000/static${path.startsWith('/') ? path : '/' + path}`;
};
</script>

<template>
    <div class="res-card">
        <div class="card-image">
            <img :src="getImageUrl(info.CoverImage)" alt="restaurant image">
            <div class="price-badge">{{ info.PriceLevel || '$$' }}</div>
        </div>

        <div class="card-info">
            <h3 class="res-name">{{ info.Name }}</h3>

            <div class="rating-section">
                <slot name="rating">
                    <span class="placeholder-stars">★★★★★</span>
                    <span class="placeholder-reviews">(預留評論位置)</span>
                </slot>
            </div>

            <p class="res-tags">
                {{ info.TagStr?.split(',')[0] }} • {{ info.City }}
            </p>
            </div>

            <router-link :to="{ name: 'RestaurantDetail', params: { id: info.ID } }" class="card-btn">
                立即訂位
            </router-link>
        </div>
    
</template>



<style scoped>
.res-card {
    flex: 0 0 280px;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
    transition: transform 0.3s ease;
}

.res-card:hover {
    transform: translateY(-8px);
}

.card-image {
    height: 160px;
    position: relative;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.price-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.8rem;
    color: #f38332;
}

.card-info {
    padding: 16px;
}

.res-name {
    font-size: 1.1rem;
    font-weight: 800;
    margin-bottom: 8px;
}

.rating-section {
    margin-bottom: 10px;
    font-size: 0.85rem;
}

.placeholder-stars {
    color: #f59e0b;
}

.placeholder-reviews {
    color: #888;
    margin-left: 5px;
}

.res-tags {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 12px;
}

.card-btn {
    display: block;
    width: 100%;
    padding: 10px;
    background: #f38332;
    color: white;
    text-align: center;
    text-decoration: none;
    border-radius: 8px;
    font-weight: bold;
}
</style>