import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // /api로 시작하는 요청을 도커로 띄운 백엔드(SEBU-backend, 기본 8080 포트)로 그대로 넘겨줍니다.
      // docker-compose.yml의 BACKEND_PORT를 8080이 아닌 다른 값으로 바꿨다면 여기도 같이 바꿔주세요.
      // .env의 VITE_USE_MSW=false일 때만 의미가 있고, true(MSW 켜짐)일 때는 MSW가 먼저 가로채서 이 설정을 안 탑니다.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
