import { useState } from "react";
import Header from "../../components/layout/Header";
import SearchBar from "../../features/search/components/SearchBar";
import DetailedFilterPanel from "../../features/search/components/DetailedFilterPanel";
import ActiveFilterBar from "../../features/search/components/ActiveFilterBar"; // 🔥 불러오기!
import LabListHeader from "../../features/search/components/LabListHeader";
import LabList from "../../features/search/components/LabList";
import RecommendedLabs from "../../features/search/components/RecommendedLabs";
import PopularPostsCard from "../../features/community/components/PopularPostsCard";
import { usePopularPosts } from "../../features/community/hooks/usePopularPosts";
import { useLabFilter } from "../../features/search/hooks/useLabFilter";

function SearchPage() {
  const [activeTab, setActiveTab] = useState("college");

  const {
    rawLabs,
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

  const { posts: popularPosts, isLoading: isPopularLoading } =
    usePopularPosts();

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

        {/* 2. 💡 방금 새로 만든, 선택된 칩들이 모여있는 엑티브 바 영역! */}
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
            <RecommendedLabs labs={rawLabs} />
            <PopularPostsCard
              posts={popularPosts}
              isLoading={isPopularLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
