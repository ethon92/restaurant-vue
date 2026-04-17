import { ref } from 'vue';

// 全域快取，只 fetch 一次
let guideMap = null;
const isLoaded = ref(false);

async function loadGuides() {
  if (guideMap) return guideMap;
  try {
    const res = await fetch('/ai_guides.json');
    const data = await res.json();
    guideMap = {};
    for (const item of data) {
      guideMap[item.id] = item;
    }
    isLoaded.value = true;
  } catch (e) {
    console.error('[useAiGuide] 載入 ai_guides.json 失敗', e);
    guideMap = {};
  }
  return guideMap;
}

export function useAiGuide() {
  // 立即開始載入（如果還沒）
  loadGuides();

  const getGuide = (restaurantId) => {
    if (!guideMap || !restaurantId) return null;
    return guideMap[restaurantId] || null;
  };

  const isBookable = (restaurantId) => {
    const g = getGuide(restaurantId);
    if (!g) return true; // 找不到資料預設可預約
    return g.has_booking;
  };

  return { getGuide, isBookable, isLoaded, loadGuides };
}
