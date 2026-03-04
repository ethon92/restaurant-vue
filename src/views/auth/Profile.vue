<script setup>
import { computed, onMounted, onBeforeUnmount, reactive, ref, provide } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from "@/stores/auth";
import Navbar from '@/components/Navbar.vue';
import { uploadAvatar, getAvatarUrl, removeAvatar as removeAvatarAPI, } from "@/api/modules/auth";


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

/* =========================
 *  Avatar state
 * ========================= */

const fileInput = ref(null);
const avatarUrl = ref("");         // 後端回傳的完整 url
const avatarPreviewUrl = ref("");  // 選檔後預覽（短暫）

// 顯示用：預覽 > 後端URL > 空（走預設icon）
const avatarShown = computed(
  () => avatarPreviewUrl.value || avatarUrl.value || "");

// 選檔
const triggerPickAvatar = () => fileInput.value?.click();

// 重新抓後端頭貼
const loadAvatar = async () => {
  if (!auth.userId) return;
  try {
    const res = await getAvatarUrl(auth.userId);
    const url = res.data?.url || "";
    // ✅ 避免快取：加時間戳
    avatarUrl.value = url ? `${url}?t=${Date.now()}` : "";
  } catch (e) {
    // 沒頭貼或後端404都可以當作沒圖
    avatarUrl.value = "";
  }
};


/** 移除頭貼 */
const removeAvatar = async () => {
  if (!auth.userId) return;

  try {
    await removeAvatarAPI(auth.userId);
    okMsg.value = "已移除大頭貼";
    avatarUrl.value = "";
    // ✅ 清掉預覽 + revoke（避免 memory leak）
    if (avatarPreviewUrl.value) URL.revokeObjectURL(avatarPreviewUrl.value);
    avatarPreviewUrl.value = "";
  } catch (err) {
    errorMsg.value = "移除失敗";
  }
};

// （可選）提供給子頁用
provide("profileAvatarUrl", avatarUrl);
provide("profileRemoveAvatar", removeAvatar);

/* =========================
 *  Avatar modal (click to zoom)
 * ========================= */
const showAvatarModal = ref(false);

const openAvatarModal = () => {
  if (!avatarShown.value) return; // 沒圖就不開
  showAvatarModal.value = true;
};
const closeAvatarModal = () => {
  showAvatarModal.value = false;
};
const onKeydown = (e) => {
  if (e.key === "Escape") closeAvatarModal();
};

/* =========================
 *  Pick avatar file
 * ========================= */
const onPickAvatar = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  errorMsg.value = "";
  okMsg.value = "";

  if (!file.type.startsWith("image/")) {
    errorMsg.value = "請上傳圖片檔";
    e.target.value = "";
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    errorMsg.value = "圖片請小於 2MB";
    e.target.value = "";
    return;
  }
  if (!auth.userId) {
    errorMsg.value = "尚未登入";
    e.target.value = "";
    return;
  }

  // ✅ 先清掉舊的 preview url（避免累積 memory leak）
  if (avatarPreviewUrl.value) URL.revokeObjectURL(avatarPreviewUrl.value);
  avatarPreviewUrl.value = URL.createObjectURL(file);

  try {
    await uploadAvatar(auth.userId, file);
    okMsg.value = "大頭貼已更新";

    // ✅ 上傳成功後，重新抓後端 URL（用後端圖取代 preview）
    await loadAvatar();

    // ✅ 預覽清掉（改用後端圖）
    URL.revokeObjectURL(avatarPreviewUrl.value);
    avatarPreviewUrl.value = "";
  } catch (err) {
    errorMsg.value = "上傳失敗";
  } finally {
    e.target.value = "";
  }
};

/* =========================
 *  Lifecycle
 * ========================= */
onMounted(async () => {
  window.addEventListener("keydown", onKeydown);
  await loadProfileFromStore();
  await loadAvatar();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  // ✅ 離開頁面也順便 revoke
  if (avatarPreviewUrl.value) URL.revokeObjectURL(avatarPreviewUrl.value);
});
</script>

<template>
  <Navbar />
  <div class="profile-page">
    <!-- Header -->
    <section class="profile-header">
      <div class="avatar-wrap">
        <!-- 有圖片就顯示圖片，沒有就顯示預設 icon -->
        <!-- 只有這層裁圓 -->
        <div class="avatar-circle" @click="openAvatarModal" role="button" tabindex="0">
          <img v-if="avatarShown" class="avatar-img" :src="avatarShown" alt="avatar" />
          <span v-else class="avatar-icon">🐷</span>
        </div>

        <!-- 隱藏 input -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden-file" @change="onPickAvatar" />

        <!-- 更換 -->
        <button class="avatar-btn" type="button" title="更換大頭貼" @click.stop="triggerPickAvatar">📷</button>

        <!-- 移除（只有有圖才出現） -->
        <button v-if="avatarShown" class="avatar-remove" type="button" title="移除大頭貼"
          @click.stop="removeAvatar">✕</button>
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
      <RouterLink class="tab" :class="{ active: activeTab === 'booking' }" @click="activeTab = 'booking'"
        :to="{ 'name': 'bookingRecord' }">訂位紀錄</RouterLink>
      <RouterLink class="tab" :class="{ active: activeTab === 'favorite' }" @click="activeTab = 'favorite'"
        :to="{ 'name': 'favoriteRestaurant' }">珍藏餐廳</RouterLink>
      <RouterLink class="tab" :class="{ active: activeTab === 'account' }" @click="activeTab = 'account'"
        :to="{ 'name': 'accountDetail' }">帳戶詳細資料</RouterLink>
      <!-- <RouterLink class="tab" :class="{ active: activeTab === 'comment' }" @click="activeTab = 'comment'">我的評論</RouterLink> -->
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

  <!-- Avatar Modal -->
  <Teleport to="body">
    <div v-if="showAvatarModal" class="modal-mask" @click="closeAvatarModal">
      <div class="modal-card" @click.stop>
        <img class="modal-img" :src="avatarShown" alt="avatar-large" />
        <button class="modal-close" type="button" @click="closeAvatarModal">關閉</button>
      </div>
    </div>
  </Teleport>
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

.avatar-wrap {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #d61a8d;
  display: grid;
  place-items: center;
  position: relative;
  overflow: visible;
  /* ✅ 圖片裁成圓形 */
}

.avatar-icon {
  font-size: 34px;
  color: #fff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* ✅ 不變形 */
  display: block;
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

.hidden-file {
  display: none;
}

.avatar-remove {
  position: absolute;
  left: -4px;
  bottom: -4px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
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

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .55);
  display: grid;
  place-items: center;
  z-index: 9999;
}

.modal-card {
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  max-width: min(92vw, 720px);
  max-height: 86vh;
}

.modal-img {
  display: block;
  max-width: 100%;
  max-height: 72vh;
  object-fit: contain;
  /* ✅ 原圖完整顯示 */
  border-radius: 12px;
}

.modal-close {
  margin-top: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
}
</style>
