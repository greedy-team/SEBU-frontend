import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/layout/Header";
import ProfileHeader from "../../features/mypage/components/ProfileHeader";
import ProfileModal from "../../features/mypage/components/ProfileModal";
import SummaryCards from "../../features/mypage/components/SummaryCards";
import BookmarkedLabs from "../../features/mypage/components/BookmarkedLabs";
import { useMyPage } from "../../features/mypage/hooks/useMyPage";
import { useProfileForm } from "../../features/mypage/hooks/useProfileForm";
import { useAuthStore } from "../../store/authStore";
import { deleteAccount } from "../../features/mypage/api/mypageApi";
import { addLabBookmark } from "../../api/bookmarkApi";

function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const updateUser = useAuthStore((state) => state.updateUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const { data, isLoading: isPageLoading, error: pageError } = useMyPage();

  const [pageData, setPageData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [removedLabIds, setRemovedLabIds] = useState(() => new Set());
  const [undoTarget, setUndoTarget] = useState(null); // { item }
  const undoTimerRef = useRef(null);

  useEffect(() => {
    if (data) setPageData(data);
  }, [data]);

  useEffect(() => {
    return () => clearTimeout(undoTimerRef.current);
  }, []);

  useEffect(() => {
    if (!isPageLoading && !data) {
      navigate("/login", {
        state: { from: location.pathname },
      });
    }
  }, [isPageLoading, data, navigate, location.pathname]);

  const {
    handleSubmit,
    isLoading: isFormLoading,
    introError,
    formError,
  } = useProfileForm(pageData?.profile, updateUser, (savedProfile) => {
    setPageData((prev) => ({
      ...(prev ?? data),
      profile: savedProfile,
    }));
    setIsModalOpen(false);
  });

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { ok } = await deleteAccount();
      if (ok) {
        clearAuth();
        navigate("/login");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const currentData = pageData ?? data;

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-gray-400 text-sm">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-red-400 text-sm">{pageError}</p>
        </div>
      </div>
    );
  }

  if (!currentData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-gray-400 text-sm">불러오는 중...</p>
        </div>
      </div>
    );
  }

  const { profile } = currentData;
  const bookmarkedItems = currentData.bookmarkedLaboratories?.items ?? [];
  const visibleBookmarkedItems = bookmarkedItems.filter(
    (item) => !removedLabIds.has(item.laboratory.id),
  );

  const handleUnbookmark = (labId) => {
    const item = bookmarkedItems.find((i) => i.laboratory.id === labId);
    if (!item) return;

    setRemovedLabIds((prev) => new Set(prev).add(labId));
    setUndoTarget({ item });

    clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setUndoTarget(null), 4000);
  };

  const handleUndo = async () => {
    if (!undoTarget) return;
    clearTimeout(undoTimerRef.current);
    const labId = undoTarget.item.laboratory.id;
    setUndoTarget(null);

    const { ok } = await addLabBookmark(labId);
    if (!ok) return;

    setRemovedLabIds((prev) => {
      const next = new Set(prev);
      next.delete(labId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-xs text-gray-400 mb-4">SEBU &gt; 마이페이지</p>

        <ProfileHeader
          name={profile.name}
          grade={profile.grade}
          profileCompleted={profile.profileCompleted}
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition mb-4"
        >
          <div className="flex items-center gap-2 text-sm text-gray-700">
            {profile.profileCompleted ? (
              <>
                <span className="font-medium">{profile.name}</span>
                <span className="text-gray-300">·</span>
                <span>{profile.grade}학년</span>
                <span className="text-gray-300">·</span>
                <span>{profile.department?.name}</span>
              </>
            ) : (
              <span className="text-gray-400">내 정보를 입력해주세요</span>
            )}
          </div>
          <span className="text-xs text-blue-600">
            {profile.profileCompleted ? "내 정보 보기 →" : "입력하기 →"}
          </span>
        </button>

        <SummaryCards
          bookmarkedLaboratoryCount={visibleBookmarkedItems.length}
        />

        <BookmarkedLabs
          items={visibleBookmarkedItems}
          onUnbookmark={handleUnbookmark}
          undoTarget={undoTarget}
          onUndo={handleUndo}
        />

        {/* 회원 탈퇴 버튼 */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors group"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="group-hover:stroke-red-500 transition-colors"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            회원 탈퇴
          </button>
        </div>
      </div>

      {/* 프로필 모달 */}
      {isModalOpen && (
        <ProfileModal
          profile={profile}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isLoading={isFormLoading}
          introError={introError}
          formError={formError}
        />
      )}

      {/* 회원 탈퇴 확인 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6">
            <h2 className="font-bold text-base mb-2">정말 탈퇴하시겠어요?</h2>
            <p className="text-sm text-gray-500 mb-1">
              탈퇴 후 30일 이내에 재로그인하면 계정을 복구할 수 있어요.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              30일이 지나면 모든 데이터가 삭제됩니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
              >
                {isDeleting ? "탈퇴 중..." : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPage;
