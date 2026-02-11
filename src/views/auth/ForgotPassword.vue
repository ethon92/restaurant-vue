<template>
  <AuthLayout title="忘記密碼" subtitle="輸入註冊 Email 收取驗證碼，完成後即可重設密碼" icon="📧">

    <!-- 顯示錯誤/成功（統一用 auth-form.css class） -->
    <p v-if="errorMsg" class="msg-error">{{ errorMsg }}</p>
    <p v-if="okMsg" class="msg-ok">{{ okMsg }}</p>

    <!-- Step 1：輸入 Email + 發送 OTP -->
    <div class="form">
      <label class="label">Email</label>

      <div class="row">
        <input v-model.trim="email" class="input" type="email" placeholder="請輸入註冊 Email" :disabled="isOtpVerified" />

        <button class="btn btn-ghost" type="button" @click="sendOtp" :disabled="loading || countdown > 0 || !email">
          <span v-if="loading">傳送中...</span>
          <span v-else-if="countdown > 0">重送 ({{ countdown }}s)</span>
          <span v-else>發送驗證碼</span>
        </button>
      </div>
    </div>

    <!-- Step 2：輸入 OTP + 驗證 -->
    <label class="label" :style="{ opacity: isEmailChecked ? 1 : 0.6 }">
      驗證碼（6 碼）
      <div class="row">
        <input v-model.trim="otp" class="input" type="text" maxlength="6" placeholder="例如：123456"
          :disabled="!isEmailChecked || isOtpVerified" />

        <button type="button" class="button" @click="verifyOtp" :disabled="loading || !isEmailChecked || isOtpVerified">
          {{ isOtpVerified ? "已驗證" : "驗證" }}
        </button>
      </div>
    </label>

    <!-- Step 3：重設密碼 -->
    <div :style="{ opacity: isOtpVerified ? 1 : 0.6 }">
      <label class="label">新密碼</label>
      <PasswordField v-model="newPassword" placeholder="請輸入新密碼6–15 碼，英文+數字" :disabled="!isOtpVerified" />
      <p v-if="newPasswordRuleError" class="alert alert-error">
        {{ newPasswordRuleError }}
      </p>

      <label class="label">確認新密碼
        <PasswordField v-model="confirmPassword" placeholder="再次輸入新密碼" :disabled="!isOtpVerified" />
      </label>
      <p v-if="newPasswordMismatch" class="alert alert-error">{{ newPasswordMismatch }}</p>

      <button type="button" @click="resetPassword" class="button" :disabled="loading || !canSubmit"
        style="width: 100%;">
        {{ loading ? "送出中..." : "確認修改" }}
      </button>
    </div>

    <p class="muted">
      <a class="link" href="#" @click.prevent="goToLogin">回登入</a>
    </p>
  </AuthLayout>
</template>

<script setup>
/**
 * 忘記密碼
 * 流程：
 * 1) sendOtp：輸入 email → 後端寄出驗證碼（OTP）
 * 2) verifyOtp：輸入 OTP → 後端驗證成功
 * 3) resetPassword：OTP 已驗證 → 設定新密碼
 */

import { ref, computed, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import PasswordField from "@/components/PasswordField.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPasswordByOtp,
} from "@/api/modules/auth";

const router = useRouter()

const loading = ref(false);
const errorMsg = ref("");
const okMsg = ref("");

/** Step 狀態 */
const isEmailChecked = ref(false); // ✅ OTP 已寄出（可開始輸入 OTP）
const isOtpVerified = ref(false);  // ✅ OTP 已驗證成功（可重設密碼）

/** 表單 */
const email = ref("");
const otp = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

/** 倒數計時（防止OTP連續發送） */
const countdown = ref(0);
let timer = null;

const startCountdown = () => {
  countdown.value = 60;
  timer = setInterval(() => {
    if (countdown.value > 0) countdown.value--;
    else {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

/** 密碼輸入輔助訊息 */
const confirmTouched = ref(false);

const newPasswordRuleError = computed(() => getPasswordRuleError(newPassword.value));

const newPasswordMismatch = computed(() => {
  if (!confirmTouched.value) return "";
  if (!confirmPassword.value) return "請再次輸入確認密碼";
  return newPassword.value === confirmPassword.value ? "" : "兩次密碼不一致";
});

watch(confirmPassword, (val) => {
  if (val !== "") confirmTouched.value = true;
});


/** 是否可送出重設 */
const canSubmit = computed(() => {
  return (
    isOtpVerified.value &&
    newPassword.value &&
    confirmPassword.value &&
    !getPasswordRuleError(newPassword.value) &&
    newPassword.value === confirmPassword.value &&
    newPassword.value.length >= 6
  );
});

/** 密碼規則：6-15 碼，至少 1 英文 + 1 數字，只允許英數*/
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;

function getPasswordRuleError(pwd) {
  if (!pwd) return "請輸入密碼";
  if (!PASSWORD_RULE.test(pwd)) {
    return "密碼需為 6–15 碼，且包含英文 + 數字（僅限英數）";
  }
  return "";
}

/** 1) 發送 OTP */
const sendOtp = async () => {
  if (!email.value) return;
  if (countdown.value > 0) return;

  loading.value = true;
  errorMsg.value = "";
  okMsg.value = "";

  try {
    // 後端：檢查 email 存在 → 寄 OTP
    await sendForgotPasswordOtp({ email: email.value });

    isEmailChecked.value = true;
    isOtpVerified.value = false; // 重新發送就要重新驗證
    okMsg.value = "驗證碼已寄出，請到信箱查看";
    startCountdown();
  } catch (e) {
    const detail = e?.response?.data?.detail;
    errorMsg.value = detail || "發送失敗（請確認信箱是否註冊）";
    // 若後端做 429 限流，也可在此啟動倒數
    startCountdown();
  } finally {
    loading.value = false;
  }
};

/** 2) 驗證 OTP */
const verifyOtp = async () => {
  errorMsg.value = "";
  okMsg.value = "";

  if (otp.value.length !== 6) {
    errorMsg.value = "請輸入 6 位數驗證碼";
    return;
  }

  loading.value = true;
  try {
    await verifyForgotPasswordOtp({ email: email.value, otp: otp.value });

    isOtpVerified.value = true;
    okMsg.value = "驗證成功，請設定新密碼";
  } catch (e) {
    const detail = e?.response?.data?.detail;
    errorMsg.value = detail || "驗證碼錯誤或已過期";
  } finally {
    loading.value = false;
  }
};

/** 3) 重設密碼 */
const resetPassword = async () => {
  if (!canSubmit.value) return;

  loading.value = true;
  errorMsg.value = "";
  okMsg.value = "";

  try {
    await resetPasswordByOtp({
      email: email.value,
      otp: otp.value,
      new_password: newPassword.value,
    });

    okMsg.value = "密碼重設成功！即將回登入頁…";
    setTimeout(() => router.push("/login"), 300);
  } catch (e) {
    const detail = e?.response?.data?.detail;
    errorMsg.value = detail || "重設失敗，請稍後再試";
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => router.push("/login");
</script>
