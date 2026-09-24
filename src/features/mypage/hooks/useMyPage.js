import { useQuery } from "@tanstack/react-query";
import { getMyPage } from "../api/mypageApi";
import { useAuthStore } from "../../../store/authStore";

export function useMyPage() {
  const status = useAuthStore((state) => state.status);

  const { data, isLoading, error } = useQuery({
    queryKey: ["mypage"],
    queryFn: getMyPage,
    enabled: status === "authenticated", // 로그인 확정 후에만 fetch
  });

  return {
    data,
    isLoading: status === "loading" || isLoading, // authRestore 중에도 로딩
    error,
  };
}
