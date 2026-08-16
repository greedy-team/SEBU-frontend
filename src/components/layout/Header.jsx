import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

function Header() {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 border-b border-gray-200 flex items-center px-6 bg-white relative">
      <Link to="/" className="font-bold text-blue-600 text-xl">
        SEBU
      </Link>

      <nav className="ml-8 flex gap-6 text-sm text-gray-600">
        <div className="relative">
          <button
            onClick={() => setIsExploreOpen((prev) => !prev)}
            className="flex items-center gap-1"
          >
            탐색
          </button>

          {isExploreOpen && (
            <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-md py-2 w-40 z-10">
              <Link
                to="/colleges"
                onClick={() => setIsExploreOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                단과대별 보기
              </Link>
            </div>
          )}
        </div>

        <span>커뮤니티</span>
      </nav>

      {user ? (
        <Link
          to="/mypage-setup"
          className="ml-auto text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
        >
          마이페이지
        </Link>
      ) : (
        <Link
          to="/login"
          className="ml-auto text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          로그인
        </Link>
      )}
    </header>
  );
}

export default Header;
