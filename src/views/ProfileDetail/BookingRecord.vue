<script setup>
import { fetchBookingRecord } from '@/api/modules/restaurant';
import { onMounted, ref } from 'vue';

// 測試用的預設資料
const userId = ref();
const bookingData = ref();
userId.value = 1;

const bookingRecord = async () => {
    try {
        const result = await fetchBookingRecord(userId.value);
        bookingData.value = result.data.results;
        console.log(result)
    } catch (error) {
        console.warn(error)
    }
};


onMounted(() => bookingRecord())
</script>


<template>
    <div class="container">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">編號</th>
                    <th scope="col">餐廳名稱</th>
                    <th scope="col">訂位日期</th>
                    <th scope="col">狀態</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, index) in bookingData" :key="record.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ record.name }}</td>
                    <td>{{ record.time }}</td>
                    <td>{{ record.status }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<style scoped></style>