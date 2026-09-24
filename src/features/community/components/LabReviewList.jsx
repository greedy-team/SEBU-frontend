import { Link } from "react-router-dom";
import { SORT_OPTIONS } from "../hooks/useLabList";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

function ChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
const PAGE_SIZE = 20;

function LabReviewListInner({ labs }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, labs.length));
    }
  }, [inView, labs.length]);

  const visibleLabs = labs.slice(0, visibleCount);

  return (
    <>
      <ul className="divide-y divide-gray-100">
        {visibleLabs.map((lab) => (
          <li key={lab.id}>
            <Link
              to={`/community/labs/${lab.id}`}
              className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-gray-50"
            >
              <span className="min-w-0">
                <span className="block font-bold text-gray-900">
                  {lab.name}
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  {lab.professor.name} 교수 · {lab.department.name}
                </span>
                <span className="mt-1.5 block text-xs text-gray-400">
                  후기 {lab.reviewCount}개
                </span>
              </span>
              <span className="ml-auto shrink-0 text-gray-300">
                <ChevronRight />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {visibleCount < labs.length && (
        <div ref={ref} className="py-4 text-center text-sm text-gray-400">
          불러오는 중이에요…
        </div>
      )}
    </>
  );
}

/**
 * 커뮤니티 HOME의 랩실 평가 탭.
 *
 * 피그마에는 별점(★ 4.5)과 "평점 높은 순"이 있지만 랩실 평가 v2에서
 * 별점이 폐기되어 후기 수만 표시하고 정렬도 "후기 많은 순"입니다.
 */
function LabReviewList({
  labs,
  totalElements,
  isLoading,
  error,
  sortType,
  onSortChange,
}) {
  return (
    <div className="overflow-hidden rounded-card border border-gray-200 bg-white">
      <div className="flex items-center border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-bold text-gray-900">
          랩실 평가
          <span className="ml-1.5 font-medium text-gray-400">
            {totalElements}개 연구실
          </span>
        </h2>
        <select
          value={sortType}
          onChange={(e) => onSortChange(e.target.value)}
          className="ml-auto text-xs font-bold text-gray-900 bg-transparent"
        >
          {Object.entries(SORT_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <p className="px-5 py-16 text-center text-sm text-gray-400">
          불러오는 중이에요…
        </p>
      )}

      {!isLoading && error && (
        <p className="px-5 py-16 text-center text-sm text-gray-500">{error}</p>
      )}

      {!isLoading && !error && labs.length === 0 && (
        <p className="px-5 py-16 text-center text-sm text-gray-400">
          아직 연구실이 없어요.
        </p>
      )}

      {!isLoading && !error && labs.length > 0 && (
        <LabReviewListInner labs={labs} />
      )}
    </div>
  );
}

export default LabReviewList;
