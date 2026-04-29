<template>
  <div class="ai-analysis-tool">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>🤖 AI 營運診斷工具 (SnowNLP)</span>
        </div>
      </template>

      <div class="analysis-status">
        <p>目前還有部分評論尚未完成情感分析，點擊下方按鈕啟動掃描：</p>
        <el-button 
          type="primary" 
          :loading="isAnalyzing" 
          @click="handleBatchAnalyze"
        >
          {{ isAnalyzing ? 'AI 分析中...' : '開始全平台評論分析' }}
        </el-button>
      </div>
    </el-card>

    <div v-for="shop in healthData.urgent_alerts" :key="shop.id" style="margin-top: 20px;">
      <el-alert
        :title="`餐廳 ID: ${shop.restaurant_id} 評分告急：${shop.score}`"
        type="error"
        show-icon>
      </el-alert>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const isAnalyzing = ref(false)
const healthData = ref({ urgent_alerts: [] }) // 預設空資料避免報錯

const handleBatchAnalyze = async () => {
  isAnalyzing.value = true
  try {
    const res = await axios.post('http://127.0.0.1:8000/api/v1/admin/batch-analyze')
    
    if (res.data.status === 'success') {
      ElMessage.success(res.data.message)
    }
  } catch (error) {
    ElMessage.error('分析過程發生錯誤，請檢查後端 Terminal')
    console.error(error)
  } finally {
    isAnalyzing.value = false
  }
}
</script> <style scoped>
.ai-analysis-tool {
  margin-top: 20px;
}
.analysis-status {
  text-align: center;
  padding: 20px;
}
</style>