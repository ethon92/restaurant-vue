<template>
    <div class="auth-shell">
        <div class="auth-card">
            <header class="auth-head">
                <div class="auth-title-row">
                    <!-- ✅ icon：優先用 slot，其次用 prop（兩種寫法都能用） -->
                    <span class="auth-icon" aria-hidden="true">
                        <slot name="icon">{{ icon }}</slot>
                    </span>

                    <h1 class="auth-title">{{ title }}</h1>
                </div>

                <p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>
            </header>

            <!-- 主要表單內容放這裡 -->
            <div class="auth-body">
                <slot />
            </div>

            <!-- 底部連結/說明 -->
            <footer v-if="$slots.footer" class="auth-footer">
                <slot name="footer" />
            </footer>

        </div>
    </div>
</template>

<script setup>
/**
 * AuthLayout：所有 auth 頁共用外殼（置中卡片 + title/subtitle + footer slot）
 * icon 可用兩種方式：
 * 1) <AuthLayout icon="🔑" ... />
 * 2) <AuthLayout ...><template #icon>🔑</template></AuthLayout>
 */
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    icon: { type: String, default: "🔐" }, // 也可以每頁換不同 icon
});
</script>
