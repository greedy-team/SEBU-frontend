function ActiveFilterBar({ filters, onFilterChange, colleges }) {
  const hasActiveColleges = filters.colleges.length > 0;
  const hasActiveStatus = filters.recruitmentStatus !== null;

  if (!hasActiveColleges && !hasActiveStatus) return null;

  const getCollegeName = (id) => colleges.find((c) => c.id === id)?.name || "";
  const getStatusName = (status) => {
    if (status === "RECRUITING") return "모집중";
    if (status === "ALWAYS_OPEN") return "상시모집";
    if (status === "CLOSED") return "마감";
    return "";
  };

  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-100">
      <div className="flex gap-2 flex-wrap">
        {filters.colleges.map((collegeId) => (
          <button
            key={collegeId}
            onClick={() => onFilterChange("colleges", collegeId)}
            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-blue-100 transition-colors"
          >
            {getCollegeName(collegeId)}{" "}
            <span className="text-blue-400 font-light text-base leading-none">
              ✕
            </span>
          </button>
        ))}

        {filters.recruitmentStatus && (
          <button
            onClick={() => onFilterChange("recruitmentStatus", null)}
            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-blue-100 transition-colors"
          >
            🔥 {getStatusName(filters.recruitmentStatus)}{" "}
            <span className="text-blue-400 font-light text-base leading-none">
              ✕
            </span>
          </button>
        )}
      </div>

      <button
        onClick={() => {
          onFilterChange("colleges", []);
          onFilterChange("recruitmentStatus", null);
        }}
        className="text-sm text-gray-400 flex items-center gap-1.5 hover:text-gray-600 font-medium whitespace-nowrap ml-4"
      >
        <span className="text-lg">↺</span> 필터 초기화
      </button>
    </div>
  );
}

export default ActiveFilterBar;
