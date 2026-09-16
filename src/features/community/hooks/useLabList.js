import { useEffect, useMemo, useState } from "react";
import { fetchLaboratories } from "../../../api/labApi";

export const SORT_OPTIONS = {
  REVIEW_COUNT_DESC: "후기 많은 순",
  NAME_ASC: "이름순",
};

/** 후기 많은 순 연구실 목록. 전체 로드 후 클라이언트에서 검색·정렬. */
export function useLabList() {
  const [rawLabs, setRawLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("REVIEW_COUNT_DESC");

  useEffect(() => {
    let ignore = false;

    fetchLaboratories()
      .then((data) => {
        if (!ignore) setRawLabs(data ?? []);
      })
      .catch(() => {
        if (!ignore) setError("연구실 목록을 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleSearch = () => setSearchTerm(searchInput.trim());

  const labs = useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    const filtered = keyword
      ? rawLabs.filter((lab) => lab.name.toLowerCase().includes(keyword))
      : rawLabs;

    return [...filtered].sort((a, b) =>
      sortType === "NAME_ASC"
        ? a.name.localeCompare(b.name)
        : (b.reviewCount ?? 0) - (a.reviewCount ?? 0),
    );
  }, [rawLabs, searchTerm, sortType]);

  return {
    labs,
    totalElements: labs.length,
    isLoading,
    error,
    searchInput,
    setSearchInput,
    handleSearch,
    sortType,
    setSortType,
  };
}
