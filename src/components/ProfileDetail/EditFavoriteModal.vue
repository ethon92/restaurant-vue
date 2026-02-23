<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    restaurant: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['edit-note', 'cancel']);

// 初始值從傳入的 restaurant 物件中取得備註
const tempNote = ref(props.restaurant.favNote || "");

// 監聽 props 變化，確保切換餐廳時內容會更新
watch(() => props.restaurant, (newVal) => {
    tempNote.value = newVal.favNote || "";
}, { deep: true });

const handleSave = () => {
    const updateData = {
        fav_id: props.restaurant.favId,
        fav_note: tempNote.value
    };
    // 向上傳遞修改後的資料
    emit('edit-note', updateData);
};

const handleCancel = () => {
    emit('cancel');
};
</script>

<template>
    <div class="edit-card shadow-sm border rounded-3 overflow-hidden">
        <header class="card-header bg-light py-3 px-4 d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold">修改餐廳備註</h5>
            <span class="badge bg-primary-subtle text-primary rounded-pill px-3">
                {{ restaurant.name }}
            </span>
        </header>

        <main class="card-body p-4 bg-white">
            <div class="mb-3">
                <label for="noteInput" class="form-label fw-bold text-secondary mb-2">
                    我的用餐心得
                </label>
                <textarea v-model="tempNote" class="form-control custom-textarea" id="noteInput" rows="5"
                    placeholder="分享一下您對這間餐廳的評價或個人筆記..."></textarea>
            </div>
        </main>

        <footer class="card-footer bg-light py-3 px-4 d-flex justify-content-end gap-2 border-top">
            <button type="button" class="btn btn-outline-secondary px-4 rounded-pill" @click="handleCancel">
                取消
            </button>
            <button type="button" class="btn btn-primary px-4 rounded-pill fw-bold" @click="handleSave">
                儲存變更
            </button>
        </footer>
    </div>
</template>

<style scoped>
.edit-card {
    max-width: 600px;
    margin: 0 auto;
    background: #fff;
}

.card-header {
    border-bottom: 1px solid #edf2f7;
}

.custom-textarea {
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem;
    resize: none;
    transition: all 0.2s ease;
}

.custom-textarea:focus {
    border-color: hsl(28, 75%, 45%);
    box-shadow: 0 0 0 3px rgba(174, 86, 23, 0.1);
}

.card-footer {
    border-top: 1px solid #edf2f7;
}

/* 讓按鈕樣式與您的 Detail 頁面色系一致 */
.btn-primary {
    background-color: hsl(28, 75%, 45%);
    border-color: hsl(28, 75%, 45%);
}

.btn-primary:hover {
    background-color: hsl(28, 75%, 35%);
    border-color: hsl(28, 75%, 35%);
}
</style>