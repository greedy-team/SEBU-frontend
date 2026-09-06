import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useErrorStore } from "../store/errorStore";

const client = axios.create({
  /**
   * 언제나 상대경로입니다.
   *   개발  : vite의 server.proxy가 /api 를 백엔드로 넘깁니다
   *   배포  : vercel.json의 rewrites가 같은 일을 합니다
   *
   * 절대 주소를 쓰면 브라우저가 다른 사이트로 보기 때문에
   * CORS 허용이 필요하고, refresh 토큰 쿠키(SameSite=Lax)도 전송되지 않습니다.
   * MSW를 쓸 때와 실제 서버를 쓸 때 경로가 같아야 코드도 안 갈립니다.
   */
  baseURL: "/api/v1",
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
