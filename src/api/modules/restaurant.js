import service from '../index';
import request from '../index'; 

export default {
  /**
   * 1. 取得餐廳列表
   */
  getRestaurants(skip = 0, limit = 20) {
    return request.get('/api/restaurants', {
      params: { skip, limit }
    });
  },

  /**
   * 2. 連動搜尋 API
   */
  searchRestaurants(filters) {
    return request.get('/api/search', {
      params: filters,
      paramsSerializer: {
        indexes: null
      }
    });
  },

  /**
   * 3. 取得餐廳詳情
   */
  getDetail(id) {
    return request.get(`/api/restaurant/${id}`);
  },

  /**
   * 4. 提交預約
   * @param {Object} bookingData */

book(bookingData) {
  return request.post('/api/reservations', bookingData);
},

  /**
   * 5. [新功能] 取消/刪除預約
   * @param {number} id - 預約 ID
   */
  deleteReservation(id) {
    return request.delete(`/api/reservation/${id}`);
  },

  /**
   * 6. [新功能] 取得所有預約
   */
  getAllReservations() {
    return request.get('/api/reservations');
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
