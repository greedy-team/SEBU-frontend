import axios from "axios";
import { useErrorStore } from "../store/errorStore";
// useAuthStore import 제거 ← 토큰 직접 관리 안 하니까

const client = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // 쿠키 자동 전송
});

let rateLimitedUntil = null;

// 요청 인터셉터 - Rate Limit 체크만
// Authorization 헤더 붙이는 로직 제거 ← 브라우저가 쿠키 자동으로 붙여줌
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
  return config;
});

// 응답 인터셉터 - 429면 errorStore에 저장
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = Number(error.response.headers["retry-after"] ?? 30);
      rateLimitedUntil = Date.now() + retryAfter * 1000;
      useErrorStore.getState().setRateLimitError(retryAfter);
    }
    return Promise.reject(error);
  },
);

export default client;
