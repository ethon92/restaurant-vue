<script setup>
defineProps({
    message: {
        type: String,
        default: '正在載入您的收藏餐廳...'
    },
    progress: {
        type: Number,
        default: 0
    },
    showProgress: {
        type: Boolean,
        default: true
    }
})
</script>

<template>
    <div class="loading-wrapper d-flex flex-column align-items-center justify-content-center p-5">
        <div class="spinner-container mb-4">
            <div class="spinner-border text-primary spinner" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <h5 class="text-secondary fw-bold mb-3">{{ message }}</h5>

        <div v-if="showProgress" class="progress w-50 mb-4 progress-wrapper">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                :style="{ width: progress + '%' }"></div>
        </div>

        <div class="skeleton-screen row w-100 g-3 mt-4">
            <div v-for="i in 4" :key="i" class="col-md-3">
                <div class="skeleton-card">
                    <div class="skeleton-img"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-text long"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.loading-wrapper {
    min-height: 400px;
    background-color: #ffffff;
    border-radius: 12px;
}

.spinner {
    width: 3rem; 
    height: 3rem;
}

.progress-wrapper {
    height: 10px;
}

/* 骨架屏動畫特效 */
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.skeleton-card {
    background: #fdfdfd;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #eee;
}

.skeleton-img,
.skeleton-text {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
    border-radius: 4px;
}

.skeleton-img {
    height: 120px;
    margin-bottom: 15px;
}

.skeleton-text {
    height: 15px;
    margin-bottom: 10px;
}

.skeleton-text.short {
    width: 60%;
}

.skeleton-text.long {
    width: 90%;
}
</style>