import { useState, useMemo, useEffect, useRef } from "react";
import LabDetailModal from "../../../components/common/LabDetailModal";
import {
  TICKER_INTERVAL_MS,
  TICKER_FADE_MS,
  rankBadgeClass,
  tickerRankClass,
} from "../../../constants/designTokens";

/**
 * 실시간 인기 연구실.
 *
 * 접힘 = 티커 pill(40px) 한 줄이 자동으로 롤링,
 * 펼침 = 순위 카드(16px) 전체 목록.
 * 스타일·모션값은 Figma(App.tsx의 RankingWidget)를 따릅니다 — DESIGN_SYSTEM.md §5.
 *
 * 데이터·동작(북마크 수 기준 상위 5개, 클릭 시 상세 모달, hover 시 정지)은
 * 기존 로직 그대로예요.
 */

function ChevronDown({ flipped = false }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={flipped ? { transform: "rotate(180deg)" } : undefined}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const toggleButtonClass =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-150 hover:bg-brand-50 hover:text-brand-500";

function RecommendedLabs({ labs = [] }) {
  const [selectedLab, setSelectedLab] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const fadeTimer = useRef(null);

  const topLabs = useMemo(() => {
    return [...labs]
      .sort((a, b) => b.bookmarkCount - a.bookmarkCount)
      .slice(0, 5);
  }, [labs]);

  // 집계 기준 시각. 실제 API가 붙으면 응답의 타임스탬프로 교체하세요.
  const asOf = useMemo(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:00`;
  }, []);

  useEffect(() => {
    if (isExpanded || isHovered || topLabs.length === 0) return undefined;

    const interval = setInterval(() => {
      setIsVisible(false);
      fadeTimer.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % topLabs.length);
        setIsVisible(true);
      }, TICKER_FADE_MS);
    }, TICKER_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, [isExpanded, isHovered, topLabs.length]);

  const current = topLabs[currentIndex];
  const subtitleOf = (lab) => lab?.department?.name ?? lab?.college?.name ?? "";

  if (topLabs.length === 0) return null;

  return (
    <>
      <div
        className="overflow-hidden bg-white"
        style={{
          borderRadius: isExpanded ? 16 : 40,
          border: "1px solid var(--color-line-widget)",
          boxShadow: "var(--shadow-widget)",
          transition: "border-radius 0.22s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isExpanded ? (
          /* ── 접힘: 티커 pill ── */
          <div className="flex items-center gap-2 px-2 py-1.5">
            <span className="flex shrink-0 select-none items-center gap-1.5 rounded-full bg-live-bg px-2.5 py-1 text-[10.5px] font-black whitespace-nowrap text-live">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-70 animate-ping-slow" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
              </span>
              실시간
            </span>

            <button
              onClick={() => setSelectedLab(current)}
              className="min-w-0 flex-1 overflow-hidden text-left"
            >
              <div
                className="flex items-center gap-1.5 whitespace-nowrap"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(5px)",
                  transition: "opacity 0.22s ease, transform 0.22s ease",
                }}
              >
                <span
                  className={`shrink-0 text-center text-[12px] font-black ${tickerRankClass(currentIndex + 1)}`}
                  style={{ minWidth: 12 }}
                >
                  {currentIndex + 1}
                </span>
                <span className="truncate text-[12px] font-semibold text-gray-900">
                  {current?.name}
                </span>
              </div>
            </button>

            <button
              onClick={() => setIsExpanded(true)}
              className={toggleButtonClass}
              aria-label="인기 연구실 펼치기"
            >
              <ChevronDown />
            </button>
          </div>
        ) : (
          /* ── 펼침: 순위 카드 ── */
          <>
            <div className="flex items-start justify-between px-5 pt-4 pb-3.5">
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <h3 className="text-[14px] font-black tracking-[-0.01em] text-gray-900">
                    🔥 실시간 인기 연구실
                  </h3>
                  <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-live-dot opacity-60 animate-ping-slow" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-live-dot" />
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">오늘 {asOf} 기준</p>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className={toggleButtonClass}
                aria-label="인기 연구실 접기"
              >
                <ChevronDown flipped />
              </button>
            </div>

            <div className="mx-5 mb-1 h-px bg-gray-100" />

            <div className="pt-0.5 pb-3">
              {topLabs.map((lab, index) => (
                <button
                  key={lab.id}
                  onClick={() => setSelectedLab(lab)}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 hover:bg-gray-50"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-black ${rankBadgeClass(index + 1)}`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold leading-snug text-gray-900">
                      {lab.name}
                    </p>
                    <p className="mt-0.5 truncate text-[10.5px] text-gray-400">
                      {subtitleOf(lab)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedLab && (
        <LabDetailModal lab={selectedLab} onClose={() => setSelectedLab(null)} />
      )}
    </>
  );
}

export default RecommendedLabs;
