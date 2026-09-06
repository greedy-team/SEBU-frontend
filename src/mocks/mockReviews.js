import { hoursAgo } from "./mockTime";

/**
 * 랩실 후기 mock 데이터.
 *
 * 기준은 랩실 평가 v2입니다 — 별점(overallRating)과 논문 기회(paperOpportunity)는 없습니다.
 * 공개 응답에는 작성자 정보가 전혀 들어가지 않으므로 여기에도 authorId만 두고
 * 응답 변환 단계에서 뺍니다. (COMMUNITY_API.md §6.5)
 *
 * laboratoryId는 mockLabs의 id(1001~)를 씁니다.
 */

/** MSW 로그인 사용자. 이 사람이 쓴 후기가 있는 랩실은 reviewedByMe=true가 됩니다. */
export const MOCK_REVIEW_AUTHOR_ID = 17;

let nextReviewId = 7001;

const review = (laboratoryId, data) => ({
  id: nextReviewId++,
  laboratoryId,
  ...data,
});

export const mockReviews = [
  /* ── 1001 인공지능연구실 : 후기 4개, 태그 요약이 잘 보이는 랩실 ── */
  review(1001, {
    authorId: 201,
    category: "RESEARCH_ENVIRONMENT",
    participationYear: 2026,
    participationTerm: "FIRST_SEMESTER",
    researchIntensity: "HIGH",
    compensation: "SUFFICIENT",
    atmosphere: "COOPERATIVE",
    tags: [
      "RESEARCH_IMMERSION",
      "PROJECT_OPPORTUNITY",
      "STRUCTURED_RESEARCH_GUIDANCE",
    ],
    content:
      "프로젝트에 직접 참여할 기회가 많았고 교수님 피드백도 자주 받을 수 있었어요. 처음엔 논문 읽는 것도 버거웠는데 매주 세미나를 하면서 많이 늘었습니다.",
    createdAt: hoursAgo(30),
  }),
  review(1001, {
    authorId: MOCK_REVIEW_AUTHOR_ID,
    category: "ACCEPTANCE",
    participationYear: 2025,
    participationTerm: "WINTER_BREAK",
    researchIntensity: "MEDIUM",
    compensation: "SMALL_AMOUNT",
    atmosphere: "COOPERATIVE",
    tags: ["PROJECT_OPPORTUNITY", "CAREER_CONNECTION"],
    content:
      "방학 동안 먼저 참여해보고 학기 중에 계속할지 정할 수 있어서 좋았습니다. 컨택 메일에 관심 분야를 구체적으로 적은 게 도움이 된 것 같아요.",
    createdAt: hoursAgo(200),
  }),
  review(1001, {
    authorId: 203,
    category: "PROFESSOR_STYLE",
    participationYear: 2025,
    participationTerm: "SECOND_SEMESTER",
    researchIntensity: "HIGH",
    compensation: "SUFFICIENT",
    atmosphere: "NORMAL",
    tags: [
      "PROFESSOR_COMMUNICATION",
      "ACTIVE_FEEDBACK",
      "STRUCTURED_RESEARCH_GUIDANCE",
    ],
    content:
      "교수님이 학부생 의견도 잘 들어주시고, 진행이 막히면 먼저 물어봐 주십니다. 다만 연구 강도는 낮지 않으니 시간 배분은 미리 생각하고 오시는 게 좋아요.",
    createdAt: hoursAgo(420),
  }),
  review(1001, {
    authorId: 204,
    category: "COMPENSATION_WELFARE",
    participationYear: 2025,
    participationTerm: "SUMMER_BREAK",
    researchIntensity: "MEDIUM",
    compensation: "SUFFICIENT",
    atmosphere: "COOPERATIVE",
    tags: ["STUDY_RESEARCH_BALANCE", "FREE_ATMOSPHERE"],
    content:
      "인건비가 제때 나오고 금액도 학부생 기준으로는 넉넉한 편이었습니다. 출퇴근 시간도 자유로워서 수업과 병행하기 괜찮았어요.",
    createdAt: hoursAgo(700),
  }),

  /* ── 1002 데이터사이언스랩 : 후기 2개 ── */
  review(1002, {
    authorId: 205,
    category: "RESEARCH_ENVIRONMENT",
    participationYear: 2026,
    participationTerm: "FIRST_SEMESTER",
    researchIntensity: "MEDIUM",
    compensation: "NONE",
    atmosphere: "NORMAL",
    tags: ["DIVERSE_RESEARCH_EXPERIENCE", "INTEREST_FIELD_RESEARCH"],
    content:
      "데이터 전처리부터 모델링까지 전 과정을 경험할 수 있었습니다. 인건비는 없었지만 배우는 게 많아서 저는 만족했어요.",
    createdAt: hoursAgo(90),
  }),
  review(1002, {
    authorId: 206,
    category: "OTHER",
    participationYear: 2025,
    participationTerm: "SECOND_SEMESTER",
    researchIntensity: "LOW",
    compensation: "SMALL_AMOUNT",
    atmosphere: "COOPERATIVE",
    tags: ["FREE_ATMOSPHERE", "STUDY_RESEARCH_BALANCE"],
    content:
      "분위기가 자유로운 편이라 부담 없이 시작하기 좋았어요. 대신 스스로 목표를 잡지 않으면 흐지부지될 수도 있습니다.",
    createdAt: hoursAgo(520),
  }),

  /* ── 1003 : 후기 1개 (태그 없음 — 태그는 선택 항목) ── */
  review(1003, {
    authorId: 207,
    category: "ACCEPTANCE",
    participationYear: 2026,
    participationTerm: "SUMMER_BREAK",
    researchIntensity: "HIGH",
    compensation: "NONE",
    atmosphere: "COMPETITIVE",
    tags: [],
    content:
      "경쟁적인 분위기라 스스로 밀어붙이는 성향이면 잘 맞을 것 같습니다. 저는 여름방학 동안만 참여했는데 배운 건 확실히 많았어요.",
    createdAt: hoursAgo(150),
  }),
];

/** 특정 랩실의 후기 수. 저장값이 아니라 매번 집계합니다. */
export const countReviews = (laboratoryId) =>
  mockReviews.filter((review) => review.laboratoryId === laboratoryId).length;
