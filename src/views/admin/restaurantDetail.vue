<script setup>
import { ref, onMounted } from 'vue'
import ScanButton from '@/components/adminPage/scanButton.vue'
import axios from 'axios'

const restaurantList = ref([])
const isLoading = ref(false)
const fetchTableData = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('http://127.0.0.1:8000/admin/restaurant-status')
    // 確保 res.data 是陣列，避免 v-for 報錯
    restaurantList.value = Array.isArray(res.data) ? res.data : []
  } catch (error) {
    console.error("抓取失敗:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTableData()
})

const onScanFinished = () => {
  fetchTableData()
}

const getSentimentStyle = (score) => {
  const numScore = parseFloat(score)
  if (numScore <= 0.33) {
    return { backgroundColor: '#fff1f0', color: '#cf1322', border: '1px solid #ffa39e' }
  } else if (numScore <= 0.66) {
    return { backgroundColor: '#fffbe6', color: '#d48806', border: '1px solid #ffe58f' }
  } else {
    return { backgroundColor: '#f6ffed', color: '#389e0d', border: '1px solid #b7eb8f' }
  }
}

const getSentimentLabel = (score) => {
  const numScore = parseFloat(score)
  if (numScore <= 0.33) return '營運告急 (紅)'
  if (numScore <= 0.66) return '注意波動 (黃)'
  return '表現優異 (綠)'
}
</script>

<template>
  <div class="table-container">
    <div class="table-header-action">
      <h2 class="table-title">餐廳營運狀態監控</h2>
      <div class="action-wrapper">
        <ScanButton @finished="onScanFinished" />
      </div>
    </div>

    <div class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th>餐廳名稱</th>
            <th>總評論數</th>
            <th>近期差評數量</th>
            <th>餐廳評論狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="4" class="empty-state">數據載入中...</td>
          </tr>
          
          <tr v-else-if="restaurantList.length === 0">
            <td colspan="4" class="empty-state">目前暫無餐廳分析數據</td>
          </tr>

          <tr v-for="(shop, index) in restaurantList" :key="index">
            <td>{{ shop.name || '未命名餐廳' }}</td>
            <td>{{ shop.total_comments || 0 }} 筆</td>
            <td class="negative-count">{{ shop.bad_comments_count || 0 }}</td>
            <td>
              <span 
                class="sentiment-badge" 
                :style="getSentimentStyle(shop.sentiment_score)"
              >
                {{ getSentimentLabel(shop.sentiment_score) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

.table-container {
  background: #fff;
  padding: 30px;
  min-height: 500px;
}

.table-header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.table-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.action-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hint-text {
  font-size: 14px;
  color: #999;
}

.table-wrapper {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.custom-table th {
  background-color: #f8f9fa;
  padding: 16px 20px;
  color: #666;
  font-weight: 600;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.custom-table td {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  color: #444;
}

.custom-table tr:last-child td {
  border-bottom: none;
}

.custom-table tr:hover td {
  background-color: #fafafa;
}

.negative-count {
  font-weight: bold;
  color: #cf1322;
}

.sentiment-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 60px !important;
  color: #999;
}
</style>

