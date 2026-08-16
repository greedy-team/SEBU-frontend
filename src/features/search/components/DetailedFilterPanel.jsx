import FilterTabs from "./FilterTabs";
import CollegeChips from "./CollegeChips";
import StatusChips from "./StatusChips";

function DetailedFilterPanel({
  activeTab,
  setActiveTab,
  filters,
  onFilterChange,
  colleges,
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

        {/* {activeTab === "status" && (
          <StatusChips
            selected={filters.recruitmentStatus}
            onSelect={(status) => onFilterChange("recruitmentStatus", status)}
          />
        )} */}
      </div>
    </div>
  );
}

export default DetailedFilterPanel;
