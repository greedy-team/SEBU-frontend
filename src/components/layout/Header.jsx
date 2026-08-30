import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { logout } from "../../features/auth/api/authApi";

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
  const status = useAuthStore((state) => state.status);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  /**
   * 로그아웃
   *
   * 서버 호출이 실패해도 프론트는 반드시 로그아웃 처리합니다.
   * 사용자가 로그아웃을 눌렀는데 네트워크 오류로 여전히 로그인 상태면
   * 그게 훨씬 이상하기 때문에, finally에서 무조건 상태를 비웁니다.
   *
   * 이동은 로그인 페이지가 아니라 홈입니다.
   * 비로그인도 연구실을 둘러볼 수 있는 서비스라, 로그아웃 직후 로그인 화면이 뜨면
   * "다시 로그인하라"는 압박으로 읽힙니다. (명세 §7과 다르게 구현한 부분)
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // 네트워크 오류 — 그래도 아래 finally에서 로그아웃 처리합니다
    } finally {
      clearAuth();
      navigate("/");
    }
  };

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
          {/*
            인증 상태 3분기.
            loading일 때 '로그인'을 먼저 그리면, 복원이 끝나는 순간
            '마이페이지'로 바뀌면서 깜빡입니다. 그래서 판단이 끝날 때까지 보류합니다.
            자리는 유지해야 옆의 CTA 버튼이 밀리지 않습니다.
          */}
          {status === "loading" ? (
            <span
              className="px-2 text-[13px] font-medium whitespace-nowrap opacity-0"
              aria-hidden="true"
            >
              마이페이지
            </span>
          ) : status === "authenticated" ? (
            <>
              <Link
                to="/mypage"
                className="px-2 text-[13px] font-medium whitespace-nowrap text-gray-600 transition-colors hover:text-gray-900"
              >
                마이페이지
              </Link>
              <button
                type="button"
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
