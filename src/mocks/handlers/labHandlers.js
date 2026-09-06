import { http, HttpResponse } from "msw";
import { mockLabs } from "../mockLabs";
import { countReviews } from "../mockReviews";

/**
 * 연구실 목록.
 *
 * 커뮤니티 랩실 평가 탭이 이 API에 정렬·페이징·reviewCount를 얹어 씁니다.
 * 다만 연구실 검색 화면은 예전처럼 query 없이 전체 목록을 받아가므로,
 * **query가 하나도 없으면 기존 동작을 그대로 유지**합니다. (명세 §6.4 하위 호환)
 */

const SORTS = ["REVIEW_COUNT_DESC"];

const errorResponse = (status, code, message) =>
  HttpResponse.json(
    {
      success: false,
      data: null,
      error: { code, message, fieldErrors: [], traceId: null },
    },
    { status },
  );

/** 후기 수는 저장값이 아니라 후기에서 집계합니다. */
const withReviewCount = (lab) => ({
  ...lab,
  reviewCount: countReviews(lab.id),
});

export const labHandlers = [
  http.get("/api/v1/laboratories", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const hasQuery =
      params.has("sort") || params.has("page") || params.has("size");

    // 기존 호출: 전체 목록을 그대로 반환합니다.
    if (!hasQuery) {
      return HttpResponse.json({
        success: true,
        data: { laboratories: mockLabs.map(withReviewCount) },
        error: null,
      });
    }

    const sort = params.get("sort") ?? "REVIEW_COUNT_DESC";
    const page = Number(params.get("page") ?? 0);
    const size = Number(params.get("size") ?? 20);

    if (!SORTS.includes(sort)) {
      return errorResponse(
        400,
        "INVALID_QUERY_PARAMETER",
        "잘못된 정렬 조건입니다.",
      );
    }
    if (!Number.isInteger(page) || page < 0) {
      return errorResponse(
        400,
        "INVALID_QUERY_PARAMETER",
        "잘못된 페이지 번호입니다.",
      );
    }
    if (!Number.isInteger(size) || size < 1 || size > 50) {
      return errorResponse(
        400,
        "INVALID_QUERY_PARAMETER",
        "size는 1에서 50 사이여야 합니다.",
      );
    }

    // reviewCount DESC, id DESC (명세 §6.4)
    const sorted = mockLabs
      .map(withReviewCount)
      .sort((a, b) => b.reviewCount - a.reviewCount || b.id - a.id);

    const start = page * size;

    return HttpResponse.json({
      success: true,
      data: {
        laboratories: sorted.slice(start, start + size),
        page,
        size,
        totalElements: sorted.length,
        hasNext: start + size < sorted.length,
      },
      error: null,
    });
  }),
];
