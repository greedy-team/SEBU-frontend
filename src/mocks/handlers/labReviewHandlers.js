import { http, HttpResponse, delay } from "msw";
import { mockLabs } from "../mockLabs";
import { mockReviews, MOCK_REVIEW_AUTHOR_ID } from "../mockReviews";

/**
 * 랩실 후기 (커뮤니티 랩실 평가).
 *
 * 랩실 도메인과 커뮤니티 도메인이 만나는 지점이라 파일을 따로 뒀습니다.
 * 기준은 랩실 평가 v2 — 별점이 없고, 후기 수정·삭제 API도 없습니다.
 *
 * 공개 응답에는 작성자 정보를 절대 넣지 않습니다. (명세 §6.5)
 * mock의 authorId는 reviewedByMe 계산과 중복 작성 차단에만 씁니다.
 */

const reviews = [...mockReviews];

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
];
