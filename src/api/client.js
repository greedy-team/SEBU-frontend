import axios from "axios";
import { useErrorStore } from "../store/errorStore";
import { useAuthStore } from "../store/authStore";
import {
  getAuthRevision,
  recoverInvalidSession,
  runAuthMutation,
} from "./authSession";

const client = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// Keep the browser on /api: Vercel forwards it without changing cookie scope.
export const postAuth = (url, data) =>
  runAuthMutation(() => client.post(url, data));

function isPublicRead(config) {
  if (config.method !== "get") return false;
  const path = config.url.split(/[?#]/, 1)[0];
  return (
    ["/laboratories", "/colleges", "/research-field-categories", "/posts"].includes(path) ||
    /^\/laboratories\/\d+\/(reviews|review-summary)$/.test(path) ||
    /^\/posts\/\d+(\/comments)?$/.test(path) ||
    /^\/users\/\d+\/community-profile$/.test(path)
  );
}

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
  config._authRevision = getAuthRevision();
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

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

      // Authentication endpoints own their failures; never recursively refresh them.
      if (originalRequest.url.startsWith("/auth/")) {
        return Promise.reject(error);
      }

      if (errorCode === "ACCESS_TOKEN_INVALID") {
        if (isPublicRead(originalRequest) && !originalRequest._sessionRetry) {
          originalRequest._sessionRetry = true;
          try {
            await recoverInvalidSession(originalRequest._authRevision, async () => {
              await client.get("/auth/csrf");
              await client.post("/auth/logout");
              useAuthStore.getState().clearAuth();
            });
            return client(originalRequest);
          } catch {
            return Promise.reject(error);
          }
        }
        if (originalRequest._authRevision === getAuthRevision()) {
          useAuthStore.getState().clearAuth();
        }
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
        await postAuth("/auth/refresh");
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
