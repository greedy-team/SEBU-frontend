import { Link } from "react-router-dom";

const GITHUB_URL = "https://github.com/greedy-team/SEBU-frontend";

function GithubIcon() {
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
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

const linkClass = "transition-colors hover:text-white";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-24 md:px-6 md:pb-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex gap-16 md:gap-24">
            <div>
              <p className="mb-4 text-xs font-bold tracking-wide text-gray-500">
                서비스
              </p>
              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <Link to="/search" className={linkClass}>
                    연구실 탐색
                  </Link>
                </li>
                <li>
                  <Link to="/colleges" className={linkClass}>
                    단과대별 보기
                  </Link>
                </li>
                {/* <li>
                  <Link to="/community" className={linkClass}>
                    커뮤니티
                  </Link>
                </li> */}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold tracking-wide text-gray-500">
                정책
              </p>
              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <Link to="/privacy" className={linkClass}>
                    개인정보 처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:text-right">
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-gray-500">
              FOLLOW
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (SEBU-frontend)"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
            >
              <GithubIcon />
            </a>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <p>
            <span className="text-[15px] font-black text-brand-500">SEBU</span>
            <span className="mx-2 text-gray-700">·</span>
            세종대학교 학부연구생 플랫폼
          </p>
          <p>© 2026 SEBU. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
