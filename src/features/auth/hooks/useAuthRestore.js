import { useEffect, useRef } from "react";
import { useAuthStore } from "../../../store/authStore";
import { fetchMe, refreshToken } from "../api/authApi";

export function useAuthRestore() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const restore = async () => {
      try {
        // 1. /me 먼저 호출 (accessToken 쿠키 자동으로 붙어서 날아감)
        const { ok: meOk, result: meResult } = await fetchMe();

        if (meOk && meResult.success) {
          // accessToken 아직 유효 → 유저 정보만 저장
          setAuth(meResult.data);
          return;
        }

        // 2. /me 실패(401) → accessToken 만료 → refresh 호출
        const { ok: refreshOk, result: refreshResult } = await refreshToken();
        if (!refreshOk || !refreshResult.success) {
          clearAuth();
          return;
        }

        // 3. refresh 성공 → 다시 /me 호출
        const { ok: meOk2, result: meResult2 } = await fetchMe();
        if (!meOk2 || !meResult2.success) {
          clearAuth();
          return;
        }

        setAuth(meResult2.data); // accessToken null (쿠키로 관리)
      } catch {
        clearAuth();
      }
    };

    restore();
  }, [setAuth, clearAuth]);
}
