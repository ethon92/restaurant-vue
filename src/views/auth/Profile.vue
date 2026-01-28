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
      <button class="tab" :class="{ active: activeTab === 'booking' }" type="button" @click="activeTab = 'booking'">
        訂位
      </button>
      <button class="tab" :class="{ active: activeTab === 'favorite' }" type="button" @click="activeTab = 'favorite'">
        珍藏餐廳
      </button>
      <button class="tab" :class="{ active: activeTab === 'account' }" type="button" @click="activeTab = 'account'">
        帳戶詳細資料
      </button>
    </nav>

    <!-- Content -->
    <section class="tab-content">
      <!-- 訂位：先保留連接 -->
      <div v-if="activeTab === 'booking'" class="card">
        <h2>你的訂位</h2>
        <p class="muted">這裡會顯示訂位紀錄。</p>
        <router-link class="link-btn" :to="{ name: 'booking-record' }">
          前往訂位紀錄
        </router-link>
        <p class="hint">（連到BookingRecordPage.vue，之後對齊即可）</p>
      </div>

      <!-- 珍藏餐廳：先保留連接 -->
      <div v-else-if="activeTab === 'favorite'" class="card">
        <h2>珍藏餐廳</h2>
        <p class="muted">這裡會顯示收藏的餐廳。</p>
        <router-link class="link-btn" :to="{ name: 'favorite-restaurant' }">
          前往珍藏餐廳
        </router-link>
        <p class="hint">（連到FavoriteRestaurant.vue，路由 name 之後對齊）</p>
      </div>

      <!-- 帳戶詳細資料 -->
      <div v-else class="card">
        <div class="card-head">
          <h2>關於我</h2>
          <button class="primary" type="button" @click="onSave" :disabled="saving">
            {{ saving ? "儲存中..." : "儲存" }}
          </button>
        </div>

        <p class="muted">你在這裡輸入的資訊會在之後預約時分享給餐廳。</p>

        <div class="form">
          <label class="label">
            名字
            <input v-model.trim="form.name" class="input" type="text" placeholder="請輸入名字" />
          </label>

          <label class="label">
            電子郵件地址（不可修改）
            <input v-model="form.email" class="input" type="email" readonly />
          </label>

          <label class="label">
            生日
            <input v-model="form.birthday" class="input" type="date" />
          </label>
          <label class="label">
            目前密碼（儲存前驗證）
            <PasswordField v-model="currentPassword" placeholder="請輸入目前密碼" />
          </label>
          <div class="row">
            <button class="ghost" type="button" @click="goResetPassword">
              修改密碼
            </button>

            <button class="danger" type="button" @click="onLogout">
              登出
            </button>
          </div>

          <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
          <p v-if="okMsg" class="ok">{{ okMsg }}</p>

          <p class="hint">
            考慮加上電話欄位
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from 'vue-router'
import { getProfile, updateProfile, logout as logoutAPI } from '@/api/modules/auth'
import PasswordField from "@/components/PasswordField.vue";


const memberSinceText = "2026年1月";

const router = useRouter()
const activeTab = ref("booking"); // 預設顯示「訂位」

const saving = ref(false);
const errorMsg = ref("");
const okMsg = ref("");
const currentPassword = ref("");


const form = reactive({
  name: "",
  email: "",
  birthday: "", // YYYY-MM-DD
});


// const user = ref({
//  email: '',
//  role: ''
//}) 

const fetchProfile = async () => {
  errorMsg.value = "";
  okMsg.value = "";
  try {
    const email = localStorage.getItem("auth_email");
    if (!email) {
      router.push("/login");
      return;
    }

    const res = await getProfile({ email });
    const data = res.data;

    form.name = data?.name ?? "";
    form.email = data?.email ?? email;
    form.birthday = data?.birthday ?? "";
  } catch (e) {
    errorMsg.value = "取得會員資料失敗";
  }
};

onMounted(fetchProfile);

// ⚠️ 這裡先保留「儲存」的連接點：你之後做後端 update API 再接上
const onSave = async () => {
  errorMsg.value = "";
  okMsg.value = "";

  // 先做最基本檢查
  if (!form.name) {
    errorMsg.value = "名字不能為空";
    return;
  }
  // 儲存前必須輸入目前密碼
  if (!currentPassword.value) {
    errorMsg.value = "請先輸入目前密碼才能儲存";
    return;
  }

  saving.value = true;
  try {
    await updateProfile({
      email: form.email,       // 用 email 當查找條件
      name: form.name,
      birthday: form.birthday || null, // date input 是字串，空就送 null
      current_password: currentPassword.value, // 送到後端驗證
    });

    okMsg.value = "已儲存";
    currentPassword.value = ""; // ✅ 存完清空比較安全
  } catch (e) {
    const detail = e?.response?.data?.detail;
    if (detail === "Password incorrect") errorMsg.value = "目前密碼錯誤";
    else errorMsg.value = detail || "儲存失敗";
  } finally {
    saving.value = false;
  }
};

const onLogout = async () => {
  try {
    await logoutAPI();
  } catch (e) { }
  localStorage.removeItem("auth_email");
  router.push("/login");
};

const goResetPassword = () => {
  // 你目前 reset-password 是透過 query email
  router.push({ path: "/reset-password", query: { email: form.email } });
};

</script>

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

.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 18px;
}

.card h2 {
  margin: 0 0 8px;
  font-size: 22px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.muted {
  color: #6b7280;
  margin: 8px 0 14px;
}

.form {
  margin-top: 10px;
  display: grid;
  gap: 14px;
}

.label {
  display: grid;
  gap: 6px;
  font-weight: 700;
  color: #111827;
}

.input {
  height: 42px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 0 12px;
  font-size: 14px;
}

.row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.primary,
.ghost,
.danger,
.link-btn {
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.primary {
  background: #111827;
  color: #fff;
}

.ghost {
  background: #fff;
  border-color: #d1d5db;
  color: #111827;
}

.danger {
  background: #fff;
  border-color: #ef4444;
  color: #ef4444;
}

.link-btn {
  background: #111827;
  color: #fff;
  width: fit-content;
}

.error {
  color: #dc2626;
  font-weight: 700;
}

.ok {
  color: #16a34a;
  font-weight: 700;
}

.hint {
  margin-top: 10px;
  color: #9ca3af;
  font-size: 12px;
}
</style>