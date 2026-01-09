<script setup>
import { ref, reactive } from 'vue';
import restaurantApi from '@/api/modules/restaurant'; // 引用你寫好的 API 模組

const props = defineProps({
    restaurantName: String
});

// 定義表單資料
const myFormData = reactive({
    restaurant_name: props.restaurantName || '',
    user_name: '',
    phone: '',
    date: '',
    time: '',
    people: 2,
    note: '',
});

const isSubmitting = ref(false);

// const handleBooking = async () => {
//     if (!myFormData.user_name || !myFormData.phone) {
//         alert("請填寫姓名與電話");
//         return;
//     }
//     isSubmitting.value = true;
//     try {
//         const res = await restaurantApi.book(myFormData);
//         if (res.data.status === 'success') {
//             alert("預約成功！" + res.data.message);
//         }
//     } catch (error) {
//         console.error("預約出錯：", error.response?.data || error.message);
//         alert("預約失敗");
//     } finally {
//         isSubmitting.value = false;
//     }
// };

// 處理預約提交
const handleBooking = async () => {
    // 1. 基礎驗證
    if (!myFormData.user_name || !myFormData.phone) {
        alert("請填寫姓名與電話");
        return;
    }

    // --- 測試代碼開始 ---
    // 在發送請求前，我們先檢查準備傳給後端的 JSON 長怎樣
    const testPayload = JSON.parse(JSON.stringify(myFormData));
    console.log("🚀 準備發送至後端的預約 JSON 資料：", testPayload);
    
    // 你可以在這裡檢查欄位名稱是否與後端要求一致：
    // restaurant_name, user_name, phone, date, time, people, note
    // --- 測試代碼結束 ---

    isSubmitting.value = true;
    try {
        // 呼叫 API 模組
        const res = await restaurantApi.book(myFormData);

        // 根據你提供的 logic，判斷回傳狀態
        if (res.data.status === 'success') {
            alert("預約成功！系統訊息：" + res.data.message);
        } else {
            alert("預約未完成：" + (res.data.message || "未知原因"));
        }
    } catch (error) {
        // 捕捉詳細錯誤資訊
        console.error("❌ 預約 API 出錯：", error.response?.data || error.message);
        alert("預約失敗，請檢查網路連線或格式是否正確");
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div border="1" style="padding: 10px;">
        <h3>預約訂位 - {{ restaurantName }}</h3>
        
        <div>
            <label>姓名：</label>
            <input v-model="myFormData.user_name" type="text">
        </div>

        <div>
            <label>電話：</label>
            <input v-model="myFormData.phone" type="tel">
        </div>

        <div>
            <label>日期：</label>
            <input v-model="myFormData.date" type="date">
            <label>時間：</label>
            <input v-model="myFormData.time" type="time">
        </div>

        <div>
            <label>人數：{{ myFormData.people }}</label>
            <input v-model.number="myFormData.people" type="range" min="1" max="20">
        </div>

        <div>
            <label>備註：</label>
            <textarea v-model="myFormData.note"></textarea>
        </div>

        <button @click="handleBooking" :disabled="isSubmitting">
            {{ isSubmitting ? '處理中...' : '確認預約' }}
        </button>
    </div>
</template>