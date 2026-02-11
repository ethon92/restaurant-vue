<script setup>
import { createFavorite } from '@/api/modules/feature';
import { ref } from 'vue';

const emit = defineEmits(['success', 'close'])
const props = defineProps({
    restaurantInfo: {
        type: Object
    },
    userId: {
        type: Number
    }
});
const favNote = ref('');

// 餐廳加入收藏函式
const addFavorite = async () => {
    // 刪除文字前後的空白
    const trimmedNote = favNote.value.trim()

    const data = {
        user_id: props.userId,
        restaurant_id: props.restaurantInfo.ID,
        fav_note: trimmedNote
    }

    try {
        const result = await createFavorite(data)
        // 清空note欄位的文字
        favNote.value = ''
        console.log(result)
        emit('success');
    } catch (error) {
        console.log('message:', error.response)
    }

}

</script>


<template>
    <div class="add-fav-container">
        <div class="text-center mb-4">
            <span class="badge bg-danger-subtle text-danger rounded-pill px-3 mb-2">NEW FAVORITE</span>
            <h4 class="fw-bold text-dark mt-1">
                <i class="bi bi-bookmark-star-fill me-2 text-warning"></i>
                {{ props.restaurantInfo.Name }}
            </h4>
        </div>

        <div class="mb-3">
            <label for="favNote" class="form-label">為這間餐廳寫點筆記...</label>
            <textarea class="form-control shadow-sm" id="favNote" rows="3" v-model="favNote"
                placeholder="例如：慶生首選、這家的甜點超厲害..."></textarea>
        </div>

        <div class="d-grid gap-2 mt-4">
            <button type="button" class="btn btn-primary btn-lg rounded-pill" @click="addFavorite">
                確認加入收藏
            </button>
            <button type="button" class="btn btn-light text-secondary text-decoration-none" @click="emit('close')">
                我再想想
            </button>
        </div>
    </div>
</template>


<style scoped>
/* 容器整體排版 */
.add-fav-container {
    padding: 0.5rem;
    color: #333;
}

/* 標籤樣式 */
.form-label {
    font-weight: 600;
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 0.75rem;
}

/* 備註輸入框美化 */
.form-control {
    border-radius: 12px;
    border: 1.5px solid #eee;
    padding: 12px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    resize: none;
    /* 防止使用者自行拉伸破壞排版 */
}

.form-control:focus {
    border-color: #ffb3b3;
    box-shadow: 0 0 0 0.25rem rgba(255, 77, 79, 0.1);
    outline: none;
}

/* 按鈕區域佈局 */
.d-flex.gap-2 {
    margin-top: 1.5rem;
}

/* 確認加入按鈕 */
.btn-primary {
    background-color: #ff4d4f;
    border: none;
    border-radius: 10px;
    padding: 10px 0;
    font-weight: 600;
    transition: all 0.3s transform;
}

.btn-primary:hover {
    background-color: #ff7875;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.btn-primary:active {
    transform: translateY(0);
}

/* 取消按鈕 */
.btn-light {
    background-color: #f5f5f5;
    border: none;
    border-radius: 10px;
    color: #888;
    padding: 10px 20px;
    font-weight: 500;
    transition: background 0.3s;
}

.btn-light:hover {
    background-color: #e8e8e8;
    color: #555;
}

h4 {
    letter-spacing: 0.5px;
    line-height: 1.4;
}

/* 響應式微調 */
@media (max-width: 576px) {
    .add-fav-container {
        padding: 0;
    }
}
</style>