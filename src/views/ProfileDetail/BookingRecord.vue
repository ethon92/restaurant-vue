<script setup>
import { fetchBookingRecord } from '@/api/modules/restaurant';
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';


// 從pinia引入useAuthStore，以獲取userId
const authStore = useAuthStore();
const bookingData = ref();
const isEmpty = ref(false);

const bookingRecord = async () => {
    try {
        // 當me為空值時，先去打API拿資料
        if (!authStore.me) {
            await authStore.fetchMe();
        }

        const result = await fetchBookingRecord(authStore.me.id);
        bookingData.value = result.data.results;
        if (bookingData.value.length === 0) {
            isEmpty.value = true;
        }
        console.log(result);
    } catch (error) {
        console.warn(error);
    }
};

// 狀態樣式對照表
const getStatusClass = (status) => {
    const map = {
        'confirmed': 'bg-success-subtle text-success border-success',
        // '已取消': 'bg-danger-subtle text-danger border-danger',
    };
    return map[status] || 'bg-light text-secondary';
};

onMounted(() => bookingRecord())
</script>


<template>
    <div class="container py-4">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th scope="col" class="ps-4 py-3 text-secondary fw-semibold">#</th>
                            <th scope="col" class="py-3 text-secondary fw-semibold">餐廳名稱</th>
                            <th scope="col" class="py-3 text-secondary fw-semibold">訂位日期</th>
                            <th scope="col" class="py-3 text-secondary fw-semibold">狀態</th>
                        </tr>
                    </thead>

                    <TransitionGroup name="table-row" tag="tbody">
                        <tr v-for="(record, index) in bookingData" :key="record.id" class="record-row"
                            :style="{ '--i': index }">
                            <th scope="row" class="ps-4 text-muted">{{ index + 1 }}</th>
                            <td class="fw-bold text-dark">{{ record.name }}</td>
                            <td>
                                <div class="d-flex flex-column">
                                    <span class="text-dark">{{ record.time }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="badge border rounded-pill px-3 py-2 fw-medium"
                                    :class="getStatusClass(record.status)">
                                    {{ record.status }}
                                </span>
                            </td>
                        </tr>
                    </TransitionGroup>
                </table>
            </div>
            <div v-if="isEmpty" class="text-center py-5">
                <i class="bi bi-calendar-x text-muted opacity-25" style="font-size: 4rem;"></i>
                <p class="text-secondary mt-3">目前尚無任何訂位紀錄</p>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* 表格列懸停變色 */
.record-row {
    transition: background-color 0.3s;
}

.record-row:hover {
    background-color: #f8faff;
}

/* --- 進場動畫 --- */
.table-row-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.table-row-enter-active {
    transition: all 0.4s ease;
    transition-delay: calc(var(--i) * 0.05s);
}

/* 狀態標籤微調 */
.badge {
    font-size: 0.85rem;
    letter-spacing: 0.5px;
}
</style>