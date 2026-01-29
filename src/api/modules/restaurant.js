
import service from "../index";


export default {
  /* 1. 取得餐廳列表 */
  getRestaurants(skip = 0, limit = 20) {
    return service.get('/api/restaurants', {
      params: { skip, limit }
    });
  },

  /* 2. 連動搜尋 API */
  searchRestaurants(filters) {
    return service.get('/api/search', {
      params: filters,
      paramsSerializer: {
        indexes: null 
      }
      });
  },

  /* 3. 取得餐廳詳情 */
  getDetail(id) {
    return service.get(`/api/restaurant/${id}`);
  },

  /* 4. 提交預約 */

book(bookingData) {
  return service.post('/api/reservations', bookingData);
},

  /*5. [新功能] 取消/刪除預約 */
  deleteReservation(id) {
    return service.delete(`/api/reservation/${id}`);
  },

  /* 6. [新功能] 取得所有預約 */
  getAllReservations() {
    return service.get('/api/reservations');
  }
};

// 取得訂位歷史紀錄API
const bookingRecordApi = {
    fetchBookingRecord(userId) {
        return service({
            url: `/booking-record/${userId}`,
            method: 'get'
        })
    }
}

export const fetchBookingRecord = bookingRecordApi.fetchBookingRecord
