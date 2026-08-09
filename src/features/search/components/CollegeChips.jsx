function CollegeChips({ colleges, selected, onSelect }) {
  return (
    <div className="mt-3 flex gap-2 flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-full text-xs border ${
          selected === null
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-600 border-gray-200"
        }`}
      >
        전체
      </button>
      {colleges.map((college) => (
        <button
          key={college.id}
          onClick={() => onSelect(college.id)}
          className={`px-3 py-1.5 rounded-full text-xs border ${
            selected === college.id
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200"
          }`}
        >
          {college.name}
        </button>
      ))}
    </div>
  );
}

export default CollegeChips;
