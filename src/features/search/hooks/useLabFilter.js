import { useState, useMemo, useEffect } from "react";
import { fetchLaboratories } from "../../../api/labApi";
import { applyFilters, applySorting } from "../utils/labFilterUtils";

// 여러 개를 동시에 고를 수 있는 필터들입니다. (칩을 누르면 토글)
const MULTI_SELECT_KEYS = ["colleges", "categoryIds", "fieldIds"];

export function useLabFilter() {
  const [rawLabs, setRawLabs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("RECENT");

  const [filters, setFilters] = useState({
    colleges: [],
    recruitmentStatus: null,
    categoryIds: [], // 1단계: 연구 분야 카테고리
    fieldIds: [], // 2단계: 세부 연구 분야
  });

  useEffect(() => {
    fetchLaboratories().then(setRawLabs).catch(console.error);
  }, []);

  const colleges = useMemo(() => {
    const map = new Map();
    rawLabs.forEach((lab) => map.set(lab.college.id, lab.college));
    return [...map.values()];
  }, [rawLabs]);

  // 1단계 칩: 모든 랩실의 카테고리를 id 기준으로 중복 제거합니다.
  const researchCategories = useMemo(() => {
    const map = new Map();
    rawLabs.forEach((lab) =>
      (lab.researchFieldCategories ?? []).forEach((c) => map.set(c.id, c)),
    );
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [rawLabs]);

  // 2단계 칩: 고른 카테고리에 속한 세부 분야를 모읍니다.
  // researchFieldDetails가 아직 배포 전이라 지금은 항상 비어 있고,
  // 그동안 2단계 영역 자체가 화면에 나타나지 않습니다.
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

      // 빈 배열이 오면 해당 필터를 통째로 비웁니다. (초기화 버튼)
      if (Array.isArray(value) && value.length === 0) {
        return key === "categoryIds"
          ? { ...prev, categoryIds: [], fieldIds: [] }
          : { ...prev, [key]: [] };
      }

      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((id) => id !== value)
        : [...current, value];

      // 카테고리를 바꾸면 2단계 칩 목록 자체가 달라지므로
      // 이전에 고른 세부 분야는 비웁니다. (없어진 칩이 선택된 채 남는 걸 막음)
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
