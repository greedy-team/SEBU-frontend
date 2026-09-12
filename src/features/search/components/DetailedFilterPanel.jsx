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
    </div>
  );
}

export default DetailedFilterPanel;
