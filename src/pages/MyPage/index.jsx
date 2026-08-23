import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import ProfileHeader from "../../features/mypage/components/ProfileHeader";
import ProfileForm from "../../features/mypage/components/ProfileForm";
import ProfileView from "../../features/mypage/components/ProfileView";
import SummaryCards from "../../features/mypage/components/SummaryCards";
import BookmarkedLabs from "../../features/mypage/components/BookmarkedLabs";
import BookmarkedPosts from "../../features/mypage/components/BookmarkedPosts";
import { useMyPage } from "../../features/mypage/hooks/useMyPage";
import { useProfileForm } from "../../features/mypage/hooks/useProfileForm";

function MyPage() {
  const navigate = useNavigate();
  const { data, isLoading: isPageLoading, error: pageError } = useMyPage();
  const [pageData, setPageData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // useMyPage에서 데이터 받으면 pageData에 저장
  useEffect(() => {
    if (data) {
      setPageData(data);
      setIsEditing(!data.profile.profileCompleted);
    }
  }, [data]);

  // 로그인 안 된 상태면 로그인 페이지로
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
  } = useProfileForm(pageData?.profile, (savedProfile) => {
    setPageData((prev) => ({
      ...prev,
      profile: savedProfile,
    }));
    setIsEditing(false);
  });

  // 로딩 중
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

  // 에러
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

  // pageData 없을 때 (navigate 처리 중)
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
  const showForm = !profile.profileCompleted || isEditing;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <p className="text-xs text-gray-400 mb-4">SEBU &gt; 마이페이지</p>

        {/* 프로필 헤더 */}
        <ProfileHeader
          name={profile.name}
          grade={profile.grade}
          profileCompleted={profile.profileCompleted}
        />

        {/* 프로필 폼 or 뷰 */}
        {showForm ? (
          <ProfileForm
            initialData={profile}
            onSubmit={handleSubmit}
            isLoading={isFormLoading}
            introError={introError}
            formError={formError}
          />
        ) : (
          <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
        )}

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
    </div>
  );
}

export default MyPage;
