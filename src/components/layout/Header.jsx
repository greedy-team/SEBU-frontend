import { useState, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { logout } from "../../features/auth/api/authApi";
import { initCsrf } from "../../features/auth/api/authApi";
import MobileMenu from "./MobileMenu";
import { NAV_ITEMS } from "../../constants/navigation";
import { REPORT_FORM_URL } from "../../constants/links";

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

function HeadsetIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
      <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
    </svg>
  );
}

const navItemClass = ({ isActive }) =>
  [
    "rounded-control px-3 py-2 text-[15px] whitespace-nowrap transition-colors duration-150",
    isActive
      ? "bg-brand-50 font-bold text-brand-500"
      : "font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand-500",
  ].join(" ");

function Header() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const { pathname, search } = useLocation();
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
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 md:px-6">
        <Link to="/" aria-label="SEBU 홈" className="shrink-0">
          <span className="text-[22px] font-black tracking-[-0.02em] text-brand-500">
            SEBU
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navItemClass}>
              {label}
            </NavLink>
          ))}
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
              state={{ from: pathname + search }}
              className="px-2 text-[13px] font-medium whitespace-nowrap text-gray-400 transition-colors hover:text-gray-700"
            >
              로그인
            </Link>
          )}
          {/* 신고/제보: 아이콘 버튼, 맨 오른쪽 끝 */}
          <a
            href={REPORT_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="신고/제보"
            title="신고/제보"
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
          >
            <HeadsetIcon />
          </a>
        </div>
      </div>

      {menuOpen && (
        <MobileMenu user={user} onLogout={handleLogout} onClose={closeMenu} />
      )}
    </header>
  );
}

export default Header;
