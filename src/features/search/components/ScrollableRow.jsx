import { useRef } from "react";

function ChevronIcon({ direction }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

// 칩이 많으면 줄바꿈하면 화면을 많이 차지하므로, 한 줄로 두고 좌우 화살표로 넘겨봅니다.
// wrapOnDesktop: 데스크톱(md~)에서는 화살표 없이 줄바꿈 배치, 모바일에서만 캐러셀.
function ScrollableRow({ children, wrapOnDesktop = false }) {
  const trackRef = useRef(null);
  const scrollBy = (amount) =>
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });

  const arrowClass = `flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 ${
    wrapOnDesktop ? "md:hidden" : ""
  }`;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => scrollBy(-320)}
        aria-label="이전 목록 보기"
        className={arrowClass}
      >
        <ChevronIcon direction="left" />
      </button>

      {/* 스크롤바는 숨기고 화살표로만 넘기게 합니다. */}
      <div
        ref={trackRef}
        className={`flex gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          wrapOnDesktop ? "min-w-0 flex-1 md:flex-wrap md:overflow-visible" : ""
        }`}
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(320)}
        aria-label="다음 목록 보기"
        className={arrowClass}
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  );
}

export default ScrollableRow;
