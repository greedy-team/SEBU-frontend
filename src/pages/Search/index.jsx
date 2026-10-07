import { useState } from "react";
import Header from "../../components/layout/Header";
import SearchBar from "../../features/search/components/SearchBar";
import DetailedFilterPanel from "../../features/search/components/DetailedFilterPanel";
import ActiveFilterBar from "../../features/search/components/ActiveFilterBar"; // 🔥 불러오기!
import LabListHeader from "../../features/search/components/LabListHeader";
import LabList from "../../features/search/components/LabList";
import RecommendedLabs from "../../features/search/components/RecommendedLabs";
// import PopularPostsCard from "../../features/community/components/PopularPostsCard";
// import { usePopularPosts } from "../../features/community/hooks/usePopularPosts";
import { useLabFilter } from "../../features/search/hooks/useLabFilter";

function SearchPage() {
  const [activeTab, setActiveTab] = useState("college");

  const {
    rawLabs,
    isLoading, // 추가
    error, // 추가
    searchInput,
    setSearchInput,
    searchTerm,
    handleSearch,
    filters,
    handleFilterChange,
    colleges,
    researchCategories,
    researchFields,
    filteredLabs,
    sortType,
    setSortType,
  } = useLabFilter();

  // const { posts: popularPosts, isLoading: isPopularLoading } =
  //   usePopularPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 모바일은 메인 소개 화면이 없으므로, 검색 전에만 메인 히어로와 같은 톤의 소개를 보여줌 */}
        {searchTerm === "" && (
          <div className="mb-5 md:hidden">
            <p className="text-[10.5px] font-bold tracking-[0.14em] text-brand-500 uppercase">
              Sejong University · Undergraduate Research Platform
            </p>
            <h1 className="mt-2 text-2xl leading-[1.25] font-black tracking-[-0.02em] break-keep text-gray-900">
              세종대학교 학부연구생
              <br />
              플랫폼, SEBU
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed break-keep text-gray-500">
              연구실 탐색부터 교수님 컨택, 합격 후기까지
              <br />
              학부연구생을 위한 전용 플랫폼입니다.
            </p>
          </div>
        )}
        <div className="mb-5">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
          />
        </div>
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <p className="text-sm text-gray-400">불러오는 중이에요…</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-32">
            <p className="text-sm text-gray-500">
              연구실 목록을 불러오지 못했어요.
            </p>
          </div>
        )}
        {!isLoading && !error && (
          <>
            {/* 1. 카테고리 탭과 칩 선택 영역 */}
            <DetailedFilterPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              filters={filters}
              onFilterChange={handleFilterChange}
              colleges={colleges}
              researchCategories={researchCategories}
              researchFields={researchFields}
            />

            {/* 2. 💡 방금 새로 만든, 선택된 칩들이 모여있는 엑티브 바 영역! */}
            <ActiveFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              colleges={colleges}
              researchCategories={researchCategories}
              researchFields={researchFields}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
              <div className="flex flex-col">
                <LabListHeader
                  totalCount={filteredLabs.length}
                  hasFilters={
                    searchTerm.trim() !== "" ||
                    filters.colleges.length > 0 ||
                    filters.categoryIds.length > 0 ||
                    filters.fieldIds.length > 0 ||
                    filters.recruitmentStatus !== null ||
                    filters.hasWebsite
                  }
                  sortType={sortType}
                  onSortChange={setSortType}
                />
                <LabList labs={filteredLabs} />
              </div>
              <div className="hidden flex-col gap-4 md:flex">
                <RecommendedLabs labs={rawLabs} />
                {/* <PopularPostsCard
              posts={popularPosts}
              isLoading={isPopularLoading}
            /> */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
