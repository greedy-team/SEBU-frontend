import { useEffect, useRef, useState } from "react";
import {
  SAMPLE_RANKED_LABS,
  TICKER_INTERVAL_MS,
  TICKER_FADE_MS,
  rankBadgeClass,
  tickerRankClass,
} from "../../../constants/designTokens";
import { Section } from "../components/Primitives";

function Label({ children, hint }) {
  return (
    <div className="mb-2">
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
        {children}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-gray-500">{hint}</p>}
    </div>
  );
}

function ChevronDown({ size = 12, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ── Navbar ────────────────────────────────────────────────────────────────
   실제 components/layout/Header.jsx 와 같은 클래스를 씁니다.
   Figma에는 항목 3개 + 메가메뉴 + 우측 아이콘(검색·알림·북마크)이 더 있지만,
   라우트/기능이 있는 것만 넣기로 했어요 (DESIGN_SYSTEM.md §1).                */
function NavbarDemo() {
  return (
    <div className="overflow-hidden rounded-card border border-gray-200">
      <header
        className="bg-white"
        style={{ boxShadow: "var(--shadow-header)" }}
      >
        <div className="flex h-14 items-center px-6">
          <span className="text-[20px] font-black tracking-[-0.02em] text-brand-500">
            SEBU
          </span>

          <div className="ml-8 flex items-center gap-1">
            <button className="rounded-control px-4 py-2 text-[13.5px] font-medium whitespace-nowrap text-gray-700 transition-all duration-150 hover:bg-brand-50 hover:text-brand-500">
              단과대별 보기
            </button>
            <span className="rounded-control bg-brand-50 px-4 py-2 text-[13.5px] font-bold whitespace-nowrap text-brand-500">
              활성 상태
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button className="px-2 text-[13px] font-medium text-gray-400 transition-colors hover:text-gray-700">
              로그인
            </button>
            <button
              className="ml-1 flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-[13px] font-bold whitespace-nowrap text-white transition-all hover:brightness-95"
              style={{ boxShadow: "var(--shadow-cta)" }}
            >
              연구실 탐색하기 →
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ── 실시간 인기 연구실 위젯 ───────────────────────────────────────────────
   축소(티커 pill 40px) ↔ 펼침(카드 16px) 토글. Figma의 모션값을 그대로 씁니다. */
function RankingWidgetDemo() {
  const [expanded, setExpanded] = useState(false);
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const fadeTimer = useRef(null);

  useEffect(() => {
    if (expanded || paused) return undefined;
    const timer = setInterval(() => {
      setVisible(false);
      fadeTimer.current = setTimeout(() => {
        setIdx((i) => (i + 1) % SAMPLE_RANKED_LABS.length);
        setVisible(true);
      }, TICKER_FADE_MS);
    }, TICKER_INTERVAL_MS);
    return () => {
      clearInterval(timer);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, [expanded, paused]);

  const item = SAMPLE_RANKED_LABS[idx];

  return (
    <div
      className="w-[320px] overflow-hidden bg-white"
      style={{
        borderRadius: expanded ? 16 : 40,
        border: "1px solid var(--color-line-widget)",
        boxShadow: "var(--shadow-widget)",
        transition: "border-radius 0.22s ease",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {!expanded ? (
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="flex shrink-0 select-none items-center gap-1.5 rounded-full bg-live-bg px-2.5 py-1 text-[10.5px] font-black whitespace-nowrap text-live">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-70 animate-ping-slow" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
            </span>
            실시간
          </span>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              className="flex items-center gap-1.5 whitespace-nowrap"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(5px)",
                transition: "opacity 0.22s ease, transform 0.22s ease",
              }}
            >
              <span
                className={`shrink-0 text-center text-[12px] font-black ${tickerRankClass(item.rank)}`}
                style={{ minWidth: 12 }}
              >
                {item.rank}
              </span>
              <span className="truncate text-[12px] font-semibold text-gray-900">
                {item.name}
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(true)}
            aria-label="펼치기"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-150 hover:bg-brand-50 hover:text-brand-500"
          >
            <ChevronDown />
          </button>
        </div>
      ) : (
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
              <p className="text-[11px] text-gray-400">오늘 14:00 기준</p>
            </div>
            <button
              onClick={() => setExpanded(false)}
              aria-label="접기"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-150 hover:bg-brand-50 hover:text-brand-500"
            >
              <ChevronDown style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>

          <div className="mx-5 mb-1 h-px bg-gray-100" />

          <div className="pt-0.5 pb-3">
            {SAMPLE_RANKED_LABS.map((lab) => (
              <div
                key={lab.rank}
                className="flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors duration-100 hover:bg-gray-50"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-black ${rankBadgeClass(lab.rank)}`}
                >
                  {lab.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold leading-snug text-gray-900">
                    {lab.name}
                  </p>
                  <p className="mt-0.5 truncate text-[10.5px] text-gray-400">
                    {lab.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ComponentSection() {
  return (
    <Section
      title="9. Components"
      description="Figma에 있는 조각들 중 지금 코드에 대응되는 것만 담았어요. 새 화면을 만들 때 여기서 클래스를 복사해 쓰면 서비스 전체가 같은 규격을 유지합니다."
    >
      <div className="mb-10">
        <Label hint="hover 시 배경·글자색이 150ms로 바뀝니다. 오른쪽 항목은 현재 경로일 때의 활성 상태예요.">
          Navbar
        </Label>
        <NavbarDemo />
      </div>

      <div className="mb-10">
        <Label hint="chevron을 눌러 펼침/접힘을 확인해보세요. 마우스를 올리면 자동 롤링이 멈춥니다.">
          Ranking Widget
        </Label>
        <RankingWidgetDemo />
      </div>

      <div className="mb-10">
        <Label>Button</Label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-full bg-brand-500 px-4 py-2 text-[13px] font-bold text-white transition-all hover:brightness-95"
            style={{ boxShadow: "var(--shadow-cta)" }}
          >
            연구실 탐색하기 →
          </button>
          <button className="rounded-control bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
            검색
          </button>
          <button className="rounded-control bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200">
            보조 버튼
          </button>
          <button className="rounded-full border border-brand-200 px-5 py-2 text-[12px] font-semibold text-brand-500 transition-colors hover:bg-brand-50">
            필터 초기화
          </button>
        </div>
      </div>

      <div className="mb-10">
        <Label hint="미선택 칩은 테두리가 투명해야 해요. 현재 CollegeChips.jsx는 미선택에도 파란 테두리가 들어가 있습니다.">
          Filter Chip
        </Label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-500">
            ✓ 전자정보공학대학
          </span>
          <span className="rounded-full border border-transparent bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600">
            소프트웨어융합대학
          </span>
          <span className="rounded-full border border-transparent bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600">
            공과대학
          </span>
        </div>
      </div>

      <div>
        <Label hint="모집 상태는 코드에서 주석 처리된 상태예요. 주석을 풀 때 이 스타일을 쓰면 됩니다.">
          Status Badge
        </Label>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-status-open-line bg-status-open-bg px-3 py-1 text-xs font-semibold whitespace-nowrap text-status-open">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-open-dot" />
            상시모집
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-status-closed-line bg-status-closed-bg px-3 py-1 text-xs font-semibold whitespace-nowrap text-status-closed">
            마감
          </span>
        </div>
      </div>
    </Section>
  );
}
