import request from '../index'; // 引用你設定好的 axios 實例

export default {
  /**
   * 1. 取得餐廳列表 (支援分頁)
   * @param {number} skip - 跳過幾筆
   * @param {number} limit - 取得幾筆
   */
  getRestaurants(skip = 0, limit = 20) {
    // 改用 request，就不需要寫整串 http://localhost:8000/api
    return request.get('/api/restaurants', {
      params: { skip, limit }
    });
  },

  /**
   * 2. 連動搜尋 API
   * @param {Object} filters - 包含 q, tags, city, price_level
   */
  searchRestaurants(filters) {
    return request.get('/api/search', {
      params: filters,
      paramsSerializer: {
        indexes: null // 解決 FastAPI 的 List[str] 傳參問題
      }
    });
  },

  /**
   * 3. 取得餐廳詳情
   * @param {string} name - 餐廳名稱
   */
  getDetail(name) {
    return request.get(`/api/restaurant/${encodeURIComponent(name)}`);
  },

  /**
   * 4. 提交預約
   * @param {Object} bookingData - 包含姓名、電話、日期、時間、人數
   */
  book(bookingData) {
    return request.post('/api/book', bookingData);
  }
};