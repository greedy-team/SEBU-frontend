import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/Search";
import CollegeView from "./pages/CollegeView";
import LoginPage from "./pages/Login";
import MyPage from "./pages/MyPage";
import DesignSystem from "./pages/DesignSystem";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/colleges" element={<CollegeView />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/design-system" element={<DesignSystem />} />
    </Routes>
  );
}

export default App;
