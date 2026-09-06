import { useEffect, useState } from "react";
import { getPost } from "../api/communityApi";

export function usePostDetail(postId, accessToken) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchPost = async () => {
      setIsLoading(true);
      setErrorCode(null);

      try {
        const { ok, result } = await getPost(postId, accessToken);
        if (ignore) return;

        if (!ok || !result.success) {
          setErrorCode(result.error?.code ?? "UNKNOWN");
          return;
        }

        setPost(result.data.post);
      } catch {
        if (!ignore) setErrorCode("NETWORK_ERROR");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchPost();
    return () => {
      ignore = true;
    };
  }, [postId, accessToken]);

  return { post, setPost, isLoading, errorCode };
}
