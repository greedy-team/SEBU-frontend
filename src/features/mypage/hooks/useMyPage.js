import { useState, useEffect } from "react";
import { getMyPage } from "../api/mypageApi";

export function useMyPage() {
  // accessToken 파라미터 제거
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 항상 true로 시작
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyPage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { ok, result } = await getMyPage(); // accessToken 제거

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
  }, []); // 의존성 배열에서 accessToken 제거

  return { data, isLoading, error };
}
