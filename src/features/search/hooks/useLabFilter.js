import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { applyFilters, applySorting } from "../utils/labFilterUtils";
import { useLaboratoriesQuery } from "../../../api/queries/laboratories";
const MULTI_SELECT_KEYS = ["colleges", "categoryIds", "fieldIds"];

export function useLabFilter() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 검색어는 주소(?keyword=)에 드러나지 않도록 화면 이동 정보(history state)에 담는다.
  // 새로고침·뒤로가기·앞으로가기 때는 브라우저가 이 값을 그대로 복원해 준다.
  // 예전에 공유된 ?keyword= 링크는 한 번 읽고 아래 effect에서 주소를 정리한다.
  const legacyKeyword = searchParams.get("keyword");
  const searchTerm = location.state?.keyword ?? legacyKeyword ?? "";

  useEffect(() => {
    if (legacyKeyword === null) return;
    navigate(location.pathname, {
      replace: true,
      state: { keyword: legacyKeyword },
    });
  }, [legacyKeyword, location.pathname, navigate]);

  const [searchInput, setSearchInput] = useState(searchTerm);
  const [syncedTerm, setSyncedTerm] = useState(searchTerm);
  // 검색어가 바뀌면(뒤로가기, 다른 페이지에서 검색 등) 입력창도 따라가게 함
  if (syncedTerm !== searchTerm) {
    setSyncedTerm(searchTerm);
    setSearchInput(searchTerm);
  }
  const [sortType, setSortType] = useState("RECENT");

  const [filters, setFilters] = useState({
    colleges: [],
    recruitmentStatus: null,
    categoryIds: [],
    fieldIds: [],
    hasWebsite: false,
  });

  // useEffect + useState → useQuery로 전환
  const { data: rawLabs = [], isLoading, error } = useLaboratoriesQuery();

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

  const handleSearch = () => {
    const keyword = searchInput.trim();
    navigate(location.pathname, { state: { keyword } });
  };

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
