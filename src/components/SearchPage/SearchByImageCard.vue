<script setup>
defineProps({
    info: {
        type: Object,
        required: true
    }
});

const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300x180';
    if (path.startsWith('http')) return path;
    // 串接後端靜態資源路徑
    return `http://127.0.0.1:8000/static${path.startsWith('/') ? path : '/' + path}`;
};
</script>

<template>
    <div class="res-card">
        <div class="card-image">
            <img :src=" getImageUrl(info.cover_image)" alt="restaurant image">
        </div>

        <div class="card-info">
            <h3 class="res-name">{{ info.restaurant_name }}</h3>

            <div class="similarity-section">
                <span class="similarity-label">相似度: </span>
                <span class="similarity-value">{{ info.similarity }}%</span>
            </div>

            <p class="res-tags">
                {{ info.city }}
            </p>
        </div>

        <router-link :to="{ name: 'RestaurantDetail' , params: { id: info.id } }" class="card-btn">
            查看詳情
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
    width: 100%;
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

.card-info {
    padding: 16px;
}

.res-name {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.similarity-section {
    margin-bottom: 8px;
    font-size: 0.9rem;
}

.similarity-label {
    color: #666;
}

.similarity-value {
    color: #f38332;
    font-weight: bold;
}

.res-tags {
    color: #999;
    font-size: 0.85rem;
    margin: 0;
}

.card-btn {
    display: block;
    width: 100%;
    padding: 12px 0;
    background: #f38332;
    color: white;
    text-align: center;
    text-decoration: none;
    font-weight: bold;
    transition: background 0.2s;
    border: none;
}

.card-btn:hover {
    background: #e06f1d;
}
</style>