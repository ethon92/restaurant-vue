<script setup>
import { ref } from 'vue'

const props = defineProps({
    restaurants: {
        type: Array,
    }
})
const emit = defineEmits(['edit-note', 'delete-fav', 'go-explore'])
const baseUrl = "http://localhost:8000/static"

// 用於 Modal 的響應式資料
const editingRestaurant = ref({})
const tempNote = ref("")

const saveNote = () => {
    // 取得 HTML 元素
    const modalElement = document.getElementById('editNoteModal')
    
    // 抓取已經存在的 Modal 實例
    const modal = bootstrap.Modal.getInstance(modalElement)
    
    // 呼叫 hide() 方法，讓對話框消失
    if (modal) {
        modal.hide()
    }
    // 連動畫面上顯示的文字
    editingRestaurant.value.fav_note = tempNote.value;
    const updateData = {
        fav_id: editingRestaurant.value.fav_id,
        fav_note: editingRestaurant.value.fav_note
    };
    emit('edit-note', updateData);
}

const openEditModal = (restaurant) => {
    editingRestaurant.value = restaurant
    tempNote.value = restaurant.fav_note || ""
    
    // 手動觸發 Bootstrap Modal (若沒用實體化，可用 data-bs-toggle)
    const modalElement = document.getElementById('editNoteModal')
    // 抓取已經存在的 Modal 實例
    const modal = new bootstrap.Modal(modalElement)
    modal.show()
}

// 加入 .stop 修飾符防止事件冒泡 (如果未來卡片本身有點擊功能)
const handleDelete = (id) => {
    emit('delete-fav', id)
}
</script>


<template>
    <!-- 顯示收藏餐廳列表 -->
    <div v-if="restaurants && restaurants.length > 0" class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
        <div class="col" v-for="restaurant in restaurants" :key="restaurant.fav_id">

            <div class="card h-100 shadow-sm border-0 restaurant-card position-relative">

                <button type="button" class="btn-close-custom" @click.stop="handleDelete(restaurant.fav_id)"
                    title="刪除此收藏">
                    <i class="bi bi-x-lg"></i>
                </button>

                <div class="img-wrapper">
                    <img class="card-img-top" :src="baseUrl + restaurant.CoverImage" :alt="restaurant.Name">
                </div>

                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold text-dark">{{ restaurant.Name }}</h5>

                    <div class="card-text text-secondary mb-3 flex-grow-1 note-text">
                        <i class="bi bi-pencil-square me-1"></i>
                        {{ restaurant.fav_note || "尚無備註..." }}
                    </div>

                    <div class="mt-auto pt-3 border-top">
                        <button class="btn btn-outline-primary btn-sm w-100" @click="openEditModal(restaurant)">
                            修改備註
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 若使用者還未收藏餐廳 -->
    <div v-else class="d-flex flex-column align-items-center justify-content-center py-5 text-center empty-state">
        <div class="mb-3 icon-container">
            <i class="bi bi-heartbreak text-muted" style="font-size: 4rem;"></i>
        </div>
        <h4 class="text-secondary fw-bold">目前沒有收藏餐廳</h4>
        <p class="text-muted mb-4">快去探索美味餐廳，將它們加入收藏清單吧！</p>

        <button class="btn btn-primary px-4 rounded-pill" @click="handleGoExplore">
            去探索餐廳
        </button>
    </div>
    <!-- 修改餐廳備註modal -->
    <div class="modal fade" id="editNoteModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">修改餐廳備註</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3 text-start">
                        <label class="form-label fw-bold">餐廳名稱</label>
                        <input type="text" class="form-control-plaintext" :value="editingRestaurant?.Name" readonly>
                    </div>
                    <div class="mb-3 text-start">
                        <label for="noteInput" class="form-label fw-bold">我的備註</label>
                        <textarea 
                            v-model="tempNote" 
                            class="form-control" 
                            id="noteInput" 
                            rows="4" 
                            placeholder="請輸入對這間餐廳的評價或筆記..."
                        ></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="saveNote">儲存變更</button>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* TODO: 美化頁面 */
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

/* modal樣式設定 */
.modal-content {
    border-radius: 15px;
    border: none;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.modal-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #eee;
    border-radius: 15px 15px 0 0;
}

.form-control:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
}
</style>