<template>
  <div class="member-detail-container">
    <h3>會員詳細資訊管理</h3>
    
    <table class="user-table">
      <thead>
        <tr>
          <th>用戶名稱</th>
          <th>電子信箱</th>
          <th>電話號碼</th>
          <th>生日</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in memberList" :key="index">
          <td>{{ user.user_name }}</td>
          <td>{{ user.user_email }}</td>
          <td>
            <span v-if="user.user_phone">{{ user.user_phone }}</span>
            <span v-else class="text-muted">未提供</span>
          </td>
          <td>{{ user.user_birthdate }}</td>
        </tr>
        <tr v-if="memberList.length === 0">
          <td colspan="4" class="text-center">暫無會員資料</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // 建議使用 axios 處理請求

const memberList = ref([]);

// 獲取會員資料的函數
const fetchMembers = async () => {
  try {
    // 請將此處 URL 替換為您後端 API 的實際路徑
    // const response = await axios.get('http://localhost:3000/api/users');
    // memberList.value = response.data;
    
    // 以下為模擬您截圖中的資料庫數據
    memberList.value = [
      { user_name: "123", user_email: "1234@gmail.com", user_phone: null, user_birthdate: "2026-02-16" },
      { user_name: "安安", user_email: "chang@gmail.com", user_phone: null, user_birthdate: "2026-03-11" },
      { user_name: "安安", user_email: "chang.yao.an@gmail.com", user_phone: null, user_birthdate: "2026-03-17" },
      { user_name: "123", user_email: "j547471@outlook.com", user_phone: null, user_birthdate: "2026-03-16" }
    ];
  } catch (error) {
    console.error("抓取會員資料失敗:", error);
  }
};

onMounted(() => {
  fetchMembers();
});
</script>

<style scoped>
.member-detail-container {
  padding: 20px;
  background-color: #fff;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  font-size: 14px;
}

.user-table th {
  background-color: #f8f9fa;
  color: #555;
  font-weight: 600;
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #eee;
}

.user-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.user-table tr:hover {
  background-color: #fafafa;
}

.text-muted {
  color: #bbb;
  font-style: italic;
}

.text-center {
  text-align: center;
  padding: 20px;
}
</style>