import { http, HttpResponse, delay } from "msw";
import { mockLabs } from "../mockLabs";
import { reviews, issueReviewId, MOCK_REVIEW_AUTHOR_ID } from "../mockReviews";
import { toApiDateTime } from "../mockTime";

/**
 * 랩실 후기 (커뮤니티 랩실 평가).
 *
 * 랩실 도메인과 커뮤니티 도메인이 만나는 지점이라 파일을 따로 뒀습니다.
 * 기준은 랩실 평가 v2 — 별점이 없고, 후기 수정·삭제 API도 없습니다.
 *
 * 공개 응답에는 작성자 정보를 절대 넣지 않습니다. (명세 §6.5)
 * mock의 authorId는 reviewedByMe 계산과 중복 작성 차단에만 씁니다.
 */

// 허용 Enum. 명세 §6의 값을 그대로 적어둡니다.
const CATEGORIES = [
  "ACCEPTANCE",
  "RESEARCH_ENVIRONMENT",
  "PROFESSOR_STYLE",
  "COMPENSATION_WELFARE",
  "OTHER",
];
const TERMS = [
  "FIRST_SEMESTER",
  "SUMMER_BREAK",
  "SECOND_SEMESTER",
  "WINTER_BREAK",
];
const INTENSITIES = ["LOW", "MEDIUM", "HIGH"];
const COMPENSATIONS = ["NONE", "SMALL_AMOUNT", "SUFFICIENT"];
const ATMOSPHERES = ["COMPETITIVE", "NORMAL", "COOPERATIVE"];
const TAGS = [
  "RESEARCH_IMMERSION",
  "STUDY_RESEARCH_BALANCE",
  "FREE_ATMOSPHERE",
  "STRUCTURED_RESEARCH_GUIDANCE",
  "PROFESSOR_COMMUNICATION",
  "ACTIVE_FEEDBACK",
  "PROJECT_OPPORTUNITY",
  "DIVERSE_RESEARCH_EXPERIENCE",
  "INTEREST_FIELD_RESEARCH",
  "CAREER_CONNECTION",
];

const CONTENT_MIN_LENGTH = 20;
const CONTENT_MAX_LENGTH = 2000;
const MIN_YEAR = 2000;

const errorResponse = (status, code, message) =>
  HttpResponse.json(
    {
      success: false,
      data: null,
      error: { code, message, fieldErrors: [], traceId: null },
    },
    { status },
  );

const getUserId = (request) => {
  const token = request.headers.get("Authorization");
  return token && token.startsWith("Bearer ") ? MOCK_REVIEW_AUTHOR_ID : null;
};

/** 공개 응답용 후기 — authorId·laboratoryId는 빼고 내보냅니다. */
const toPublicReview = (review) => ({
  id: review.id,
  category: review.category,
  participationYear: review.participationYear,
  participationTerm: review.participationTerm,
  researchIntensity: review.researchIntensity,
  compensation: review.compensation,
  atmosphere: review.atmosphere,
  tags: review.tags,
  content: review.content,
  createdAt: review.createdAt,
});

/**
 * 후기 입력 검증. 통과하면 null, 아니면 에러 응답을 돌려줍니다. (명세 §6.6)
 * 후기는 수정 API가 없어서 작성에서만 씁니다.
 */
const validateReviewBody = (body = {}) => {
  const enumChecks = [
    [CATEGORIES, body.category, "카테고리를 선택해주세요."],
    [TERMS, body.participationTerm, "참여 학기를 선택해주세요."],
    [INTENSITIES, body.researchIntensity, "연구 강도를 선택해주세요."],
    [COMPENSATIONS, body.compensation, "인건비를 선택해주세요."],
    [ATMOSPHERES, body.atmosphere, "연구실 분위기를 선택해주세요."],
  ];
  for (const [allowed, value, message] of enumChecks) {
    if (!allowed.includes(value)) {
      return errorResponse(400, "VALIDATION_ERROR", message);
    }
  }

  const currentYear = new Date().getFullYear();
  if (
    !Number.isInteger(body.participationYear) ||
    body.participationYear < MIN_YEAR ||
    body.participationYear > currentYear
  ) {
    return errorResponse(
      400,
      "VALIDATION_ERROR",
      `참여 연도는 ${MIN_YEAR}년부터 ${currentYear}년 사이여야 합니다.`,
    );
  }

  // 태그는 선택 항목이라 없어도 통과합니다.
  const tags = body.tags ?? [];
  if (!Array.isArray(tags) || tags.some((tag) => !TAGS.includes(tag))) {
    return errorResponse(400, "VALIDATION_ERROR", "알 수 없는 태그입니다.");
  }
  if (new Set(tags).size !== tags.length) {
    return errorResponse(400, "VALIDATION_ERROR", "태그는 중복될 수 없습니다.");
  }

  const content = (body.content ?? "").trim();
  if (content.length < CONTENT_MIN_LENGTH) {
    return errorResponse(
      400,
      "VALIDATION_ERROR",
      `후기는 ${CONTENT_MIN_LENGTH}자 이상 작성해주세요.`,
    );
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    return errorResponse(
      400,
      "VALIDATION_ERROR",
      `후기는 ${CONTENT_MAX_LENGTH}자까지 입력할 수 있습니다.`,
    );
  }

  return null;
};

