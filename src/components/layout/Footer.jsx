import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <p className="text-xs font-bold tracking-wide text-gray-500 mb-4">
            서비스
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link to="/search" className="transition-colors hover:text-white">
                연구실 탐색
              </Link>
            </li>
            <li>
              <Link
                to="/colleges"
                className="transition-colors hover:text-white"
              >
                단과대별 보기
              </Link>
            </li>
            <li>
              <Link
                to="/community"
                className="transition-colors hover:text-white"
              >
                커뮤니티
              </Link>
            </li>
          </ul>
        </div>

        <hr className="my-8 border-gray-700" />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <p>
            <span className="font-bold text-white">SEBU</span> ·
            세종대학교 학부연구생 플랫폼
          </p>
          <p>© 2026 SEBU. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
