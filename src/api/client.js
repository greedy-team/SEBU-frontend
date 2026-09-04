import axios from "axios";
import { useAuthStore } from "../store/authStore";

const client = axios.create({
  baseURL:
    import.meta.env.VITE_USE_MSW === "true"
      ? "/api/v1" // MSW 켜짐 → 상대경로
      : import.meta.env.VITE_API_BASE_URL + "/api/v1", // MSW 꺼짐 → 절대경로
  withCredentials: true,
});

// Rate Limit 해제 시간
let rateLimitedUntil = null;

// 요청 인터셉터 - Rate Limit 체크 + 토큰 자동 첨부
client.interceptors.request.use((config) => {
  // 429 났으면 해제 시간 전까지 모든 요청 막기
  if (rateLimitedUntil && Date.now() < rateLimitedUntil) {
    const retryAfter = Math.ceil((rateLimitedUntil - Date.now()) / 1000);
    return Promise.reject({ isRateLimited: true, retryAfter });
  }

  // 토큰 자동 첨부
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터 - 429면 시간 저장
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"] ?? 30;
      rateLimitedUntil = Date.now() + retryAfter * 1000;
    }
    return Promise.reject(error);
  },
);

export default client;
