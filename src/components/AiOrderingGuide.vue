<script setup>
defineProps({
  goldenCombo: {
    type: String,
    default: null
  },
  warningTips: {
    type: String,
    default: null
  },
  restaurantName: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="ai-guide-card">
    <div class="guide-header">
      <span class="ai-badge">AI</span>
      <h3 class="guide-title">在地人點餐攻略</h3>
    </div>
    <p class="guide-subtitle">{{ restaurantName }}</p>

    <div class="guide-body">
      <div v-if="goldenCombo" class="guide-section combo-section">
        <div class="section-label">
          <span class="label-icon">🥇</span>
          <span class="label-text">黃金組合</span>
        </div>
        <p class="section-content">{{ goldenCombo }}</p>
      </div>

      <div v-if="warningTips" class="guide-section warning-section">
        <div class="section-label">
          <span class="label-icon">⚠️</span>
          <span class="label-text">避雷提醒</span>
        </div>
        <p class="section-content">{{ warningTips }}</p>
      </div>

      <div v-if="!goldenCombo && !warningTips" class="guide-empty">
        <p>此店家暫無 AI 攻略資料</p>
      </div>
    </div>

    <div class="guide-footer">
      <span class="footer-hint">由 AI 分析真實 Google 評論生成</span>
    </div>
  </div>
</template>

<style scoped>
.ai-guide-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  max-width: 340px;
  margin: 0 auto;
  border: 1px solid #fde8c0;
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.ai-badge {
  background: linear-gradient(135deg, #f38332, #c26a1a);
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.guide-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.guide-subtitle {
  font-size: 0.78rem;
  color: #999;
  margin: 0 0 20px 0;
}

.guide-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-section {
  border-radius: 12px;
  padding: 14px 16px;
}

.combo-section {
  background: #fffbf0;
  border: 1px solid #fde8a0;
}

.warning-section {
  background: #fff8f0;
  border: 1px solid #fdd0a0;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.label-icon {
  font-size: 1rem;
}

.label-text {
  font-size: 0.72rem;
  font-weight: 700;
  color: #bbb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-content {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.5;
}

.guide-empty {
  text-align: center;
  color: #ccc;
  font-size: 0.85rem;
  padding: 20px 0;
}

.guide-footer {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.footer-hint {
  font-size: 0.68rem;
  color: #ccc;
}
</style>
