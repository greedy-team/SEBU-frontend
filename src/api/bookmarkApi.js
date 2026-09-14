import client from "./client";

// 연구실 북마크 추가
export const addLabBookmark = async (laboratoryId) => {
  try {
    await client.put(`/laboratories/${laboratoryId}/bookmark`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

// 연구실 북마크 삭제
export const removeLabBookmark = async (laboratoryId) => {
  try {
    await client.delete(`/laboratories/${laboratoryId}/bookmark`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      result: error.response?.data ?? {
        error: { message: "네트워크 오류가 발생했습니다." },
      },
    };
  }
};

// 북마크한 연구실 조회
export const getBookmarkedLabs = async () => {
  try {
    const response = await client.get("/users/me/bookmarked-laboratories");
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
