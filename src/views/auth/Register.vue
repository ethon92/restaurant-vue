<template>
  <div class="auth-container">
    <div class="card">
      <div class="head">
        <h2>創建新帳戶</h2>
        <p class="muted">建立帳號後即可使用訂位、收藏等功能</p>
      </div>

      <!-- submit 交給 onRegister，避免頁面刷新 -->
      <form class="form" @submit.prevent="onRegister">
        <label class="label">
          姓名
          <input v-model.trim="form.name" class="input" type="text" placeholder="請輸入姓名" required />
        </label>

        <label class="label">
          Email
          <input v-model.trim="form.email" class="input" type="email" placeholder="your@email.com" required />
        </label>

        <label class="label">
          <!-- PasswordField 可顯示/隱藏密碼 -->
          密碼
          <PasswordField v-model="form.password" placeholder="請輸入密碼" />
        </label>

        <label class="label">
          確認密碼
          <PasswordField v-model="form.confirmPassword" placeholder="請再次輸入密碼" />
        </label>

        <label class="label">
          生日
          <input v-model="form.birthday" class="input" type="date" required />
        </label>

        <!-- loading 時禁用按鈕，避免重複送出 -->
        <button class="primary" type="submit" :disabled="loading">
          {{ loading ? "註冊中..." : "立即註冊 →" }}
        </button>

        <!-- 顯示後端/前端驗證錯誤 -->
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <!-- 顯示成功訊息 -->
        <p v-if="okMsg" class="ok">{{ okMsg }}</p>

        <p class="login-link">
          已經有帳號？
          <a href="#" @click.prevent="goToLogin">回登入</a>
        </p>
      </form>
    </div>
  </div>
</template>
<script setup>
/**
 * 1) 收集註冊資料（name/email/password/birthday）
 * 2) 基本前端驗證（密碼一致、必填）
 * 3) 呼叫後端 /auth/register
 * 4) 成功後導回 /login
 */
import { reactive, ref } from 'vue'
import PasswordField from "@/components/PasswordField.vue";
import { register as registerAPI } from '@/api/modules/auth'

import { useRouter } from 'vue-router'

/** loading：避免連點註冊 */
const loading = ref(false);

/** 顯示錯誤/成功訊息（不用 Element Plus 也能用） */
const errorMsg = ref("");
const okMsg = ref("");
const router = useRouter();

/**
 * form：註冊資料
 * 目前後端 payload 是 name/email/password/birthday
 */
const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  birthday: "", // YYYY-MM-DD
});

/** 前端驗證：避免打 API 才發現錯誤 */
const validate = () => {
  errorMsg.value = "";
  okMsg.value = "";

  if (!form.name.trim()) {
    errorMsg.value = "請輸入姓名";
    return false;
  }
  if (!form.email.trim()) {
    errorMsg.value = "請輸入 Email";
    return false;
  }
  if (!form.password) {
    errorMsg.value = "請輸入密碼";
    return false;
  }
  if (form.password !== form.confirmPassword) {
    errorMsg.value = "兩次密碼不一致";
    return false;
  }
  if (!form.birthday) {
    errorMsg.value = "請選擇生日";
    return false;
  }

  return true;
};

/** 註冊主流程 */
const onRegister = async () => {
  if (!validate()) return;

  loading.value = true;
  try {
    // ✅ 呼叫後端（對齊FastAPI RegisterPayload）
    await registerAPI({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      birthday: form.birthday, // 後端是 date，可直接送 YYYY-MM-DD 字串
    });

    okMsg.value = "註冊成功！即將帶你回登入頁…";

    // 小延遲讓使用者看到成功訊息
    setTimeout(() => {
      router.push("/login");
    }, 300);
  } catch (e) {
    // ✅ 後端錯誤一般在 e.response.data.detail
    const detail = e?.response?.data?.detail;

    // 後端有用 "Email already exists"
    if (detail === "Email already exists") {
      errorMsg.value = "此 Email 已被註冊";
    } else {
      errorMsg.value = detail || "註冊失敗，請稍後再試";
    }
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => router.push("/login");

</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 0 16px;
}
</style>1