import axios from "axios";

const service = axios.create({
    baseURL: "http://localhost:8000", // 後端API的網址
    timeout: 10000 // 請求逾時時間(毫秒)
});

export default service;