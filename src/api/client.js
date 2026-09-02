import axios from "axios";
import { useAuthStore } from "../store/authStore";

const client = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // credentials: "include" 대신
});

// 요청 인터셉터 - 토큰 자동 첨부
client.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default client;
