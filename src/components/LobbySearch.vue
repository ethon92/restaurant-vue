<script setup>
import { ref, computed, onMounted } from 'vue';
import restaurantApi from '@/api/modules/restaurant';

// 定義 Emit，用來把搜尋結果傳給父組件 (Home.vue)
const emit = defineEmits(['search-result', 'loading']);

const allData = ref([]);
const isLoading = ref(false);

// 搜尋條件
const searchQuery = ref('');
const selectedCity = ref([]);
const priceLevels = ['全部', '$', '$$', '$$$'];
const priceIndex = ref(0);
const selectedPrice = computed(() => priceLevels[priceIndex.value]);
const selectedTags = ref([]);

// 自動提取選項邏輯
const cityOptions = computed(() => {
    if (allData.value.length === 0) return [];
    const cities = allData.value.map(r => r.City).filter(Boolean);
    return [...new Set(cities)];
});

const tagOptions = computed(() => {
    let allTags = [];
    allData.value.forEach(r => {
        const tags = r.TagsStr ? r.TagsStr.split(',') : [];
        allTags.push(...tags.map(t => t.trim()));
    });
    return [...new Set(allTags)].filter(t => t.length > 0).slice(0, 15);
});

// 搜尋執行
const onSearch = async () => {
    isLoading.value = true;
    emit('loading', true);
    try {
        const filters = {
            q: searchQuery.value,
            city: selectedCity.value,
            price_level: selectedPrice.value,
            tags: selectedTags.value
        };
        const res = await restaurantApi.searchRestaurants(filters);
        // 重要：將結果傳出去！
        emit('search-result', res.data);
    } catch (error) {
        console.error("搜尋發生錯誤：", error);
    } finally {
        isLoading.value = false;
        emit('loading', false);
    }
};

onMounted(async () => {
    try {
        const res = await restaurantApi.getRestaurants(0, 4322);
        allData.value = res.data;
        // 初始化時先給父組件前 20 筆
        emit('search-result', res.data.slice(0, 20));
    } catch (error) {
        console.error("初始載入失敗：", error);
    }
});
</script>

<template>
    <div class="search-container" style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
        <h2>🔍 餐廳搜尋</h2>
        
        <div style="margin-bottom: 10px;">
            <input v-model="searchQuery" placeholder="輸入關鍵字..." style="width: 200px;" />
        </div>

        <div style="margin-bottom: 10px;">
            <strong>選擇縣市</strong><br>
            <span v-for="city in cityOptions" :key="city" style="margin-right: 15px; display: inline-block;">
                <label>
                    <input type="checkbox" :value="city" v-model="selectedCity">{{ city }}
                </label>
            </span>
        </div>

        <div style="margin-bottom: 10px;">
            <strong>熱門標籤:</strong><br>
            <span v-for="tag in tagOptions" :key="tag" style="margin-right: 10px;">
                <input type="checkbox" :value="tag" v-model="selectedTags"> {{ tag }}
            </span>
        </div>

        <div class="price-filter" style="margin-bottom: 10px;">
            <strong>人均消費: </strong>
            <span>{{ selectedPrice === '全部' ? '任何' : selectedPrice }}</span>
            <input type="range" v-model.number="priceIndex" min="0" :max="priceLevels.length - 1" step="1">
        </div>

        <button @click="onSearch" :disabled="isLoading" style="background: #ffc107; border: none; padding: 8px 20px; cursor: pointer;">
            {{ isLoading ? '搜尋中...' : '立即搜尋' }}
        </button>
    </div>
</template>