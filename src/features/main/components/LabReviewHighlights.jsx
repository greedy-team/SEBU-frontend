import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLaboratoriesQuery } from "../../../api/queries/laboratories";

const PAGE_SIZE = 3;
const MAX_ITEMS = 9;

function ChatIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

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

const pagerButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40";

// 새로 올라온 후기 API가 생기기 전까지는, 랩실 후기 페이지와 같은 기준(후기 많은 순)으로 보여줍니다.
function LabReviewHighlights() {
  const { data: labs = [], isLoading, error } = useLaboratoriesQuery();
  const [page, setPage] = useState(0);

  const items = useMemo(
    () =>
      labs
        .filter((lab) => (lab.reviewCount ?? 0) > 0)
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, MAX_ITEMS),
    [labs],
  );

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const visible = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div
      className="rounded-3xl bg-white p-6 md:p-8"
      style={{ boxShadow: "var(--shadow-widget)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold text-brand-500">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            랩실 후기
          </p>
          <h2 className="mt-2 text-[22px] font-black tracking-[-0.01em] text-gray-900">
            연구실 후기
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setPage((prev) => (prev - 1 + pageCount) % pageCount)
            }
            disabled={pageCount <= 1}
            aria-label="이전 후기 보기"
            className={pagerButtonClass}
          >
            <ChevronIcon direction="left" />
          </button>
          <span className="min-w-10 text-center text-xs text-gray-300">
            {page + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => (prev + 1) % pageCount)}
            disabled={pageCount <= 1}
            aria-label="다음 후기 보기"
            className={pagerButtonClass}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading && (
          <p className="py-10 text-center text-sm text-gray-400">
            불러오는 중이에요…
          </p>
        )}

        {error && (
          <p className="py-10 text-center text-sm text-gray-400">
            랩실 후기를 불러오지 못했어요.
          </p>
        )}

        {!isLoading && !error && items.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">
            아직 등록된 후기가 없어요.
          </p>
        )}

        {visible.map((lab) => (
          <Link
            key={lab.id}
            to={`/community/labs/${lab.id}`}
            className="flex items-center gap-4 rounded-2xl bg-gray-50 px-4 py-4 transition-colors hover:bg-brand-50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-500">
              <ChatIcon />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold text-gray-900">
                {lab.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-gray-500">
                {lab.professor?.name} 교수 · {lab.department?.name}
              </p>
            </div>
            <span className="shrink-0 text-xs font-medium text-gray-400">
              후기 {lab.reviewCount}개
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LabReviewHighlights;
