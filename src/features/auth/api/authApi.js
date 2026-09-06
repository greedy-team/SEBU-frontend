import client from "../../../api/client";

export const sejongLogin = async (studentId, password) => {
  try {
    const response = await client.post("/auth/sejong/login", {
      studentId,
      password,
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
