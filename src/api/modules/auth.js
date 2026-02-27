import service from "../index";
import api from "../index";

/**
 * Auth API module
 * ✅ 統一管理會員相關 endpoints（給 pages / store 使用）
 *
 * 注意：
 * - api 是 axios instance（baseURL 在 src/api/index.js）
 */

/** POST /auth/login
 * payload: { email, password }
 * response: { message, user: { id, email, role, name?, birthday?, phone? } }
 */
// 取得用戶評論
const authCommentApi = {
  memberCommentList(userId){
    return service({
      url: `/comment/${userId}`,
      method: 'get'
    })
  }
}

export const memberCommentList = authCommentApi.memberCommentList

export const login = (payload) => api.post("/auth/login", payload);

/** POST /auth/register
 * payload: { name, email, password, birthday }
 */
export const register = (payload) => api.post("/auth/register", payload);

/** POST /auth/forgot-password（傳統忘記密碼：第一步）
 * payload: { email }
 */
export const forgotPassword = (payload) =>
  api.post("/auth/forgot-password", payload);

/** POST /auth/verify-password（敏感操作前 re-auth）
 * payload: { user_id, current_password }
 */
export const verifyPassword = (payload) =>
  api.post("/auth/verify-password", payload);

/** POST /auth/profile
 * 目前設計是「後端吃 user_id」，所以 store 會傳 { user_id }
 * payload(default {}): { user_id? }
 */
export const getProfile = (payload = {}) => api.post("/auth/profile", payload);

/** PUT /auth/profile
 * payload: { user_id, name, phone?, birthday?, current_password }
 */
export const updateProfile = (payload) => api.put("/auth/profile", payload);

/** POST /auth/change-password（已登入修改密碼）
 * payload: { user_id, current_password, new_password }
 * ✅ 與 ForgotPassword OTP 流程分開：
 * - ForgotPassword（未登入）：/auth/forgot-password/*
 * - ChangePassword（已登入）：/auth/change-password
 */
export const changePassword = (payload) =>
  api.post("/auth/change-password", payload);

/** POST /auth/logout */
export const logout = () => api.post("/auth/logout");

// ===== OTP 忘記密碼（Email 驗證） =====

/** POST /auth/forgot-password/send-otp
 * payload: { email }
 */
export const sendForgotPasswordOtp = (payload) =>
  api.post("/auth/forgot-password/send-otp", payload);

/** POST /auth/forgot-password/verify-otp
 * payload: { email, otp }
 */
export const verifyForgotPasswordOtp = (payload) =>
  api.post("/auth/forgot-password/verify-otp", payload);

/** POST /auth/forgot-password/reset
 * payload: { email, otp, new_password }
 */
export const resetPasswordByOtp = (payload) =>
  api.post("/auth/forgot-password/reset", payload);

// ===== Avatar（存後端 static/avatars + DB avatar_path） =====

/** POST /auth/avatar
 * form-data: user_id, file
 */
export const uploadAvatar = (userId, file) => {
  const fd = new FormData();
  fd.append("user_id", String(userId));
  fd.append("file", file);
  return api.post("/auth/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/** GET /auth/avatar-url?user_id=xx
 * response: { url: "http://127.0.0.1:8000/static/avatars/xxx.jpg" } or { url: "" }
 */
export const getAvatarUrl = (userId) =>
  api.get("/auth/avatar-url", { params: { user_id: userId } });

/** DELETE /auth/avatar?user_id=xx */
export const removeAvatar = (userId) =>
  api.delete("/auth/avatar", { params: { user_id: userId } });
