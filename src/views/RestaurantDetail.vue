<script setup>
import { ref, onMounted } from 'vue';
import AppointmentSection from '@/components/AppointmentSection.vue';
import restaurantApi from '@/api/modules/restaurant';
import FaqSection from '@/components/FaqSection.vue';

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
      <div class="spinner"></div>
      <p>Loading Experience...</p>
    </div>

    <div v-else class="content-layout">
      <main class="main-content">

        <section class="hero-section" :style="{ backgroundImage: `url(${getImageUrl(info.CoverImage)})` }">
          <button class="favorite-btn" :class="{ 'is-active': isFavorite }" @click="toggleFavorite">
            {{ isFavorite ? '❤️' : '🤍' }}
          </button>
          <div class="hero-overlay">
            <div class="hero-text">
              <span class="category-tag">{{ info.TagStr?.split(',')[0] || 'Restaurant' }}</span>
              <h1 class="restaurant-name">{{ info.Name }}</h1>
              <div class="quick-meta">
                <span class="rating">★ 4.5</span>
                <span class="location-brief">{{ info.City }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="info-card">
          <div class="section-header">
            <h3 class="section-title">餐廳介紹</h3>
            <div class="title-underline"></div>
          </div>
          <p class="description-text">{{ info.Description }}</p>
        </section>

        <section class="info-card">
          <h3 class="section-title">詳細資訊</h3>
          <div class="meta-grid">
            <div class="meta-item">
              <span class="icon">📍</span>
              <div>
                <label>地址</label>
                <p>
                  <a :href="info.GoogleMap" target="_blank" rel="noopener noreferrer" class="address-link">
                    {{ info.Add }}</a>
                </p>
              </div>
            </div>
            <div class="meta-item">
              <span class="icon">📞</span>
              <div>
                <label>電話</label>
                <p>{{ info.Tel }}</p>
              </div>
            </div>
            <div class="meta-item">
              <span class="icon">⏰</span>
              <div>
                <label>營業時間</label>
                <p>{{ info.ServiceTime }}</p>
              </div>
            </div>
            <div class="meta-item">
              <span class="icon">💰</span>
              <div>
                <label>均消</label>
                <p>{{ info.PriceLevel }}</p>
              </div>
            </div>
            <div class="meta-item">
              <span class="icon">🛜</span>
              <div>
                <label>餐廳網址</label>
                <p>
                  <a :href="info.Website" target="_blank" rel="noopener noreferrer" class="modern-link">
                    {{ info.Name }}
                  </a>
                </p>
              </div>
            </div>
            <div class="meta-item">
              <span class="icon">🍽️</span>
              <div>
                <label>營業風格</label>
                <p>{{ info.TagsStr }}</p>
              </div>
            </div>
            <div class="meta-item">
              <span class="icon">🔖</span>
              <div>
                <label>鄰近縣市</label>
                <p>{{ info.City }}</p>
              </div>
            </div>
            <div class="meta-item">
              <span class="icon">🅿️</span>
              <div>
                <label>停車資訊</label>
                <p>{{ info.Parking }}</p>
              </div>
            </div>

          </div>
        </section>

        <section class="ugc-section">
          <div class="ugc-placeholder">
            <p>Community Reviews & Photos (Coming Soon)
              <!-- 這裡放WOM, User Generated Content -->
            </p>
          </div>
        </section>
        <FaqSection></FaqSection>
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
:root {
  --primary-green: #98bd98;
  --accent-orange: #f38332;
  --text-main: #2d2d2d;
  --text-light: #757575;
  --bg-soft: #fcfcfc;
  --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  --border-radius: 20px;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', -apple-system, sans-serif;
  color: #2d2d2d;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
}

/* 1. Hero Section */
.hero-section {
  height: 450px;
  background-size: cover;
  background-position: center;
  border-radius: var(--border-radius);
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

/* fav section */
/* 加入最愛按鈕樣式 */
.favorite-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  /* 毛玻璃效果 */
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

.favorite-btn:active {
  transform: scale(0.9);
}

/* 當選中時的微調 */
.favorite-btn.is-active {
  background: white;
}
.restaurant-name {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 10px 0;
}

.category-tag {
  background: var(--primary-green);
  color: white;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.quick-meta {
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  gap: 20px;
}

/* 2 & 3. Info Cards */
.info-card {
  background: white;
  padding: 30px;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.description-text {
  line-height: 1.8;
  color: var(--text-light);
}

.address-link,
.modern-link {
  color: hsl(28, 75%, 45%);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.address-link:hover,
.modern-link:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
  filter: brightness(1.2);
}

/* 4. Meta Grid */
.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.meta-item {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.meta-item label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-light);
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.meta-item p {
  font-weight: 500;
  margin: 0;
}

.icon {
  font-size: 1.2rem;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 12px;
}

/* 5. UGC Placeholder */
.ugc-placeholder {
  border: 2px dashed #eee;
  padding: 60px;
  border-radius: var(--border-radius);
  text-align: center;
  color: #bbb;
}

/* 6. Sidebar / Appointment */
.sidebar {
  position: relative;
}

.sticky-container {
  position: sticky;
  top: 40px;
}

/* Responsive */
@media (max-width: 992px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: -1;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>