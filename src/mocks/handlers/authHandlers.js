import { http, HttpResponse, delay } from "msw";

export const authHandlers = [
  http.post("/api/v1/auth/sejong/login", async ({ request }) => {
    await delay(1000);

    const body = await request.json();
    const { studentId } = body;
    if (studentId === "0000") {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: "SEJONG_AUTH_FAILED",
            message: "학번 또는 비밀번호를 확인해주세요.",
          },
        },
        { status: 401 },
      );
    }
    if (studentId === "0001") {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: "SEJONG_SYSTEM_UNAVAILABLE",
            message:
              "세종대학교 시스템에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
          },
        },
        { status: 502 },
      );
    }

    if (studentId === "0002") {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: "LOGIN_RATE_LIMITED",
            message: "로그인 요청이 너무 많습니다.",
          },
        },
        {
          status: 429,
          headers: { "Retry-After": "30" }, 
        },
      );
    }

    if (studentId === "0003") {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_LOGIN_REQUEST",
            message: "학번과 비밀번호를 모두 입력해주세요.",
          },
        },
        { status: 400 },
      );
    }
    if (studentId === "9999") {
      return HttpResponse.json(
        {
          success: true,
          data: {
            accessToken: "fake-jwt-token-completed",
            tokenType: "Bearer",
            expiresIn: 1800,
            user: { id: 17, isNewUser: false, profileCompleted: true },
          },
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        success: true,
        data: {
          accessToken: "fake-jwt-token-12345",
          tokenType: "Bearer",
          expiresIn: 1800,
          user: { id: 17, isNewUser: true, profileCompleted: false },
        },
      },
      { status: 200 },
    );
  }),
];
