<template>
    <div class="password-row">
        <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :type="show ? 'text' : 'password'" :placeholder="placeholder" :required="required" />

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
import { ref } from "vue";

defineProps({
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "密碼" },
    required: { type: Boolean, default: true },
});

defineEmits(["update:modelValue"]);

const show = ref(false);
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
