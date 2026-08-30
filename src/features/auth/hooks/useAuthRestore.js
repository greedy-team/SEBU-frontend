import { useEffect, useRef } from "react";
import { refreshToken, fetchMe } from "../api/authApi";
import { useAuthStore } from "../../../store/authStore";

/**
 * 웹 진입 시 세션을 한 번 복원합니다.
 *
 *   refresh → 새 Access Token 발급
 *   me      → 사용자 정보 조회
 *   실패    → 조용히 anonymous
 *
 * 왜 2단계인가
 *   refresh 응답에는 accessToken만 있고 user 정보가 없습니다.
 *   그래서 토큰을 받은 뒤 me를 이어서 호출해야 사용자를 알 수 있습니다.
 *
 * 왜 useRef로 막는가
 *   서버가 Refresh Token Rotation 방식이라 refresh를 한 번 쓰면 그 토큰이 즉시 폐기됩니다.
 *   StrictMode는 개발 모드에서 effect를 두 번 실행하는데, 그대로 두면
 *   2차 요청이 이미 폐기된 토큰으로 나가서 401을 받고 로그인이 풀린 것처럼 보입니다.
 *   "페이지 로드당 정확히 한 번"이 필요한 동작이라 ref 가드를 사용합니다.
 *
 * 왜 실패해도 안내하지 않는가
 *   여기서 실패하는 사람 대부분은 그냥 로그인하지 않은 방문자입니다.
 *   에러를 띄우면 처음 온 사람이 영문 모를 경고를 보게 됩니다.
 *   로그인 안내는 북마크처럼 사용자가 직접 행동했을 때만 합니다.
 */
export function useAuthRestore() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const restore = async () => {
      try {
        const { ok: refreshOk, result: refreshResult } = await refreshToken();

        if (!refreshOk || !refreshResult.success) {
          clearAuth();
          return;
        }

        const accessToken = refreshResult.data.accessToken;

        const { ok: meOk, result: meResult } = await fetchMe(accessToken);

        if (!meOk || !meResult.success) {
          clearAuth();
          return;
        }

        // /me 응답은 로그인 API와 달리 data를 user로 감싸지 않습니다.
        // data 자체가 { id, nickname, profileCompleted } 입니다.
        setAuth(accessToken, meResult.data);
      } catch {
        // 네트워크 오류, JSON 파싱 실패 등
        // (MSW를 끄면 백엔드에 이 API가 없어서 여기로 옵니다)
        clearAuth();
      }
    };

    restore();
  }, [setAuth, clearAuth]);
}
