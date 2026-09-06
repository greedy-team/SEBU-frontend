import { http, HttpResponse, delay } from "msw";
import { mockPosts, MOCK_USER } from "../mockPosts";
import { mockComments } from "../mockComments";
import { toApiDateTime } from "../mockTime";

/**
 * 커뮤니티 MSW 핸들러.
 *
 * 실제 서버가 하는 일을 그대로 흉내냅니다.
 *  - 필터·정렬·페이징을 여기서 처리하고 FE는 받은 순서대로 표시만 합니다.
 *  - HOT/NEW 배지, mine, liked/bookmarked는 저장값이 아니라 매 요청마다 계산합니다.
 *  - nickname이 null이면 응답에서만 "익명"으로 바꿉니다.
 *  - bookmarkCount는 정렬에만 쓰고 응답에는 넣지 않습니다.
 * (COMMUNITY_API.md §1~§3 참고)
 */

const POPULAR_SIZE = 4;
const ONE_DAY = 24 * 60 * 60 * 1000;
const CATEGORIES = ["FREE", "QUESTION"];
const SORTS = ["LATEST", "POPULAR"];
const COMMENT_MAX_LENGTH = 500;
const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 2000;

/* ────────────────────────────────────────────
   세션 동안 변하는 상태 = mock의 DB 역할.
   새로고침하면 초기값으로 돌아갑니다.
   ──────────────────────────────────────────── */
const comments = [...mockComments];
// 게시글도 작성·수정·삭제가 생겨서 원본이 아니라 복사본을 씁니다.
// mockPosts.js는 초기값 파일로 두고, 세션 중 변경은 여기서만 일어나요.
const posts = [...mockPosts];
const deletedPostIds = new Set();
const viewCounts = new Map(mockPosts.map((post) => [post.id, post.viewCount]));
const likeCounts = new Map(mockPosts.map((post) => [post.id, post.likeCount]));
const bookmarkCounts = new Map(
  mockPosts.map((post) => [post.id, post.bookmarkCount]),
);
const likedPostIds = new Set();
const bookmarkedPostIds = new Set();
let nextCommentId = 9001;
let nextPostId = 501; // 명세 §4 응답 예시와 맞췄습니다

/* ── 공통 헬퍼 ── */

const errorResponse = (status, code, message) =>
  HttpResponse.json(
    {
      success: false,
      data: null,
      error: { code, message, fieldErrors: [], traceId: null },
    },
    { status },
  );

const okResponse = (data) =>
  HttpResponse.json({ success: true, data, error: null });

/** 생성 성공은 200이 아니라 201입니다. (명세 §4) */
const createdResponse = (data) =>
  HttpResponse.json({ success: true, data, error: null }, { status: 201 });

/** 토큰이 있으면 로그인 사용자로 봅니다. 없으면 비로그인. */
const getUser = (request) => {
  const token = request.headers.get("Authorization");
  return token && token.startsWith("Bearer ") ? MOCK_USER : null;
};

/** 삭제되지 않은 게시글만. 목록·정렬·상세가 모두 이걸 씁니다. */
const livePosts = () => posts.filter((post) => !deletedPostIds.has(post.id));

/**
 * 삭제된 글은 "찾지 못한 것"으로 봅니다.
 * 명세 §1 — 삭제된 자원의 상세·수정·삭제, 두 번째 DELETE는 모두 404입니다.
 */
const findPost = (postId) => livePosts().find((post) => post.id === postId);

const countComments = (postId) =>
  comments.filter((comment) => comment.postId === postId).length;

/** 공개 응답용 작성자. 닉네임 미설정이면 "익명". (명세 §5.1) */
const toPublicAuthor = (author) => ({
  id: author.id,
  nickname: author.nickname ?? "익명",
});

/* ── 정렬·배지 ── */

const compareLatest = (a, b) =>
  b.createdAt.localeCompare(a.createdAt) || b.id - a.id;

