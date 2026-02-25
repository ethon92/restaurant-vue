<script setup>
import { ref, inject, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import PasswordField from "@/components/PasswordField.vue";
import { updateProfile } from "@/api/modules/auth";

/**
 * ✅ 從 Profile.vue 注入同一份狀態（共享）
 * - form：reactive 物件（可直接 form.name / form.email）
 * - errorMsg / okMsg：ref（要用 .value）
 * ⚠️ 防呆：如果此頁不是掛在 Profile 子路由下（沒有 provide），就會拿不到注入值
 */
const form = inject("profileForm", null);
const display = inject("profileDisplay", null);
const isEditing = inject("profileIsEditing", ref(false));
const startEdit = inject("profileStartEdit", () => { });
const cancelEdit = inject("profileCancelEdit", () => { });

const errorMsg = inject("profileErrorMsg", ref(""));
const okMsg = inject("profileOkMsg", ref(""));

const canEdit = computed(() => !!isEditing.value);

const cancelEditLocal = () => {
    cancelEdit();
    currentPassword.value = "";
};


if (!form) {
    console.warn("[AccountDetail] profileForm not provided. Make sure this page is under /profile route.");
}


const router = useRouter();
const auth = useAuthStore();

/** 儲存按鈕 loading */
const saving = ref(false);
/** 目前密碼：敏感操作（儲存個資）前驗證 */
const currentPassword = ref("");

/** 欄位級錯誤訊息（誰錯就填誰） */
const fieldErrors = ref({
    name: "",
    phone: "",
    currentPassword: "",
});

/** 每次驗證前清空 */
const clearFieldErrors = () => {
    fieldErrors.value = { name: "", phone: "", currentPassword: "" };
};

/** 用 ref 綁到 input DOM，才能 scroll/focus */
const nameInputRef = ref(null);
const phoneInputRef = ref(null);
const pwdInputRef = ref(null);

/**
 * 讓畫面跳到特定欄位並 focus
 * - scrollIntoView：捲到欄位可見位置
 * - focus：游標直接進去
 */
const focusField = async (key) => {
    await nextTick(); // 等 DOM 更新（例如錯誤訊息/紅框 class 出現）
    const map = {
        name: nameInputRef.value,              // 原生 input
        phone: phoneInputRef.value,            // 原生 input
        currentPassword: pwdInputRef.value,    // PasswordField 元件 ref
    };
    const el = map[key];
    if (!el) return;

    // ✅ 元件 ref 會是 component instance：它有 $el（DOM），也可能 expose focus()
    const dom = el?.$el ? el.$el : el;

    if (dom?.scrollIntoView) {
        dom.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // ✅ 如果有 expose focus() 就呼叫（PasswordField 會提供）
    if (typeof el.focus === "function") {
        el.focus();
    } else if (typeof dom.focus === "function") {
        dom.focus();
    }
};


/**
 * 儲存個人資料（需要先驗證目前密碼）
 */
const onSave = async () => {
    errorMsg.value = "";
    okMsg.value = "";

    // ✅ 清欄位錯誤
    clearFieldErrors();

    // 先做最基本檢查：名字不能空
    if (!form.name) {
        fieldErrors.value.name = "名字不能為空";
        await focusField("name");
        return;
    }

    // 檢查手機格式（允許空）
    if (form.phone && !/^09\d{8}$/.test(form.phone)) {
        fieldErrors.value.phone = "手機格式不正確（需為 09 開頭共 10 碼）";
        await focusField("phone");
        return;
    }

    // 儲存前必須輸入目前密碼
    if (!currentPassword.value) {
        fieldErrors.value.currentPassword = "請先輸入目前密碼才能儲存";
        await focusField("currentPassword");
        return;
    }


    saving.value = true;
    try {
        // 呼叫後端更新資料
        await updateProfile({
            user_id: auth.userId,       // 用 user_id 當查找條件
            name: form.name,
            email: form.email,
            phone: form.phone || null, // 手機（空就送 null）
            birthday: form.birthday || null, // date input 是字串，空就送 null
            current_password: currentPassword.value, // 送到後端驗證
        });

        okMsg.value = "已儲存";
        // ✅ 儲存成功：把「已儲存資料」同步到 display（header/預覽就更新）
        if (display) {
            display.name = form.name;
            display.email = form.email;
            display.birthday = form.birthday;
            display.phone = form.phone;
        }

        // ✅ 關閉編輯模式
        isEditing.value = false;

        currentPassword.value = ""; // ✅ 存完清空比較安全

        // ✅ 4) 更新後讓 store 的 me 也跟著更新（或直接重新 fetch）
        // 方案 A：直接更新 store.me（快）
        if (auth.me) {
            auth.$patch({
                me: {
                    ...auth.me,
                    name: form.name,
                    birthday: form.birthday,
                    phone: form.phone,
                },
            });
        } else {
            // 方案 B：重新抓一次（穩）
            await auth.fetchMe();
        }
    } catch (e) {
        const detail = e?.response?.data?.detail;

        if (detail === "Password incorrect") {
            // 綁在「目前密碼」那格，如過輸入錯誤跳過去 focus + 紅框
            fieldErrors.value.currentPassword = "目前密碼錯誤";
            await focusField("currentPassword");
        } else {
            errorMsg.value = detail || "儲存失敗";
        }
    } finally {
        saving.value = false;
    }
};


/**
 * ✅ 修改密碼：導到已登入的 ChangePassword（/profile/change-password）
 */
const goChangePassword = () => {
    router.push({ name: "changePassword" });
};


/**
 * 登出：統一交給 store.logout 清掉 localStorage + me
 */
const onLogout = async () => {
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

            <div class="row">
                <!-- 非編輯：顯示 修改 -->
                <button v-if="!canEdit" class="ghost" type="button" @click="startEdit">
                    修改
                </button>

                <!-- ✅ 編輯狀態：顯示「取消」+「儲存」 -->
                <template v-else>
                    <button class="ghost" type="button" @click="cancelEditLocal" :disabled="saving">
                        取消
                    </button>

                    <button class="primary" type="button" @click="onSave" :disabled="saving">
                        {{ saving ? "儲存中..." : "儲存" }}
                    </button>
                </template>
            </div>
        </div>
        <p class="muted">你在這裡輸入的資訊會在之後預約時分享給餐廳。</p>

        <div class="form">
            <label class="label">
                名字
                <input v-if="!canEdit" :value="display?.name || ''" class="input" type="text" readonly />
                <input v-else ref="nameInputRef" v-model.trim="form.name" class="input"
                    :class="{ 'input-error': fieldErrors.name }" type="text" placeholder="請輸入名字"
                    @input="fieldErrors.name = ''" />
                <p v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</p>

            </label>

            <label class="label">
                電子郵件地址（不可修改）
                <input :value="display?.email || ''" class="input" type="email" readonly />
            </label>

            <label class="label">
                手機號碼
                <input v-if="!canEdit" :value="display?.phone || ''" class="input" type="tel" readonly />
                <input v-else ref="phoneInputRef" v-model.trim="form.phone" class="input"
                    :class="{ 'input-error': fieldErrors.phone }" type="tel" inputmode="numeric" maxlength="10"
                    placeholder="例如：0912345678" @input="fieldErrors.phone = ''" />
                <p v-if="fieldErrors.phone" class="field-error">{{ fieldErrors.phone }}</p>

            </label>

            <label class="label">
                生日
                <input v-if="!canEdit" :value="display?.birthday || ''" class="input" type="text" readonly />
                <input v-else v-model="form.birthday" class="input" type="date" />
            </label>

            <label v-if="canEdit" class="label">
                目前密碼（儲存前驗證）
                <PasswordField v-model="currentPassword" ref="pwdInputRef" placeholder="請輸入目前密碼"
                    :error="!!fieldErrors.currentPassword" @input="fieldErrors.currentPassword = ''" />
                <p v-if="fieldErrors.currentPassword" class="field-error">
                    {{ fieldErrors.currentPassword }}
                </p>
            </label>

            <div class="row">
                <button class="ghost" type="button" @click="goChangePassword">
                    修改密碼
                </button>

                <button class="danger" type="button" @click="onLogout">
                    登出
                </button>
            </div>

            <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
            <p v-if="okMsg" class="ok">{{ okMsg }}</p>
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

/* 紅框與欄位錯誤文字 */

.input-error {
    border-color: #dc2626 !important;
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12);
}

.field-error {
    margin: 6px 0 0;
    color: #dc2626;
    font-weight: 700;
    font-size: 13px;
}
</style>