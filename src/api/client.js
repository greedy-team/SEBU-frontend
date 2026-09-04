import axios from "axios";
import { useAuthStore } from "../store/authStore";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/v1",
  withCredentials: true,
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
