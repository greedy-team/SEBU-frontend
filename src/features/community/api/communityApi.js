import client from "../../../api/client";

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

  try {
    const response = await client.get(`/posts?${params}`);
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const getPopularPosts = async () =>
  getPosts({ sort: "POPULAR", page: 0, size: 4 });

export const getPost = async (postId) => {
  try {
    const response = await client.get(`/posts/${postId}`);
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const getComments = async (postId, { page = 0, size = 20 } = {}) => {
  try {
    const response = await client.get(
      `/posts/${postId}/comments?page=${page}&size=${size}`,
    );
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const createComment = async (postId, content) => {
  try {
    const response = await client.post(`/posts/${postId}/comments`, {
      content,
    });
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const updateComment = async (postId, commentId, content) => {
  try {
    const response = await client.patch(
      `/posts/${postId}/comments/${commentId}`,
      { content },
    );
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    const response = await client.delete(
      `/posts/${postId}/comments/${commentId}`,
    );
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const toggleLike = async (postId, liked) => {
  try {
    const response = await client[liked ? "put" : "delete"](
      `/posts/${postId}/likes`,
    );
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const toggleBookmark = async (postId, bookmarked) => {
  try {
    const response = await client[bookmarked ? "put" : "delete"](
      `/posts/${postId}/bookmarks`,
    );
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const createPost = async (body) => {
  try {
    const response = await client.post("/posts", body);
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const updatePost = async (postId, body) => {
  try {
    const response = await client.put(`/posts/${postId}`, body);
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await client.delete(`/posts/${postId}`);
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const getLabs = async ({ page = 0, size = 20 } = {}) => {
  try {
    const response = await client.get(
      `/laboratories?sort=REVIEW_COUNT_DESC&page=${page}&size=${size}`,
    );
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const getLabReviews = async (
  laboratoryId,
  { page = 0, size = 20 } = {},
) => {
  try {
    const response = await client.get(
      `/laboratories/${laboratoryId}/reviews?page=${page}&size=${size}`,
    );
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

export const createLabReview = async (laboratoryId, body) => {
  try {
    const response = await client.post(
      `/laboratories/${laboratoryId}/reviews`,
      body,
    );
    return { ok: true, result: response.data };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};
