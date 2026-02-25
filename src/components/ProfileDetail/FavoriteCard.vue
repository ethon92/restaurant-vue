<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import EditFavoriteModal from './EditFavoriteModal.vue';

const emit = defineEmits(['edit-note', 'delete-fav', 'go-explore']);
const props = defineProps({
    restaurants: {
        type: Array,
    },
});

const baseUrl = "http://localhost:8000/static";
const router = useRouter();

// 用於 EditFavoriteModal 的資料
const editingRestaurant = ref(null);
const isEditing = ref(false);

const openEditSection = (restaurant) => {
    editingRestaurant.value = restaurant;
    isEditing.value = true;

    // 如果是採用捲動到編輯區的設計，可以加上：
    // window.scrollTo({ top: 0, behavior: 'smooth' });
}

const handleSaveNote = (updateData) => {
    // 3. 接收子元件傳來的資料並轉發給父層 (Profile.vue 等)
    emit('edit-note', updateData);
    isEditing.value = false;
    editingRestaurant.value = null;
}

const handleCancelEdit = () => {
    isEditing.value = false;
    editingRestaurant.value = null;
}


// 加入 .stop 修飾符防止事件冒泡 (如果未來卡片本身有點擊功能)
const handleDelete = (id) => {
    emit('delete-fav', id);
}

const getRestaurant = (restaurantId) => {
    router.push(`/restaurant/${restaurantId}`);
}
</script>


<template>
    <div class="favorite-section">
        <Transition name="fade-slide">
            <div v-if="isEditing && editingRestaurant" class="edit-overlay mb-5">
                <EditFavoriteModal :restaurant="editingRestaurant" @edit-note="handleSaveNote"
                    @cancel="handleCancelEdit"></EditFavoriteModal>
            </div>
        </Transition>
        <!-- 顯示收藏餐廳列表 -->
        <div v-if="restaurants && restaurants.length > 0 && !isEditing">
            <TransitionGroup name="staggered-list" tag="div" class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4"
                appear>
                <div class="col" v-for="(restaurant, index) in restaurants" :key="restaurant.favId"
                    :style="{ '--delay': index }">
                    <div class="card h-100 shadow-sm border-0 restaurant-card position-relative">
                        <button type="button" class="btn-close-custom" @click.stop="handleDelete(restaurant.favId)"
                            title="刪除此收藏">
                            <i class="bi bi-x-lg"></i>
                        </button>
                        <div class="img-wrapper">
                            <img class="card-img-top" :src="baseUrl + restaurant.coverImage" :alt="restaurant.name">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold text-dark" title="點擊查看餐廳詳情"
                                @click="getRestaurant(restaurant.restaurantId)">{{ restaurant.name }}</h5>

                            <div class="card-text text-secondary mb-3 flex-grow-1 note-text">
                                <i class="bi bi-pencil-square me-1"></i>
                                {{ restaurant.favNote || "尚無備註..." }}
                            </div>
                            <div class="mt-auto pt-3 border-top">
                                <button class="btn btn-outline-primary btn-sm w-100"
                                    @click="openEditSection(restaurant)">
                                    修改備註
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </TransitionGroup>
        </div>
        <!-- 若使用者還未收藏餐廳 -->
        <div v-else-if="restaurants.length == 0"
            class="d-flex flex-column align-items-center justify-content-center py-5 text-center empty-state">
            <div class="mb-3 icon-container">
                <i class="bi bi-heartbreak text-muted" style="font-size: 4rem;"></i>
            </div>
            <h4 class="text-secondary fw-bold">目前沒有收藏餐廳</h4>
            <p class="text-muted mb-4">快去探索美味餐廳，將它們加入收藏清單吧！</p>
            <RouterLink :to="{ 'name': 'home' }" class="btn btn-primary px-4 rounded-pill">去探索餐廳</RouterLink>
        </div>
    </div>
</template>


<style scoped>
.restaurant-card {
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
}

.restaurant-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;
}

/* --- 叉叉按鈕樣式 --- */
.btn-close-custom {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    /* 確保浮在圖片上層 */

    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;

    /* 半透明白色背景，讓它在深色或淺色圖片上都看得到 */
    background-color: rgba(255, 255, 255, 0.85);
    color: #666;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 懸停時變成紅色背景 */
.btn-close-custom:hover {
    background-color: #dc3545;
    /* Bootstrap Danger Red */
    color: white;
    transform: scale(1.1);
}

/* --- 圖片與其他樣式維持原樣 --- */
.img-wrapper {
    height: 12rem;
    overflow: hidden;
}

.card-img-top {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.restaurant-card:hover .card-img-top {
    transform: scale(1.05);
}

.note-text {
    font-size: 0.9rem;
    line-height: 1.5;
    background-color: #f8f9fa;
    padding: 8px;
    border-radius: 6px;
}

.card-title {
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.card-title:hover {
    color: #0d6efd !important;
    transform: translateX(3px);
    /* 輕微右移，增加動感 */
}

/* 也可以在文字前加上一個小圖示，讓引導更明確 */
.card-title:hover::after {
    content: "\2192";
    font-size: 0.8em;
    opacity: 0.7;
}

/* --- 交錯動畫核心邏輯 --- */

/* 進場前狀態 */
.staggered-list-enter-from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
}

/* 進場中狀態 */
.staggered-list-enter-active {
    transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    /* 重點：利用 CSS 變數計算延遲時間 */
    /* 每增加一個 index，延遲 0.1 秒 */
    transition-delay: calc(var(--delay) * 0.1s);
}

/* 離場狀態 */
.staggered-list-leave-to {
    opacity: 0;
    transform: scale(0.5);
}

.staggered-list-leave-active {
    transition: all 0.4s ease;
    position: absolute;
    /* 離場時絕對定位，讓其餘卡片滑動補位 */
    width: inherit;
    /* 保持寬度一致 */
}

/* 移動動畫 (當其他卡片被刪除時) */
.staggered-list-move {
    transition: transform 0.5s ease;
}

/* 編輯區域容器美化 */
.edit-overlay {
    /* 1. 背景：使用非常淡的漸層，增加層次感 */
    background: linear-gradient(145deg, #ffffff, #fdfaf7);

    /* 2. 邊框：改為實線，並使用柔和的品牌色調 */
    border: 1.5px solid rgba(174, 86, 23, 0.15);

    /* 3. 圓角與間距 */
    border-radius: 20px;
    padding: 2.5rem;

    /* 4. 陰影：使用多層陰影創造深度感，而不是單調的黑影 */
    box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.05),
        0 4px 6px -2px rgba(0, 0, 0, 0.02),
        inset 0 0 0 1px rgba(255, 255, 255, 0.6);
    /* 內發光效果 */

    /* 5. 確保與上方內容有足夠呼吸空間 */
    margin-bottom: 3rem;

    /* 6. 當它出現時的平滑效果 */
    transition: all 0.3s ease-in-out;
}

/* 如果滑鼠移到該區塊，可以有微弱的提亮效果 */
.edit-overlay:hover {
    border-color: rgba(174, 86, 23, 0.3);
    box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.08),
        0 10px 10px -5px rgba(0, 0, 0, 0.03);
}

/* 針對過場動畫的微調 */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-30px) scale(0.98);
    /* 加入輕微縮放效果 */
}
</style>