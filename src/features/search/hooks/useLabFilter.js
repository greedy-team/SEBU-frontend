import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLaboratories } from "../../../api/labApi";
import { applyFilters, applySorting } from "../utils/labFilterUtils";

const MULTI_SELECT_KEYS = ["colleges", "categoryIds", "fieldIds"];

export function useLabFilter() {
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") ?? "";

  const [searchInput, setSearchInput] = useState(initialKeyword);
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [sortType, setSortType] = useState("RECENT");

  const [filters, setFilters] = useState({
    colleges: [],
    recruitmentStatus: null,
    categoryIds: [],
    fieldIds: [],
    hasWebsite: false,
  });

  // useEffect + useState → useQuery로 전환
  const {
    data: rawLabs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["laboratories"],
    queryFn: fetchLaboratories,
    staleTime: 1000 * 60 * 60, 
  });

  const colleges = useMemo(() => {
    const map = new Map();
    rawLabs.forEach((lab) => map.set(lab.college.id, lab.college));
    return [...map.values()];
  }, [rawLabs]);

  const researchCategories = useMemo(() => {
    const map = new Map();
    rawLabs.forEach((lab) =>
      (lab.researchFieldCategories ?? []).forEach((c) => map.set(c.id, c)),
    );
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [rawLabs]);

  const researchFields = useMemo(() => {
    if (filters.categoryIds.length === 0) return [];
    const map = new Map();

    rawLabs.forEach((lab) =>
      (lab.researchFieldDetails ?? []).forEach((field) => {
        const belongs = (field.categoryIds ?? []).some((id) =>
          filters.categoryIds.includes(id),
        );
        if (belongs) map.set(field.researchFieldId, field);
      }),
    );

    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [rawLabs, filters.categoryIds]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      if (!MULTI_SELECT_KEYS.includes(key)) {
        return { ...prev, [key]: value };
      }

      if (Array.isArray(value) && value.length === 0) {
        return key === "categoryIds"
          ? { ...prev, categoryIds: [], fieldIds: [] }
          : { ...prev, [key]: [] };
      }

      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((id) => id !== value)
        : [...current, value];

      if (key === "categoryIds") {
        return { ...prev, categoryIds: next, fieldIds: [] };
      }
      return { ...prev, [key]: next };
    });
  };

  const handleSearch = () => setSearchTerm(searchInput);

  const finalFilteredLabs = useMemo(() => {
    const filtered = applyFilters(rawLabs, filters, searchTerm);
    return applySorting(filtered, sortType);
  }, [rawLabs, filters, searchTerm, sortType]);

  return {
    rawLabs,
    isLoading,
    error,
    searchInput,
    setSearchInput,
    searchTerm,
    handleSearch,
    filters,
    handleFilterChange,
    colleges,
    researchCategories,
    researchFields,
    filteredLabs: finalFilteredLabs,
    sortType,
    setSortType,
  };
}
