function CollegeChips({ colleges, selectedColleges, onSelect }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      {colleges.map((college) => {
        const isSelected = selectedColleges.includes(college.id);

        return (
          <button
            key={college.id}
            onClick={() => onSelect(college.id)}
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
            {college.name}
          </button>
        );
      })}
    </div>
  );
}

export default CollegeChips;
