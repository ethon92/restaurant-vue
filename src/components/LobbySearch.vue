<script setup>
import { ref, computed, onMounted } from 'vue';
import restaurantApi from '@/api/modules/restaurant';

const emit = defineEmits(['search-result', 'loading']);

const allData = ref([]);
const isLoading = ref(false);
const isFiltersOpen = ref(false);

// 搜尋條件
const searchQuery = ref('');
const selectedCity = ref([]);
const priceLevels = ['全部', '$', '$$', '$$$'];
const priceIndex = ref(0);
const selectedPrice = computed(() => priceLevels[priceIndex.value]);
const selectedTags = ref([]);

// 提取選項邏輯
const cityOptions = computed(() => {
    if (allData.value.length === 0) return [];
    return [...new Set(allData.value.map(r => r.City).filter(Boolean))];
});

const tagOptions = computed(() => {
    let allTags = [];
    allData.value.forEach(r => {
        const tags = r.TagsStr ? r.TagsStr.split(',') : [];
        allTags.push(...tags.map(t => t.trim()));
    });
    return [...new Set(allTags)].filter(t => t.length > 0).slice(0, 15);
});

// 清除過濾功能
const clearFilters = () => {
    searchQuery.value = '';
    selectedCity.value = [];
    priceIndex.value = 0;
    selectedTags.value = [];
    onSearch();
};

const toggleFilters = () => {
    isFiltersOpen.value = !isFiltersOpen.value;
};

const toggleSelection = (arrayRef, item) => {
    const index = arrayRef.indexOf(item);
    if (index === -1) {
        arrayRef.push(item);
    } else {
        arrayRef.splice(index, 1);
    }
};

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
        emit('search-result', res.data);
    } catch (error) {
        console.error("搜尋錯誤：", error);
    } finally {
        isLoading.value = false;
        emit('loading', false);
    }
};

onMounted(async () => {
    try {
        const res = await restaurantApi.getRestaurants(0, 4322);
        allData.value = res.data;
        emit('search-result', res.data.slice(0, 20));
    } catch (error) {
        console.error("載入失敗：", error);
    }
});
</script>

<template>
    <div class="search-system-container">
        <div class="horizontal-layout">
            
            <div class="main-search-bar" :class="{ 'bar-active': isFiltersOpen }">
                <span class="search-icon">🔍</span>
                <input 
                    v-model="searchQuery" 
                    placeholder="搜尋餐廳名稱、食物、關鍵字..." 
                    @keyup.enter="onSearch"
                />
                <span v-if="searchQuery" class="clear-text-icon" @click="searchQuery = ''">✕</span>
                <button class="hamburger-btn" @click="toggleFilters">
                    <span v-if="!isFiltersOpen">☰</span>
                    <span v-else>✕</span>
                </button>
            </div>

            <Transition name="expand-right">
                <div v-if="isFiltersOpen" class="advanced-drawer">
                    <div class="drawer-content">
                        
                        <div class="filter-row">
                            <span class="row-label">縣市</span>
                            <div class="chip-group">
                                <button 
                                    v-for="city in cityOptions" :key="city"
                                    class="chip-btn" :class="{ 'active': selectedCity.includes(city) }"
                                    @click="toggleSelection(selectedCity, city)"
                                >{{ city }}</button>
                            </div>
                        </div>

                        <div class="filter-row">
                            <span class="row-label">消費</span>
                            <div class="price-slider-box">
                                <input type="range" v-model.number="priceIndex" min="0" :max="priceLevels.length - 1" class="mini-range">
                                <span class="price-text">{{ selectedPrice }}</span>
                            </div>
                        </div>

                        <div class="filter-row">
                            <span class="row-label">標籤</span>
                            <div class="chip-group">
                                <button 
                                    v-for="tag in tagOptions" :key="tag"
                                    class="chip-btn" :class="{ 'active': selectedTags.includes(tag) }"
                                    @click="toggleSelection(selectedTags, tag)"
                                >{{ tag }}</button>
                            </div>
                        </div>

                        <div class="drawer-actions">
                            <div class="main-actions">
                                <button class="submit-btn" @click="onSearch">立即過濾</button>
                                <button class="reset-btn" @click="clearFilters">清除過濾</button>
                            </div>
                            <button class="close-text-btn" @click="isFiltersOpen = false">隱藏進階搜尋 ◂</button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.search-system-container {
    padding: 30px 20px;
    display: flex;
    justify-content: center;
}

.horizontal-layout {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    max-width: 100%;
}

/* --- 搜尋框 --- */
.main-search-bar {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 14px 24px; 
    border-radius: 50px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    border: 1px solid #eee;
    width: 450px; 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
}
.main-search-bar.bar-active {
    border-color: hsl(28, 75%, 45%);
    box-shadow: 0 6px 20px rgba(243, 131, 50, 0.1);
}
.main-search-bar input {
    border: none;
    outline: none;
    flex: 1;
    margin: 0 15px;
    font-size: 1.1rem; 
    background: transparent;
}
.clear-text-icon {
    color: #ccc;
    cursor: pointer;
    margin-right: 10px;
    font-size: 0.9rem;
}
.clear-text-icon:hover { color: #999; }

.hamburger-btn {
    background: #f5f5f5;
    border: none;
    width: 40px; 
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* --- 面板設定--- */
.advanced-drawer {
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    border: 1px solid #eee;
    overflow: hidden;
    white-space: nowrap;
}

.drawer-content {
    padding: 25px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 480px;
}

.filter-row {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}
.row-label {
    font-size: 0.85rem;
    font-weight: bold;
    color: #bbb;
    min-width: 40px;
    padding-top: 6px;
}
.chip-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.chip-btn {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid #f0f0f0;
    background: #fcfcfc;
    font-size: 0.85rem;
    cursor: pointer;
    transition: 0.2s;
    color: #666;
}
.chip-btn:hover { background: #f5f5f5; }
.chip-btn.active {
    background: hsl(28, 75%, 45%);
    color: #fff;
    border-color: hsl(28, 75%, 45%);
    box-shadow: 0 4px 10px rgba(243, 131, 50, 0.2);
}

.price-slider-box {
    display: flex;
    align-items: center;
    gap: 15px;
    flex: 1;
}
.mini-range {
    flex: 1;
    accent-color: hsl(28, 75%, 45%);
}
.price-text {
    font-weight: bold;
    color: hsl(28, 75%, 45%);
    font-size: 1rem;
}

/* --- 按鈕區 --- */
.drawer-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-top: 20px;
    border-top: 1px solid #f8f8f8;
}

.main-actions {
    display: flex;
    gap: 12px;
}

.submit-btn {
    background: hsl(28, 75%, 45%);
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}
.submit-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

/* 清除按鈕 */
.reset-btn {
    background: #f5f5f5;
    color: #888;
    border: 1px solid #eee;
    padding: 10px 20px;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}
.reset-btn:hover { background: #eee; color: #666; }

.close-text-btn {
    background: none;
    border: none;
    color: #ccc;
    font-size: 0.8rem;
    cursor: pointer;
}
.close-text-btn:hover { color: #999; }

/* --- 動畫 --- */
.expand-right-enter-active, .expand-right-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 700px;
}
.expand-right-enter-from, .expand-right-leave-to {
    max-width: 0;
    opacity: 0;
    transform: translateX(-30px);
}

/* 手機版適配 */
@media (max-width: 768px) {
    .horizontal-layout { flex-direction: column; align-items: center; }
    .main-search-bar { width: 90vw; }
    .drawer-content { width: 90vw; }
}
</style>