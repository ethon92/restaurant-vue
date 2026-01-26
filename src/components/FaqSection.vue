<script setup>
import { ref, computed } from 'vue';

const activeTab = ref('booking');

const faqsCategories = ref({
    explore: [
        {
            question: '我可以取消訂位嗎？',
            answer: ['當然可以。只要還在餐廳的取消期限內，透過本網站登入帳戶，即可輕鬆更改訂位時間或取消訂位。'],
            isOpen: false
        },
        {
            question: '餐廳有提供外送或外帶嗎？',
            answer: ['目前與多家平台合作提供外送服務，亦支援店內外帶。'],
            isOpen: false
        }
    ],
    booking: [
        {
            question: '我可以取消訂位嗎？',
            answer: [
                '只要還在餐廳的取消期限內即可取消。',
                '可透過此網站登入帳戶輕鬆更改或取消。'
            ],
            isOpen: false
        },
        {
            question: '我可以在訂位時備註特殊需求嗎？',
            answer: [
                '您可以填寫特殊需求作為個人的行程備註。',
                '溫馨提醒：備註目前僅供個人查看。',
                '隨時修改：進入「編輯區」即可更新。'
            ],
            isOpen: false
        }
    ],
    availability: [
        {
            question: '現在還有位子可以預訂嗎？',
            answer: [
                '由於目前線上系統尚未與店內即時連動，顯示之供應情況僅供參考。',
                '建議您送出訂位需求前，可先撥打電話詢問實際空位狀況。', 
                '確認後再進行線上預約，能確保您的座位安排更準確。'
            ],
            isOpen: false
        },
        {
            question: '如果電話預訂與線上預約衝突怎麼辦？',
            answer: [
                '我們建議以「電話確認」的結果為優先。',
                '若您已在網上送出需求，店員也會在收到通知後盡速處理您的申請。'
            ],
            isOpen: false
        }
    ],
    traffic: [
        {
            question: '附近好停車嗎？',
            answer: ['請參考周邊路邊停車格或收費停車場。'], 
            isOpen: false
        },
        {
            question: '餐廳具體位置在哪裡？',
            answer: [
                '請參考上述詳細資料的餐廳地址資訊。'
            ],
            isOpen: false
        }
    ]
});

// 計算屬性
const currentFaqs = computed(() => faqsCategories.value[activeTab.value]);

const toggleFaq = (index) => {
    currentFaqs.value[index].isOpen = !currentFaqs.value[index].isOpen;
}
</script>

<template>
    <section class="faq-container">
        <h3 class="faq-main-title">常見問答</h3>
        <div class="tab-scroll-wrapper">
            <div class="tab-banner">
                <button class="tab-btn" :class="{ active: activeTab === 'explore' }"
                    @click="activeTab = 'explore'">探索</button>
                <button class="tab-btn" :class="{ active: activeTab === 'booking' }"
                    @click="activeTab = 'booking'">訂位</button>
                <button class="tab-btn" :class="{ active: activeTab === 'availability' }"
                    @click="activeTab = 'availability'">供應情況</button>
                <button class="tab-btn" :class="{
                    active:activeTab === 'traffic' }" @click="activeTab = 'traffic' ">交通資訊</button>
            </div>
        </div>

        <Transition name="fade" mode="out-in">
            <div class="faq-list" :key="activeTab">
                <div v-for="(item, index) in currentFaqs" :key="index" class="faq-item"
                    :class="{ 'is-open': item.isOpen }">
                    <button class="faq-question" @click="toggleFaq(index)">
                        <span>{{ item.question }}</span>
                        <span class="arrow-icon" :class="{ rotate: item.isOpen }">▼</span>
                    </button>

                    <div class="faq-answer">
                        <ul class="faq-bullet-list">
                            <li v-for="(line, i) in item.answer" :key="i">{{ line }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Transition>
    </section>
</template>

<style scoped>
/* 基礎容器 */
.faq-container {
    max-width: 800px;
    margin: 40px 0;
}

.faq-main-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
}

/* Tab Banner */
.tab-scroll-wrapper {
    width: 100%;
    overflow-x: auto;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 20px;
}

.tab-scroll-wrapper::-webkit-scrollbar {
    display: none;
}

.tab-banner {
    display: flex;
    gap: 30px;
    white-space: nowrap;
}

.tab-btn {
    background: none;
    border: none;
    padding: 12px 5px;
    font-size: 1rem;
    font-weight: 600;
    color: #757575;
    cursor: pointer;
    position: relative;
    transition: color 0.3s;
}

.tab-btn.active {
    color: #d32323;
}

.tab-btn.active::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #d32323;
}

/* FAQ 核心樣式 */
.faq-item {
    border-bottom: 1px solid #f0f0f0;
}

.faq-question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d2d2d;
    text-align: left;
}

.arrow-icon {
    font-size: 0.8rem;
    color: #999;
    transition: transform 0.3s;
}

.arrow-icon.rotate {
    transform: rotate(180deg);
}

/* 開合動畫關鍵 */
.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    opacity: 0;
}

.is-open .faq-answer {
    max-height: 300px;
    opacity: 1;
    padding-bottom: 20px;
}

/* 清單樣式 */
.faq-bullet-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.faq-bullet-list li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 8px;
    color: #4a4a4a;
    line-height: 1.6;
}

.faq-bullet-list li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 9px;
    width: 6px;
    height: 6px;
    background-color: hsl(28, 75%, 45%);
    border-radius: 50%;
}

/* 過渡動畫 */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>