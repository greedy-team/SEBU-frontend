import { http, HttpResponse, delay } from "msw";
import { mockLabs } from "./mockLabs";

/* ────────────────────────────────────────────────────────────
 * MSW 전용 가짜 세션
 *
 * 실제 서버는 Refresh Token을 HttpOnly 쿠키로 관리하지만,
 * HttpOnly 쿠키는 JS가 읽을 수 없어 mock에서 흉내낼 수 없습니다.
 * 그래서 "로그인한 적이 있는지"만 sessionStorage로 대신 기억합니다.
 *
 * 이건 mock이 서버 역할을 흉내내기 위한 장치일 뿐,
 * 실제 앱 코드의 토큰 저장이 아닙니다.
 * (앱은 여전히 accessToken을 zustand 메모리에만 보관합니다)
 * ──────────────────────────────────────────────────────────── */
const MOCK_SESSION_KEY = "msw-mock-session";

const saveMockSession = (accessToken) => {
  try {
    sessionStorage.setItem(MOCK_SESSION_KEY, accessToken);
  } catch {
    // 저장 실패해도 mock 동작에 치명적이지 않음
  }
};

const readMockSession = () => {
  try {
    return sessionStorage.getItem(MOCK_SESSION_KEY);
  } catch {
    return null;
  }
};

const clearMockSession = () => {
  try {
    sessionStorage.removeItem(MOCK_SESSION_KEY);
  } catch {
    // noop
  }
};

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
    if (studentId === "9999") {
      saveMockSession("fake-jwt-token-completed");
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

    saveMockSession("fake-jwt-token-12345");
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

    // 프로필 완성된 유저 (학번 로 로그인 시)
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
            bookmarkedLaboratoryCount: 2,
            bookmarkedPostCount: 0,
            receivedRecommendationCount: 0,
          },
          bookmarkedLaboratories: {
            items: [
              {
                bookmarkedAt: "2026-08-16T09:00:00Z",
                laboratory: {
                  id: "42",
                  name: "데이터사이언스랩",
                  websiteUrl: "https://data-lab.example.ac.kr",
                  college: { id: "2", name: "인공지능융합대학" },
                  department: { id: "7", name: "데이터사이언스학과" },
                  professor: {
                    id: "18",
                    name: "정현우",
                    email: "jeonghw@example.ac.kr",
                  },
                  researchFields: ["데이터 분석", "빅데이터"],
                  recruitmentStatus: "RECRUITING",
                  bookmarkCount: 48,
                  bookmarked: true,
                },
              },
              {
                bookmarkedAt: "2026-08-15T09:00:00Z",
                laboratory: {
                  id: "1001",
                  name: "인공지능연구실",
                  websiteUrl: "https://ai-lab.example.ac.kr",
                  college: { id: "1", name: "인공지능융합대학" },
                  department: { id: "101", name: "인공지능학과" },
                  professor: {
                    id: "501",
                    name: "김민준",
                    email: "minjun.kim@example.ac.kr",
                  },
                  researchFields: ["인공지능", "머신러닝"],
                  recruitmentStatus: "ALWAYS_OPEN",
                  bookmarkCount: 84,
                  bookmarked: true,
                },
              },
            ],
            hasNext: false,
          },
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

  // ── 세션 복원: Access Token 재발급 ──────────────
  // 실제 서버는 Rotation 방식이라 호출할 때마다 Refresh Token이 교체되지만,
  // mock은 "세션이 살아있는가"만 판단합니다.
  http.post("/api/v1/auth/refresh", async () => {
    await delay(300);

    const accessToken = readMockSession();

    // 로그인한 적 없음 = 쿠키 없음 → 비로그인 사용자의 정상적인 상황
    if (!accessToken) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: "REFRESH_TOKEN_INVALID",
            message: "로그인이 만료되었습니다. 다시 로그인해주세요.",
          },
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        accessToken,
        tokenType: "Bearer",
        expiresIn: 1800,
      },
    });
  }),

  // ── 현재 로그인 사용자 조회 ─────────────────────
  // 로그인 API와 달리 data를 user로 감싸지 않고 그대로 내려줍니다.
  http.get("/api/v1/me", ({ request }) => {
    const token = request.headers.get("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: "ACCESS_TOKEN_INVALID",
            message: "유효하지 않은 인증 토큰입니다.",
          },
        },
        { status: 401 },
      );
    }

    const profileCompleted = token === "Bearer fake-jwt-token-completed";

    return HttpResponse.json({
      success: true,
      data: {
        id: 17,
        nickname: profileCompleted ? "세부인" : null,
        profileCompleted,
      },
    });
  }),

  // ── 로그아웃 ────────────────────────────────────
  // 이미 만료됐거나 없는 토큰이어도 항상 성공으로 응답합니다.
  http.post("/api/v1/auth/logout", async () => {
    await delay(200);
    clearMockSession();

    return HttpResponse.json({
      success: true,
      data: { message: "로그아웃되었습니다." },
    });
  }),
];
