<script setup>
import { onMounted, reactive, ref, provide } from "vue";
import { useRouter, useRoute } from 'vue-router'
import adminNavbar from '@/components/adminNavbar.vue'
import { useAuthStore } from "@/stores/auth";



/* =========================
 *  Auth / Router
 * ========================= */
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

/* =========================
 *  Tabs / Message
 * ========================= */
/** Tabs：目前在哪個分頁 */
const activeTab = ref("booking"); // 預設顯示「訂位」
/** Profile 層級共用訊息（成功/失敗提示）
 *  - 主要用在：拉會員資料 / 頭貼上傳、移除
 *  - 帳戶詳細資料（儲存個資）的提示，放在 AccountDetail.vue 自己管
 */
const errorMsg = ref("");
const okMsg = ref("");


/* =========================
 *  Display（顯示用）
 *  - header/tab 非編輯狀態要顯示的資料
 *  - 真正資料來源是 auth.me
 * ========================= */

const display = reactive({
  name: "",
  email: "",
  birthday: "",
  phone: "",
});

/** 將 store.me 同步到 display（顯示用） */
const syncMeToDisplay = () => {
  display.name = auth.me?.name ?? "";
  display.email = auth.me?.email ?? "";
  display.birthday = auth.me?.birthday ?? "";
  display.phone = auth.me?.phone ?? "";
};

/**
 * ✅ 提供給子頁：更新 display（讓 header 立即更新）
 * - 子頁存檔成功時呼叫：updateDisplay({ name, phone, birthday })
 * - 只更新有傳的欄位（partial update）
 */
const updateDisplay = (patch = {}) => {
  if (patch.name !== undefined) display.name = patch.name;
  if (patch.email !== undefined) display.email = patch.email;
  if (patch.birthday !== undefined) display.birthday = patch.birthday;
  if (patch.phone !== undefined) display.phone = patch.phone;
};

/* =========================
 *  Provide to child routes
 *  Profile 這層負責
 *  1) 拉一次會員資料（auth.fetchMe）
 *  2) 同步到 display
 *  3) 把 display 與 updateDisplay 提供給子頁（AccountDetail / BookingRecord / FavoriteRestaurant）
 * ========================= */
provide("profileDisplay", display);
provide("profileUpdateDisplay", updateDisplay);

/* =========================
 *  Load profile (me)
 *  - 只負責抓會員資料並同步到 display
 * ========================= */
const loadProfileFromStore = async () => {
  // ✅ 只有在 /profile（沒有子路由）時，才導去 booking-record
  // 避免：想進 /profile/account-detail 卻被強制導回 booking-record
  if (route.path === "/profile") {
    router.replace("/profile/booking-record");
  }
  // 每次載入先清訊息
  errorMsg.value = "";
  okMsg.value = "";

  // ✅ 用 Pinia 判斷登入（router guard 也會擋，但這裡再保險一次）
  if (!auth.isLoggedIn) {
    router.push("/login");
    return;
  }

  try {
    // ✅ 確保 me 有資料（沒有就打 /auth/profile）
    if (!auth.me) await auth.fetchMe();
    syncMeToDisplay();
  } catch (e) {
    errorMsg.value = "取得會員資料失敗";
  }
};

onMounted(async () => {
  await loadProfileFromStore();
});
</script>

<template>
  <adminNavbar />
  <div class="profile-page">
    <!-- Header -->
    <section class="profile-header">
      <div class="avatar-circle">
        <span class="avatar-icon">🛠️</span>
      </div>

      <div class="header-text">
        <!-- form.name 來自共用 reactive -->
        <h1 class="title">{{ display.name ? `${display.name} 您好` : "您好" }}</h1>
        <div class="sub">
        </div>
      </div>
    </section>

    <!-- Tabs -->
    <nav class="tabs">
      <RouterLink class="tab" :class="{ active: activeTab === 'record' }" @click="activeTab = 'record'"
        :to="{ 'name': 'record' }">數據分析</RouterLink>
      <RouterLink class="tab" :class="{ active: activeTab === 'memberDetail' }" @click="activeTab = 'memberDetail'"
        :to="{ 'name': 'memberDetail' }">會員管理</RouterLink>
      <RouterLink class="tab" :class="{ active: activeTab === 'restaurantDetail' }"
        @click="activeTab = 'restaurantDetail'" :to="{ 'name': 'restaurantDetail' }">餐廳管理</RouterLink>
    </nav>
    <!-- 子頁（AccountDetail / BookingRecord / FavoriteRestaurant) -->
    <section class="tab-content">
      <!-- ✅ 子頁會用 inject 拿到 profileForm/profileErrorMsg/profileOkMsg -->
      <RouterView></RouterView>

      <!-- ✅ Profile 層級提示（抓資料/頭貼） -->
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <p v-if="okMsg" class="ok">{{ okMsg }}</p>
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



.avatar-icon {
  font-size: 34px;
  color: #fff;
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


.avatar-circle {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  /* ✅ 只裁圖片 */
  background: #d61a8d;
  display: grid;
  place-items: center;
  cursor: pointer;
  /* ✅ 可點看原圖 */
}
</style>
