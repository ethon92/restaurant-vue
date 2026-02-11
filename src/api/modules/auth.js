import service from "../index";
import api from "../index";

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
export const register = (payload) => api.post("/auth/register", payload);
export const forgotPassword = (payload) =>
  api.post("/auth/forgot-password", payload);
export const verifyIdentity = (payload) =>
  api.post("/auth/verify-identity", payload);
export const verifyPassword = (payload) =>
  api.post("/auth/verify-password", payload);
export const resetPassword = (payload) =>
  api.post("/auth/reset-password", payload);
export const getProfile = (payload = {}) => api.post("/auth/profile", payload);
export const updateProfile = (payload) => api.put("/auth/profile", payload);
export const logout = () => api.post("/auth/logout");
