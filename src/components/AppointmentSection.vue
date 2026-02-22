<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import restaurantApi from '@/api/modules/restaurant';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const todayStr = new Date().toISOString().split('T')[0];

const props = defineProps({
    restaurantName: String
});

const myFormData = reactive({
    restaurant_name: props.restaurantName || '',
    user_id: null,
    user_name: '',
    phone: '',
    email: '',
    date: todayStr,
    time: '',
    people: 2,
    note: '',
});

// 提成一個function,方便重複呼叫
const fillFormData = () => {
    myFormData.user_id = authStore.userId;
    myFormData.user_name = authStore.me.name || '';
    myFormData.phone = authStore.me.phone || '';
    myFormData.email = authStore.me.email || '';

};

const isPastTime = computed(() => {
    if (!myFormData.date || !myFormData.time) return false;
    const selectedDateTime = new Date(`${myFormData.date}T${myFormData.time}`);
    return selectedDateTime < new Date();
});


// 組建掛載去抓store資料
onMounted(async () => {
    if (useStore.useId && !authStore.me) {
        try {
            await authStore.fetchMe();
        } catch (err) {
            console.error("抓取會員資料失敗", err);
        }
    }

    if (authStore.me) {
        fillFormData();
    }
});

// 監控store 資料更新
watch(() => authStore.me, (newVal) => {
    if (newVal) fillFormData();
}, { immediate: true });

const handleBooking = async () => {
    // 防呆：沒 ID
    if (!myFormData.user_id) {
        alert("請先登入會員");
        return;
    }

    const phoneRegex = /^09\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!myFormData.user_name) {
        alert("請輸入預約姓名");
        return;
    }

    if (!phoneRegex.test(myFormData.phone)) {
        alert("手機格式錯誤，請輸入正確的 10 位數字 (例如: 0912345678)");
        return;
    }

    if (!emailRegex.test(myFormData.email)) {
        alert("信箱格式錯誤");
        return;
    }

    if (!myFormData.date || !myFormData.time) {
        alert("請選擇預約日期與時間");
        return;
    }

    const selectedDateTime = new Date(`${myFormData.date}T${myFormData.time}`);
    if (selectedDateTime < new Date()) {
        alert("預約時間不可早於現在，請重新選擇");
        return;
    }

    const apiPayload = {
        restaurant_name: myFormData.restaurant_name,
        user_id: myFormData.user_id,
        user_name: myFormData.user_name,
        phone: myFormData.phone,
        email: myFormData.email,
        party_size: parseInt(myFormData.people, 10),
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
                    <input v-model="myFormData.user_name" type="text" placeholder="請輸入姓名">
                </div>
                <div class="field">
                    <label>聯絡電話 (會員)</label>
                    <input v-model="myFormData.phone" type="tel" placeholder="0912345678"
                        :class="{ 'error-border': myFormData.phone && !/^09\d{8}$/.test(myFormData.phone) }">
                    <span v-if="myFormData.phone && !/^09\d{8}$/.test(myFormData.phone)" class="error-text">
                        格式應為 09xxxxxxxx
                    </span>
                </div>
            </div>

            <div class="field">
                <label>電子信箱</label>
                <input v-model="myFormData.email" type="email" placeholder="example@gmail.com"
                    :class="{ 'input-error': myFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(myFormData.email) }">
                <p v-if="myFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(myFormData.email)" class="error-msg">
                    請輸入有效的電子信箱格式
                </p>
            </div>


            <div class="input-grid">
                <div class="field">
                    <label>預約日期</label>
                    <input v-model="myFormData.date" type="date" :min="todayStr">
                </div>
                <div class="field">
                    <label>預約時間</label>
                    <input v-model="myFormData.time" type="time" :class="{ 'input-error': isPastTime }">
                    <p v-if="isPastTime" class="error-msg">預約時間不能早於當前時間</p>
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

            <button class="submit-btn" @click="handleBooking" :disabled="isSubmitting || isPastTime">
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

/* 錯誤時的輸入紅框 */
.input-error {
    border: 1px solid #ff4d4f !important;
    background-color: #fff2f0 !important;
}

/* 錯誤提示 */
.error-msg {
    color: #ff4d4f;
    font-size: 0.65rem;
    margin: 2px 0 0 4px;
    font-weight: 500;
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