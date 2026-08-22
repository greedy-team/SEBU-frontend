import { http, HttpResponse, delay } from "msw";
import { mockLabs } from "./mockLabs";

export const handlers = [
  http.get("/api/v1/laboratories", () => {
    return HttpResponse.json({
      success: true,
      data: { laboratories: mockLabs },
      error: null,
    });
  }),

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
    if (studentId === "001") {
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
            message: "로그인 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
          },
        },
        { status: 429 },
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
  // GET 마이페이지 조회
  http.get("/api/v1/users/me/mypage", ({ request }) => {
    const token = request.headers.get("Authorization");

    // 프로필 완성된 유저 (학번 21012345로 로그인 시)
    if (token === "Bearer fake-jwt-token-completed") {
      return HttpResponse.json({
        data: {
          profile: {
            name: "김세종",
            grade: 3,
            major: { id: "12", name: "소프트웨어학과" },
            gpaBand: "GTE_3_5",
            introduction: "머신러닝에 관심있습니다.",
            profileCompleted: true,
            profileUpdatedAt: "2026-08-17T01:30:00Z",
          },
          summary: {
            bookmarkedLaboratoryCount: 0,
            bookmarkedPostCount: 0,
            receivedRecommendationCount: 0,
          },
          bookmarkedLaboratories: { items: [], hasNext: false },
          bookmarkedPosts: { items: [], hasNext: false },
        },
      });
    }

    // 신규 유저 (프로필 미완성)
    return HttpResponse.json({
      data: {
        profile: {
          name: null,
          grade: null,
          major: null,
          gpaBand: null,
          introduction: null,
          profileCompleted: false,
          profileUpdatedAt: null,
        },
        summary: {
          bookmarkedLaboratoryCount: 0,
          bookmarkedPostCount: 0,
          receivedRecommendationCount: 0,
        },
        bookmarkedLaboratories: { items: [], hasNext: false },
        bookmarkedPosts: { items: [], hasNext: false },
      },
    });
  }),

  // PUT 프로필 저장
  http.put("/api/v1/users/me/profile", async ({ request }) => {
    const body = await request.json();
    await delay(500);

    return HttpResponse.json({
      data: {
        name: body.name,
        grade: body.grade,
        major: { id: "12", name: body.major },
        gpaBand: body.gpaBand,
        introduction: body.introduction,
        profileCompleted: true,
        profileUpdatedAt: new Date().toISOString(),
      },
    });
  }),
];
