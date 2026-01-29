<script setup>
defineProps({
    icon: String,
    label: String,
    value: [String, Number]
});
</script>

<template>
    <div class="meta-item">
        <span class="icon">{{ icon }}</span>
        <div>
            <label>{{ label }}</label>
            <div class="meta-content">
                <slot>{{ value }}</slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.meta-item {
    display: flex;
    gap: 15px;
    align-items: flex-start;
}

.meta-item label {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #757575;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

.meta-content {
    font-weight: 500;
    margin: 0;
}

.icon {
    font-size: 1.2rem;
    background: #f5f5f5;
    padding: 10px;
    border-radius: 12px;
}
</style>