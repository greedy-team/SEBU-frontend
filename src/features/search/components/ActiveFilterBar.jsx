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

  const chipClass =
    "group flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-600 transition-colors hover:border-brand-500 hover:bg-brand-100";

  const RemoveIcon = () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand-500/60 transition-colors group-hover:text-brand-600"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );

  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 py-4">
      <div className="flex flex-wrap gap-2">
        {filters.colleges.map((collegeId) => (
          <button
            key={collegeId}
            onClick={() => onFilterChange("colleges", collegeId)}
            className={chipClass}
            aria-label={`${getCollegeName(collegeId)} 필터 제거`}
          >
            {getCollegeName(collegeId)}
            <RemoveIcon />
          </button>
        ))}

        {filters.recruitmentStatus && (
          <button
            onClick={() => onFilterChange("recruitmentStatus", null)}
            className={chipClass}
            aria-label={`${getStatusName(filters.recruitmentStatus)} 필터 제거`}
          >
            {getStatusName(filters.recruitmentStatus)}
            <RemoveIcon />
          </button>
        )}
      </div>

      <button
        onClick={() => {
          onFilterChange("colleges", []);
          onFilterChange("recruitmentStatus", null);
        }}
        className="ml-4 flex shrink-0 items-center gap-1.5 text-sm font-medium whitespace-nowrap text-gray-400 transition-colors hover:text-gray-700"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        필터 초기화
      </button>
    </div>
  );
}

export default ActiveFilterBar;
