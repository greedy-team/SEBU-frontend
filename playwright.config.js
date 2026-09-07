import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // 테스트 파일이 있는 폴더
  testDir: "./e2e",

  // 테스트끼리 동시에 실행합니다.
  // MSW 상태는 브라우저 탭마다 따로라서 서로 간섭하지 않습니다.
  fullyParallel: true,

  retries: 0,

  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "http://localhost:5180",

    // 실패했을 때만 흔적을 남깁니다. 성공한 테스트까지 남기면 용량만 커져요.
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: {
    command: "npm run dev -- --port 5180",
    url: "http://localhost:5180",

    // 항상 새로 띄웁니다. 이미 떠 있는 서버를 재사용하면
    // 그 서버가 MSW 꺼진 상태일 수 있어서 결과를 믿을 수 없습니다.
    reuseExistingServer: false,

    // .env의 VITE_USE_MSW 값과 무관하게 테스트는 가짜 서버로 돌립니다.
    env: { VITE_USE_MSW: "true" },

    timeout: 60_000,
  },
});
