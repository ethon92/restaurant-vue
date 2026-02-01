<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from 'vue-router'
import { useAuthStore } from "@/stores/auth";

const memberSinceText = "2026年1月";
const router = useRouter()
const auth = useAuthStore();

const activeTab = ref("booking"); // 預設顯示「訂位」
const errorMsg = ref("");
const okMsg = ref("");
const form = reactive({
    name: "",
    email: "",
    birthday: "", // YYYY-MM-DD
});

const loadProfileFromStore = async () => {
  errorMsg.value = "";
  okMsg.value = "";

  // ✅ 1) 用 Pinia 判斷登入，不直接讀 localStorage
  if (!auth.isLoggedIn) {
    router.push("/login");
    return;
  }

  try {
    // ✅ 2) 確保 me 有資料（沒有就打 /auth/profile）
    if (!auth.me) {
      await auth.fetchMe();
    }
    // ✅ 3) 把 store 的 me 同步到可編輯的 form
    form.name = auth.me?.name ?? "";
    form.email = auth.me?.email ?? "";
    form.birthday = auth.me?.birthday ?? "";
  } catch (e) {
    errorMsg.value = "取得會員資料失敗";
  }
};

onMounted(loadProfileFromStore);

</script>

<template>
  <div class="profile-page">
    <!-- Header -->
    <section class="profile-header">
      <div class="avatar">
        <span class="avatar-icon">👤</span>
        <button class="avatar-btn" type="button" title="更換大頭貼（還沒加上功能）">📷</button>
      </div>

      <div class="header-text">
        <h1 class="title">{{ form.name || "您好：" }}</h1>
        <div class="sub">
          <span class="dot">•</span>
          <span class="sub-item">會員起始日期：{{ memberSinceText }}</span>
        </div>
      </div>
    </section>

    <!-- Tabs -->
    <nav class="tabs">
      <RouterLink class="tab" :class="{ active: activeTab === 'booking' }" @click="activeTab = 'booking'" :to="{'name': 'bookingRecord'}">訂位紀錄</RouterLink>
      <RouterLink class="tab" :class="{ active: activeTab === 'favorite' }" @click="activeTab = 'favorite'" :to="{'name': 'favoriteRestaurant'}">珍藏餐廳</RouterLink>
      <RouterLink class="tab" :class="{ active: activeTab === 'account' }" @click="activeTab = 'account'" :to="{'name': 'accountDetail'}">帳戶詳細資料</RouterLink>
      <!-- <RouterLink class="tab" :class="{ active: activeTab === 'comment' }" @click="activeTab = 'comment'">我的評論</RouterLink> -->
    </nav>
    <!-- Content -->
    <section class="tab-content">
      <RouterView :me="auth.me"></RouterView>
    </section>
  </div>
</template>


<style scoped>
.profile-page {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px 16px 40px;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans TC", Arial, sans-serif;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 0 22px;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #d61a8d;
  display: grid;
  place-items: center;
  position: relative;
}

.avatar-icon {
  font-size: 34px;
  color: #fff;
}

.avatar-btn {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}

.header-text .title {
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  color: #1f2937;
}

.sub {
  margin-top: 8px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.dot {
  opacity: 0.6;
}

.tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-top: 6px;
}

.tab {
  padding: 14px 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 700;
  color: #374151;
  position: relative;
  text-decoration: none;
}

.tab.active {
  color: #0f172a;
}

.tab.active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  background: #0f172a;
  border-radius: 999px;
}

.tab-content {
  padding-top: 22px;
}
</style>