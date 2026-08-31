import { useEffect, useState } from "react";
import { getPopularPosts } from "../api/communityApi";

/**
 * 인기글 TOP 4.
 * 목록과 별도로 요청하고, 탭·검색이 바뀌어도 다시 부르지 않습니다. (명세 §2)
 */
export function usePopularPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchPopular = async () => {
      try {
        const { ok, result } = await getPopularPosts();
        if (ignore) return;
        if (ok && result.success) setPosts(result.data.posts);
      } catch {
        // 인기글은 보조 정보라 실패해도 화면을 막지 않습니다.
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchPopular();
    return () => {
      ignore = true;
    };
  }, []);

  return { posts, isLoading };
}
