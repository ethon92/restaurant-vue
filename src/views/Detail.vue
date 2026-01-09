<script setup>
import { onMounted, ref } from 'vue';
import restaurantApi from '@/api/modules/restaurant';
import AppointmentSection from '@/components/AppointmentSection.vue'; 

// 修正 1：只保留一個 props 定義，並確保名稱與 router 對齊
const props = defineProps({
    name: { // 將 restaurantName 改為 name，配合 router 的 :name
        type: String,
        default: '老井極上燒肉 竹北店'
    }
});

const restaurantStaticInfo = ref({
    address: "302 新竹縣竹北市文興路一段31號",
    phone: "03 668 8238",
    price: "NT$1000至NT$1999",
    description: "座位將為您保留10分鐘，超過時間即取消訂位。用餐時間為兩小時。"
});

const restaurantInfo = ref(null);

onMounted(async () => {
    // 修正 2：確保這裡使用的是 props.name
    if (props.name) {
        try {
            const res = await restaurantApi.getDetail(props.name);
            console.log("這間餐廳的詳細資料：", res.data);
            restaurantInfo.value = res.data.info;
        } catch (error) {
            console.error("抓取失敗", error);
        }
    }
});

</script>

<template>
    <div>
        <h1>{{ restaurantName }}</h1>
        <p>價格：{{ restaurantStaticInfo.price }}</p>
        <p>介紹：{{ restaurantStaticInfo.description }}</p>

        <hr>

        <div style="width: 60%; float: left;">
            <section>
                <h3>詳細資料</h3>
                <ul>
                    <li>位置：{{ restaurantStaticInfo.address }}</li>
                    <li>電話：{{ restaurantStaticInfo.phone }}</li>
                </ul>
            </section>

            <hr>

            <section>
                <h3>顧客回饋 (UGC)</h3>
                <p style="color: gray;">[這裡留給朋友放他的 UserComments 組件]</p>
                </section>
        </div>

        <div style="width: 35%; float: right;">
            <AppointmentSection :restaurantName="restaurantName" />
        </div>

        <div style="clear: both;"></div>
    </div>
</template>