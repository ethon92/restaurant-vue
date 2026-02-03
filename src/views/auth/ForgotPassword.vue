<template>
  <div class="auth-container">
    <h2>忘記密碼（Email 驗證）</h2>

    <!-- 顯示錯誤 -->
    <p v-if="errorMsg" style="color: #dc2626; font-weight: 700;">
      {{ errorMsg }}
    </p>
    <p v-if="okMsg" style="color: #16a34a; font-weight: 700;">
      {{ okMsg }}
    </p>

    <!-- Step 1：輸入 Email + 發送 OTP -->
    <div style="margin-top: 12px;">
      <label style="display:block; font-weight: 700; margin-bottom: 6px;">Email</label>

      <div style="display:flex; gap: 8px; align-items:center;">
        <input v-model.trim="email" type="email" placeholder="請輸入註冊 Email" :disabled="isOtpVerified"
          style="flex:1; height: 40px; padding: 0 10px;" />

        <button type="button" @click="sendOtp" :disabled="loading || countdown > 0 || !email"
          style="height: 40px; padding: 0 12px;">
          <span v-if="loading">傳送中...</span>
          <span v-else-if="countdown > 0">重送 ({{ countdown }}s)</span>
          <span v-else>發送驗證碼</span>
        </button>
      </div>
    </div>

    <!-- Step 2：輸入 OTP + 驗證 -->
    <div :style="{ marginTop: '16px', opacity: isEmailChecked ? 1 : 0.6 }">

      <label style="display:block; font-weight: 700; margin-bottom: 6px;">驗證碼（6 碼）</label>

      <div style="display:flex; gap: 8px; align-items:center;">
        <input v-model.trim="otp" type="text" maxlength="6" placeholder="例如：123456"
          :disabled="!isEmailChecked || isOtpVerified" style="flex:1; height: 40px; padding: 0 10px;" />
        <button type="button" @click="verifyOtp" :disabled="loading || !isEmailChecked || isOtpVerified"
          style="height: 40px; padding: 0 12px;">
          {{ isOtpVerified ? "已驗證" : "驗證" }}
        </button>
      </div>
    </div>

    <!-- Step 3：重設密碼 -->
    <div :style="{ marginTop: '16px', opacity: isOtpVerified ? 1 : 0.6 }">
      <label style="display:block; font-weight: 700; margin-bottom: 6px;">新密碼</label>
      <PasswordField v-model="newPassword" placeholder="請輸入新密碼" :disabled="!isOtpVerified" />

      <label style="display:block; font-weight: 700; margin: 12px 0 6px;">確認新密碼</label>
      <PasswordField v-model="confirmPassword" placeholder="再次輸入新密碼" :disabled="!isOtpVerified" />

      <button type="button" @click="resetPassword" :disabled="loading || !canSubmit"
        style="margin-top: 12px; height: 40px; padding: 0 12px; width: 100%;">
        {{ loading ? "送出中..." : "確認修改" }}
      </button>
    </div>

    <p style="margin-top: 16px;">
      <a href="#" @click.prevent="goToLogin">回登入</a>
    </p>
  </div>
</template>

<script setup>
/**
 * 忘記密碼
 * 流程：
 * 1) sendOtp：輸入 email → 後端寄出驗證碼（OTP）
 * 2) verifyOtp：輸入 OTP → 後端驗證成功
 * 3) resetPassword：OTP 已驗證 → 設定新密碼
 */

import { ref, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import PasswordField from "@/components/PasswordField.vue";
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
const isEmailChecked = ref(false); // 已發送過 OTP
const isOtpVerified = ref(false);  // OTP 已驗證成功

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

/** 是否可送出重設 */
const canSubmit = computed(() => {
  return (
    isOtpVerified.value &&
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value === confirmPassword.value &&
    newPassword.value.length >= 6
  );
});

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
