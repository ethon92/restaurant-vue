<script setup>
import { computed, onMounted, reactive, ref, provide } from "vue";
import { useRouter } from 'vue-router'
import { useAuthStore } from "@/stores/auth";
import { uploadAvatar, getAvatarUrl, removeAvatar as removeAvatarAPI, } from "@/api/modules/auth";
import Navbar from '@/components/Navbar.vue';


const router = useRouter()
const auth = useAuthStore();

/** Tabs：目前在哪個分頁 */
const activeTab = ref("booking"); // 預設顯示「訂位」

/** 共用訊息（成功/失敗提示） */
const errorMsg = ref("");
const okMsg = ref("");

/**
 * 共用表單資料（可編輯）
 * 之後 AccountDetail 要 v-model 這些欄位，所以要放 reactive
 */
const form = reactive({
  name: "",
  email: "",
  birthday: "", // YYYY-MM-DD
  phone: "",  // 09xxxxxxxx
});

/** 顯示用資料（不會跟著輸入即時變動）*/
const display = reactive({
  name: "",
  email: "",
  birthday: "",
  phone: "",
});

/** 是否為編輯模式（預設 false：只能看不能改）*/
const isEditing = ref(false);

/** 一鍵開始編輯：把 display 複製到 form（開始改）*/
const startEdit = () => {
  errorMsg.value = "";
  okMsg.value = "";
  form.name = display.name;
  form.email = display.email;
  form.birthday = display.birthday;
  form.phone = display.phone;
  isEditing.value = true;
};

/** 取消編輯：不動 display，直接退出 */

const cancelEdit = () => {
  errorMsg.value = "";
  okMsg.value = "";
  isEditing.value = false;
};

/**
 * Profile 這層負責「拉一次會員資料」並把可編輯 form 提供給子頁
 * 好處：
 * - 子頁（AccountDetail/BookingRecord/...）不用各自再打一次 /auth/profile
 * - 所有子頁看到的是同一份狀態（資料一致）
 */
provide("profileForm", form);
provide("profileErrorMsg", errorMsg);
provide("profileOkMsg", okMsg);
provide("profileDisplay", display);
provide("profileIsEditing", isEditing);
provide("profileStartEdit", startEdit);
provide("profileCancelEdit", cancelEdit);



const loadProfileFromStore = async () => {
  // 每次載入先清訊息
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
    form.phone = auth.me?.phone ?? "";

    // ✅ 塞 display（header/預覽都用它）
    display.name = form.name;
    display.email = form.email;
    display.birthday = form.birthday;
    display.phone = form.phone;
  } catch (e) {
    errorMsg.value = "取得會員資料失敗";
  }
};


onMounted(async () => {
  await loadProfileFromStore();
  await loadAvatar();
});

// ===== Avatar state =====
const fileInput = ref(null);
const avatarUrl = ref("");         // 後端回傳的完整 url
const avatarPreviewUrl = ref("");  // 選檔後預覽（短暫）

// 顯示用：預覽 > 後端URL > 空（走預設）
const avatarShown = computed(() => avatarPreviewUrl.value || avatarUrl.value || "");

// 選檔
const triggerPickAvatar = () => fileInput.value?.click();
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


// 移除
const removeAvatar = async () => {
  if (!auth.userId) return;

  try {
    await removeAvatarAPI(auth.userId);
    okMsg.value = "已移除大頭貼";
    avatarUrl.value = "";
    avatarPreviewUrl.value = "";
  } catch (err) {
    errorMsg.value = "移除失敗";
  }
};

// 進頁載入已保存的大頭貼
/****** 
onMounted(() => {
  const saved = localStorage.getItem(avatarKey.value);
  if (saved) avatarDataUrl.value = saved;
});
******/

// （可選）也把它提供給子頁用
provide("profileAvatarUrl", avatarUrl);
provide("profileRemoveAvatar", removeAvatar);

const showAvatarModal = ref(false);

const openAvatarModal = () => {
  if (!avatarShown.value) return; // 沒圖就不開
  showAvatarModal.value = true;
};
const closeAvatarModal = () => {
  showAvatarModal.value = false;
};


const onPickAvatar = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    errorMsg.value = "請上傳圖片檔";
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    errorMsg.value = "圖片請小於 2MB";
    return;
  }
  if (!auth.userId) {
    errorMsg.value = "尚未登入";
    return;
  }

  // 先顯示預覽
  avatarPreviewUrl.value = URL.createObjectURL(file);

  try {
    await uploadAvatar(auth.userId, file);
    okMsg.value = "大頭貼已更新";

    // 上傳成功後，重新拿一次後端 URL
    await loadAvatar();

    // 預覽清掉，改用後端圖（避免 memory leak）
    URL.revokeObjectURL(avatarPreviewUrl.value);
    avatarPreviewUrl.value = "";
  } catch (err) {
    errorMsg.value = "上傳失敗";
  } finally {
    e.target.value = "";
  }
};

</script>

<template>
  <div class="profile-page">
    <Navbar />
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
    <!-- Content：這裡會顯示子頁（AccountDetail / BookingRecord / FavoriteRestaurant) -->
    <section class="tab-content">
      <!-- ✅ 子頁會用 inject 拿到 profileForm/profileErrorMsg/profileOkMsg -->
      <RouterView></RouterView>
    </section>
  </div>
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
