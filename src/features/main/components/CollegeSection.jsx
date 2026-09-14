import { useRef } from "react";
import { Link } from "react-router-dom";

// 학과 태그는 두 개까지만 보여주고 나머지는 +N으로 접습니다.
const VISIBLE_DEPARTMENTS = 2;

function ChevronIcon({ direction }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

function CollegeCard({ college }) {
  const departments = college.departments ?? [];
  const shown = departments.slice(0, VISIBLE_DEPARTMENTS);
  const restCount = departments.length - shown.length;

  return (
    <Link
      to="/colleges"
      className="flex w-[220px] shrink-0 flex-col gap-3 rounded-card border border-gray-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-card"
    >
      <span className="text-[15px] font-bold text-gray-900">
        {college.name}
      </span>

      <span className="text-xs text-gray-400">
        연구실 {college.laboratoryCount} · 학과 {college.departmentCount}
      </span>

      <span className="flex flex-wrap gap-1.5">
        {shown.map((department) => (
          <span
            key={department.id}
            className="rounded-field bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500"
          >
            {department.name}
          </span>
        ))}
        {restCount > 0 && (
          <span className="rounded-field bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-400">
            +{restCount}
          </span>
        )}
      </span>
    </Link>
  );
}

function CollegeSection({ colleges, status }) {
  const trackRef = useRef(null);
  const scrollBy = (amount) =>
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });

  const arrowClass =
    "flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900";

  return (
    <section className="mx-auto max-w-6xl px-6 pt-8 pb-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">단과대학 둘러보기</h2>
          <p className="mt-1 text-xs text-gray-400">
            세종대학교 {colleges.length}개 단과대학 · 전체 연구실 탐색
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-480)}
            aria-label="이전 단과대학 보기"
            className={arrowClass}
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(480)}
            aria-label="다음 단과대학 보기"
            className={arrowClass}
          >
            <ChevronIcon direction="right" />
          </button>
          <Link
            to="/colleges"
            className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[13px] font-bold text-gray-700 transition-colors hover:border-brand-200 hover:text-brand-600"
          >
            전체보기
          </Link>
        </div>
      </div>

      {status === "loading" && (
        <p className="mt-6 text-sm text-gray-400">불러오는 중이에요…</p>
      )}

      {status === "error" && (
        <p className="mt-6 text-sm text-gray-400">
          단과대학 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {status === "success" && colleges.length === 0 && (
        <p className="mt-6 text-sm text-gray-400">
          아직 등록된 단과대학이 없어요.
        </p>
      )}

      {status === "success" && colleges.length > 0 && (
        <div
          ref={trackRef}
          className="mt-6 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {colleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CollegeSection;
