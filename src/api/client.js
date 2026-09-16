import axios from "axios";
import { useErrorStore } from "../store/errorStore";
import { useAuthStore } from "../store/authStore";

const client = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

let rateLimitedUntil = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// 요청 인터셉터 - Rate Limit 체크
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

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 429 처리
    if (error.response?.status === 429) {
      const retryAfter = Number(error.response.headers["retry-after"] ?? 30);
      rateLimitedUntil = Date.now() + retryAfter * 1000;
      useErrorStore.getState().setRateLimitError(retryAfter);
      return Promise.reject(error);
    }

    // 403 CSRF 실패 처리
    if (error.response?.status === 403) {
      const errorCode = error.response?.data?.error?.code;
      if (errorCode === "CSRF_TOKEN_INVALID" && !originalRequest._csrfRetry) {
        originalRequest._csrfRetry = true;
        try {
          await client.get("/auth/csrf");
          return client(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      }
    }

    // 401 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorCode = error.response?.data?.error?.code;

      // ACCESS_TOKEN_INVALID → 탈퇴 계정 or 인증 버전 불일치
      // refresh 호출 없이 바로 clearAuth
      if (errorCode === "ACCESS_TOKEN_INVALID") {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }

      // refresh, csrf, me, recovery 요청은 재시도 안 함
      if (
        originalRequest.url.includes("/auth/refresh") ||
        originalRequest.url.includes("/auth/csrf") ||
        originalRequest.url.includes("/auth/recovery") ||
        originalRequest.url.includes("/me")
      ) {
        return Promise.reject(error);
      }

      // ACCESS_TOKEN_EXPIRED → refresh 시도
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => client(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await client.post("/auth/refresh");
        processQueue(null);
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default client;
