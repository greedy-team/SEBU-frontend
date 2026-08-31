import { http, HttpResponse, delay } from "msw";
import { mockPosts } from "../mockPosts";

/**
 * 커뮤니티 MSW 핸들러.
 *
 * 실제 서버가 하는 일을 그대로 흉내냅니다.
 *  - 필터·정렬·페이징을 여기서 처리하고 FE는 받은 순서대로 표시만 합니다.
 *  - HOT/NEW 배지는 저장값이 아니라 매 요청마다 계산합니다.
 *  - nickname이 null이면 응답에서만 "익명"으로 바꿉니다.
 *  - bookmarkCount는 정렬에만 쓰고 응답에는 넣지 않습니다.
 * (COMMUNITY_API.md §1, §2 참고)
 */

const POPULAR_SIZE = 4;
const ONE_DAY = 24 * 60 * 60 * 1000;

const CATEGORIES = ["FREE", "QUESTION"];
const SORTS = ["LATEST", "POPULAR"];

const errorResponse = (status, code, message) =>
  HttpResponse.json(
    {
      success: false,
      data: null,
      error: { code, message, fieldErrors: [], traceId: null },
    },
    { status },
  );

/** 최신순: createdAt 내림차순, 같으면 id 내림차순 */
const compareLatest = (a, b) =>
  b.createdAt.localeCompare(a.createdAt) || b.id - a.id;

/** 인기순: 북마크 수 내림차순, 같으면 최신순 */
const comparePopular = (a, b) =>
  b.bookmarkCount - a.bookmarkCount || compareLatest(a, b);

/** 현재 인기 TOP 4의 id — HOT 배지 판정에 씁니다. */
const getHotIds = () =>
  [...mockPosts]
    .sort(comparePopular)
    .slice(0, POPULAR_SIZE)
    .map((p) => p.id);

const isNew = (createdAt) =>
  Date.now() - new Date(createdAt).getTime() < ONE_DAY;

/** mock 데이터 한 건을 목록 응답 형태로 변환합니다. */
const toListItem = (post, hotIds) => {
  const badges = [];
  if (hotIds.includes(post.id)) badges.push("HOT");
  if (isNew(post.createdAt)) badges.push("NEW");

  return {
    id: post.id,
    category: post.category,
    title: post.title,
    author: {
      id: post.author.id,
      nickname: post.author.nickname ?? "익명",
    },
    badges,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    viewCount: post.viewCount,
    createdAt: post.createdAt,
    // bookmarkCount, content는 목록 응답에 포함하지 않습니다.
  };
};

export const communityHandlers = [
  // GET 게시글 목록 (검색·카테고리·정렬·페이징)
  http.get("/api/v1/posts", async ({ request }) => {
    await delay(300);

    const params = new URL(request.url).searchParams;
    const keyword = params.get("keyword")?.trim() ?? "";
    const category = params.get("category");
    const sort = params.get("sort") ?? "LATEST";
    const page = Number(params.get("page") ?? 0);
    const size = Number(params.get("size") ?? 20);

    if (category && !CATEGORIES.includes(category)) {
      return errorResponse(
        400,
        "INVALID_QUERY_PARAMETER",
        "잘못된 카테고리입니다.",
      );
    }
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

    const filtered = mockPosts
      .filter((post) => (category ? post.category === category : true))
      .filter((post) => (keyword ? post.title.includes(keyword) : true));

    const sorted = [...filtered].sort(
      sort === "POPULAR" ? comparePopular : compareLatest,
    );

    const start = page * size;
    const paged = sorted.slice(start, start + size);
    const hotIds = getHotIds();

    return HttpResponse.json({
      success: true,
      data: {
        posts: paged.map((post) => toListItem(post, hotIds)),
        page,
        size,
        totalElements: filtered.length,
        hasNext: start + size < filtered.length,
      },
      error: null,
    });
  }),
];
