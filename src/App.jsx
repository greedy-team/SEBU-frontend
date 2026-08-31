import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/Search";
import CollegeView from "./pages/CollegeView";
import LoginPage from "./pages/Login";
import MyPage from "./pages/MyPage";
import DesignSystem from "./pages/DesignSystem";
import CommunityPage from "./pages/Community";
import PostDetailPage from "./pages/PostDetail";
import PostWritePage from "./pages/PostWrite";
import LabReviewPage from "./pages/LabReview";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/colleges" element={<CollegeView />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/design-system" element={<DesignSystem />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/community/write" element={<PostWritePage />} />
      <Route path="/community/labs/:laboratoryId" element={<LabReviewPage />} />
      <Route path="/community/:postId" element={<PostDetailPage />} />
    </Routes>
  );
}

export default App;
