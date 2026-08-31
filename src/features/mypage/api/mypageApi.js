import client from "../../../api/client";

export const getMyPage = async () => {
  try {
    const response = await client.get("/users/me/mypage");
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

export const updateProfile = async (profileData) => {
  try {
    const response = await client.put("/users/me/profile", {
      name: profileData.name,
      grade: profileData.grade,
      major: profileData.major,
      gpaBand: profileData.gpaBand,
      introduction: profileData.introduction,
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
