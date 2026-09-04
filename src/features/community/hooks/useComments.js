import { useEffect, useRef, useState } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../api/communityApi";

const PAGE_SIZE = 20;

/** 오류 코드를 사용자에게 보여줄 문구로 바꿉니다. (명세 §4 오류 계약) */
const toMessage = (result) => {
  switch (result?.error?.code) {
    case "ACCESS_TOKEN_INVALID":
    case "ACCESS_TOKEN_EXPIRED":
      return "로그인이 필요해요.";
    case "COMMENT_FORBIDDEN":
      return "권한이 없어요.";
    case "COMMENT_NOT_FOUND":
      return "이미 삭제된 댓글이에요.";
    case "VALIDATION_ERROR":
      return result.error.message;
    default:
      return "잠시 후 다시 시도해주세요.";
  }
};

export function useComments(postId, accessToken) {
  const [comments, setComments] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 게시글이 바뀌면 이전 요청의 응답을 버리기 위한 번호표
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    const fetchFirstPage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { ok, result } = await getComments(
          postId,
          { page: 0, size: PAGE_SIZE },
          accessToken,
        );
        if (requestId !== requestIdRef.current) return;

        if (!ok || !result.success) {
          setError("댓글을 불러오지 못했어요.");
          return;
        }

        setComments(result.data.comments);
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
  }, [postId, accessToken]);

  const loadMore = async () => {
    if (!hasNext) return;

    const requestId = requestIdRef.current;
    const nextPage = page + 1;

    const { ok, result } = await getComments(
      postId,
      { page: nextPage, size: PAGE_SIZE },
      accessToken,
    );
    if (requestId !== requestIdRef.current) return;
    if (!ok || !result.success) return;

    setComments((prev) => [...prev, ...result.data.comments]);
    setHasNext(result.data.hasNext);
    setPage(nextPage);
  };

  /* ── 등록·수정·삭제 ──
     성공하면 갱신된 commentCount를 돌려줍니다.
     게시글 헤더의 댓글 수를 맞추는 건 화면 쪽 몫이에요. */

  const addComment = async (content) => {
    const { ok, result } = await createComment(postId, content, accessToken);
    if (!ok || !result.success)
      return { ok: false, message: toMessage(result) };

    setComments((prev) => [...prev, result.data.comment]);
    setTotalElements(result.data.commentCount);
    return { ok: true, commentCount: result.data.commentCount };
  };

  const editComment = async (commentId, content) => {
    const { ok, result } = await updateComment(
      postId,
      commentId,
      content,
      accessToken,
    );
    if (!ok || !result.success)
      return { ok: false, message: toMessage(result) };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              content: result.data.content,
              updatedAt: result.data.updatedAt,
            }
          : comment,
      ),
    );
    return { ok: true };
  };

  const removeComment = async (commentId) => {
    const { ok, result } = await deleteComment(postId, commentId, accessToken);
    if (!ok || !result.success)
      return { ok: false, message: toMessage(result) };

    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    setTotalElements(result.data.commentCount);
    return { ok: true, commentCount: result.data.commentCount };
  };

  return {
    comments,
    totalElements,
    hasNext,
    isLoading,
    error,
    loadMore,
    addComment,
    editComment,
    removeComment,
  };
}