export const labReviewHandlers = [
  http.get(
    "/api/v1/laboratories/:laboratoryId/reviews",
    async ({ params, request }) => {
      await delay(300);

      const laboratoryId = Number(params.laboratoryId);
      const laboratory = mockLabs.find((lab) => lab.id === laboratoryId);
      if (!laboratory) {
        return errorResponse(
          404,
          "LABORATORY_NOT_FOUND",
          "연구실을 찾을 수 없습니다.",
        );
      }

      const searchParams = new URL(request.url).searchParams;
      const page = Number(searchParams.get("page") ?? 0);
      const size = Number(searchParams.get("size") ?? 20);

      if (
        !Number.isInteger(page) ||
        page < 0 ||
        !Number.isInteger(size) ||
        size < 1 ||
        size > 50
      ) {
        return errorResponse(
          400,
          "INVALID_QUERY_PARAMETER",
          "잘못된 페이지 값입니다.",
        );
      }

      const userId = getUserId(request);

      // 최신순 (createdAt DESC, id DESC)
      const labReviews = reviews
        .filter((review) => review.laboratoryId === laboratoryId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);

      const start = page * size;

      return HttpResponse.json({
        success: true,
        data: {
          laboratory: {
            id: laboratory.id,
            name: laboratory.name,
            professor: {
              id: laboratory.professor.id,
              name: laboratory.professor.name,
            },
            college: laboratory.college,
            department: laboratory.department,
          },
          // 로그인 사용자가 이미 이 랩실에 후기를 썼는지. 비로그인이면 false.
          reviewedByMe: userId
            ? labReviews.some((review) => review.authorId === userId)
            : false,
          reviews: labReviews.slice(start, start + size).map(toPublicReview),
          page,
          size,
          totalElements: labReviews.length,
          hasNext: start + size < labReviews.length,
        },
        error: null,
      });
    },
  ),

  /* ─────────── 후기 작성 ─────────── */
  http.post(
    "/api/v1/laboratories/:laboratoryId/reviews",
    async ({ params, request }) => {
      await delay(300);

      const userId = getUserId(request);
      if (!userId) {
        return errorResponse(
          401,
          "ACCESS_TOKEN_INVALID",
          "유효하지 않은 인증 토큰입니다.",
        );
      }

      const laboratoryId = Number(params.laboratoryId);
      if (!mockLabs.some((lab) => lab.id === laboratoryId)) {
        return errorResponse(
          404,
          "LABORATORY_NOT_FOUND",
          "연구실을 찾을 수 없습니다.",
        );
      }

      // 사용자당 같은 연구실에 후기 하나. (명세 §6.7)
      const alreadyWrote = reviews.some(
        (review) =>
          review.laboratoryId === laboratoryId && review.authorId === userId,
      );
      if (alreadyWrote) {
        return errorResponse(
          409,
          "LABORATORY_REVIEW_ALREADY_EXISTS",
          "이미 이 연구실에 후기를 작성했습니다.",
        );
      }

      const body = await request.json();
      const invalid = validateReviewBody(body);
      if (invalid) return invalid;

      const review = {
        id: issueReviewId(),
        laboratoryId,
        authorId: userId,
        category: body.category,
        participationYear: body.participationYear,
        participationTerm: body.participationTerm,
        researchIntensity: body.researchIntensity,
        compensation: body.compensation,
        atmosphere: body.atmosphere,
        tags: body.tags ?? [],
        content: body.content.trim(),
        createdAt: toApiDateTime(new Date()),
      };

      reviews.push(review);

      return HttpResponse.json(
        { success: true, data: { reviewId: review.id }, error: null },
        { status: 201 },
      );
    },
  ),
];
