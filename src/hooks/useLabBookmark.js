import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addLabBookmark, removeLabBookmark } from "../api/bookmarkApi";
import { useAuthStore } from "../store/authStore";
import { queryClient } from "../api/queryClient";
import {
  LABORATORIES_KEY,
  updateLabBookmarkCache,
} from "../api/queries/laboratories";

/**
 * 연구실 북마크 공용 훅.
 * LabCard, 실시간 인기 연구실 모달 등 여러 곳에서 같은 로직을 씁니다.
 *
 * 로컬 state 없이 캐시(lab props)를 그대로 쓰고,
 * 낙관적 업데이트도 laboratories 캐시에 직접 합니다.
 */
export function useLabBookmark(lab, { onUnbookmark } = {}) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const bookmarked = lab.bookmarked ?? false;
  const bookmarkCount = lab.bookmarkCount ?? 0;

  const { mutate } = useMutation({
    mutationFn: (isBookmarked) =>
      isBookmarked ? removeLabBookmark(lab.id) : addLabBookmark(lab.id),

    // 낙관적 업데이트 - 캐시를 먼저 수정
    onMutate: async (isBookmarked) => {
      // 진행 중인 재요청이 내 수정을 덮어쓰지 않도록 멈춤
      await queryClient.cancelQueries({ queryKey: LABORATORIES_KEY });

      // 롤백용 이전 캐시 저장
      const previous = queryClient.getQueryData(LABORATORIES_KEY);

      updateLabBookmarkCache(lab.id, !isBookmarked);

      return { previous };
    },

    // 실패 시 이전 캐시로 롤백
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(LABORATORIES_KEY, context.previous);
      }
    },

    onSuccess: (_, isBookmarked) => {
      // isBookmarked = 클릭 전 상태 → true면 이번 요청은 "해제"
      if (isBookmarked) {
        onUnbookmark?.(lab.id);
      }
      queryClient.invalidateQueries({ queryKey: ["mypage"] });
    },
  });

  const toggleBookmark = (e) => {
    e?.stopPropagation();
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    mutate(bookmarked);
  };

  return { bookmarked, bookmarkCount, toggleBookmark };
}
