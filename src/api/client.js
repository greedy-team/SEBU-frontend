import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useErrorStore } from "../store/errorStore";

const client = axios.create({
  baseURL:
    import.meta.env.VITE_USE_MSW === "true"
      ? "/api/v1"
      : import.meta.env.VITE_API_BASE_URL + "/api/v1",
  withCredentials: true,
});

// Rate Limit 해제 시간
let rateLimitedUntil = null;

// 요청 인터셉터 - Rate Limit 체크 + 토큰 자동 첨부
client.interceptors.request.use((config) => {
  if (rateLimitedUntil && Date.now() < rateLimitedUntil) {
    const retryAfter = Math.ceil((rateLimitedUntil - Date.now()) / 1000);
    const error = new Error(
      "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
    );
    error.isRateLimited = true;
    error.retryAfter = retryAfter;
    return Promise.reject(error);
  }

  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터 - 429면 errorStore에 저장
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = Number(error.response.headers["retry-after"] ?? 30);
      rateLimitedUntil = Date.now() + retryAfter * 1000;
      useErrorStore.getState().setRateLimitError(retryAfter); // 전역 상태에 저장
    }
    return Promise.reject(error);
  },
);

export default client;