const comparePopular = (a, b) =>
  bookmarkCounts.get(b.id) - bookmarkCounts.get(a.id) || compareLatest(a, b);

const getHotIds = () =>
  livePosts()
    .sort(comparePopular)
    .slice(0, POPULAR_SIZE)
    .map((post) => post.id);

const isNew = (createdAt) =>
  Date.now() - new Date(createdAt).getTime() < ONE_DAY;

const getBadges = (post, hotIds) => {
  const badges = [];
  if (hotIds.includes(post.id)) badges.push("HOT");
  if (isNew(post.createdAt)) badges.push("NEW");
  return badges;
};

/* ── 응답 변환 ── */

const toListItem = (post, hotIds) => ({
  id: post.id,
  category: post.category,
  title: post.title,
  author: toPublicAuthor(post.author),
  badges: getBadges(post, hotIds),
  likeCount: likeCounts.get(post.id),
  commentCount: countComments(post.id),
  viewCount: viewCounts.get(post.id),
  createdAt: post.createdAt,
  // bookmarkCount, content는 목록 응답에 포함하지 않습니다.
});

const toComment = (comment, user) => ({
  id: comment.id,
  author: toPublicAuthor(comment.author),
  content: comment.content,
  mine: user?.id === comment.author.id,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
});

/** 댓글 본문 검증. 통과하면 null, 아니면 에러 응답을 돌려줍니다. */
const validateCommentContent = (content) => {
  const trimmed = (content ?? "").trim();
  if (!trimmed) {
    return errorResponse(400, "VALIDATION_ERROR", "댓글 내용을 입력해주세요.");
  }
  if (trimmed.length > COMMENT_MAX_LENGTH) {
    return errorResponse(
      400,
      "VALIDATION_ERROR",
      `댓글은 ${COMMENT_MAX_LENGTH}자까지 입력할 수 있습니다.`,
    );
  }
  return null;
};

/**
 * 게시글 입력 검증. 통과하면 null, 아니면 에러 응답을 돌려줍니다. (명세 §4)
 * 작성·수정이 같은 규칙이라 한 곳에 둡니다.
 */
const validatePostBody = ({ category, title, content } = {}) => {
  if (!CATEGORIES.includes(category)) {
    return errorResponse(400, "VALIDATION_ERROR", "카테고리를 선택해주세요.");
  }

  const trimmedTitle = (title ?? "").trim();
  if (!trimmedTitle) {
    return errorResponse(400, "VALIDATION_ERROR", "제목을 입력해주세요.");
  }
  if (trimmedTitle.length > TITLE_MAX_LENGTH) {
    return errorResponse(
      400,
      "VALIDATION_ERROR",
      `제목은 ${TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`,
    );
  }

  const trimmedContent = (content ?? "").trim();
  if (!trimmedContent) {
    return errorResponse(400, "VALIDATION_ERROR", "내용을 입력해주세요.");
  }
  if (trimmedContent.length > CONTENT_MAX_LENGTH) {
    return errorResponse(
      400,
      "VALIDATION_ERROR",
      `내용은 ${CONTENT_MAX_LENGTH}자까지 입력할 수 있습니다.`,
    );
  }

  return null;
};

