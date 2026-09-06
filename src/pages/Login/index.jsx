import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../../features/auth/components/LoginForm";

/**
 * 로그인 페이지.
 *
 * Figma대로 전체 내비게이션 대신 뒤로가기 + 로고만 있는 최소 헤더를 씁니다.
 * 로그인 화면에서 다른 메뉴로 새는 걸 막으려는 의도예요.
 */

function ArrowLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex h-14 items-center gap-3 px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="뒤로 가기"
        >
          <ArrowLeftIcon />
        </button>
        <Link
          to="/"
          className="text-[18px] font-black tracking-[-0.02em] text-brand-500"
        >
          SEBU
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[400px] px-6 pt-10 pb-16">
        <h1 className="text-2xl font-black tracking-tight text-gray-900">로그인</h1>
        <p className="mt-2 mb-6 text-[13px] leading-relaxed text-gray-400">
          SEBU 계정으로 로그인하고
          <br />
          학부연구생 탐색을 시작해보세요.
        </p>

        <LoginForm />

        <div className="mt-5 flex items-start gap-2.5 rounded-control bg-brand-50 px-4 py-3.5">
          <span className="mt-px shrink-0 text-brand-500">
            <InfoIcon />
          </span>
          <p className="text-[12px] leading-relaxed text-gray-600">
            세종대학교 포털(portal.sejong.ac.kr) 계정으로 로그인하세요.
            <br />
            재학생·교직원만 이용할 수 있어요.
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
