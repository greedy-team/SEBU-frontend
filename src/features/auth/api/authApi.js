export const sejongLogin = async (studentId, password) => {
  const response = await fetch("/api/v1/auth/sejong/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ studentId, password }),
  });

  const result = await response.json();
  return { ok: response.ok, result };
};

/**
 * Access Token 재발급
 *
 * Refresh Token은 HttpOnly 쿠키라 JS가 읽을 수 없습니다.
 * credentials: "include"를 주면 브라우저가 알아서 쿠키를 실어 보냅니다.
 * 이게 없으면 서버는 쿠키를 못 받아 무조건 401을 반환합니다.
 *
 * 주의: 서버가 Rotation 방식이라 호출 한 번에 기존 Refresh Token이 폐기됩니다.
 *       따라서 이 함수는 중복 호출되지 않도록 호출부에서 막아야 합니다.
 *
 * 성공 응답: data = { accessToken, tokenType, expiresIn }  ← user 정보 없음
 */
export const refreshToken = async () => {
  const response = await fetch("/api/v1/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();
  return { ok: response.ok, result };
};

/**
 * 현재 로그인 사용자 조회
 *
 * refresh 응답에는 user 정보가 없어서, 복원할 때 이 API를 이어서 호출해야 합니다.
 * 여기서는 쿠키가 아니라 Access Token으로 인증합니다.
 *
 * 성공 응답: data = { id, nickname, profileCompleted }
 *            ← 로그인 API와 달리 user로 한 겹 감싸져 있지 않습니다
 */
export const fetchMe = async (accessToken) => {
  const response = await fetch("/api/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  const result = await response.json();
  return { ok: response.ok, result };
};

/**
 * 로그아웃
 *
 * 서버가 Refresh Token을 폐기하고 쿠키를 삭제합니다.
 * 이미 만료됐거나 없는 토큰이어도 서버는 성공으로 응답합니다.
 */
export const logout = async () => {
  const response = await fetch("/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();
  return { ok: response.ok, result };
};
