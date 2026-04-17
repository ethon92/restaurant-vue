<script setup>
import { fetchBookingRecord } from "@/api/modules/restaurant";
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref } from "vue";
import AddCommentCard from "@/components/AddCommentCard.vue";



// 從pinia引入useAuthStore，以獲取userId
const authStore = useAuthStore();
const bookingData = ref();
const isEmpty = ref(false);

const showCommentModal = ref(false);
const selectedRestaurantId = ref(null);
const selectedRestaurantName = ref(""); 
const selectedBookingId = ref(null);

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
const openComment = (record) => {
  selectedRestaurantId.value = record.ID;
  selectedRestaurantName.value = record.name;
  selectedBookingId.value = record.id;
  showCommentModal.value = true;
};
const onCommentSuccess = () => {
    const target = bookingData.value.find(r => r.id === selectedBookingId.value);
    if (target) {
        target.is_commented = 1;
    } 
    showCommentModal.value = false;
};
// 狀態樣式對照表
const getStatusClass = (status) => {
  const map = {
    confirmed: "bg-success-subtle text-success border-success",
    // '已取消': 'bg-danger-subtle text-danger border-danger',
  };
  return map[status] || "bg-light text-secondary";
};


onMounted(() => bookingRecord());
</script>

<template>
  <div class="container py-4">
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th scope="col" class="ps-4 py-3 text-secondary fw-semibold">
                #
              </th>
              <th scope="col" class="py-3 text-secondary fw-semibold">
                餐廳名稱
              </th>
              <th scope="col" class="py-3 text-secondary fw-semibold">
                訂位日期
              </th>
              <th scope="col" class="py-3 text-secondary fw-semibold">狀態</th>
              <th scope="col" class="ps-4 py-3 text-secondary fw-semibold">
                評論
              </th>
            </tr>
          </thead>

          <TransitionGroup name="table-row" tag="tbody">
            <tr
              v-for="(record, index) in bookingData"
              :key="record.id"
              class="record-row"
              :style="{ '--i': index }"
            >
              <th scope="row" class="ps-4 text-muted">{{ index + 1 }}</th>
              <td class="fw-bold text-dark">{{ record.name }}</td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-dark">{{ record.time }}</span>
                </div>
              </td>
              <td>
                <span
                  class="badge border rounded-pill px-3 py-2 fw-medium"
                  :class="getStatusClass(record.status)"
                >
                  {{ record.status }}
                </span>
              </td>
<td>
    <span v-if="record.is_commented === 1" class="text-muted fw-bold small">
        已評論
    </span>
    
    <button 
        v-else-if="record.is_commented === 0 && record.status === 'confirmed'"
        @click="openComment(record)" 
        class="btn btn-link btn-sm text-decoration-none fw-bold p-0"
    >
        發表評論
    </button>
    
    <span v-else class="text-muted small">-</span>
</td>
            </tr>
          </TransitionGroup>
        </table>
        <Transition name="fade">
          <div
            v-if="showCommentModal"
            class="custom-modal-overlay"
            @click.self="showCommentModal = false"
          >
            <div class="custom-modal-content shadow-lg">
              <div
                class="modal-header-custom d-flex justify-content-between align-items-center"
              >
                <span
                  class="badge bg-primary-subtle text-primary rounded-pill px-3"
                >
                  {{ selectedRestaurantName }}
                </span>
              </div>

              <div class="modal-body-custom mt-4">
                <AddCommentCard
                  :restaurantIdProp="selectedRestaurantId"
                  :restaurantName="selectedRestaurantName"
                  :bookingIdProp="selectedBookingId"
                  @close="showCommentModal = false"
                  @submit-success="onCommentSuccess"

                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <div v-if="isEmpty" class="text-center py-5">
        <i
          class="bi bi-calendar-x text-muted opacity-25"
          style="font-size: 4rem"
        ></i>
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

/* 彈窗遮罩層 */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4); /* 半透明黑背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 視窗白框主體 */
.custom-modal-content {
  background: white;
  width: 100%;
  max-width: 600px; /* 參考圖片寬度 */
  border-radius: 12px;
  padding: 30px;
  position: relative;
  animation: slideUp 0.3s ease-out;
}

.modal-header-custom {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

/* 進場動畫 */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
