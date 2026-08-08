import { useState } from "react";
import Header from "../../components/layout/Header";
import SearchBar from "../../features/search/components/SearchBar";
import FilterTabs from "../../features/search/components/FilterTabs";
import CollegeChips from "../../features/search/components/CollegeChips";
import LabList from "../../features/search/components/LabList";
import RecommendedLabs from "../../features/search/components/RecommendedLabs";
import PopularPosts from "../../features/search/components/PopularPosts";
import { useLabFilter } from "../../features/search/hooks/useLabFilter";

function SearchPage() {
  const [activeTab, setActiveTab] = useState(null);
  const {
    searchInput,
    setSearchInput,
    handleSearch,
    selectedCollege,
    setSelectedCollege,
    colleges,
    filteredLabs,
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
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "college" && (
          <CollegeChips
            colleges={colleges}
            selected={selectedCollege}
            onSelect={setSelectedCollege}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
          <LabList labs={filteredLabs} />
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
