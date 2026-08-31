/**
 * 랩실 후기 Enum 표시값.
 *
 * 기준은 `Community 랩실 평가 API 명세 v2`입니다.
 * v1에 있던 별점(overallRating)과 논문 기회(paperOpportunity)는 폐기되어 없습니다.
 * (COMMUNITY_API.md §6)
 */

/** 후기 카테고리 — 후기당 반드시 1개 */
export const REVIEW_CATEGORY = {
  ACCEPTANCE: { label: "합격 후기", badge: "bg-brand-50 text-brand-600" },
  RESEARCH_ENVIRONMENT: {
    label: "연구 환경",
    badge: "bg-emerald-50 text-emerald-600",
  },
  PROFESSOR_STYLE: {
    label: "교수님 스타일",
    badge: "bg-orange-50 text-orange-600",
  },
  COMPENSATION_WELFARE: {
    label: "인건비·복지",
    badge: "bg-violet-50 text-violet-600",
  },
  OTHER: { label: "기타", badge: "bg-gray-100 text-gray-600" },
};

/** 참여 학기 */
export const PARTICIPATION_TERM = {
  FIRST_SEMESTER: "1학기",
  SUMMER_BREAK: "여름방학",
  SECOND_SEMESTER: "2학기",
  WINTER_BREAK: "겨울방학",
};

/**
 * 평가 3항목.
 * 화면에서 "연구 강도 높음" 처럼 항목명과 값을 함께 보여주기 위해
 * 라벨과 값 목록을 한 곳에 묶었습니다.
 */
export const REVIEW_EVALUATIONS = [
  {
    field: "researchIntensity",
    label: "연구 강도",
    options: { LOW: "낮음", MEDIUM: "보통", HIGH: "높음" },
  },
  {
    field: "compensation",
    label: "인건비",
    options: { NONE: "없음", SMALL_AMOUNT: "소액", SUFFICIENT: "충분" },
  },
  {
    field: "atmosphere",
    label: "연구실 분위기",
    // v1은 COLLABORATIVE였지만 v2에서 COOPERATIVE로 바뀌었습니다.
    options: { COMPETITIVE: "경쟁적", NORMAL: "보통", COOPERATIVE: "협력적" },
  },
];

/** 좋은 점 태그 10종. 복수 선택 가능하며 선택하지 않아도 됩니다. */
export const REVIEW_TAG = {
  RESEARCH_IMMERSION: "연구 몰입 환경",
  STUDY_RESEARCH_BALANCE: "학업·연구 병행 가능",
  FREE_ATMOSPHERE: "자유로운 분위기",
  STRUCTURED_RESEARCH_GUIDANCE: "체계적인 연구 지도",
  PROFESSOR_COMMUNICATION: "교수님과 소통 원활",
  ACTIVE_FEEDBACK: "피드백이 활발함",
  PROJECT_OPPORTUNITY: "프로젝트 참여 기회",
  DIVERSE_RESEARCH_EXPERIENCE: "다양한 연구 경험",
  INTEREST_FIELD_RESEARCH: "관심 분야 연구 가능",
  CAREER_CONNECTION: "진로·진학·취업 연계",
};
