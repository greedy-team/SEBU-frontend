import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { getMyPage } from "../api/mypageApi";

export function useMyPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(!!accessToken);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    const fetchMyPage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { ok, result } = await getMyPage(accessToken);

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
  }, [accessToken]);

  return { data, isLoading, error };
}
