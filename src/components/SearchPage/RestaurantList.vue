<template>
  <div class="list-container">
    <div v-if="data.length === 0" class="empty-state">
      <p>在此區域內找不到餐廳，請移動地圖試試</p>
    </div>

    <div 
      v-for="item in data" 
      :key="item.id" 
      class="restaurant-card"
      @click="$emit('select-restaurant', item)"
    >
      <div class="card-image">
        <img :src="item.CoverImage || 'https://via.placeholder.com/150?text=No+Image'" alt="restaurant">
      </div>

      <div class="card-content">
        <h5 class="title">{{ item.name }}</h5>
        <p class="address"><i class="bi bi-geo-alt"></i> {{ item.address }}</p>
        
        <div class="footer">
          <span class="badge bg-info text-dark">{{ item.category || '一般餐廳' }}</span>
          <button class="btn btn-primary btn-sm btn-book" @click.stop="goBooking(item.id)">
            立即預約
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps(['data']);
const emit = defineEmits(['select-restaurant']);
const router = useRouter();

const goBooking = (id) => {
  // 跳轉到預約頁面
  router.push(`/booking/${id}`);
};
</script>

<style scoped>
.list-container {
  padding: 15px;
  background-color: #fcfcfc;
}

.restaurant-card {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eee;
}

.restaurant-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
  border-color: #007bff;
}

.card-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.title {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.address {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
  /* 限制地址長度，超出顯示省略號 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-book {
  border-radius: 20px;
  padding: 4px 15px;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #999;
}
</style>