import { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 0,
    },
  },
});
// 로그인 사용자가 바뀌면 사용자별 캐시 정리
// (로그인, 로그아웃, 계정 복구, 탈퇴, 새로고침 복원 전부 여기서 처리)
useAuthStore.subscribe((state, prevState) => {
  if (state.user?.id === prevState.user?.id) return;
  // 이전 사용자의 마이페이지 데이터 삭제
  queryClient.removeQueries({ queryKey: ["mypage"] });
  // bookmarked가 사용자 기준 값이라 연구실 목록 다시 받기
  queryClient.invalidateQueries({
    queryKey: ["laboratories"],
    refetchType: "all",
  });
});
