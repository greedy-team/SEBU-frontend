// src/features/search/components/StatusChips.jsx
function StatusChips({ selected, onSelect }) {
  const statuses = [
    { id: "OPEN", label: "모집중 (상시 포함)" },
    { id: "CLOSED", label: "마감" },
  ];

  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      {statuses.map((status) => {
        const isSelected = selected === status.id;

        return (
          <button
            key={status.id}
            onClick={() => onSelect(isSelected ? null : status.id)}
            aria-pressed={isSelected}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 ${
              isSelected
                ? "border-brand-500 bg-brand-50 font-bold text-brand-600 shadow-card"
                : "border-gray-200 bg-white font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {isSelected && (
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
            {status.label}
          </button>
        );
      })}
    </div>
  );
}

export default StatusChips;
