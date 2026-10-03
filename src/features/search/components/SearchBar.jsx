function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "관심 분야, 교수명, 연구실 이름을 검색해보세요",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex h-14 w-full items-center rounded-full border-2 border-brand-200 bg-white pr-2 pl-6 transition-shadow focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200"
      style={{ boxShadow: "var(--shadow-widget)" }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="연구실 검색"
        className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        aria-label="검색"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-all hover:brightness-95"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

export default SearchBar;
