<script setup>
defineProps({
    title: String
});
</script>

<template>
    <section class="info-card">
        <div class="section-header">
            <h3 class="section-title">
                <slot name="title">{{ title }}</slot>
            </h3>
            <div class="title-underline"></div>
        </div>
        <div class="card-body">
            <slot></slot>
        </div>
    </section>
</template>

<style scoped>
.info-card {
    background: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 20px;
}

.title-underline {
    height: 3px;
    width: 40px;
    background: #98bd98;
    margin-bottom: 20px;
    border-radius: 2px;
}
</style>