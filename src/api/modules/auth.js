import api from "../index";

export const login = (payload) => api.post("/auth/login", payload);
export const register = (payload) => api.post("/auth/register", payload);
export const forgotPassword = (payload) =>
  api.post("/auth/forgot-password", payload);
export const verifyIdentity = (payload) =>
  api.post("/auth/verify-identity", payload);
export const resetPassword = (payload) =>
  api.post("/auth/reset-password", payload);
export const getProfile = (payload = {}) => api.post("/auth/profile", payload);
export const logout = () => api.post("/auth/logout");
