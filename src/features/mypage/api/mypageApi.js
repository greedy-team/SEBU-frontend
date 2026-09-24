import client from "../../../api/client";

export const getMyPage = async () => {
  const response = await client.get("/users/me/mypage");
  return response.data.data; // throw 방식으로 변경
};

export const updateProfile = async (profileData) => {
  try {
    const response = await client.put("/users/me/profile", {
      grade: profileData.grade,
      gpaBand: profileData.gpaBand,
      introduction: profileData.introduction,
    });
    return response.data.data;
  } catch (error) {
    const err = new Error(
      error.response?.data?.error?.message || "저장에 실패했습니다.",
    );
    err.code = error.response?.data?.error?.code;
    err.fieldErrors = error.response?.data?.error?.fieldErrors;
    throw err;
  }
};

export const deleteAccount = async () => {
  await client.delete("/users/me");
};
