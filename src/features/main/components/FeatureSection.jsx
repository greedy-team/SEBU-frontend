import { Link } from "react-router-dom";

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const FEATURES = [
  {
    to: "/search",
    icon: SearchIcon,
    title: "연구실 탐색",
    description: "단과대, 학과, 키워드로 원하는 연구실을 빠르게 찾아보세요.",
  },
  {
    to: "/community/labs",
    icon: ReviewIcon,
    title: "랩실 평가",
    description: "먼저 경험한 학생들의 실제 후기로 연구실을 확인하세요.",
  },
];

function FeatureSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h2 className="text-lg font-bold text-gray-900">
        SEBU로 할 수 있는 것들
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FEATURES.map(({ to, icon: Icon, title, description }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col gap-3 rounded-card border border-gray-200 bg-white p-6 transition-all hover:border-brand-200 hover:shadow-card"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <Icon />
            </span>
            <span className="text-[15px] font-bold text-gray-900">
              {title}
            </span>
            <span className="text-sm leading-relaxed text-gray-500">
              {description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;
