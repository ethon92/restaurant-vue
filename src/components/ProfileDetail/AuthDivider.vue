<template>
    <div class="divider">
        <span class="line"></span>
        <span class="text">{{ text }}</span>
        <span class="line"></span>
    </div>
</template>

<script setup>
defineProps({ text: { type: String, default: "或" } });
</script>

<style scoped>
.divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 8px 0 0;
    color: #9ca3af;
    font-size: 12px;
}

.line {
    height: 1px;
    flex: 1;
    background: #f3f4f6;
}

.text {
    white-space: nowrap;
}
</style>
