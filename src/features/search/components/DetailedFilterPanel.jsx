import FilterTabs from "./FilterTabs";
import CollegeChips from "./CollegeChips";
import ResearchFieldChips from "./ResearchFieldChips";

function DetailedFilterPanel({
  activeTab,
  setActiveTab,
  filters,
  onFilterChange,
  colleges,
  researchCategories,
  researchFields,
}) {
  return (
    <div className="flex flex-col gap-4">
      <FilterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filters={filters}
      />

      <div className="min-h-[50px]">
        {activeTab === "college" && (
          <CollegeChips
            colleges={colleges}
            selectedColleges={filters.colleges}
            onSelect={(id) => onFilterChange("colleges", id)}
          />
        )}

        {activeTab === "research" && (
          <ResearchFieldChips
            categories={researchCategories}
            fields={researchFields}
            selectedCategoryIds={filters.categoryIds}
            selectedFieldIds={filters.fieldIds}
            onSelectCategory={(id) => onFilterChange("categoryIds", id)}
            onSelectField={(id) => onFilterChange("fieldIds", id)}
          />
        )}
      </div>

      {/* 탭 전환과 무관하게 항상 노출되는 공통 필터 */}
      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={() => onFilterChange("hasWebsite", !filters.hasWebsite)}
          aria-pressed={filters.hasWebsite}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 ${
            filters.hasWebsite
              ? "border-brand-500 bg-brand-50 font-bold text-brand-600 shadow-card"
              : "border-gray-200 bg-white font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          {filters.hasWebsite && (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
          🔗 홈페이지 등록된 연구실
        </button>
      </div>
    </div>
  );
}

export default DetailedFilterPanel;
