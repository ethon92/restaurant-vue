<template>
  <div class="analysis-header">
    <span class="status-text">
      {{ isAnalyzing ? 'AI 診斷中...' : label }}
    </span>

    <button 
      class="mini-scan-btn" 
      :class="{ 'is-spinning': isAnalyzing }"
      :disabled="isAnalyzing"
      @click="handleBatchAnalyze"
      :title="title"
    >
      <svg class="refresh-icon" viewBox="0 0 24 24">
        <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 定義 Props，讓外部可以自定義文字
const props = defineProps({
  label: {
    type: String,
    default: '評論分析更新'
  },
  title: {
    type: String,
    default: '啟動 AI 批量掃描'
  }
})

// 定義 Emit，分析完畢後通知父組件重新抓取資料
const emit = defineEmits(['finished'])

const isAnalyzing = ref(false)

const handleBatchAnalyze = async () => {
  isAnalyzing.value = true
  try {
    const res = await axios.post('http://127.0.0.1:8000/api/v1/admin/batch-analyze')
    if (res.data.status === 'success') {
      // 成功後發送事件給父組件
      emit('finished', res.data)
    }
  } catch (error) {
    console.error('掃描出錯:', error)
  } finally {
    // 稍微延遲結束旋轉動畫，體感較好
    setTimeout(() => {
      isAnalyzing.value = false
    }, 1000)
  }
}
</script>

<style scoped>
.analysis-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
}

.status-text {
  font-size: 14px;
  color: #666;
}

.mini-scan-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  outline: none;
}

.mini-scan-btn:hover:not(:disabled) {
  background-color: #f9f9f9;
  transform: scale(1.1);
}

.mini-scan-btn:disabled {
  cursor: not-allowed;
}

.refresh-icon {
  width: 18px;
  height: 18px;
  fill: #5f6368;
}

.is-spinning .refresh-icon {
  animation: scan-rotate 1s linear infinite;
  fill: #ff8c00; 
}

@keyframes scan-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>