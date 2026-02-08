<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore()

</script>

<template>
    <nav class="navbar">
        <div class="logo">
            <span>平台名稱</span>
        </div>
        <div class="navbar-content">
            <div class="member-feature">會員專區</div>
            <RouterLink :to="{'name': 'login'}" class="btn-login">登入</RouterLink>
            <RouterLink :to="{'name': 'register'}" class="btn-login member-feature">註冊</RouterLink>
        </div>
    </nav>
</template>

<style scoped>
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

.nav-item {
    color: var(--text-muted);
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;
}

.nav-item:hover {
    color: var(--primary-color);
}

.member-feature {
    padding: 10px;
    font-size: 16px;
    font-weight: 500;
}

/* 按鈕樣式 */
.btn-login {
    background: none;
    border: none;
    color: var(--text-muted);
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
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

.btn-register:hover {
    background-color: var(--primary-hover);
}
</style>