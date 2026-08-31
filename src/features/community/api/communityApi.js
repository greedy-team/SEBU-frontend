/**
 * 커뮤니티 API.
 *
 * 아직 axios 공통 client(#35)가 dev에 없어서 fetch를 씁니다.
 * 반환 형태 { ok, result }는 authApi·mypageApi와 동일한 규칙이에요.
 * client가 머지되면 axios로 바꾸면서 이 형태는 유지합니다.
 */

const request = async (path) => {
  const response = await fetch(path);
  const result = await response.json();
  return { ok: response.ok, result };
};

const notImplemented = (name) => {
  throw new Error(`communityApi.${name}는 아직 구현되지 않았습니다.`);
};

/* ── 커뮤니티 HOME ── */

/**
 * GET /posts — 게시글 목록
 * 값이 없는 파라미터는 아예 보내지 않습니다. 빈 문자열을 보내면
 * 서버가 "빈 문자열로 검색"으로 해석할 수 있어서요.
 */
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

/**
 * 인기글 TOP 4.
 * 별도 엔드포인트가 아니라 목록 API의 정렬 옵션입니다. (명세 §2)
 */
export const getPopularPosts = async () =>
  getPosts({ sort: "POPULAR", page: 0, size: 4 });

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
