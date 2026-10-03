import { useState } from "react";
import { Link } from "react-router-dom";
import LabDetailModal from "./LabDetailModal";
import BookmarkIcon from "./BookmarkIcon";
import { useLabBookmark } from "../../hooks/useLabBookmark";

function ReviewIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LabCard({ lab, onUnbookmark }) {
  const [showModal, setShowModal] = useState(false);
  const { bookmarked, bookmarkCount, toggleBookmark } = useLabBookmark(lab, {
    onUnbookmark,
  });

  const { name, professor, college, department, researchFields } = lab;

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group relative cursor-pointer overflow-hidden rounded-card border border-gray-200 bg-white p-4 transition-all duration-150 hover:border-brand-500 hover:shadow-widget md:p-5"
      >
        <span className="absolute top-5 bottom-5 left-3 w-1 rounded-full bg-brand-100 transition-colors duration-150 group-hover:bg-brand-500" />

        <div className="pl-4">
          <div className="mb-2 flex items-start gap-2">
            <span className="rounded-field bg-brand-50 px-2 py-1 text-xs font-bold text-brand-600">
              {college.name}
            </span>
            <span className="mt-1 text-xs text-gray-400">·</span>
            <span className="mt-1 text-xs text-gray-500">
              {department.name}
            </span>
          </div>

          <h3 className="text-base font-bold text-gray-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500">{professor.name} 교수</p>

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

            <div className="ml-auto flex shrink-0 items-center gap-3">
              <Link
                to={`/community/labs/${lab.id}`}
                onClick={(e) => e.stopPropagation()}
                aria-label={`${name} 랩실 평가 보러가기`}
                className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-600 transition-colors hover:bg-violet-100"
              >
                <ReviewIcon />
                후기
              </Link>

              <button
                aria-label={bookmarked ? "북마크 해제" : "북마크"}
                onClick={toggleBookmark}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
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
      </div>

      {showModal && (
        <LabDetailModal
          lab={lab}
          bookmarked={bookmarked}
          bookmarkCount={bookmarkCount}
          onToggleBookmark={toggleBookmark}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default LabCard;
