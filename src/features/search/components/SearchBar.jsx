import { useIsMobile } from "../../../hooks/useIsMobile";

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

function SearchBar({ value, onChange, onSearch, placeholder }) {
  const isMobile = useIsMobile();

  // 좁은 화면에서는 안내 문구가 버튼 앞에서 잘리지 않도록 짧은 문구를 씁니다.
  const resolvedPlaceholder =
    placeholder ??
    (isMobile
      ? "관심 분야, 교수명, 연구실 검색"
      : "관심 분야, 교수명, 연구실 이름을 검색해보세요");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex h-14 w-full items-center rounded-full border-2 border-brand-200 bg-white pr-2 pl-5 transition-shadow focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200 md:pl-6"
      style={{ boxShadow: "var(--shadow-widget)" }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        aria-label="연구실 검색"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 md:text-[15px]"
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
