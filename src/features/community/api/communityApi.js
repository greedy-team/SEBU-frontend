/**
 * 커뮤니티 API.
 *
 * 아직 axios 공통 client(#35)가 dev에 없어서 fetch를 씁니다.
 * 반환 형태 { ok, result }는 authApi·mypageApi와 동일한 규칙이에요.
 * accessToken은 인자로 받습니다 (#31에서 정리한 파라미터 전달 방식).
 */

const request = async (path, { method = "GET", body, accessToken } = {}) => {
  const response = await fetch(path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      // 토큰이 없을 때 Authorization을 아예 안 붙입니다.
      // `Bearer null`을 보내면 서버가 "토큰 없음"이 아니라 "잘못된 토큰"으로 처리해요.
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const result = await response.json();
  return { ok: response.ok, result };
};

const notImplemented = (name) => {
  throw new Error(`communityApi.${name}는 아직 구현되지 않았습니다.`);
};

/* ── 커뮤니티 HOME ── */

export const getPosts = async ({
  keyword,
  category,
  sort = "LATEST",
  page = 0,
  size = 20,
} = {}) => {
  const params = new URLSearchParams({ sort, page, size });
  if (keyword) params.set("keyword", keyword);
  if (category) params.set("category", category);

  return request(`/api/v1/posts?${params}`);
};

/** 인기글 TOP 4. 별도 엔드포인트가 아니라 목록 API의 정렬 옵션입니다. (명세 §2) */
export const getPopularPosts = async () =>
  getPosts({ sort: "POPULAR", page: 0, size: 4 });

/* ── 게시글 상세 ── */

/** 인증은 선택. 토큰이 있으면 liked·bookmarked·mine이 계산돼서 옵니다. */
export const getPost = async (postId, accessToken) =>
  request(`/api/v1/posts/${postId}`, { accessToken });

/** 댓글 목록. 인증은 선택이며 토큰이 있으면 mine이 계산돼서 옵니다. */
export const getComments = async (
  postId,
  { page = 0, size = 20 } = {},
  accessToken,
) =>
  request(`/api/v1/posts/${postId}/comments?page=${page}&size=${size}`, {
    accessToken,
  });

/** 댓글 등록. 응답: { comment, commentCount } */
export const createComment = async (postId, content, accessToken) =>
  request(`/api/v1/posts/${postId}/comments`, {
    method: "POST",
    body: { content },
    accessToken,
  });

/** 댓글 수정. 명세는 PATCH입니다(게시글 수정은 PUT). */
export const updateComment = async (postId, commentId, content, accessToken) =>
  request(`/api/v1/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    body: { content },
    accessToken,
  });

/** 댓글 삭제. 응답: { postId, commentId, commentCount } */
export const deleteComment = async (postId, commentId, accessToken) =>
  request(`/api/v1/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    accessToken,
  });

/**
 * 좋아요 등록·해제. 요청 본문은 없고 메서드로 구분합니다. (명세 §3.5)
 * 응답: { liked, likeCount }
 */
export const toggleLike = async (postId, liked, accessToken) =>
  request(`/api/v1/posts/${postId}/likes`, {
    method: liked ? "PUT" : "DELETE",
    accessToken,
  });

/**
 * 북마크 등록·해제.
 * 응답에 개수가 없습니다 — 북마크 수는 화면에 노출하지 않기 때문이에요.
 */
export const toggleBookmark = async (postId, bookmarked, accessToken) =>
  request(`/api/v1/posts/${postId}/bookmarks`, {
    method: bookmarked ? "PUT" : "DELETE",
    accessToken,
  });

/* ── 글 작성 ── */

// POST /posts
export const createPost = async (body) => notImplemented("createPost", body);

// PATCH /posts/{postId}
export const updatePost = async (postId, body) =>
  notImplemented("updatePost", postId, body);

// DELETE /posts/{postId}
export const deletePost = async (postId) =>
  notImplemented("deletePost", postId);

/* ── 랩실 평가 ── */

/**
 * 후기 많은 순 연구실 목록.
 * 연구실 검색 화면이 쓰는 것과 같은 엔드포인트라, 커뮤니티에서는
 * sort·page·size를 붙여서 정렬·페이징 응답을 받습니다. (명세 §6.4)
 */
export const getLabs = async ({ page = 0, size = 20 } = {}) =>
  request(
    `/api/v1/laboratories?sort=REVIEW_COUNT_DESC&page=${page}&size=${size}`,
  );

/** 특정 연구실의 후기 목록. 인증은 선택이며 토큰이 있으면 reviewedByMe가 계산됩니다. */
export const getLabReviews = async (
  laboratoryId,
  { page = 0, size = 20 } = {},
  accessToken,
) =>
  request(
    `/api/v1/laboratories/${laboratoryId}/reviews?page=${page}&size=${size}`,
    {
      accessToken,
    },
  );
