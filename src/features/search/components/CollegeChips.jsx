function CollegeChips({ colleges, selectedColleges, onSelect }) {
  return (
    <div className="mt-4 flex gap-2.5 flex-wrap">
      {colleges.map((college) => {
        const isSelected = selectedColleges.includes(college.id);

        return (
          <button
            key={college.id}
            onClick={() => onSelect(college.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all border ${
              isSelected
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-gray-50 text-gray-600 border-blue-200 hover:bg-gray-100"
            }`}
          >
            {isSelected && <span className="font-bold text-blue-600">✓</span>}
            {college.name}
          </button>
        );
      })}
    </div>
  );
}

export default CollegeChips;
