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
    <div class="search-system-wrapper">
        <div v-if="isFiltersOpen" class="overlay-mask" @click="isFiltersOpen = false"></div>

        <div class="search-container">
            <div class="search-bar" :class="{ 'focused': isFiltersOpen }">
                <span class="icon">🔍</span>
                <input v-model="searchQuery" placeholder="搜尋名稱、縣市或標籤..." @focus="isFiltersOpen = true"
                    @keyup.enter="onSearch" />
                <button class="menu-btn" @click.stop="isFiltersOpen = !isFiltersOpen">
                    <span v-if="!isFiltersOpen">☰</span>
                    <span v-else>✕</span>
                </button>
                <button class="search-btn" @click="onSearch">搜尋</button>
            </div>

            <Transition name="fade-slide">
                <div v-if="isFiltersOpen" class="floating-panel">
                    <div class="panel-inner">

                        <div class="filter-group">
                            <label>選擇縣市</label>
                            <div class="chip-grid">
                                <button v-for="city in cityOptions" :key="city" class="chip"
                                    :class="{ active: selectedCity.includes(city) }"
                                    @click="toggleSelection(selectedCity, city)">{{ city }}</button>
                            </div>
                        </div>

                        <div class="filter-group">
                            <div class="group-header">
                                <label>人均消費</label>
                                <span class="price-val">{{ selectedPrice }}</span>
                            </div>
                            <input type="range" v-model.number="priceIndex" min="0" :max="priceLevels.length - 1"
                                class="custom-range">
                        </div>

                        <div class="filter-group">
                            <label>熱門標籤</label>
                            <div class="chip-grid">
                                <button v-for="tag in tagOptions" :key="tag" class="chip"
                                    :class="{ active: selectedTags.includes(tag) }"
                                    @click="toggleSelection(selectedTags, tag)">{{ tag }}</button>
                            </div>
                        </div>

                        <div class="panel-footer">
                            <button class="reset-link" @click="clearFilters">清除所有條件</button>
                            <button class="apply-btn" @click="onSearch">查看結果</button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.search-system-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    padding: 30px 0;
    z-index: 1000;
}

.search-container {
    position: relative;
    width: 100%;
    max-width: 650px;
}

/* 搜尋列 */
.search-bar {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 8px 10px 8px 20px;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid #eee;
    transition: 0.3s;
    position: relative;
    z-index: 1001;
}

.search-bar.focused {
    border-color: #f38332;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.search-bar input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1.1rem;
    padding: 10px;
}

.menu-btn {
    background: #f5f5f5;
    border: none;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    cursor: pointer;
    margin: 0 10px;
    color: #666;
}

.search-btn {
    background: #f38332;
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 30px;
    font-weight: bold;
    cursor: pointer;
}

/* 懸浮面板 */
.floating-panel {
    position: absolute;
    top: calc(100% + 15px);
    left: 0;
    width: 100%;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid #eee;
    z-index: 1000;
}

.panel-inner {
    padding: 25px;
}

.filter-group {
    margin-bottom: 20px;
}

.filter-group label {
    display: block;
    font-size: 0.8rem;
    font-weight: bold;
    color: #bbb;
    text-transform: uppercase;
    margin-bottom: 10px;
}

.group-header {
    display: flex;
    justify-content: space-between;
}

.price-val {
    color: #f38332;
    font-weight: bold;
}

.chip-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.chip {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid #eee;
    background: #fafafa;
    font-size: 0.85rem;
    cursor: pointer;
    transition: 0.2s;
}

.chip.active {
    background: #f38332;
    color: #fff;
    border-color: #f38332;
}

.custom-range {
    width: 100%;
    accent-color: #f38332;
    margin-top: 10px;
}

/* 底部按鈕 */
.panel-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #f5f5f5;
}

.reset-link {
    background: none;
    border: none;
    color: #999;
    text-decoration: underline;
    cursor: pointer;
    font-size: 0.9rem;
}

.apply-btn {
    background: #2d2d2d;
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
}

/* 動畫與遮罩 */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.overlay-mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.05);
    z-index: 999;
}

/* 響應式微調 (Breakpoint: 768px) */
@media (max-width: 768px) {
    .search-box-container {
        width: 95%;
    }

    .main-bar {
        padding-left: 15px;
    }

    .main-bar input {
        font-size: 1rem;
    }

    .btn-text {
        display: none;
    }

    .submit-btn {
        padding: 10px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .submit-btn::before {
        content: "🔍";
        color: white;
    }

    .floating-panel {
        width: 100vw;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 0 0 20px 20px;
    }

    .panel-body {
        padding: 20px;
    }
}
</style>