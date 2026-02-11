<script setup>
import { ref , onMounted} from 'vue';
import RestaurantCard from './RestaurantCard.vue';

const props = defineProps({
  title: String,
  list: Array
});

const scrollContainer = ref(null);

const nav = (direction) => {
  if (scrollContainer.value) {
    const containerWidth = scrollContainer.value.offsetWidth;
    scrollContainer.value.scrollBy({
      left: direction === 'left' ? -containerWidth : containerWidth,
      behavior: 'smooth'
    });
  }
};
</script>

<template>
  <div class="carousel-section">
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
    </div>

    <div class="carousel-outer">
      <button class="nav-control prev" @click="nav('left')" aria-label="Previous">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
      </button>

      <div class="scroll-track" ref="scrollContainer">
        <RestaurantCard v-for="r in list" :key="'carousel-' + r.ID" :info="r" />
      </div>

      <button class="nav-control next" @click="nav('right')" aria-label="Next">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.carousel-section { margin-top: 40px; }
.section-header { margin-bottom: 20px; }
.section-title { font-size: 1.5rem; font-weight: 700; color: #333; }
.carousel-outer { position: relative; width: 100%; }

.scroll-track {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding: 10px 0 30px;
  scrollbar-width: none;
}
.scroll-track::-webkit-scrollbar { display: none; }

.nav-control {
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-control:hover { background: #f9fafb; transform: translateY(-50%) scale(1.1); }
.nav-control.prev { left: -22px; }
.nav-control.next { right: -22px; }

:deep(.res-card) {
  flex: 0 0 calc(25% - 12px);
  min-width: 280px;
  scroll-snap-align: start;
}

@media (max-width: 1024px) { :deep(.res-card) { flex: 0 0 calc(50% - 8px); } }
@media (max-width: 640px) { 
  :deep(.res-card) { flex: 0 0 85%; }
  .nav-control { display: none; }
}
</style>