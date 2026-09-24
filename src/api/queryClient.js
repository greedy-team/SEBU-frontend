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
  console.log("user 변경", prevState.user?.id, "→", state.user?.id);
  if (state.user?.id === prevState.user?.id) return;

  queryClient.removeQueries({ queryKey: ["mypage"] });
  queryClient.invalidateQueries({ queryKey: ["laboratories"] });
});
