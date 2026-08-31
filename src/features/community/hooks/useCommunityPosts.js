import { useEffect, useState } from "react";
import { getPosts } from "../api/communityApi";

const PAGE_SIZE = 6;

export function useCommunityPosts({ category, keyword, sort = "LATEST" } = {}) {
  const [posts, setPosts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 조건이 빠르게 바뀔 때 늦게 도착한 응답이 화면을 덮어쓰지 않도록 막습니다.
    let ignore = false;

    const fetchPosts = async () => {
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
        if (ignore) return;

        if (!ok || !result.success) {
          setError("게시글을 불러오지 못했어요.");
          return;
        }

        setPosts(result.data.posts);
        setTotalElements(result.data.totalElements);
        setHasNext(result.data.hasNext);
      } catch {
        if (!ignore) setError("서버와 연결할 수 없어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchPosts();
    return () => {
      ignore = true;
    };
  }, [category, keyword, sort]);

  return { posts, totalElements, hasNext, isLoading, error };
}
