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

export const refreshToken = async () => {
  try {
    const response = await client.post("/auth/refresh");
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

export const fetchMe = async () => {
  try {
    const response = await client.get("/me");
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
// CSRF 초기화
export const initCsrf = async () => {
  try {
    await client.get("/auth/csrf");
  } catch (error) {
    // 실패해도 조용히 넘어감
  }
};

// 로그아웃
export const logout = async () => {
  try {
    const response = await client.post("/auth/logout");
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
