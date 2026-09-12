import { useEffect, useState } from "react";
import { fetchLatestPosts } from "../api/mainApi";

/**
 * 메인보드 최신글.
 *
 * 상태를 loading / success / error 셋으로 나눕니다.
 * 빈 목록과 조회 실패는 화면에서 다르게 보여줘야 해서요. (명세 6절)
 */
export function useLatestPosts() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let ignore = false;

    fetchLatestPosts()
      .then((data) => {
        if (ignore) return;
        setPosts(data);
        setStatus("success");
      })
      .catch(() => {
        if (!ignore) setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { posts, status };
}
