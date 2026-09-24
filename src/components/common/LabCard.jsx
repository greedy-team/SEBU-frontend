import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import LabDetailModal from "./LabDetailModal";
import { addLabBookmark, removeLabBookmark } from "../../api/bookmarkApi";
import { useAuthStore } from "../../store/authStore";
import { queryClient } from "../../api/queryClient";
import { updateLabBookmarkCache } from "../../api/queries/laboratories";
import BookmarkIcon from "./BookmarkIcon";

function LabCard({ lab, onUnbookmark }) {
  const [showModal, setShowModal] = useState(false);
  const [bookmarked, setBookmarked] = useState(lab.bookmarked ?? false);
  const [bookmarkCount, setBookmarkCount] = useState(lab.bookmarkCount ?? 0);

  // 캐시(props)가 새로 바뀌면 로컬 state도 맞춰줌
  // (로그인/로그아웃 후 재요청, 다른 화면에서 북마크 변경 등)
  const [prevLab, setPrevLab] = useState(lab);
  if (lab !== prevLab) {
    setPrevLab(lab);
    setBookmarked(lab.bookmarked ?? false);
    setBookmarkCount(lab.bookmarkCount ?? 0);
  }

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const {
    name,
    professor,
    college,
    department,
    researchFields,
    // recruitmentStatus,
  } = lab;

  const { mutate: toggleBookmark } = useMutation({
    mutationFn: (isBookmarked) =>
      isBookmarked ? removeLabBookmark(lab.id) : addLabBookmark(lab.id),

    // API 호출 전 낙관적 업데이트
    onMutate: (isBookmarked) => {
      const nextBookmarked = !isBookmarked;
      setBookmarked(nextBookmarked);
      setBookmarkCount((prev) => (nextBookmarked ? prev + 1 : prev - 1));
      //return { isBookmarked }; // 롤백용 이전 상태 저장 constext안써서 주석처리
    },

    // 성공 시 MyPage 캐시 무효화
    onSuccess: (_, isBookmarked) => {
      updateLabBookmarkCache(lab.id, !isBookmarked);

      // isBookmarked = 클릭 전 상태 → true면 이번 요청은 "해제"
      if (isBookmarked) {
        onUnbookmark?.(lab.id);
      }

      queryClient.invalidateQueries({ queryKey: ["mypage"] });
    },

    // 실패 시 롤백
    onError: (_, isBookmarked) => {
      setBookmarked(isBookmarked);
      setBookmarkCount((prev) => (isBookmarked ? prev + 1 : prev - 1));
    },
  });

  const handleBookmark = (e) => {
    e?.stopPropagation();
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    toggleBookmark(bookmarked);
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
        <LabDetailModal
          lab={lab}
          bookmarked={bookmarked}
          bookmarkCount={bookmarkCount}
          onToggleBookmark={handleBookmark}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default LabCard;
