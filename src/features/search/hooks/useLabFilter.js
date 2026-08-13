import { useState, useMemo, useEffect } from "react";
import { fetchLaboratories } from "../api/labApi";
import { applyFilters, applySorting } from "../utils/labFilterUtils";

export function useLabFilter() {
  const [rawLabs, setRawLabs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("RECENT");

  // 💡 수정됨: college가 아니라 colleges 배열로 변경!
  const [filters, setFilters] = useState({
    colleges: [],
    recruitmentStatus: null,
  });

  useEffect(() => {
    fetchLaboratories().then(setRawLabs).catch(console.error);
  }, []);

  const colleges = useMemo(() => {
    const map = new Map();
    rawLabs.forEach((lab) => map.set(lab.college.id, lab.college));
    return [...map.values()];
  }, [rawLabs]);

  // 💡 수정됨: 배열일 경우 넣고 빼는(Toggle) 로직 추가
  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      if (category === "colleges") {
        if (Array.isArray(value) && value.length === 0) {
          return { ...prev, colleges: [] }; // 배열 리셋
        }
        // 기존 토글 로직
        const isAlreadySelected = prev.colleges.includes(value);
        const newColleges = isAlreadySelected
          ? prev.colleges.filter((id) => id !== value)
          : [...prev.colleges, value];
        return { ...prev, colleges: newColleges };
      }
      return { ...prev, [category]: value };
    });
  };

  const handleSearch = () => setSearchTerm(searchInput);

  const finalFilteredLabs = useMemo(() => {
    const filtered = applyFilters(rawLabs, filters, searchTerm);
    return applySorting(filtered, sortType);
  }, [rawLabs, filters, searchTerm, sortType]);

  return {
    searchInput,
    setSearchInput,
    handleSearch,
    filters,
    handleFilterChange,
    colleges,
    filteredLabs: finalFilteredLabs,
    sortType,
    setSortType,
  };
}
