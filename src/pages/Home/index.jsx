import { Navigate } from "react-router-dom";
import MainPage from "../Main";
import { useIsMobile } from "../../hooks/useIsMobile";

// 모바일은 소개용 메인 없이 검색 페이지가 곧 홈
function HomePage() {
  const isMobile = useIsMobile();

  if (isMobile) return <Navigate to="/search" replace />;
  return <MainPage />;
}

export default HomePage;
