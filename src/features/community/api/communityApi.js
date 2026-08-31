/**
 * 커뮤니티 API 함수 껍데기.
 *
 * 이 이슈(#37)에서는 실제 HTTP 호출을 넣지 않습니다.
 *   - 현재 dev에는 공통 axios client(src/api/client.js)가 아직 없습니다. (PR #35 대기)
 *   - API 응답 구조에 의존하는 코드를 만들지 않는 것이 이 이슈의 방침입니다.
 *
 * 후속 이슈에서 담당자가 각자 맡은 함수의 본문만 채우면 됩니다.
 * 엔드포인트는 커뮤니티 API 명세 기준이며, 확정 명세와 다르면 그때 맞춰주세요.
 */

const notImplemented = (name) => {
  throw new Error(`communityApi.${name}는 아직 구현되지 않았습니다.`);
};

/* ── 커뮤니티 HOME ── */

// GET /posts — 게시글 목록 (카테고리·검색·정렬·페이징)
export const getPosts = async (query) => notImplemented("getPosts", query);

// GET /posts/popular — 인기글 TOP 4
export const getPopularPosts = async () => notImplemented("getPopularPosts");

/* ── 게시글 상세 ── */

// GET /posts/{postId}
export const getPost = async (postId) => notImplemented("getPost", postId);

// GET /posts/{postId}/comments
export const getComments = async (postId) =>
  notImplemented("getComments", postId);

// POST /posts/{postId}/comments
export const createComment = async (postId, body) =>
  notImplemented("createComment", postId, body);

// DELETE /comments/{commentId}
export const deleteComment = async (commentId) =>
  notImplemented("deleteComment", commentId);

// POST / DELETE /posts/{postId}/likes
export const toggleLike = async (postId, liked) =>
  notImplemented("toggleLike", postId, liked);

// POST / DELETE /posts/{postId}/bookmarks
export const toggleBookmark = async (postId, bookmarked) =>
  notImplemented("toggleBookmark", postId, bookmarked);

/* ── 글 작성 ── */

// POST /posts
export const createPost = async (body) => notImplemented("createPost", body);

// PATCH /posts/{postId}
export const updatePost = async (postId, body) =>
  notImplemented("updatePost", postId, body);

// DELETE /posts/{postId}
export const deletePost = async (postId) =>
  notImplemented("deletePost", postId);