export const communityHandlers = [
  /* ─────────── 게시글 목록 ─────────── */
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

    const filtered = livePosts()
      .filter((post) => (category ? post.category === category : true))
      .filter((post) => (keyword ? post.title.includes(keyword) : true));

    const sorted = [...filtered].sort(
      sort === "POPULAR" ? comparePopular : compareLatest,
    );

    const start = page * size;
    const paged = sorted.slice(start, start + size);
    const hotIds = getHotIds();

    return okResponse({
      posts: paged.map((post) => toListItem(post, hotIds)),
      page,
      size,
      totalElements: filtered.length,
      hasNext: start + size < filtered.length,
    });
  }),

  /* ─────────── 게시글 상세 ─────────── */
  http.get("/api/v1/posts/:postId", async ({ params, request }) => {
    await delay(300);

    const postId = Number(params.postId);
    const post = findPost(postId);
    if (!post) {
      return errorResponse(404, "POST_NOT_FOUND", "게시글을 찾을 수 없습니다.");
    }

    // 명세 §3.1 — 조회수는 상세 조회의 부수효과입니다.
    const viewCount = viewCounts.get(postId) + 1;
    viewCounts.set(postId, viewCount);

    const user = getUser(request);

    return okResponse({
      post: {
        id: post.id,
        category: post.category,
        title: post.title,
        content: post.content,
        author: toPublicAuthor(post.author),
        badges: getBadges(post, getHotIds()),
        viewCount,
        likeCount: likeCounts.get(postId),
        commentCount: countComments(postId),
        liked: user ? likedPostIds.has(postId) : false,
        bookmarked: user ? bookmarkedPostIds.has(postId) : false,
        mine: user?.id === post.author.id,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt ?? post.createdAt,
      },
    });
  }),

  /* ─────────── 게시글 작성 ─────────── */
  http.post("/api/v1/posts", async ({ request }) => {
    await delay(300);

    const user = getUser(request);
    if (!user) {
      return errorResponse(
        401,
        "ACCESS_TOKEN_INVALID",
        "유효하지 않은 인증 토큰입니다.",
      );
    }

    const body = await request.json();
    const invalid = validatePostBody(body);
    if (invalid) return invalid;

    const now = toApiDateTime(new Date());
    const post = {
      id: nextPostId++,
      category: body.category,
      title: body.title.trim(),
      content: body.content.trim(),
      author: { ...user },
      createdAt: now,
      updatedAt: now,
    };

    posts.push(post);
    // 카운터는 별도 Map이 원본이라 여기서 같이 채워줘야 합니다.
    viewCounts.set(post.id, 0);
    likeCounts.set(post.id, 0);
    bookmarkCounts.set(post.id, 0);

    return createdResponse({ postId: post.id });
  }),

  /* ─────────── 게시글 수정 ─────────── */
  // 명세 §3.6 — 댓글은 PATCH지만 게시글은 PUT이고 3개 필드를 전부 받습니다.
  http.put("/api/v1/posts/:postId", async ({ params, request }) => {
    await delay(300);

    const user = getUser(request);
    if (!user) {
      return errorResponse(
        401,
        "ACCESS_TOKEN_INVALID",
        "유효하지 않은 인증 토큰입니다.",
      );
    }

    const postId = Number(params.postId);
    const post = findPost(postId);
    if (!post) {
      return errorResponse(404, "POST_NOT_FOUND", "게시글을 찾을 수 없습니다.");
    }
    if (post.author.id !== user.id) {
      return errorResponse(
        403,
        "POST_FORBIDDEN",
        "본인이 작성한 글만 수정할 수 있습니다.",
      );
    }

    const body = await request.json();
    const invalid = validatePostBody(body);
    if (invalid) return invalid;

    post.category = body.category;
    post.title = body.title.trim();
    post.content = body.content.trim();
    post.updatedAt = toApiDateTime(new Date());

    return okResponse({ postId: post.id, updatedAt: post.updatedAt });
  }),

  /* ─────────── 게시글 삭제 ─────────── */
  http.delete("/api/v1/posts/:postId", async ({ params, request }) => {
    await delay(300);

    const user = getUser(request);
    if (!user) {
      return errorResponse(
        401,
        "ACCESS_TOKEN_INVALID",
        "유효하지 않은 인증 토큰입니다.",
      );
    }

    const postId = Number(params.postId);
    const post = findPost(postId);
    // 이미 지운 글을 또 지우면 여기서 걸립니다. (명세 §1)
    if (!post) {
      return errorResponse(404, "POST_NOT_FOUND", "게시글을 찾을 수 없습니다.");
    }
    if (post.author.id !== user.id) {
      return errorResponse(
        403,
        "POST_FORBIDDEN",
        "본인이 작성한 글만 삭제할 수 있습니다.",
      );
    }

    // 소프트 삭제 — 배열에서 빼지 않고 표시만 합니다.
    deletedPostIds.add(postId);

    return okResponse({ postId });
  }),

  /* ─────────── 댓글 목록 ─────────── */
  http.get("/api/v1/posts/:postId/comments", async ({ params, request }) => {
    await delay(200);

    const postId = Number(params.postId);
    if (!findPost(postId)) {
      return errorResponse(404, "POST_NOT_FOUND", "게시글을 찾을 수 없습니다.");
    }

    const searchParams = new URL(request.url).searchParams;
    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 20);
    const user = getUser(request);

    // 댓글은 작성 순(오래된 것부터)입니다. DB 인덱스도 (post_id, created_at, id) 오름차순.
    const postComments = comments
      .filter((comment) => comment.postId === postId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id - b.id);

    const start = page * size;
    const paged = postComments.slice(start, start + size);

    return okResponse({
      comments: paged.map((comment) => toComment(comment, user)),
      page,
      size,
      totalElements: postComments.length,
      hasNext: start + size < postComments.length,
    });
  }),

  /* ─────────── 댓글 등록 ─────────── */
  http.post("/api/v1/posts/:postId/comments", async ({ params, request }) => {
    await delay(300);

    const user = getUser(request);
    if (!user) {
      return errorResponse(
        401,
        "ACCESS_TOKEN_INVALID",
        "유효하지 않은 인증 토큰입니다.",
      );
    }

    const postId = Number(params.postId);
    if (!findPost(postId)) {
      return errorResponse(404, "POST_NOT_FOUND", "게시글을 찾을 수 없습니다.");
    }

    const body = await request.json();
    const invalid = validateCommentContent(body.content);
    if (invalid) return invalid;

    const now = toApiDateTime(new Date());
    const comment = {
      id: nextCommentId++,
      postId,
      author: user,
      content: body.content.trim(),
      createdAt: now,
      updatedAt: now,
    };
    comments.push(comment);

    return HttpResponse.json(
      {
        success: true,
        data: {
          comment: toComment(comment, user),
          commentCount: countComments(postId),
        },
        error: null,
      },
      { status: 201 },
    );
  }),

  /* ─────────── 댓글 수정 ─────────── */
  http.patch(
    "/api/v1/posts/:postId/comments/:commentId",
    async ({ params, request }) => {
      await delay(300);

      const user = getUser(request);
      if (!user) {
        return errorResponse(
          401,
          "ACCESS_TOKEN_INVALID",
          "유효하지 않은 인증 토큰입니다.",
        );
      }

      const postId = Number(params.postId);
      const commentId = Number(params.commentId);
      const comment = comments.find(
        (item) => item.id === commentId && item.postId === postId,
      );
      if (!comment) {
        return errorResponse(
          404,
          "COMMENT_NOT_FOUND",
          "댓글을 찾을 수 없습니다.",
        );
      }
      if (comment.author.id !== user.id) {
        return errorResponse(
          403,
          "COMMENT_FORBIDDEN",
          "댓글을 수정할 권한이 없습니다.",
        );
      }

      const body = await request.json();
      const invalid = validateCommentContent(body.content);
      if (invalid) return invalid;

      comment.content = body.content.trim();
      comment.updatedAt = toApiDateTime(new Date());

      return okResponse({
        commentId: comment.id,
        content: comment.content,
        updatedAt: comment.updatedAt,
      });
    },
  ),

  /* ─────────── 댓글 삭제 ─────────── */
  http.delete(
    "/api/v1/posts/:postId/comments/:commentId",
    async ({ params, request }) => {
      await delay(300);

      const user = getUser(request);
      if (!user) {
        return errorResponse(
          401,
          "ACCESS_TOKEN_INVALID",
          "유효하지 않은 인증 토큰입니다.",
        );
      }

      const postId = Number(params.postId);
      const commentId = Number(params.commentId);
      const index = comments.findIndex(
        (item) => item.id === commentId && item.postId === postId,
      );
      if (index === -1) {
        return errorResponse(
          404,
          "COMMENT_NOT_FOUND",
          "댓글을 찾을 수 없습니다.",
        );
      }
      if (comments[index].author.id !== user.id) {
        return errorResponse(
          403,
          "COMMENT_FORBIDDEN",
          "댓글을 삭제할 권한이 없습니다.",
        );
      }

      // 실제 서버는 deleted_at을 기록하는 소프트 삭제지만,
      // mock은 조회에서 제외되기만 하면 되므로 배열에서 뺍니다.
      comments.splice(index, 1);

      return okResponse({
        postId,
        commentId,
        commentCount: countComments(postId),
      });
    },
  ),

  /* ─────────── 좋아요 ─────────── */
  http.put("/api/v1/posts/:postId/likes", async ({ params, request }) => {
    await delay(200);

    const user = getUser(request);
    if (!user) {
      return errorResponse(
        401,
        "ACCESS_TOKEN_INVALID",
        "유효하지 않은 인증 토큰입니다.",
      );
    }

    const postId = Number(params.postId);
    if (!findPost(postId)) {
      return errorResponse(404, "POST_NOT_FOUND", "게시글을 찾을 수 없습니다.");
    }

    // 멱등 — 이미 눌러둔 상태면 숫자를 또 올리지 않습니다.
    if (!likedPostIds.has(postId)) {
      likedPostIds.add(postId);
      likeCounts.set(postId, likeCounts.get(postId) + 1);
    }

    return okResponse({ liked: true, likeCount: likeCounts.get(postId) });
  }),

  http.delete("/api/v1/posts/:postId/likes", async ({ params, request }) => {
    await delay(200);

    const user = getUser(request);
    if (!user) {
      return errorResponse(
        401,
        "ACCESS_TOKEN_INVALID",
        "유효하지 않은 인증 토큰입니다.",
      );
    }

    const postId = Number(params.postId);
    if (!findPost(postId)) {
      return errorResponse(404, "POST_NOT_FOUND", "게시글을 찾을 수 없습니다.");
    }

    if (likedPostIds.has(postId)) {
      likedPostIds.delete(postId);
      likeCounts.set(postId, likeCounts.get(postId) - 1);
    }

    return okResponse({ liked: false, likeCount: likeCounts.get(postId) });
  }),

  /* ─────────── 북마크 ─────────── */
  http.put("/api/v1/posts/:postId/bookmarks", async ({ params, request }) => {
    await delay(200);

    const user = getUser(request);
    if (!user) {
      return errorResponse(
        401,
        "ACCESS_TOKEN_INVALID",
        "유효하지 않은 인증 토큰입니다.",
      );
    }

    const postId = Number(params.postId);
    if (!findPost(postId)) {
      return errorResponse(404, "POST_NOT_FOUND", "게시글을 찾을 수 없습니다.");
    }

    if (!bookmarkedPostIds.has(postId)) {
      bookmarkedPostIds.add(postId);
      bookmarkCounts.set(postId, bookmarkCounts.get(postId) + 1);
    }

    // 명세 §3.5 — 북마크 응답에는 개수가 없습니다.
    return okResponse({ bookmarked: true });
  }),

  http.delete(
    "/api/v1/posts/:postId/bookmarks",
    async ({ params, request }) => {
      await delay(200);

      const user = getUser(request);
      if (!user) {
        return errorResponse(
          401,
          "ACCESS_TOKEN_INVALID",
          "유효하지 않은 인증 토큰입니다.",
        );
      }

      const postId = Number(params.postId);
      if (!findPost(postId)) {
        return errorResponse(
          404,
          "POST_NOT_FOUND",
          "게시글을 찾을 수 없습니다.",
        );
      }

      if (bookmarkedPostIds.has(postId)) {
        bookmarkedPostIds.delete(postId);
        bookmarkCounts.set(postId, bookmarkCounts.get(postId) - 1);
      }

      return okResponse({ bookmarked: false });
    },
  ),
];
