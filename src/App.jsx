import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/Search";
import CollegeView from "./pages/CollegeView";
import LoginPage from "./pages/Login";
import MyPageSetup from "./pages/MyPageSetup";
import DesignSystem from "./pages/DesignSystem";

function App() {
  return (
    <Routes>
      {" "}
      <Route path="/" element={<SearchPage />} />{" "}
      <Route path="/colleges" element={<CollegeView />} />{" "}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mypage-setup" element={<MyPageSetup />} />
      <Route path="/design-system" element={<DesignSystem />} />
    </Routes>
  );
}
export default App;
