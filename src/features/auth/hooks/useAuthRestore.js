import { useEffect, useRef } from "react";
import { useAuthStore } from "../../../store/authStore";
import { refreshToken, fetchMe } from "../api/authApi";

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

        const { ok: meOk, result: meResult } = await fetchMe();
        if (!meOk || !meResult.success) {
          clearAuth();
          return;
        }

        setAuth(accessToken, meResult.data);
      } catch {
        clearAuth();
      }
    };

    restore();
  }, [setAuth, clearAuth]);
}
