import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/Search";
import CollegeView from "./pages/CollegeView";
import LoginPage from "./pages/Login";
import MyPage from "./pages/MyPage";
import DesignSystem from "./pages/DesignSystem";
import CommunityPage from "./pages/Community";
import PostDetailPage from "./pages/PostDetail";
import PostWritePage from "./pages/PostWrite";
import RateLimitToast from "./components/common/RateLimitToast";
import LabReviewHomePage from "./pages/LabReviewHome";
import LabReviewPage from "./pages/LabReview";
import LabReviewWritePage from "./pages/LabReviewWrite";
import { useAuthRestore } from "./features/auth/hooks/useAuthRestore";

function App() {
  useAuthRestore();

  return (
    <>
      <RateLimitToast />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/colleges" element={<CollegeView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/write" element={<PostWritePage />} />
        <Route path="/community/:postId" element={<PostDetailPage />} />
        <Route path="/community/labs" element={<LabReviewHomePage />} />
        <Route
          path="/community/labs/:laboratoryId/write"
          element={<LabReviewWritePage />}
        />
        <Route
          path="/community/labs/:laboratoryId"
          element={<LabReviewPage />}
        />
        <Route path="/community/:postId/edit" element={<PostWritePage />} />
      </Routes>
    </>
  );
}

export default App;
