import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  return (
    <header className="h-16 border-b border-gray-200 flex items-center px-6 bg-white relative">
      <span className="font-bold text-blue-600 text-xl">SEBU</span>

      <nav className="ml-8 flex gap-6 text-sm text-gray-600">
        {/* 탐색 드롭다운 */}
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

      <div className="ml-auto text-sm text-gray-500">로그인</div>
    </header>
  );
}

export default Header;
