import { useEffect, useState } from "react";
import { getLabs } from "../api/communityApi";

const PAGE_SIZE = 20;

/** 후기 많은 순 연구실 목록. */
export function useLabList() {
  const [labs, setLabs] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchLabs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { ok, result } = await getLabs({ page: 0, size: PAGE_SIZE });
        if (ignore) return;

        if (!ok || !result.success) {
          setError("연구실 목록을 불러오지 못했어요.");
          return;
        }

        setLabs(result.data.laboratories);
        setTotalElements(result.data.totalElements);
      } catch {
        if (!ignore) setError("서버와 연결할 수 없어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchLabs();
    return () => {
      ignore = true;
    };
  }, []);

  return { labs, totalElements, isLoading, error };
}
