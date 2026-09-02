import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // updateUser만 구독 (accessToken은 인터셉터가 처리)
  const updateUser = useAuthStore((state) => state.updateUser);

  const { data, isLoading: isPageLoading, error: pageError } = useMyPage();
  const [pageData, setPageData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setPageData(data);
      // 최초 로그인이면 모달 자동으로 열기
      if (!data.profile.profileCompleted) {
        setIsModalOpen(true);
      }
    }
  }, [data]);

  useEffect(() => {
    if (!isPageLoading && !data) {
      navigate("/login");
    }
  }, [isPageLoading, data, navigate]);

  const {
  handleSubmit,
  isLoading: isFormLoading,
  introError,
  formError,
} = useProfileForm(
  pageData?.profile,
  updateUser, // accessToken 없음
  (savedProfile) => {
    setPageData((prev) => ({
      ...prev,
      profile: savedProfile,
    }));
    setIsModalOpen(false); // isEditing 대신 모달 닫기
  },
);

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

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-gray-400 text-sm">불러오는 중...</p>
        </div>
      </div>
    );
  }

  const { profile, summary } = pageData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-xs text-gray-400 mb-4">SEBU &gt; 마이페이지</p>

        {/* 프로필 헤더 */}
        <ProfileHeader
          name={profile.name}
          grade={profile.grade}
          profileCompleted={profile.profileCompleted}
        />

        {/* 한 줄 요약 버튼 */}
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

        {/* 요약 카드 */}
        <SummaryCards summary={summary} />

        {/* 관심 랩실 */}
        <BookmarkedLabs
          items={pageData.bookmarkedLaboratories.items}
          hasNext={pageData.bookmarkedLaboratories.hasNext}
        />

        {/* 북마크 게시글 */}
        <BookmarkedPosts
          items={pageData.bookmarkedPosts.items}
          hasNext={pageData.bookmarkedPosts.hasNext}
        />
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
    </div>
  );
}

export default MyPage;
