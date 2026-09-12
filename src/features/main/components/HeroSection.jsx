import { Link } from "react-router-dom";

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
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

function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-[11px] font-bold tracking-[0.14em] text-brand-500 uppercase">
        Sejong University · Undergraduate Research Platform
      </p>

      <h1 className="mt-5 text-[40px] leading-[1.2] font-black tracking-[-0.02em] text-gray-900">
        세종대학교 학부연구생
        <br />
        플랫폼, SEBU
      </h1>

      <p className="mt-5 text-[15px] leading-relaxed text-gray-500">
        연구실 탐색부터 교수님 컨택, 합격 후기까지 —
        <br />
        학부연구생을 꿈꾸는 세종대생을 위한 전용 플랫폼입니다.
      </p>

      <div className="mt-9 flex flex-wrap gap-3">
        <Link
          to="/search"
          className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-95"
          style={{ boxShadow: "var(--shadow-cta)" }}
        >
          연구실 탐색하기
          <ArrowRightIcon />
        </Link>

        <Link
          to="/colleges"
          className="flex items-center gap-2 rounded-full bg-brand-50 px-6 py-3 text-sm font-bold text-brand-600 transition-colors hover:bg-brand-100"
        >
          단과대 전체보기
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
