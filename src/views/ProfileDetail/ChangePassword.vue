<script setup>
/**
 * ChangePassword.vue（已登入修改密碼）
 * ✅ 與 ForgotPassword（未登入/OTP）完全分開
 * ✅ 這頁需要登入（掛在 /profile 子路由並受 requiresAuth 保護）
 *
 * 提交給後端：
 * POST /auth/change-password
 * payload: { user_id, current_password, new_password }
 */
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import PasswordField from "@/components/PasswordField.vue";
import { changePassword } from "@/api/modules/auth";

const router = useRouter();
const auth = useAuthStore();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const saving = ref(false);
const errorMsg = ref("");
const okMsg = ref("");

const onSubmit = async () => {
    errorMsg.value = "";
    okMsg.value = "";

    // ✅ 基本驗證
    if (!currentPassword.value) {
        errorMsg.value = "請輸入目前密碼";
        return;
    }
    if (!newPassword.value || newPassword.value.length < 6) {
        errorMsg.value = "新密碼至少 6 碼";
        return;
    }
    if (newPassword.value !== confirmPassword.value) {
        errorMsg.value = "新密碼與確認密碼不一致";
        return;
    }

    saving.value = true;
    try {
        await changePassword({
            user_id: auth.userId, // ✅ 已登入用 user_id
            current_password: currentPassword.value,
            new_password: newPassword.value,
        });

        okMsg.value = "密碼已更新";
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";

        // ✅ 改完密碼通常回帳戶頁
        setTimeout(() => router.push({ name: "accountDetail" }), 600);
    } catch (e) {
        const detail = e?.response?.data?.detail;
        if (detail === "Password incorrect") errorMsg.value = "目前密碼錯誤";
        else errorMsg.value = detail || "修改失敗";
    } finally {
        saving.value = false;
    }
};

const goBack = () => {
    router.push({ name: "accountDetail" });
};
</script>

<template>
    <div class="card">
        <div class="card-head">
            <h2>修改密碼</h2>
            <button class="ghost" type="button" @click="goBack">返回</button>
        </div>

        <p class="muted">
            為了安全起見，修改密碼需要再次輸入「目前密碼」。
        </p>

        <div class="form">
            <label class="label">
                目前密碼
                <PasswordField v-model="currentPassword" placeholder="請輸入目前密碼" />
            </label>

            <label class="label">
                新密碼
                <PasswordField v-model="newPassword" placeholder="請輸入新密碼（至少 6 碼）" />
            </label>

            <label class="label">
                確認新密碼
                <PasswordField v-model="confirmPassword" placeholder="再次輸入新密碼" />
            </label>

            <div class="row">
                <button class="primary" type="button" @click="onSubmit" :disabled="saving">
                    {{ saving ? "更新中..." : "更新密碼" }}
                </button>
            </div>

            <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
            <p v-if="okMsg" class="ok">{{ okMsg }}</p>
        </div>
    </div>
</template>

<style scoped>
/* ✅ 沿用 AccountDetail 的 card 風格（視覺一致） */
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

.row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 4px;
}

.primary,
.ghost {
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

.error {
    color: #dc2626;
    font-weight: 700;
}

.ok {
    color: #16a34a;
    font-weight: 700;
}
</style>
