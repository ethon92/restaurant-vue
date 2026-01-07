<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0 flex items-center cursor-pointer">
            <span class="text-2xl font-bold text-orange-500 tracking-tight">平台名稱</span>
          </div>

          <div class="hidden md:flex space-x-8 items-center">
            <a href="#" class="text-gray-600 hover:text-orange-500 font-medium transition">探索餐廳</a>
            
            <template v-if="!isLoggedIn">
              <button @click="handleLogin" class="text-gray-600 hover:text-orange-500 font-medium transition">登入</button>
              <button class="bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition shadow-md">註冊</button>
            </template>
            <template v-else>
              <div class="flex items-center space-x-4">
                <span class="text-gray-600">你好，xxx！</span>
                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                  <i class="fa-solid fa-user"></i>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <header class="relative h-[600px] flex items-center justify-center text-black">
      <!-- <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
             class="w-full h-full object-cover" alt="Restaurant">
        <div class="absolute inset-0 bg-black/50"></div>
      </div> -->

      <div class="relative z-10 w-full max-w-5xl px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4">預訂您的下一頓美味</h1>
        <p class="text-lg md:text-xl mb-12 text-black-200">全台 4,000+ 間頂級餐廳，一鍵即刻預定</p>
        
        <div class="bg-white p-2 md:p-4 rounded-2xl shadow-2xl">
          <div class="flex flex-col lg:flex-row gap-2">
            
            <div class="flex-[2] relative">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                v-model="searchQuery.keyword"
                type="text" 
                placeholder="餐廳名稱、菜系..." 
                class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl text-gray-800 focus:ring-2 focus:ring-orange-500"
              >
            </div>

            <div class="flex-1 relative">
              <i class="fa-solid fa-calendar absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                v-model="searchQuery.date"
                type="date" 
                class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl text-gray-800 focus:ring-2 focus:ring-orange-500"
              >
            </div>

            <div class="flex-1 relative">
              <i class="fa-solid fa-user-group absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <select 
                v-model="searchQuery.guests"
                class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl text-gray-800 appearance-none focus:ring-2 focus:ring-orange-500"
              >
                <option v-for="n in 10" :key="n" :value="n">{{ n }} 位</option>
              </select>
            </div>

            <button 
              @click="performSearch"
              class="lg:w-32 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition duration-300 flex items-center justify-center gap-2"
            >
              <span class="lg:hidden">立即搜尋</span>
              <i class="fa-solid fa-arrow-right hidden lg:block"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <section class="max-w-7xl mx-auto py-16 px-4">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">熱門菜系</h2>
          <p class="text-gray-500 mt-2">根據您的喜好推薦最佳選擇</p>
        </div>
        <a href="#" class="text-orange-500 font-semibold hover:underline">查看全部</a>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div v-for="cuisine in cuisines" :key="cuisine.name" 
             class="group cursor-pointer">
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center group-hover:shadow-md group-hover:-translate-y-1 transition duration-300">
            <div class="text-4xl mb-4 group-hover:scale-110 transition duration-300">{{ cuisine.icon }}</div>
            <p class="font-bold text-gray-800">{{ cuisine.name }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 登入狀態模擬
const isLoggedIn = ref(false);

// 搜尋條件
const searchQuery = reactive({
  keyword: '',
  date: new Date().toISOString().substr(0, 10),
  guests: 2
});

// 菜系資料
const cuisines = [
  { name: '義式', icon: '🍕' },
  { name: '日式', icon: '🍣' },
  { name: '法式', icon: '🍷' },
  { name: '泰式', icon: '🍲' },
  { name: '火鍋', icon: '🔥' },
  { name: '甜點', icon: '🍰' }
];

// 方法
const handleLogin = () => {
  isLoggedIn.value = true;
  alert('登入成功！');
};

const performSearch = () => {
  console.log('搜尋條件：', { ...searchQuery });
  alert(`正在搜尋 ${searchQuery.date} ${searchQuery.guests} 位的餐廳：${searchQuery.keyword || '全部'}`);
};
</script>

<style>
/* 可以在此處添加自定義微調 */
input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
}
</style>