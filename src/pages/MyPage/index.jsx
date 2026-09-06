import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/layout/Header";
import ProfileHeader from "../../features/mypage/components/ProfileHeader";
import ProfileModal from "../../features/mypage/components/ProfileModal";
import SummaryCards from "../../features/mypage/components/SummaryCards";
import BookmarkedLabs from "../../features/mypage/components/BookmarkedLabs";
import BookmarkedPosts from "../../features/mypage/components/BookmarkedPosts";
import { useMyPage } from "../../features/mypage/hooks/useMyPage";
import { useProfileForm } from "../../features/mypage/hooks/useProfileForm";
import { useAuthStore } from "../../store/authStore";

function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const updateUser = useAuthStore((state) => state.updateUser);

  const { data, isLoading: isPageLoading, error: pageError } = useMyPage();

  // data를 초기값으로 사용 (useEffect 제거)
  const [pageData, setPageData] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      ...prev,
      profile: savedProfile,
    }));
    setIsModalOpen(false);
  });

  // data 받아오면 pageData 업데이트 (useMemo로 대체)
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

  const { profile, summary } = currentData;

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
                <span>{profile.major?.name}</span>
              </>
            ) : (
              <span className="text-gray-400">내 정보를 입력해주세요</span>
            )}
          </div>
          <span className="text-xs text-blue-600">
            {profile.profileCompleted ? "내 정보 보기 →" : "입력하기 →"}
          </span>
        </button>

        <SummaryCards summary={summary} />

        <BookmarkedLabs
          items={currentData.bookmarkedLaboratories.items}
          hasNext={currentData.bookmarkedLaboratories.hasNext}
        />

        <BookmarkedPosts
          items={currentData.bookmarkedPosts.items}
          hasNext={currentData.bookmarkedPosts.hasNext}
        />
      </div>

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
    </div>
  );
}

export default MyPage;
