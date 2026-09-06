function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CommunitySearchBar({ value, onChange, onSubmit, onClear }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex h-14 w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white pr-3 pl-5"
    >
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={100}
        placeholder="키워드로 검색하고 최신순으로 확인하세요."
        aria-label="게시글 제목 검색"
        className="flex-1 text-sm outline-none placeholder:text-gray-400"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="검색어 지우기"
          className="px-1 text-lg leading-none text-gray-300 transition-colors hover:text-gray-500"
        >
          ×
        </button>
      )}

      <button
        type="submit"
        aria-label="검색"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-all hover:brightness-95"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

export default CommunitySearchBar;
