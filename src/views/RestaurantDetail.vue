<script setup>
import { ref, onMounted } from 'vue';
import AppointmentSection from '@/components/AppointmentSection.vue';
import restaurantApi from '@/api/modules/restaurant';
import FaqSection from '@/components/FaqSection.vue';
import InfoMetaItem from '@/components/RestaurantDetail/InfoMetaItem.vue';
import DetailCard from '@/components/RestaurantDetail/DetailCard.vue';


const props = defineProps({
  id: {
    type: String,
    required: true
  }
});
const info = ref({});
const gallery = ref([]);
const isLoading = ref(true);

//抓餐廳資料
const fetchDetail = async () => {
  try {
    const res = await restaurantApi.getDetail(props.id);
    if (res && res.data) {
      info.value = res.data.info || {};
      gallery.value = res.data.gallery || [];
      console.log("資料抓取成功:", info.value);
    }
  } catch (error) {
    console.error("讀取失敗", error);
    alert("找不到此餐廳資訊！");
  } finally {
    isLoading.value = false;
  }
};
// fav section.
const isFavorite = ref(false);

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  // 這裡串接 API
  console.log(isFavorite.value ? "加入最愛成功" : "取消最愛成功");
};

const getImageUrl = (path) => {
  if (!path) return '';

  if (path.startsWith('http')) return path;

  const baseUrl = 'http://127.0.0.1:8000';
  const cleanPath = path.startsWith('/') ? path : `/` + path;
  return `${baseUrl}/static${cleanPath}`;
};

onMounted(async () => {
  fetchDetail();
});
</script>

<template>
  <div class="detail-container">
    
    <div v-if="isLoading" class="loading-state">
      <p>Loading...</p>
    </div>

    <div v-else class="content-layout">
      
      <main class="main-content">
        
        <section class="hero-section" :style="{ backgroundImage: `url(${getImageUrl(info.CoverImage)})` }">
          <button class="favorite-btn" :class="{ 'is-active': isFavorite }" @click="toggleFavorite">
            {{ isFavorite ? '❤️' : '🤍' }}
          </button>
          <div class="hero-overlay">
            <div class="hero-text">
              <h1 class="restaurant-name">{{ info.Name }}</h1>
            </div>
          </div>
        </section>

        <DetailCard title="餐廳介紹">
          <p class="description-text">{{ info.Description }}</p>
        </DetailCard>

        <DetailCard title="詳細資訊">
          <div class="meta-grid">
            <InfoMetaItem icon="📍" label="地址">
              <a :href="info.GoogleMap" target="_blank" class="address-link">{{ info.Add }}</a>
            </InfoMetaItem>
            <InfoMetaItem icon="📞" label="電話" :value="info.Tel" />
            <InfoMetaItem icon="⏰" label="營業時間" :value="info.ServiceTime" />
            <InfoMetaItem icon="💰" label="均消" :value="info.PriceLevel" />
            <InfoMetaItem icon="🛜" label="餐廳網址">
              <a :href="info.Website" target="_blank" class="modern-link">{{ info.Name }}</a>
            </InfoMetaItem>
            <InfoMetaItem icon="🍽️" label="營業風格" :value="info.TagsStr" />
            <InfoMetaItem icon="🔖" label="鄰近縣市" :value="info.City" />
            <InfoMetaItem icon="🅿️" label="停車資訊" :value="info.Parking" />
          </div>
        </DetailCard>

        <FaqSection />
      </main>

      <aside class="sidebar">
        <div class="sticky-container">
          <AppointmentSection :restaurant-name="info.Name" />
        </div>
      </aside>

    </div>
  </div>
</template>

<style scoped>
/* 頁面變數 */
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
}

/* Hero Section */
.hero-section {
  height: 450px;
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: flex-end;
  padding: 40px;
}

/* Meta Grid */
.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* Sidebar Appointment */
.sidebar {
  position: relative;
}

.sticky-container {
  position: sticky;
  top: 40px;
}

/* 側邊欄固定 */
.sticky-container {
  position: sticky;
  top: 40px;
}

@media (max-width: 992px) {
  .content-layout { grid-template-columns: 1fr; }
  .sidebar { order: -1; }
  .meta-grid { grid-template-columns: 1fr; }
}

.address-link, .modern-link {
  color: hsl(28, 75%, 45%);
  text-decoration: none;
  font-weight: 500;
}
</style>