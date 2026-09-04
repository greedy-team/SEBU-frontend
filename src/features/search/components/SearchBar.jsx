function SearchBar({ value, onChange, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="w-full h-12 bg-white border border-gray-200 rounded-lg flex items-center px-4 gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="관심 분야, 역량, 연구실 이름을 검색해보세요"
        aria-label="연구실 검색"
        className="flex-1 outline-none text-sm placeholder:text-gray-400"
      />
      <button
        onClick={onSearch}
        className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
      >
        검색
      </button>
    </div>
  );
}

export default SearchBar;
