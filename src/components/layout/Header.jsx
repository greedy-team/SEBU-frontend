import { useState, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { logout } from "../../features/auth/api/authApi";
import { initCsrf } from "../../features/auth/api/authApi";
import MobileMenu from "./MobileMenu";
import sebuLogo from "../../assets/sebu-logo.svg";

function HamburgerIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

const navItemClass = ({ isActive }) =>
  [
    "px-3 py-2 text-[15px] font-semibold whitespace-nowrap transition-colors duration-150",
    isActive ? "text-brand-500" : "text-gray-700 hover:text-brand-500",
  ].join(" ");

function Header() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const { pathname } = useLocation();
  const isLabArea = pathname.startsWith("/community/labs");
  // const isCommunityArea = pathname.startsWith("/community") && !isLabArea;
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      await initCsrf(); // 로그아웃 후 CSRF 재초기화

      // 로그인 필수 페이지(마이페이지)에 있었을 때만 홈으로 이동.
      // 그 외 페이지는 비로그인 상태로도 볼 수 있으니 그대로 유지한다.
      if (pathname === "/mypage") {
        navigate("/");
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 md:h-[72px] md:px-6">
        <Link to="/" aria-label="SEBU 홈" className="shrink-0">
          <img src={sebuLogo} alt="SEBU" className="h-7 w-auto md:h-8" />
        </Link>

        <nav className="ml-8 hidden items-center gap-3 md:flex">
          <NavLink to="/search" className={navItemClass}>
            연구실 탐색하기
          </NavLink>
          <NavLink to="/colleges" className={navItemClass}>
            단과대별 보기
          </NavLink>
          {/* 커뮤니티는 MVP 범위에서 제외 */}
          {/* <NavLink
            to="/community"
            className={navItemClass({ isActive: isCommunityArea })}
          >
            커뮤니티
          </NavLink> */}
          <Link
            to="/community/labs"
            className={navItemClass({ isActive: isLabArea })}
          >
            랩실 평가
          </Link>
        </nav>

        {/* 모바일: 햄버거 버튼 */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
        >
          <HamburgerIcon />
        </button>

        {/* 데스크톱: 사용자 메뉴 */}
        <div className="ml-auto hidden items-center gap-1 md:flex">
          {user ? (
            <>
              <Link
                to="/mypage"
                className="px-2 text-[13px] font-medium whitespace-nowrap text-gray-600 transition-colors hover:text-gray-900"
              >
                마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="px-2 text-[13px] font-medium whitespace-nowrap text-gray-400 transition-colors hover:text-gray-700"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-2 text-[13px] font-medium whitespace-nowrap text-gray-400 transition-colors hover:text-gray-700"
            >
              로그인
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <MobileMenu user={user} onLogout={handleLogout} onClose={closeMenu} />
      )}
    </header>
  );
}

export default Header;
