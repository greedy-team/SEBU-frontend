import { useState } from "react";
import LabDetailModal from "./LabDetailModal";
import { addLabBookmark, removeLabBookmark } from "../../api/bookmarkApi";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

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

function LabCard({ lab, onUnbookmark }) {
  const [showModal, setShowModal] = useState(false);
  const [bookmarked, setBookmarked] = useState(lab.bookmarked ?? false);
  const [bookmarkCount, setBookmarkCount] = useState(lab.bookmarkCount ?? 0);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const {
    name,
    professor,
    college,
    department,
    researchFields,
    recruitmentStatus,
  } = lab;

  const handleBookmark = async (e) => {
    e.stopPropagation();

    // 비로그인 시 무시
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    // Optimistic Update
    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);
    setBookmarkCount((prev) => (nextBookmarked ? prev + 1 : prev - 1));

    const { ok } = nextBookmarked
      ? await addLabBookmark(lab.id)
      : await removeLabBookmark(lab.id);

    // 실패 시 롤백
    if (!ok) {
      setBookmarked(!nextBookmarked);
      setBookmarkCount((prev) => (nextBookmarked ? prev - 1 : prev + 1));
      return;
    }

    // 해제 성공 시 상위(마이페이지 목록 등)에 알림
    if (!nextBookmarked) {
      onUnbookmark?.(lab.id);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group relative cursor-pointer overflow-hidden rounded-card border border-gray-200 bg-white p-5 transition-all duration-150 hover:border-brand-500 hover:shadow-widget"
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

            <button
              aria-label={bookmarked ? "북마크 해제" : "북마크"}
              onClick={handleBookmark}
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
