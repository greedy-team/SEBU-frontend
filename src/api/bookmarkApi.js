import client from "./client";

// 연구실 북마크 추가
export const addLabBookmark = async (laboratoryId) => {
  await client.put(`/laboratories/${laboratoryId}/bookmark`);
};

// 연구실 북마크 삭제
export const removeLabBookmark = async (laboratoryId) => {
  await client.delete(`/laboratories/${laboratoryId}/bookmark`);
};

// 북마크한 연구실 조회
export const getBookmarkedLabs = async () => {
  const response = await client.get("/users/me/bookmarked-laboratories");
  return response.data.data;
};
