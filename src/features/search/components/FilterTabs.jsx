function FilterTabs({ activeTab, setActiveTab, filters }) {
  const tabs = [
    { id: "college", label: "단과대/학과", filterKey: "colleges" },
    { id: "status", label: "모집 상태", filterKey: "recruitmentStatus" },
  ];

  return (
    <div className="flex gap-8 border-b border-gray-200 mt-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        let activeCount = 0;
        if (tab.filterKey === "colleges") {
          activeCount = filters.colleges.length;
        } else if (filters[tab.filterKey]) {
          activeCount = 1;
        }

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
              isActive
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
            {activeCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs text-white bg-blue-500 rounded-full">
                {activeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
