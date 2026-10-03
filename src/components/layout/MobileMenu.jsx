import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/navigation";
import sebuLogo from "../../assets/sebu-logo.svg";

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const itemClass = ({ isActive }) =>
  `block rounded-control px-4 py-3 text-[15px] ${
    isActive
      ? "bg-brand-50 font-bold text-brand-600"
      : "font-semibold text-gray-800 hover:bg-gray-50"
  }`;

const subItemClass =
  "block rounded-control px-4 py-3 text-left text-[14px] font-medium text-gray-600 hover:bg-gray-50";

function MobileMenu({ user, onLogout, onClose }) {
  const { pathname } = useLocation();

  // 메뉴가 열려 있는 동안 뒤 화면 스크롤을 막고 Esc로 닫는다
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // 헤더에 backdrop-blur가 걸려 있으면 그 안의 fixed 요소가 화면이 아니라 헤더 크기에 갇히므로
  // 서랍은 body에 직접 그린다.
  return createPortal(
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="메뉴"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <nav
        className="absolute top-0 right-0 flex h-full w-72 max-w-[85vw] flex-col bg-white"
        style={{ boxShadow: "var(--shadow-mega)" }}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
          <img src={sebuLogo} alt="SEBU" className="h-7 w-auto" />
          <button
            type="button"
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                // 모바일의 홈(/)은 검색 페이지를 그대로 보여주므로 검색 메뉴도 선택 표시
                itemClass({
                  isActive: isActive || (to === "/search" && pathname === "/"),
                })
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-1 border-t border-gray-100 p-3">
          {user ? (
            <>
              <Link to="/mypage" onClick={onClose} className={subItemClass}>
                마이페이지
              </Link>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className={subItemClass}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" onClick={onClose} className={subItemClass}>
              로그인
            </Link>
          )}
        </div>
      </nav>
    </div>,
    document.body,
  );
}

export default MobileMenu;
