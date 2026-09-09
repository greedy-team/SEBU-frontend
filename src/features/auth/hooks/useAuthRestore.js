import { useEffect, useRef } from "react";
import { useAuthStore } from "../../../store/authStore";
import { fetchMe, refreshToken, initCsrf } from "../api/authApi";

export function useAuthRestore() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const restore = async () => {
      try {
        // 1. CSRF 초기화
        await initCsrf();

        // 2. /me 먼저 호출
        const { ok: meOk, result: meResult } = await fetchMe();

        if (meOk && meResult.success) {
          setAuth(meResult.data);
          return;
        }

        // 3. /me 실패(401) → refresh 호출
        const { ok: refreshOk, result: refreshResult } = await refreshToken();
        if (!refreshOk || !refreshResult.success) {
          clearAuth();
          return;
        }

        // 4. refresh 성공 → 다시 /me 호출
        const { ok: meOk2, result: meResult2 } = await fetchMe();
        if (!meOk2 || !meResult2.success) {
          clearAuth();
          return;
        }

        setAuth(meResult2.data);
      } catch {
        clearAuth();
      }
    };

    restore();
  }, [setAuth, clearAuth]);
}
