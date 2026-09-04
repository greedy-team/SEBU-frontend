function FilterTabs({ activeTab, setActiveTab, filters }) {
  const tabs = [
    { id: "college", label: "단과대/학과", filterKey: "colleges" },
    // { id: "status", label: "모집 상태", filterKey: "recruitmentStatus" },
  ];

  return (
    <div
      className="mt-2 flex gap-8 border-b border-gray-200"
      role="tablist"
      aria-label="검색 필터 탭"
    >
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
            /* -mb-px 로 활성 밑줄이 컨테이너 경계선 위에 겹치게 해서 선을 또렷하게 만듭니다 */
            className={`-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-[15px] font-bold transition-colors ${
              isActive
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeCount > 0 && (
              <span
                className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-brand-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
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
