import { useMemo, useState } from "react";
import { useLaboratoriesQuery } from "../../../api/queries/laboratories";
export const SORT_OPTIONS = {
  REVIEW_COUNT_DESC: "후기 많은 순",
  NAME_ASC: "이름순",
};

export function useLabList() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("REVIEW_COUNT_DESC");

  const { data: rawLabs = [], isLoading, error } = useLaboratoriesQuery();

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
