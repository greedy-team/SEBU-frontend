import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // /api로 시작하는 요청을 백엔드로 그대로 넘깁니다.
        //
        // 대상은 .env의 VITE_API_BASE_URL로 정합니다.
        //   - 도커로 로컬 백엔드를 띄웠다면  http://localhost:8080
        //   - 배포된 개발 서버에 붙이려면    https://sebu-dev-api.duckdns.org
        //
        // .env의 VITE_USE_MSW=false일 때만 의미가 있습니다.
        // true(MSW 켜짐)면 MSW가 먼저 가로채서 이 설정을 안 탑니다.
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
  };
});
