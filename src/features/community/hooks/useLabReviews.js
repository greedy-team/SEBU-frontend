import { useEffect, useRef, useState } from "react";
import { getLabReviews } from "../api/communityApi";

const PAGE_SIZE = 20;

/** 특정 연구실의 후기 목록. 랩실 정보와 reviewedByMe를 함께 받습니다. */
export function useLabReviews(laboratoryId, accessToken) {
  const [laboratory, setLaboratory] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewedByMe, setReviewedByMe] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    const fetchFirstPage = async () => {
      setIsLoading(true);
      setErrorCode(null);

      try {
        const { ok, result } = await getLabReviews(
          laboratoryId,
          { page: 0, size: PAGE_SIZE },
          accessToken,
        );
        if (requestId !== requestIdRef.current) return;

        if (!ok || !result.success) {
          setErrorCode(result.error?.code ?? "UNKNOWN");
          return;
        }

        setLaboratory(result.data.laboratory);
        setReviews(result.data.reviews);
        setReviewedByMe(result.data.reviewedByMe);
        setTotalElements(result.data.totalElements);
        setHasNext(result.data.hasNext);
        setPage(0);
      } catch {
        if (requestId === requestIdRef.current) setErrorCode("NETWORK_ERROR");
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
      }
    };

    fetchFirstPage();
  }, [laboratoryId, accessToken]);

  const loadMore = async () => {
    if (!hasNext) return;

    const requestId = requestIdRef.current;
    const nextPage = page + 1;

    const { ok, result } = await getLabReviews(
      laboratoryId,
      { page: nextPage, size: PAGE_SIZE },
      accessToken,
    );
    if (requestId !== requestIdRef.current) return;
    if (!ok || !result.success) return;

    setReviews((prev) => [...prev, ...result.data.reviews]);
    setHasNext(result.data.hasNext);
    setPage(nextPage);
  };

  return {
    laboratory,
    reviews,
    reviewedByMe,
    totalElements,
    hasNext,
    isLoading,
    errorCode,
    loadMore,
  };
}
