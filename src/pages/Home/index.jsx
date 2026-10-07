import MainPage from "../Main";
import SearchPage from "../Search";
import { useIsMobile } from "../../hooks/useIsMobile";

// 모바일은 소개용 메인 없이 검색 페이지가 곧 홈.
// 리다이렉트(Navigate)로 보내면 이동하는 한 프레임 동안 페이지가 비어 푸터가 맨 위로 깜빡이므로,
// 이동 없이 바로 검색 페이지를 그린다.
function HomePage() {
  const isMobile = useIsMobile();

  return isMobile ? <SearchPage /> : <MainPage />;
}

export default HomePage;
