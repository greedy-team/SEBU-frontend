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
console.log("queryClient.js 실행됨");
useAuthStore.subscribe((state, prevState) => {
  console.log("user 변경", prevState.user?.id, "→", state.user?.id);
  if (state.user?.id === prevState.user?.id) return;

  queryClient.removeQueries({ queryKey: ["mypage"] });
  queryClient.invalidateQueries({ queryKey: ["laboratories"] });
});
