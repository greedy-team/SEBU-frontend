import { useState, useMemo } from "react";
import { mockLabs } from "../data/mockLabs";

export function useLabFilter() {
  const [searchInput, setSearchInput] = useState(""); // 입력창에 실시간으로 찍히는 값
  const [searchTerm, setSearchTerm] = useState(""); // 검색 버튼 눌렀을 때만 확정되는 값
  const [selectedCollege, setSelectedCollege] = useState(null); // 칩 클릭 시 즉시 반영

  // mockLabs 안에서 중복 없는 단과대 목록 뽑기
  const colleges = useMemo(() => {
    const map = new Map();
    mockLabs.forEach((lab) => map.set(lab.college.id, lab.college));
    return [...map.values()];
  }, []);

  const filteredLabs = useMemo(() => {
    return mockLabs.filter((lab) => {
      const matchSearch =
        !searchTerm ||
        lab.name.includes(searchTerm) ||
        lab.professor.name.includes(searchTerm) ||
        lab.researchFields.some((field) => field.includes(searchTerm));
      const matchCollege =
        !selectedCollege || lab.college.id === selectedCollege;
      return matchSearch && matchCollege;
    });
  }, [searchTerm, selectedCollege]);

  const handleSearch = () => setSearchTerm(searchInput);

  return {
    searchInput,
    setSearchInput,
    handleSearch,
    selectedCollege,
    setSelectedCollege,
    colleges,
    filteredLabs,
  };
}
