<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore()

</script>

<template>
    <nav class="navbar">
        <RouterLink to="/" class="logo">
            <img src="/navbar.png" alt="Logo"/>
            <span>DINE 享樂</span>
        </RouterLink>
        <div class="navbar-content">
            <RouterLink :to="{'name': 'profile'}" 
            class="btn-login">會員專區 </RouterLink>
            <RouterLink :to="{'name': 'login'}" class="btn-login"> 登入  </RouterLink>
            <RouterLink :to="{'name': 'register'}" class="btn-login "> 註冊 </RouterLink>
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

/* 登入按鈕  */
.btn-login {
    color: #ae5617;
    font-weight: 600;
    text-decoration: none;
    font-size: 1.2rem;
    transition: color 0.3s;
    padding: 1.1rem
}

.btn-login:hover {
    color: #f38332;
}

/* 註冊按鈕 */
.btn-register {
    background-color: #ae5617;
    color: white;
    padding: 0.6rem 1.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(174, 86, 23, 0.2);
}

.btn-register:hover {
    background-color: #f38332;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(174, 86, 23, 0.3);
}
</style>