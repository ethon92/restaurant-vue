<template>
  <Navbar />
  <AuthLayout title="創建新帳戶" subtitle="建立帳號後即可使用訂位、收藏等功能" icon="📝">
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
        <p v-if="passwordRuleError" class="msg-error">{{ passwordRuleError }}</p>
      </label>

      <label class="label">
        確認密碼
        <PasswordField v-model="form.confirmPassword" placeholder="請再次輸入密碼" />
        <p v-if="passwordMismatch" class="msg-error">{{ passwordMismatch }}</p>
      </label>

      <label class="label">
        生日
        <input v-model="form.birthday" class="input" type="date" required />
      </label>

      <!-- loading 時禁用按鈕，避免重複送出 -->
      <button class="btn btn-primary" type="submit" :disabled="loading">
        {{ loading ? "註冊中..." : "立即註冊 →" }}
      </button>

      <!-- 顯示後端/前端驗證錯誤 -->
      <p v-if="errorMsg" class="msg-error">{{ errorMsg }}</p>
      <!-- 顯示成功訊息 -->
      <p v-if="okMsg" class="msg-ok">{{ okMsg }}</p>
    </form>

    <template #footer>
      已經有帳號？<a class="link" href="#" @click.prevent="goToLogin">回登入</a>
    </template>
  </AuthLayout>
</template>
<script setup>
/**
 * 1) 收集註冊資料（name/email/password/birthday）
 * 2) 基本前端驗證（密碼一致、必填）
 * 3) 呼叫後端 /auth/register
 * 4) 成功後導回 /login
 */
import { computed, watch, reactive, ref } from 'vue'
import AuthLayout from "@/layouts/AuthLayout.vue";
import PasswordField from "@/components/PasswordField.vue";
import { register as registerAPI } from '@/api/modules/auth'

import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue';

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

// 使用者是否有碰過「確認密碼」欄位（避免一開始就跳錯）
const confirmTouched = ref(false);

// 1) 密碼規則錯誤（即時）
const passwordRuleError = computed(() => getPasswordRuleError(form.password));

// 2) 確認密碼是否一致（即時）
const passwordMismatch = computed(() => {
  if (!confirmTouched.value) return "";
  if (!form.confirmPassword) return "請再次輸入確認密碼";
  return form.password === form.confirmPassword ? "" : "兩次密碼不一致";
});

// 只要使用者開始輸入 confirm，就當作 touched
watch(
  () => form.confirmPassword,
  (val) => {
    if (val !== "") confirmTouched.value = true;
  }
);

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
  const ruleErr = getPasswordRuleError(form.password);
  if (ruleErr) {
    errorMsg.value = ruleErr;
    return false;
  }

  if (form.password !== form.confirmPassword) {
    errorMsg.value = "兩次密碼不一致";
    return false;
  }

  return true;
};

/** 密碼規則：6-15 碼，至少 1 英文 + 1 數字，只允許英數*/
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;

function getPasswordRuleError(pwd) {
  if (!pwd) return "請輸入密碼";
  if (!PASSWORD_RULE.test(pwd)) {
    return "密碼需為 6–15 碼，且包含英文 + 數字（僅限英數）";
  }
  return "";
}


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

<style scoped></style>1