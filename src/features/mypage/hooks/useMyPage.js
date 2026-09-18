import { useState, useEffect } from "react";
import { getMyPage } from "../api/mypageApi";
import { useAuthStore } from "../../../store/authStore";

export function useMyPage() {
  const status = useAuthStore((state) => state.status);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // authRestore 완료 전까지 대기
    if (status === "loading") return;

    // 비로그인 상태면 fetch 안 함
    if (status === "anonymous") {
      setIsLoading(false);
      return;
    }

    const fetchMyPage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { ok, result } = await getMyPage();

        if (!ok || !result.data) {
          setError("마이페이지를 불러오는데 실패했습니다.");
          return;
        }

        setData(result.data);
      } catch (err) {
        setError("서버와 연결할 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPage();
  }, [status]); // status 변경될 때마다 실행

  return { data, isLoading, error };
}
