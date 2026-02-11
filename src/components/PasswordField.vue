<template>
    <!--
    PasswordField.vue
    ✅ 可顯示/隱藏密碼
    ✅ 支援 error 紅框（由父層傳 :error）
    ✅ 支援 ref.focus()（父層可在驗證失敗時自動 focus）
    ✅ 會把父層傳進來的 $attrs（例如 autocomplete、name、id）套到 input 上
  -->
    <div class="password-row">
        <input ref="inputEl" :value="modelValue" @input="onInput" :type="show ? 'text' : 'password'"
            :placeholder="placeholder" :required="required" :class="['pf-input', { 'pf-input-error': error }]"
            v-bind="inputAttrs" />


        <button type="button" class="eye-btn" @click="show = !show" :aria-label="show ? '隱藏密碼' : '顯示密碼'"
            :title="show ? '隱藏密碼' : '顯示密碼'">
            <!-- show=true：斜線眼睛（代表目前顯示中，按下去會隱藏） -->
            <svg v-if="show" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
                <path d="M3 3l18 18" />
            </svg>

            <!-- show=false：眼睛 -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        </button>
    </div>
</template>

<script setup>
/**
 * 為了讓父層能控制「紅框」與「focus」
 * - error: 父層驗證失敗時傳 true，PasswordField input 會紅框
 * - defineExpose({ focus })：父層透過 ref 呼叫 focusField 時可直接 focus 到 input
 * - $attrs：把父層額外傳入的屬性（autocomplete 等）套到 input
 */
import { ref, computed, useAttrs } from "vue";

// ✅ 不要把 $attrs 自動掛在根元素 div，手動掛到 input
defineOptions({ inheritAttrs: false });

const props = defineProps({
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "密碼" },
    required: { type: Boolean, default: true },
    // ✅ 父層傳入：是否顯示紅框（例如密碼錯誤）
    error: { type: Boolean, default: false },
});

// ✅ 讓父層可以用 @input 來「一打字就清掉錯誤訊息」
const emit = defineEmits(["update:modelValue", "input"]);

const show = ref(false);
const inputEl = ref(null);

const attrs = useAttrs();

/**
 * 將 attrs 轉給 input 使用，但避免 class 重複處理：
 * - 我們的 class 由 :class 控制
 * - 父層若真的要加 class，可改在父層包一層 div
 */
const inputAttrs = computed(() => {
    const { class: _class, style: _style, ...rest } = attrs;
    return rest;
});

const onInput = (e) => {
    const v = e.target.value;
    emit("update:modelValue", v);
    emit("input", v);
};

/** ✅ 提供給父層呼叫：ref.focus() */
const focus = () => {
    inputEl.value?.focus?.();
};

defineExpose({ focus });

</script>

<style scoped>
.password-row {
    display: flex;
    gap: 8px;
    align-items: center;
}

.password-row input {
    flex: 1;
}

/* ✅ 給 input 一些基本樣式（跟外面 .input 不衝突，外面會控制高度/邊框也可以） */
.pf-input {
    flex: 1;
    height: 42px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    padding: 0 12px;
    font-size: 14px;
    outline: none;
}

/* ✅ error 紅框（由父層 :error 控制） */
.pf-input-error {
    border-color: #dc2626 !important;
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12);
}


.eye-btn {
    width: 44px;
    height: 40px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    display: grid;
    place-items: center;
}

.eye-btn:hover {
    background: #f7f7f7;
}
</style>
