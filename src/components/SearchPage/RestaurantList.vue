<script setup>
import { useRouter } from 'vue-router';
const props = defineProps(['data']);
const emit = defineEmits(['select-restaurant']);
const router = useRouter();

const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/150?text=No+Image';
  if (path.startsWith('http')) return path;

  // 對接後端 static 路徑
  const baseUrl = 'http://127.0.0.1:8000';
  const cleanPath = path.startsWith('/') ? path : `/` + path;
  return `${baseUrl}/static${cleanPath}`;
};

const goBooking = (id) => {
  router.push({
    name: 'RestaurantDetail',
    params: { id: id }
  });
};
</script>

<template>
  <div class="list-container">
    <div v-if="data.length === 0" class="empty-state">
      <p>在此區域內找不到餐廳，請移動地圖試試</p>
    </div>

    <div v-for="item in data" :key="item.ID" class="restaurant-card" @click="$emit('select-restaurant', item)">
      <div class="card-image">
        <img :src="getImageUrl(item.CoverImage)"
          @error="(e) => e.target.src = 'https://via.placeholder.com/150?text=Error'" alt="restaurant">
      </div>

      <div class="card-content">
        <div class="header-row">
          <h5 class="title">{{ item.Name }}</h5>
          <span v-if="item.PriceLevel" class="price-level">{{ item.PriceLevel }}</span>
        </div>

        <p class="address"><i class="bi bi-geo-alt"></i> {{ item.Add }}</p>


        <div class="footer">
          <div class="tags-wrapper">
            <template v-if="item.TagsStr">
              <span v-for="(tag, index) in item.TagsStr.split(',')" :key="index" class="custom-tag">{{ tag.trim()
                }}</span>
            </template>
            <span v-else class="custom-tag">一般餐廳</span>
          </div>
          <button class="custom-book" @click.stop="goBooking(item.ID)">
            立即預約
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-container {
  padding: 15px;
  background-color: #fdf3e4;
}

.restaurant-card {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #fbea98;
}

.restaurant-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  border-color: #f38332;
}

.card-image {
  width: 180px;
  height: 160px;
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  flex: 1;
  color: #333;
}

.price-level {
  color: #2e7d32;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  background: #e8f5e9;
  padding: 2px 8px;
  border-radius: 6px;
}

.address {
  font-size: 0.85rem;
  font-weight: 600;
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
  align-items: flex-start;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  margin-right: 10px;
}

.custom-tag {
  background-color: #c6851c;
  color: #fcfcfc;
  padding: 2px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  white-space: nowrap;
  display: inline-block;
  font-weight: 600;
}

.custom-book {
  background-color: #865120;
  color: #ffffff;
  padding: 10px 42px;
  border-radius: 20px;
  border: none;
  outline: none;
  box-shadow: none;
  font-size: 1rem;
  font-weight: 600;
}


.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #999;
}
</style>