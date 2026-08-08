import Header from "../../features/search/components/Header";
import SearchBar from "../../features/search/components/SearchBar";
import FilterTabs from "../../features/search/components/FilterTabs";
import LabList from "../../features/search/components/LabList";
import RecommendedLabs from "../../features/search/components/RecommendedLabs";
import PopularPosts from "../../features/search/components/PopularPosts";

function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <SearchBar />
        <FilterTabs />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
          {/* 메인 리스트 */}
          <LabList />

          {/* 사이드바 */}
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
