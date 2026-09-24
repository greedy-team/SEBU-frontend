import { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/Main";
import SearchPage from "./pages/Search";
import CollegeView from "./pages/CollegeView";
import LoginPage from "./pages/Login";
import MyPage from "./pages/MyPage";
import DesignSystem from "./pages/DesignSystem";
// import CommunityPage from "./pages/Community";
// import PostDetailPage from "./pages/PostDetail";
// import PostWritePage from "./pages/PostWrite";
import RateLimitToast from "./components/common/RateLimitToast";
import Footer from "./components/layout/Footer";
import LabReviewHomePage from "./pages/LabReviewHome";
import LabReviewPage from "./pages/LabReview";
import LabReviewWritePage from "./pages/LabReviewWrite";
import { useAuthRestore } from "./features/auth/hooks/useAuthRestore";
import NotFoundPage from "./pages/NotFound";
import ScrollToTop from "./components/common/ScrollToTop";
import { useAuthStore } from "./store/authStore";
import { queryClient } from "./api/queryClient";

function App() {
  useAuthRestore();

  // 로그인 사용자가 바뀌면 사용자별 캐시 정리
  // (로그인, 로그아웃, 계정 복구, 탈퇴, 새로고침 복원 전부 여기서 처리)
  const userId = useAuthStore((state) => state.user?.id);
  const prevUserIdRef = useRef(userId);

  useEffect(() => {
    if (prevUserIdRef.current === userId) return;
    prevUserIdRef.current = userId;

    // 이전 사용자의 마이페이지 데이터 삭제
    queryClient.removeQueries({ queryKey: ["mypage"] });
    // bookmarked가 사용자 기준 값이라 연구실 목록 다시 받기
    queryClient.invalidateQueries({
      queryKey: ["laboratories"],
      refetchType: "all",
    });
  }, [userId]);

  return (
    <>
      <ScrollToTop />
      <RateLimitToast />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/colleges" element={<CollegeView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/design-system" element={<DesignSystem />} />

        {/* <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/write" element={<PostWritePage />} />
        <Route path="/community/:postId" element={<PostDetailPage />} />
        <Route path="/community/:postId/edit" element={<PostWritePage />} /> */}

        <Route path="/community/labs" element={<LabReviewHomePage />} />
        <Route
          path="/community/labs/:laboratoryId"
          element={<LabReviewPage />}
        />
        <Route
          path="/community/labs/:laboratoryId/write"
          element={<LabReviewWritePage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
