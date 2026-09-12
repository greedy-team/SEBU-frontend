// 컴포넌트 안에서 정의하면 렌더할 때마다 새 컴포넌트가 만들어집니다.
// 그러면 React가 매번 다른 컴포넌트로 보고 DOM을 새로 그리게 됩니다.
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

const chipClass =
  "group flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-600 transition-colors hover:border-brand-500 hover:bg-brand-100";

const getStatusName = (status) => {
  if (status === "RECRUITING") return "모집중";
  if (status === "ALWAYS_OPEN") return "상시모집";
  if (status === "CLOSED") return "마감";
  return "";
};

function ActiveFilterBar({
  filters,
  onFilterChange,
  colleges,
  researchCategories = [],
  researchFields = [],
}) {
  const hasActive =
    filters.colleges.length > 0 ||
    filters.categoryIds.length > 0 ||
    filters.fieldIds.length > 0 ||
    filters.recruitmentStatus !== null;

  if (!hasActive) return null;

  const getCollegeName = (id) => colleges.find((c) => c.id === id)?.name || "";
  const getCategoryName = (id) =>
    researchCategories.find((c) => c.id === id)?.name || "";
  const getFieldName = (id) =>
    researchFields.find((f) => f.researchFieldId === id)?.name || "";

  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 py-4">
      <div className="flex flex-wrap gap-2">
        {filters.colleges.map((collegeId) => (
          <button
            key={`college-${collegeId}`}
            onClick={() => onFilterChange("colleges", collegeId)}
            className={chipClass}
            aria-label={`${getCollegeName(collegeId)} 필터 제거`}
          >
            {getCollegeName(collegeId)}
            <RemoveIcon />
          </button>
        ))}

        {filters.categoryIds.map((categoryId) => (
          <button
            key={`category-${categoryId}`}
            onClick={() => onFilterChange("categoryIds", categoryId)}
            className={chipClass}
            aria-label={`${getCategoryName(categoryId)} 필터 제거`}
          >
            {getCategoryName(categoryId)}
            <RemoveIcon />
          </button>
        ))}

        {filters.fieldIds.map((fieldId) => (
          <button
            key={`field-${fieldId}`}
            onClick={() => onFilterChange("fieldIds", fieldId)}
            className={chipClass}
            aria-label={`${getFieldName(fieldId)} 필터 제거`}
          >
            {getFieldName(fieldId)}
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
          // categoryIds를 비우면 fieldIds도 함께 비워집니다.
          onFilterChange("categoryIds", []);
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
