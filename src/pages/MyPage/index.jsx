import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import ProfileHeader from "../../features/mypage/components/ProfileHeader";
import ProfileForm from "../../features/mypage/components/ProfileForm";
import ProfileView from "../../features/mypage/components/ProfileView";
import SummaryCards from "../../features/mypage/components/SummaryCards";
import BookmarkedLabs from "../../features/mypage/components/BookmarkedLabs";
import BookmarkedPosts from "../../features/mypage/components/BookmarkedPosts";

// 임시 더미 데이터 (나중에 API로 교체)
const DUMMY_PROFILE_COMPLETED = {
  profile: {
    name: "김세종",
    grade: 3,
    major: { id: "12", name: "소프트웨어학과" },
    gpaBand: "GTE_3_5",
    introduction: "머신러닝에 관심있습니다.",
    profileCompleted: true,
    profileUpdatedAt: "2026-08-17T01:30:00Z",
  },
  summary: {
    bookmarkedLaboratoryCount: 0,
    bookmarkedPostCount: 0,
    receivedRecommendationCount: 0,
  },
};

const DUMMY_PROFILE_EMPTY = {
  profile: {
    name: null,
    grade: null,
    major: null,
    gpaBand: null,
    introduction: null,
    profileCompleted: false,
    profileUpdatedAt: null,
  },
  summary: {
    bookmarkedLaboratoryCount: 0,
    bookmarkedPostCount: 0,
    receivedRecommendationCount: 0,
  },
};

function MyPage() {
  // 테스트용 - true면 프로필 완성, false면 미완성
  //const data = DUMMY_PROFILE_COMPLETED;
   const data = DUMMY_PROFILE_EMPTY; // 미완성 테스트할 때 이걸로 교체

  const { profile, summary } = data;
  const [isEditing, setIsEditing] = useState(!profile.profileCompleted);

  const handleSubmit = (formData) => {
    console.log("저장할 데이터:", formData);
    // 나중에 API 연결
  };

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
        {isEditing ? (
          <ProfileForm
            initialData={profile}
            onSubmit={handleSubmit}
            isLoading={false}
          />
        ) : (
          <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
        )}

        {/* 요약 카드 */}
        <SummaryCards summary={summary} />

        {/* 관심 랩실 */}
        <BookmarkedLabs />

        {/* 북마크 게시글 */}
        <BookmarkedPosts />
      </div>
    </div>
  );
}

export default MyPage;
