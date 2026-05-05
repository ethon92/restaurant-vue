import api from "@/api";

/**
 * 取得個人化推薦餐廳
 * @param {number} userId - 目前登入會員 id
 */
export const getRecommendRestaurants = (userId) => {
  return api.get(`/recommend/${userId}`);
};
