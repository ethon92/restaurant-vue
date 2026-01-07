<template>
  <div class="page-container">
    <nav class="navbar">
        <div class="logo">
          <span>平台名稱</span>
        </div>
      <div class="navbar-content">
        <div></div>
          <template v-if="!isLoggedIn">
            <button @click="showLoginModal = true" class="btn-login">登入</button>
            </template>
                 <template v-if="!isLoggedIn">
            <button @click="showLoginModal = true" class="btn-register">註冊</button>
          </template>
      </div>
    </nav>

    <header class="hero">
      <div class="hero-content">
        <h1 class="hero-title">預訂您的下一頓美味</h1>
        <p class="hero-subtitle">全台 4,000+ 間頂級餐廳，一鍵即刻預定</p>
        
        <div class="search-card">
          <div class="search-grid">
            <div class="input-group flex-2">
              <i class="fa-solid fa-magnifying-glass icon"></i>
              <input v-model="searchQuery.keyword" type="text" placeholder="餐廳名稱、菜系..." class="input-field">
            </div>

            <div class="input-group flex-1">
              <i class="fa-solid fa-calendar icon"></i>
              <input v-model="searchQuery.date" type="date" class="input-field">
            </div>

            <div class="input-group flex-1">
              <i class="fa-solid fa-user-group icon"></i>
              <select v-model="searchQuery.guests" class="input-field select-field">
                <option v-for="n in 10" :key="n" :value="n">{{ n }} 位</option>
              </select>
            </div>

            <button @click="performSearch" class="btn-search">
              <span class="btn-text-mobile">立即搜尋</span>
              <i class="fa-solid fa-arrow-right btn-icon-desktop"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <section class="cuisine-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">熱門菜系</h2>
          <p class="section-subtitle">根據您的喜好推薦最佳選擇</p>
        </div>
        <a href="#" class="view-all">查看全部</a>
      </div>

      <div class="cuisine-grid">
        <div v-for="cuisine in cuisines" :key="cuisine.name" class="cuisine-card">
          <div class="cuisine-icon">{{ cuisine.icon }}</div>
          <p class="cuisine-name">{{ cuisine.name }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const isLoggedIn = ref(false);
const showLoginModal = ref(false);

const searchQuery = reactive({
  keyword: '',
  date: new Date().toISOString().substr(0, 10),
  guests: 2
});

const cuisines = [
  { name: '義式', icon: '🍕' }, { name: '日式', icon: '🍣' },
  { name: '法式', icon: '🍷' }, { name: '泰式', icon: '🍲' },
  { name: '火鍋', icon: '🔥' }, { name: '甜點', icon: '🍰' }
];

const performSearch = () => {
  alert(`搜尋中：${searchQuery.keyword} / ${searchQuery.date} / ${searchQuery.guests}位`);
};
</script>

<style scoped>
/* 基礎佈局 */
.page-container {
  min-height: 100vh;
  background-color: var(--bg-light);
  font-family: sans-serif;
}

/* Navbar 樣式 */
/* Navbar底色樣式 */
.navbar {
  background-color: grey;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}
/* Navbar內容位置 */
.navbar-content {
  max-width: 80rem;
  /* margin: 0 auto; */
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* Navbar標題 */
.logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 15px;
  color: var(--primary-color);
  letter-spacing: -0.025em;
  cursor: pointer;
}
/* .nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
} */
.nav-item {
  color: var(--text-muted);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-item:hover { color: var(--primary-color); }

/* 按鈕樣式 */
.btn-login {
  background: none;
  border: none;
  color: var(--text-muted);
  font-weight: 500;
  cursor: pointer;
}
.btn-register {
  background-color: var(--primary-color);
  color: black;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  border: none;
  font-weight: 500;
  box-shadow: var(--shadow-main);
  cursor: pointer;
  transition: background 0.2s;
}
.btn-register:hover { background-color: var(--primary-hover); }

/* Hero Section */
.hero {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}
.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 3rem;
}

/* 搜尋框樣式 */
.search-card {
  background: rgb(0, 0, 0);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-large);
  max-width: 64rem;
  width: 100%;
}
.search-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
@media (min-width: 1024px) {
  .search-grid { flex-direction: row; }
}

.input-group {
  position: relative;
  flex: 1;
}
.flex-2 { flex: 2; }

.icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}
.input-field {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  outline: none;
}
.input-field:focus {
  box-shadow: 0 0 0 2px var(--primary-color);
}

.btn-search {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: 0.3s;
}
.btn-search:hover { background-color: var(--primary-hover); }

/* 菜系區塊樣式 */
.cuisine-section {
  max-width: 80rem;
  margin: 0 auto;
  padding: 4rem 1rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}
.section-title { font-size: 1.875rem; font-weight: 700; }
.view-all { color: var(--primary-color); font-weight: 600; text-decoration: none; }

.cuisine-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}
@media (min-width: 768px) { .cuisine-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .cuisine-grid { grid-template-columns: repeat(6, 1fr); } }

.cuisine-card {
  background: white;
  padding: 2rem;
  border-radius: 1.25rem;
  border: 1px solid #f3f4f6;
  text-align: center;
  transition: 0.3s;
  cursor: pointer;
}
.cuisine-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-main);
}
.cuisine-icon { font-size: 2.25rem; margin-bottom: 1rem; }

/* 日期選擇器微調 */
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0;
  position: absolute;
  inset: 0;
  width: 100%;
}
</style>