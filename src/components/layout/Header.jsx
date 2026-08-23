import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

/**
 * 상단 내비게이션.
 *
 * 스타일·인터랙션은 Figma(세부 와이어프레임 / App.tsx의 Navbar)를 따릅니다.
 *   - 높이 56px, max-w-6xl 중앙 정렬
 *   - 항목 hover 시 brand-50 배경 + brand-500 글자 + bold, 150ms 전환
 *   - CTA는 pill + shadow-cta
 *
 * 항목은 라우트가 있는 것만 넣습니다 (DESIGN_SYSTEM.md §1 "범위는 코드 기준").
 * Figma에는 '커뮤니티'·'튜토리얼'과 각각의 메가메뉴, 그리고 우측 아이콘
 * (검색·알림·북마크)이 더 있어요. 해당 페이지/기능이 생기면 그때 추가합니다.
 */

function ArrowRightIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const navItemClass = ({ isActive }) =>
  [
    "rounded-control px-4 py-2 text-[13.5px] whitespace-nowrap transition-all duration-150",
    isActive
      ? "bg-brand-50 font-bold text-brand-500"
      : "font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-500",
  ].join(" ");

function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header
      className="sticky top-0 z-40 bg-white"
      style={{ boxShadow: "var(--shadow-header)" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
        <Link
          to="/"
          className="text-[20px] font-black tracking-[-0.02em] text-brand-500"
        >
          SEBU
        </Link>

        <nav className="ml-8 flex items-center gap-1">
          <NavLink to="/colleges" className={navItemClass}>
            단과대별 보기
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {user ? (
            <Link
              to="/mypage"
              className="px-2 text-[13px] font-medium whitespace-nowrap text-gray-600 transition-colors hover:text-gray-900"
            >
              마이페이지
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-2 text-[13px] font-medium whitespace-nowrap text-gray-400 transition-colors hover:text-gray-700"
            >
              로그인
            </Link>
          )}

          <Link
            to="/"
            className="ml-1 flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-[13px] font-bold whitespace-nowrap text-white transition-all hover:brightness-95"
            style={{ boxShadow: "var(--shadow-cta)" }}
          >
            연구실 탐색하기
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
