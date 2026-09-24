import client from "../../../api/client";

export const getMyPage = async () => {
  const response = await client.get("/users/me/mypage");
  return response.data.data; // throw 방식으로 변경
};

export const updateProfile = async (profileData) => {
  const response = await client.put("/users/me/profile", {
    grade: profileData.grade,
    gpaBand: profileData.gpaBand,
    introduction: profileData.introduction,
  });
  return response.data.data;
};

export const deleteAccount = async () => {
  await client.delete("/users/me");
};
