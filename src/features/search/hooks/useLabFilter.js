import { useState, useMemo, useEffect } from "react";
import { mockLabs } from "../../../mocks/mockLabs";
// import { fetchLaboratories } from "../api/labApi"; // 나중에 주석 해제

export function useLabFilter() {
  const [labs, setLabs] = useState(mockLabs); // 지금은 더미데이터로 초기화
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);

  // ---- 실제 API 연결 시 아래 주석 해제, 위 useState(mockLabs) 대신 useState([])로 변경 ----
  // useEffect(() => {
  //   fetchLaboratories()
  //     .then((data) => setLabs(data))
  //     .catch((err) => console.error(err));
  // }, []);
  // -----------------------------------------------------------------------------

  const colleges = useMemo(() => {
    const map = new Map();
    labs.forEach((lab) => map.set(lab.college.id, lab.college));
    return [...map.values()];
  }, [labs]);

  const filteredLabs = useMemo(() => {
    return labs.filter((lab) => {
      const matchSearch =
        !searchTerm ||
        lab.name.includes(searchTerm) ||
        lab.professor.name.includes(searchTerm) ||
        lab.researchFields.some((field) => field.includes(searchTerm));
      const matchCollege =
        !selectedCollege || lab.college.id === selectedCollege;
      return matchSearch && matchCollege;
    });
  }, [labs, searchTerm, selectedCollege]);

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
