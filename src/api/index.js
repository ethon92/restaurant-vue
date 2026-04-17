import axios from "axios";

/**
 * Axios instance
 * 這裡是全站共用的 API 入口
 */
const service = axios.create({
  baseURL: "http://localhost:8000", // 後端API的網址
  timeout: 10000, // 請求逾時時間(毫秒)
});

/**
 * Request Interceptor
 * 每次送 request 前，自動把 localStorage 裡的 JWT token 帶上去
 *
 * Header 格式：
 * Authorization: Bearer <token>
 *
 * 這樣之後像 /auth/profile、/auth/avatar 等需要登入的 API
 * 就不用每次手動加 header 了
 */
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 * 若後端回 401，代表 token 可能失效、過期、格式錯誤
 * 這裡直接清掉登入資訊，避免前端還以為自己有登入
 */
service.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("auth_access_token");
      localStorage.removeItem("auth_user_id");
      localStorage.removeItem("auth_role");
    }

    return Promise.reject(error);
  },
);

export default service;
