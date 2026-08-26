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
import { useAuthStore } from "../../store/authStore";

function MyPage() {
  const navigate = useNavigate();

  // authStore 구독은 여기서만
  const accessToken = useAuthStore((state) => state.accessToken);
  const updateUser = useAuthStore((state) => state.updateUser);

  const {
    data,
    isLoading: isPageLoading,
    error: pageError,
  } = useMyPage(accessToken);
  const [pageData, setPageData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (data) {
      setPageData(data);
      setIsEditing(!data.profile.profileCompleted);
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
    accessToken,
    updateUser,
    (savedProfile) => {
      setPageData((prev) => ({
        ...prev,
        profile: savedProfile,
      }));
      setIsEditing(false);
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
  const showForm = !profile.profileCompleted || isEditing;

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

        <SummaryCards summary={summary} />

        <BookmarkedLabs
          items={pageData.bookmarkedLaboratories.items}
          hasNext={pageData.bookmarkedLaboratories.hasNext}
        />

        <BookmarkedPosts
          items={pageData.bookmarkedPosts.items}
          hasNext={pageData.bookmarkedPosts.hasNext}
        />
      </div>
    </div>
  );
}

export default MyPage;
