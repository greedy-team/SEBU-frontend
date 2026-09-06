/**
 * 검색 결과 개수 + 정렬 드롭다운.
 *
 * 4-feat 브랜치(a4fae93)에 있던 컴포넌트를 그대로 가져오고 디자인 토큰만 입혔어요.
 * props 이름과 동작은 원본과 동일합니다.
 *
 */
const SORT_OPTIONS = [
  { value: "RECENT", label: "최신순" },
  { value: "POPULAR", label: "인기순" },
  { value: "NAME_ASC", label: "이름 오름차순" },
  { value: "NAME_DESC", label: "이름 내림차순" },
];

function LabListHeader({ totalCount, hasFilters, sortType, onSortChange }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      {/* 왼쪽 안내 문구 */}
      <div className="text-[17px] font-bold tracking-tight text-gray-900">
        {hasFilters ? (
          <>
            선택한 조건의 연구실{" "}
            <span className="text-brand-500">{totalCount}개</span>를 찾았어요 🎯
          </>
        ) : (
          <>
            전체 <span className="text-brand-500">{totalCount}개</span> 연구실
          </>
        )}
      </div>

      {/* 오른쪽 정렬 드롭다운 */}
      <div className="relative shrink-0">
        <select
          value={sortType}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="정렬 기준"
          className="cursor-pointer appearance-none rounded-full border border-gray-200 bg-white py-2 pr-9 pl-4 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
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
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default LabListHeader;
