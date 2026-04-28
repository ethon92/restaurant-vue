<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/searchStore';


const authStore = useAuthStore();
// 利用useRoute去獲取路徑上的參數
const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();

// 判斷當前是否已經在 profile 相關頁面
const isAtProfile = computed(() => route.path.startsWith('/profile'));

// 登出功能的函式
const onLogout = async () => {
    try {
        await authStore.logout();
    } catch (e) {
        console.log(e)
    }

    router.push("/login");
};


const closeImageSearchModal = () => {
    // 關閉搜尋 Modal
    searchStore.closeSearchModal(); 
};

const isLoggedIn = ref()
</script>

<template>
    <nav class="navbar">
        <RouterLink to="/" class="logo" @click="closeImageSearchModal">
            <img src="/navbar.png" alt="Logo" />
            <span>DINE 享樂</span>
        </RouterLink>
        <div class="navbar-content">
            <RouterLink :to="{ 'name': 'profile' }" class="btn" :class="{ 'disabled-link': isAtProfile }">會員專區
            </RouterLink>
            <RouterLink :to="{ 'name': 'login' }" class="btn" v-if="!authStore.isLoggedIn"> 登入
            </RouterLink>
            <button v-else class="btn" type="button" @click="onLogout">
                登出
            </button>
            <RouterLink :to="{ 'name': 'register' }" class="btn"> 註冊 </RouterLink>
        </div>
    </nav>
</template>

<style scoped>
/* Navbar 樣式 */
/* Navbar底色樣式 */
.navbar {
    background-color: #fdfaf7;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid #eee;
}

/* Navbar內容位置 */
.navbar-content {
    max-width: 80rem;
    /* margin: 0 auto; */
    padding: 0 5rem;
    height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Navbar標題 */
.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.6rem;
    font-weight: 800;
    color: #ae5617;
    letter-spacing: 1px;
    cursor: pointer;
    transition: opacity 0.3s;
    padding: 0 4rem;
    text-decoration: none;
}

.logo img {
    height: 60px;
}

.logo:hover {
    opacity: 0.8;
}

.nav-item {
    color: var(--text-muted);
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;
}

.nav-item:hover {
    color: var(--primary-color);
}

.navbar-content {
    display: flex;
    align-items: center;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.disabled-link {
    opacity: 0.6;
    pointer-events: none;
}

/* 按鈕樣式  */
.btn {
    color: #ae5617;
    font-weight: 600;
    text-decoration: none;
    font-size: 1.2rem;
    transition: color 0.3s;
}

.btn:hover {
    color: #f38332;
}
</style>