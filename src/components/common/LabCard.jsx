import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import LabDetailModal from "./LabDetailModal";
import BookmarkIcon from "./BookmarkIcon";
import { addLabBookmark, removeLabBookmark } from "../../api/bookmarkApi";
import { useAuthStore } from "../../store/authStore";
import { queryClient } from "../../api/queryClient";
import {
  LABORATORIES_KEY,
  updateLabBookmarkCache,
} from "../../api/queries/laboratories";

function LabCard({ lab, onUnbookmark }) {
  const [showModal, setShowModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // 로컬 state 없이 캐시(props)를 그대로 사용
  const bookmarked = lab.bookmarked ?? false;
  const bookmarkCount = lab.bookmarkCount ?? 0;

  const { name, professor, college, department, researchFields } = lab;

  const { mutate: toggleBookmark } = useMutation({
    mutationFn: (isBookmarked) =>
      isBookmarked ? removeLabBookmark(lab.id) : addLabBookmark(lab.id),

    // 낙관적 업데이트 - 캐시를 먼저 수정
    onMutate: async (isBookmarked) => {
      // 진행 중인 재요청이 내 수정을 덮어쓰지 않도록 멈춤
      await queryClient.cancelQueries({ queryKey: LABORATORIES_KEY });

      // 롤백용 이전 캐시 저장
      const previous = queryClient.getQueryData(LABORATORIES_KEY);

      updateLabBookmarkCache(lab.id, !isBookmarked);

      return { previous };
    },

    // 실패 시 이전 캐시로 롤백
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(LABORATORIES_KEY, context.previous);
      }
    },

    onSuccess: (_, isBookmarked) => {
      // isBookmarked = 클릭 전 상태 → true면 이번 요청은 "해제"
      if (isBookmarked) {
        onUnbookmark?.(lab.id);
      }
      queryClient.invalidateQueries({ queryKey: ["mypage"] });
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
