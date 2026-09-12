import client from "../../../api/client";

/**
 * 공개 목록 조회.
 *
 * 만료되었거나 잘못된 access_token 쿠키가 함께 전송되면 공개 GET도 401이 납니다.
 * 그때는 쿠키를 빼고 한 번만 다시 부릅니다. (명세 5절)
 */
const getPublic = async (url, config = {}) => {
  try {
    return await client.get(url, config);
  } catch (error) {
    if (error.response?.status === 401) {
      return client.get(url, { ...config, withCredentials: false });
    }
    throw error;
  }
};

/** 메인보드 최신글 5개. (명세 1절) */
export async function fetchLatestPosts() {
  const response = await getPublic("/posts", {
    params: { sort: "LATEST", page: 0, size: 5 },
  });
  return response.data.data.posts ?? [];
}

/** 단과대학 목록. (명세 2절) */
export async function fetchColleges() {
  const response = await getPublic("/colleges");
  return response.data.data.colleges ?? [];
}
