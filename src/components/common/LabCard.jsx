import { useState } from "react";
//import { RECRUITMENT_STATUS } from "../../constants/recruitmentStatus";
import LabDetailModal from "./LabDetailModal";

/* 모집 상태 배지 - 추후 표시 여부 논의 후 주석 해제
const STATUS_STYLE = {
  RECRUITING: { chip: "border-green-200 bg-green-50 text-green-600", dot: "bg-green-500" },
  ALWAYS_OPEN: { chip: "border-brand-200 bg-brand-50 text-brand-600", dot: "bg-brand-500" },
  CLOSED: { chip: "border-gray-200 bg-gray-50 text-gray-400", dot: "bg-gray-300" },
};
*/

function BookmarkIcon({ filled }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function LabCard({ lab }) {
  const [showModal, setShowModal] = useState(false);
  const {
    name,
    professor,
    college,
    department,
    researchFields,
    recruitmentStatus,
    bookmarkCount,
    bookmarked,
  } = lab;
  //const status = RECRUITMENT_STATUS[recruitmentStatus];
  //const statusStyle = STATUS_STYLE[recruitmentStatus] ?? STATUS_STYLE.CLOSED;

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group relative cursor-pointer overflow-hidden rounded-card border border-gray-200 bg-white p-5 transition-all duration-150 hover:border-brand-500 hover:shadow-widget"
      >
        {/* 좌측 세로 액센트 바 — 테두리에서 살짝 띄운 옅은 기둥, hover 시 진해집니다 */}
        <span className="absolute top-5 bottom-5 left-3 w-1 rounded-full bg-brand-100 transition-colors duration-150 group-hover:bg-brand-500" />

        <div className="pl-4">
          {/* 상단: 단과대 배지 · 학과 */}
          <div className="mb-2 flex items-start gap-2">
            <span className="rounded-field bg-brand-50 px-2 py-1 text-xs font-bold text-brand-600">
              {college.name}
            </span>
            <span className="mt-1 text-xs text-gray-400">·</span>
            <span className="mt-1 text-xs text-gray-500">{department.name}</span>

            {/* 모집 상태 배지 - 추후 표시 여부 논의 후 주석 해제
            <span
              className={`ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap ${statusStyle.chip}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
              {status.label}
            </span>
            */}
          </div>

          {/* 연구실명 · 교수 */}
          <h3 className="text-base font-bold text-gray-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500">{professor.name} 교수</p>

          {/* 하단: 연구 분야 태그 / 오른쪽 북마크 */}
          <div className="mt-3 flex items-end gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {researchFields?.map((field) => (
                <span
                  key={field}
                  className="rounded-field bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                >
                  {field}
                </span>
              ))}
            </div>

            <button
              aria-label="북마크"
              onClick={(e) => e.stopPropagation()}
              className={`ml-auto flex shrink-0 items-center gap-1.5 text-xs transition-colors ${
                bookmarked
                  ? "text-brand-500"
                  : "text-gray-400 hover:text-brand-500"
              }`}
            >
              <BookmarkIcon filled={bookmarked} />
              {bookmarkCount}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <LabDetailModal lab={lab} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default LabCard;
