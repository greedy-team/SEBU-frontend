import { useQuery } from "@tanstack/react-query";
import { fetchLaboratories } from "../labApi";
import { queryClient } from "../queryClient";

export const LABORATORIES_KEY = ["laboratories"];

// 연구실 목록 조회 (Search, 단과대별, 랩실평가 공용)
export function useLaboratoriesQuery() {
  return useQuery({
    queryKey: LABORATORIES_KEY,
    queryFn: fetchLaboratories,
    staleTime: 1000 * 60 * 60, // 1시간
  });
}

// 북마크 변경 시 캐시에서 해당 연구실 하나만 수정 (재요청 없음)
// 마이페이지 응답은 id가 문자열, 목록은 숫자라서 String으로 비교
export function updateLabBookmarkCache(labId, bookmarked) {
  queryClient.setQueryData(LABORATORIES_KEY, (old) =>
    old?.map((lab) =>
      String(lab.id) === String(labId)
        ? {
            ...lab,
            bookmarked,
            bookmarkCount: lab.bookmarkCount + (bookmarked ? 1 : -1),
          }
        : lab,
    ),
  );
}
