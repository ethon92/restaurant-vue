<script setup>
import { useRouter } from 'vue-router';

defineProps ({
    show:Boolean
});
const emit = defineEmits(['close']);
const router =useRouter();

const handleGo = (routeName) =>{
    emit('close');
    router.push({name:routeName})
};
</script>

<template>
    <Transition name="modal-zoom">
    <div v-if="show" class="custom-modal-overlay" @click.self="$emit('close')">
      <div class="custom-modal-content card p-4 shadow-lg text-center">
        <h3 class="mb-3">您尚未登入</h3>
        <p class="text-muted mb-4">登入或註冊會員即可收藏您心儀的餐廳！</p>
        
        <div class="d-flex flex-column gap-2">
          <button class="btn-primary-orange" @click="handleGo('login')">
            立即登入
          </button>
          <button class="btn-outline-orange" @click="handleGo('register')">
            註冊新帳號
          </button>
          <button class="btn-ghost" @click="$emit('close')">
            先隨便逛逛
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.custom-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}
.custom-modal-content {
  width: 100%;
  max-width: 350px;
  border-radius: 15px;
}
.btn-primary-orange {
  background-color: #f38332;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
}
.btn-outline-orange {
  background: white;
  color: #f38332;
  border: 1px solid #f38332;
  padding: 10px;
  border-radius: 8px;
}
.btn-ghost {
  background: transparent;
  border: none;
  color: #666;
  margin-top: 10px;
}
/* 動畫 */
.modal-zoom-enter-from, .modal-zoom-leave-to { opacity: 0; transform: scale(0.9); }
.modal-zoom-enter-active, .modal-zoom-leave-active { transition: all 0.3s ease; }
</style>