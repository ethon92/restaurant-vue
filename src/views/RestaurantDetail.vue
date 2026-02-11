<script setup>
import { ref, onMounted } from 'vue';
import AppointmentSection from '@/components/AppointmentSection.vue';
import restaurantApi from '@/api/modules/restaurant';
import FaqSection from '@/components/FaqSection.vue';
import InfoMetaItem from '@/components/RestaurantDetail/InfoMetaItem.vue';
import DetailCard from '@/components/RestaurantDetail/DetailCard.vue';
import AddFavoriteCard from '@/components/AddFavoriteCard.vue';
import { useAuthStore } from '@/stores/auth';
import { deleteFavoriteRestaurant, getFavorite } from '@/api/modules/feature';
import Navbar from '@/components/Navbar.vue';
import TheFooter from '@/components/TheFooter.vue';


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


const authStore = useAuthStore();
const isFavorite = ref(false);
// 控制彈窗顯示
const showAddFavModal = ref(false);
// 成功收藏餐廳函式
const onFavSuccess = () => {
  showAddFavModal.value = false;
  isFavorite.value = true;
};

// 切換收藏餐廳函式
const toggleFavorite = () => {
  if (isFavorite.value) {
    // 如果已經是收藏狀態，執行取消收藏 API
    handleDeleteFav();
    isFavorite.value = false;
  } else {
    // 如果不是，則開啟「加入收藏」的彈窗輸入備註
    showAddFavModal.value = true;
  }
};

// 刪除收藏餐廳API函式
const handleDeleteFav = async () => {
  try {
    const result = await deleteFavoriteRestaurant(authStore.me.id, props.id)
    if (result.data.status == 'Success') {
      console.log('刪除成功!!')
    }
  } catch (error) {
    console.warn(error)
  }
}

// 查詢收藏餐廳API函式
const handleGetFavorite = async () => {
  try {
    const result = await getFavorite(authStore.me.id, props.id)
    isFavorite.value = result.data.results
  } catch (error) {
    console.warn(error)
  }
}

const getImageUrl = (path) => {
  if (!path) return '';

  if (path.startsWith('http')) return path;

  const baseUrl = 'http://127.0.0.1:8000';
  const cleanPath = path.startsWith('/') ? path : `/` + path;
  return `${baseUrl}/static${cleanPath}`;
};

onMounted(async () => {
  fetchDetail();
  handleGetFavorite();
});
</script>

<template>
  <Navbar></Navbar>
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
          <Transition name="modal-zoom">
            <div v-show="showAddFavModal" class="custom-modal-overlay">
              <div class="custom-modal-content card p-4 shadow-lg">
                <AddFavoriteCard :restaurantInfo="info" :userId="authStore.me.id" @success="onFavSuccess"
                  @close="showAddFavModal = false">
                </AddFavoriteCard>
              </div>
            </div>
          </Transition>
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
  <TheFooter></TheFooter>
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

/* 加入收藏餐廳按鈕 */
.favorite-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  cursor: pointer;
  z-index: 10;
  background: transparent;

  /* 磨砂玻璃背景效果 */
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  /* 陰影與過渡動畫 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 滑鼠懸停效果 */
.favorite-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* 點擊瞬間的壓縮感 */
.favorite-btn:active {
  transform: scale(0.9);
}

/* 已加入收藏 (is-active) 的狀態 */
.favorite-btn.is-active {
  background: #fff0f0;
  /* 淡淡的粉紅底 */
  animation: heartBeat 0.4s ease-in-out;
  background: transparent;
}

/* 心型跳動動畫 */
@keyframes heartBeat {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1.1);
  }
}

/* 彈窗背景遮罩 */
.custom-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.custom-modal-content {
  width: 100%;
  max-width: 450px;
  border-radius: 15px;
  border: none;
}

/* Modal 縮放進場動畫 */
.modal-zoom-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-zoom-enter-active,
.modal-zoom-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* 帶點彈性的貝氏曲線 */
}

/* 遮罩淡入效果 */
.modal-zoom-enter-active .custom-modal-overlay,
.modal-zoom-leave-active .custom-modal-overlay {
  transition: opacity 0.3s ease;
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

.address-link,
.modern-link {
  color: hsl(28, 75%, 45%);
  text-decoration: none;
  font-weight: 500;
}
</style>