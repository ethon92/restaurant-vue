<script setup>
import SearchByImageCard from '@/components/SearchPage/SearchByImageCard.vue';

const props = defineProps({
    show: Boolean,
    results: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
</script>

<template>
    <Transition name="fade">
        <div v-if="show" class="result-modal-overlay" @click.self="close">
            <div class="result-modal-content">
                <div class="modal-header">
                    <h2>推薦相似餐廳：</h2>
                    <button class="close-btn" @click="close">✕</button>
                </div>

                <div class="result-grid" v-if="results.length > 0">
                    <SearchByImageCard v-for="item in results" :key="item.id" :info="item" />
                </div>
                <div v-else class="no-result">
                    <p>找不到相似的餐廳，請嘗試換張照片或調整縣市。</p>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
/* 彈窗背景遮罩 */
.result-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3000;
    padding: 20px;
}

/* 彈窗主體 */
.result-modal-content {
    background: #f8f9fa;
    width: 90%;
    max-width: 1000px;
    max-height: 85vh;
    border-radius: 20px;
    overflow-y: auto;
    position: relative;
    padding: 30px;
}

/* modal header 的樣式*/
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    top: 0;
    background: #f8f9fa;
    z-index: 10;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
}

/* 結果網格排版 */
.result-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    justify-items: center;
}

/* 動畫 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>