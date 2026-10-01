import { useQuery } from "@tanstack/react-query";
import { fetchColleges } from "../api/mainApi";

export const COLLEGES_KEY = ["colleges"];

export function useColleges() {
  const { data: colleges = [], status } = useQuery({
    queryKey: COLLEGES_KEY,
    queryFn: fetchColleges,
    staleTime: 1000 * 60 * 60, // 1시간 (연구실 목록과 동일)
  });

  return { colleges, status: status === "pending" ? "loading" : status };
}
