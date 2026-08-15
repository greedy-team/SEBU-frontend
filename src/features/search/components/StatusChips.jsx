// src/features/search/components/StatusChips.jsx
function StatusChips({ selected, onSelect }) {
  const statuses = [
    { id: "OPEN", label: "모집중 (상시 포함)" },
    { id: "CLOSED", label: "마감" },
  ];

  return (
    <div className="mt-3 flex gap-2 flex-wrap">
      {statuses.map((status) => {
        const isSelected = selected === status.id;

        return (
          <button
            key={status.id}
            onClick={() => onSelect(isSelected ? null : status.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all border ${
              isSelected
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
            }`}
          >
            {isSelected && <span className="font-bold">✓</span>}
            {status.label}
          </button>
        );
      })}
    </div>
  );
}

export default StatusChips;
