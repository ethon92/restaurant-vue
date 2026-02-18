<script setup>
import { ref } from 'vue';

const props = defineProps({
  src: String,
  alt: { type: String, default: 'restaurant image' }
});

const loading = ref(true);
const handleLoad = () => {
  loading.value = false;
};
</script>

<template>
  <div class="image-container">
    <div v-if="loading" class="spinner-overlay">
      <div class="spinner"></div>
    </div>

    <img
      :src="src"
      :alt="alt"
      loading="lazy"
      @load="handleLoad"
      :class="{ 'is-loaded': !loading }"
      class="restaurant-img"
    />
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3; /* 強制統一比例，排版更整齊 */
  background-color: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.spinner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f3f5;
  z-index: 1;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #dee2e6;
  border-top: 2px solid hsl(28, 75%, 45%); /* 配合你的主題色 */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.restaurant-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.is-loaded {
  opacity: 1;
  transform: scale(1);
}
</style>