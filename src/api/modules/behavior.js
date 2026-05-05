import api from "@/api";

/**
 * 記錄使用者行為
 *
 * @param {Object} payload
 * @param {number} payload.user_id - 使用者 id
 * @param {number} payload.restaurant_id - 餐廳 id
 * @param {string} payload.action_type - 行為類型
 */
export const recordBehaviorApi = (payload) => {
  return api.post("/behavior", payload);
};
