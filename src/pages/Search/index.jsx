import { useState } from "react";
import Header from "../../components/layout/Header";
import SearchBar from "../../features/search/components/SearchBar";
import DetailedFilterPanel from "../../features/search/components/DetailedFilterPanel";
import ActiveFilterBar from "../../features/search/components/ActiveFilterBar";
import LabList from "../../features/search/components/LabList";
import RecommendedLabs from "../../features/search/components/RecommendedLabs";
import PopularPosts from "../../features/search/components/PopularPosts";
import { useLabFilter } from "../../features/search/hooks/useLabFilter";
import LabListHeader from "../../features/search/components/LabListHeader";

function SearchPage() {
  const [activeTab, setActiveTab] = useState(null);

  const {
    searchInput,
    setSearchInput,
    handleSearch,
    filters,
    handleFilterChange,
    colleges,
    filteredLabs,
    sortType,
    setSortType,
  } = useLabFilter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
        />

        {/* 1. 카테고리 탭과 칩 선택 영역 */}
        <DetailedFilterPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filters={filters}
          onFilterChange={handleFilterChange}
          colleges={colleges}
        />

        <ActiveFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          colleges={colleges}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
          <div className="flex flex-col">
            <LabListHeader
              totalCount={filteredLabs.length}
              hasFilters={
                searchInput.trim() !== "" ||
                filters.colleges.length > 0 ||
                filters.recruitmentStatus !== null
              }
              sortType={sortType}
              onSortChange={setSortType}
            />
            <LabList labs={filteredLabs} />
          </div>
          <div className="flex flex-col gap-4">
            <RecommendedLabs />
            <PopularPosts />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
