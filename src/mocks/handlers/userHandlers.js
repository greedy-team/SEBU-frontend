import { http, HttpResponse, delay } from "msw";

export const userHandlers = [
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
];
