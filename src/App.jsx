import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
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
import ScrollToTopButton from "./components/common/ScrollToTopButton";
import FetchingIndicator from "./components/common/FetchingIndicator";

// 개인정보 처리방침·이용약관은 마크다운 렌더러를 쓰는 무거운 페이지라서, 열 때만 불러온다.
const PrivacyPage = lazy(() => import("./pages/Privacy"));
const TermsPage = lazy(() => import("./pages/Terms"));

function App() {
  useAuthRestore();

  return (
    <>
      <ScrollToTop />
      <RateLimitToast />
      <FetchingIndicator />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/colleges" element={<CollegeView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route
          path="/privacy"
          element={
            // 불러오는 동안 화면이 비면 푸터가 맨 위로 올라와 깜빡이므로 빈 화면 높이를 채운다
            <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
              <PrivacyPage />
            </Suspense>
          }
        />
        <Route
          path="/terms"
          element={
            <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
              <TermsPage />
            </Suspense>
          }
        />

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
