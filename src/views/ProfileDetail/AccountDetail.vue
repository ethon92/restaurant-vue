<script setup>
import { ref } from 'vue';
import PasswordField from "@/components/PasswordField.vue";
import { updateProfile, verifyPassword } from '@/api/modules/auth'

const saving = ref(false);
const currentPassword = ref("");

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
            user_id: auth.userId,       // 用 user_id 當查找條件
            name: form.name,
            email: form.email,
            birthday: form.birthday || null, // date input 是字串，空就送 null
            current_password: currentPassword.value, // 送到後端驗證
        });

        okMsg.value = "已儲存";
        currentPassword.value = ""; // ✅ 存完清空比較安全

        // ✅ 4) 更新後讓 store 的 me 也跟著更新（或直接重新 fetch）
        // 方案 A：直接更新 store.me（快）
        if (auth.me) {
            auth.$patch({
                me: {
                    ...auth.me,
                    name: form.name,
                    birthday: form.birthday,
                },
            });
        } else {
            // 方案 B：重新抓一次（穩）
            await auth.fetchMe();
        }
    } catch (e) {
        const detail = e?.response?.data?.detail;
        if (detail === "Password incorrect") {
            errorMsg.value = "目前密碼錯誤";
            alert("目前密碼錯誤");
        } else {
            errorMsg.value = detail || "儲存失敗";
        }
    } finally {
        saving.value = false;
    }
};

const goResetPassword = async () => {
    errorMsg.value = "";
    okMsg.value = "";

    if (!currentPassword.value) {
        errorMsg.value = "請先輸入目前密碼才能修改密碼";
        alert("請先輸入目前密碼"); // 你想要用 alert 的話
        return;
    }

    try {
        await verifyPassword({
            user_id: auth.userId,
            current_password: currentPassword.value,
        });

        // ✅ 驗證成功才允許跳轉
        router.push({ path: "/reset-password", query: { email: form.email } });
    } catch (e) {
        const detail = e?.response?.data?.detail;

        if (detail === "Password incorrect") {
            errorMsg.value = "目前密碼錯誤";
            alert("目前密碼錯誤");
        } else {
            errorMsg.value = detail || "驗證失敗";
            alert(errorMsg.value);
        }
    }
};

const onLogout = async () => {
    // ✅ 5) 建議用 store.logout 統一清狀態
    try {
        await auth.logout(); // ✅ 會清 localStorage + me
    } catch (e) { }
    router.push("/login");
};
</script>


<template>
    <!-- 帳戶詳細資料 -->
    <div class="card">
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
</template>


<style scoped>
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