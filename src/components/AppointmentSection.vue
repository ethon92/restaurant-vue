<script setup>
import { ref, reactive, onMounted } from 'vue';
import restaurantApi from '@/api/modules/restaurant';
import axios from 'axios';


const props = defineProps({
    restaurantName: String
});

const myFormData = reactive({
    restaurant_name: props.restaurantName || '',
    user_id: null, 
    user_name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    people: 2,
    note: '',
});
// SessionStorage
onMounted(() => {
    // 1. 從 SessionStorage 拿 ID
    const savedUser = JSON.parse(sessionStorageStorage.getItem('user_info'));

    if (savedUser && savedUser.user_id) {
        myFormData.user_id = savedUser.user_id;  
        myFormData.user_name = savedUser.user_name || '';
        myFormData.phone = savedUser.phone || '';   
        myFormData.email = savedUser.email || '';
    }
});

const isSubmitting = ref(false);

const handleBooking = async () => {
    // 防呆：沒 ID
    if (!myFormData.user_id) {
        alert("請先登入會員");
        return;
    }

    if (!myFormData.user_name || myFormData.phone || myFormData.email) {
        alert("請填寫預約姓名與電話和信箱")
        return;
    }

    const apiPayload = {
        restaurant_name: myFormData.restaurant_name,
        user_id: myFormData.user_id,
        user_name: myFormData.user_name,
        phone: myFormData.phone,
        email: myFormData.email,  
        party_size: myFormData.people,
        booking_time: `${myFormData.date}T${myFormData.time}:00`,
        note: myFormData.note || "",
        booking_status: "confirmed"
    };

    isSubmitting.value = true;
    try {
        const res = await restaurantApi.book(apiPayload); 
        
        if (res.data.status === 'success') {
            const serverData = res.data.data;
            alert(`預約成功！\n 訂位代號: ${serverData.booking_id}\n 聯絡人： ${serverData.user_name}`);
        }
    } catch (error) {
        console.error("預約錯誤:", error.response?.data);
        alert(error.response?.data?.detail || "預約失敗");
    } finally {
        isSubmitting.value = false;
    }
};
</script>
<template>
    <div class="booking-card">
        <div class="header-group">
            <h3 class="booking-title">預約訂位</h3>
            <p class="restaurant-subtitle">{{ restaurantName }}</p>
        </div>
        
        <div class="form-content">
            <div class="input-grid">
                <div class="field">
                    <label>預約姓名 (會員)</label>
                    <input 
                        v-model="myFormData.user_name" 
                        type="text" 
                        placeholder="請輸入姓名"
                    >
                </div>
                <div class="field">
                    <label>聯絡電話 (會員)</label>
                    <input 
                        v-model="myFormData.phone" 
                        type="tel" 
                        placeholder="請輸入預約人電話"
                    >
                </div>
            </div>

            <div class="field">
                <label>電子信箱</label>
                <input 
                    v-model="myFormData.email" 
                    type="email" 
                    placeholder="example@gmail.com"
                >
            </div>


            <div class="input-grid">
                <div class="field">
                    <label>預約日期</label>
                    <input v-model="myFormData.date" type="date">
                </div>
                <div class="field">
                    <label>預約時間</label>
                    <input v-model="myFormData.time" type="time">
                </div>
            </div>

            <div class="field">
                <div class="range-header">
                    <label>用餐人數</label>
                    <span class="people-count">{{ myFormData.people }} 位</span>
                </div>
                <input v-model.number="myFormData.people" type="range" min="1" max="20" class="compact-range">
            </div>

            <div class="field">
                <label>備註需求</label>
                <textarea v-model="myFormData.note" rows="2"></textarea>
            </div>

            <button class="submit-btn" @click="handleBooking" :disabled="isSubmitting">
                {{ isSubmitting ? '正在連線資料庫...' : '確認預約' }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.booking-card {
    background: #ffffff;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
    max-width: 340px;
    margin: 0 auto;
}

.header-group {
    margin-bottom: 20px;
}

.booking-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
    color: #333;
}

.restaurant-subtitle {
    font-size: 0.8rem;
    color: #999;
    margin: 2px 0 0 0;
}

.form-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.field label {
    font-size: 0.7rem;
    /* 標籤更精緻 */
    font-weight: 700;
    color: #bbb;
    text-transform: uppercase;
}

input,
textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    font-size: 0.9rem;
    background: #fcfcfc;
}

.input-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

/* 滑塊優化 */
.range-header {
    display: flex;
    justify-content: space-between;
}

.people-count {
    font-size: 0.9rem;
    font-weight: 700;
    color: hsl(28, 75%, 45%);
}

.compact-range {
    -webkit-appearance: none;
    /* Chrome, Safari, Edge */
    -moz-appearance: none;
    /* 舊版 Firefox */
    appearance: none;
    width: 100%;
    height: 4px;
    background: #eee;
    border-radius: 5px;
    margin: 8px 0;
    outline: none;
    cursor: pointer;
}

.compact-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: hsl(28, 75%, 45%);
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
}

.compact-range::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

/* 按鈕優化 */
.submit-btn {
    padding: 12px;
    background: hsl(28, 75%, 45%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 700;
    margin-top: 5px;
    cursor: pointer;
}

.booking-hint {
    font-size: 0.7rem;
    color: #ccc;
    text-align: center;
}

@media (max-width: 350px) {
    .input-grid {
        grid-template-columns: 1fr;
    }
}
</style>