import { useEffect, useRef, useState } from "react";
import { getPosts } from "../api/communityApi";

const PAGE_SIZE = 6;

export function useCommunityPosts({ category, keyword, sort = "LATEST" } = {}) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // 조회 조건이 바뀔 때마다 번호를 올려서, 이전 조건의 응답을 구분합니다.
  const requestIdRef = useRef(0);

  // 조건이 바뀌면 첫 페이지부터 새로 불러옵니다.
  useEffect(() => {
    const requestId = ++requestIdRef.current;

    const fetchFirstPage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { ok, result } = await getPosts({
          category,
          keyword,
          sort,
          page: 0,
          size: PAGE_SIZE,
        });
        if (requestId !== requestIdRef.current) return;

        if (!ok || !result.success) {
          setError("게시글을 불러오지 못했어요.");
          return;
        }

        setPosts(result.data.posts);
        setTotalElements(result.data.totalElements);
        setHasNext(result.data.hasNext);
        setPage(0);
      } catch {
        if (requestId === requestIdRef.current) {
          setError("서버와 연결할 수 없어요.");
        }
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
      }
    };

    fetchFirstPage();
  }, [category, keyword, sort]);

  // 다음 페이지를 받아 아래에 이어 붙입니다.
  const loadMore = async () => {
    if (!hasNext || isLoading || isLoadingMore) return;

    const requestId = requestIdRef.current;
    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const { ok, result } = await getPosts({
        category,
        keyword,
        sort,
        page: nextPage,
        size: PAGE_SIZE,
      });
      // 기다리는 동안 탭이나 검색어가 바뀌었으면 붙이지 않습니다.
      if (requestId !== requestIdRef.current) return;
      if (!ok || !result.success) return;

      setPosts((prev) => [...prev, ...result.data.posts]);
      setHasNext(result.data.hasNext);
      setPage(nextPage);
    } catch {
      // 더 보기 실패는 목록을 지우지 않고 조용히 넘어갑니다.
    } finally {
      if (requestId === requestIdRef.current) setIsLoadingMore(false);
    }
  };

  return {
    posts,
    totalElements,
    hasNext,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
  };
}
