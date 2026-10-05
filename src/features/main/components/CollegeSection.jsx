import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// 학과 태그는 두 개까지만 보여주고 나머지는 +N으로 접습니다.
const VISIBLE_DEPARTMENTS = 2;

// 카드 한 장씩 천천히 넘어가는 자동 캐러셀
const AUTOPLAY_INTERVAL_MS = 3500;
const CARD_GAP = 16; // 트랙의 gap-4와 같은 값

// 끝없이 이어지는 루프는 카드 한 세트가 화면보다 충분히 길어야 자연스럽다 (카드 6장 ≈ 1400px)
const MIN_CARDS_FOR_LOOP = 6;
// 스크롤이 멈춘 뒤 이 시간이 지나면 복제본 위치를 원본 위치로 되돌린다
const SCROLL_IDLE_MS = 120;

// 복제 카드가 시작되는 위치 = 원본 카드 한 세트의 폭
const getLoopWidth = (track, count) =>
  track.children[count].offsetLeft - track.children[0].offsetLeft;

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

// isClone: 끝없이 이어 보이게 하려고 뒤에 한 번 더 붙인 복제 카드. 스크린리더와 Tab 이동에서는 제외한다.
function CollegeCard({ college, isClone = false }) {
  const departments = college.departments ?? [];
  const shown = departments.slice(0, VISIBLE_DEPARTMENTS);
  const restCount = departments.length - shown.length;

  return (
    <Link
      to={`/colleges?college=${college.id}`}
      aria-hidden={isClone || undefined}
      tabIndex={isClone ? -1 : undefined}
      className="flex w-[220px] shrink-0 flex-col gap-3 rounded-card border border-gray-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-card"
    >
      <span className="text-[15px] font-bold text-gray-900">
        {college.name}
      </span>

      <span className="text-xs text-gray-400">
        연구실 {college.laboratoryCount} · 학과 {college.departmentCount}
      </span>

      <span className="flex flex-wrap gap-1.5">
        {shown.map((department) => (
          <span
            key={department.id}
            className="rounded-field bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500"
          >
            {department.name}
          </span>
        ))}
        {restCount > 0 && (
          <span className="rounded-field bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-400">
            +{restCount}
          </span>
        )}
      </span>
    </Link>
  );
}

function PauseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5z" />
    </svg>
  );
}

function CollegeSection({ colleges, status }) {
  const trackRef = useRef(null);
  // 모션 줄이기 설정이면 자동 넘김을 끈 채로 시작
  const [isPlaying, setIsPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  // 마우스를 올리거나 키보드로 포커스한 동안에는 자동 넘김을 멈춘다
  const [isInteracting, setIsInteracting] = useState(false);

  const idleTimerRef = useRef(null);
  const count = colleges.length;
  const hasColleges = status === "success" && count > 0;
  // 카드가 충분할 때만 뒤에 복제본을 붙여 끝없이 이어지게 한다
  const canLoop = hasColleges && count >= MIN_CARDS_FOR_LOOP;

  // 카드 한 장씩 넘긴다. 맨 앞에서 이전을 누르면 복제본 쪽의 같은 위치로 몰래 옮긴 뒤 한 장 되돌아간다.
  const slide = useCallback(
    (direction) => {
      const track = trackRef.current;
      if (!track) return;

      const cardWidth = track.firstElementChild?.getBoundingClientRect().width;
      const step = (cardWidth ?? 220) + CARD_GAP;

      if (canLoop && direction < 0 && track.scrollLeft < 1) {
        track.scrollTo({
          left: getLoopWidth(track, count),
          behavior: "instant",
        });
      }
      track.scrollBy({ left: direction * step, behavior: "smooth" });
    },
    [canLoop, count],
  );

  // 복제본 구간까지 넘어간 뒤 스크롤이 멈추면, 눈에 보이는 변화 없이 원본 구간으로 되돌린다.
  // 스크롤 도중에 위치를 바꾸면 부드러운 이동이 끊기므로 멈춘 뒤에만 한다.
  const handleScroll = useCallback(() => {
    if (!canLoop) return;

    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;

      const loopWidth = getLoopWidth(track, count);
      if (track.scrollLeft >= loopWidth - 1) {
        track.scrollTo({
          left: track.scrollLeft - loopWidth,
          behavior: "instant",
        });
      }
    }, SCROLL_IDLE_MS);
  }, [canLoop, count]);

  useEffect(() => () => clearTimeout(idleTimerRef.current), []);

  useEffect(() => {
    if (!canLoop || !isPlaying || isInteracting) return undefined;

    const timer = setInterval(() => {
      if (!document.hidden) slide(1);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [canLoop, isPlaying, isInteracting, slide]);

  const focusRingClass =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
  const pauseButtonClass = `hidden h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 md:flex ${focusRingClass}`;
  // 카드 높이의 가운데(트랙 아래 여백 8px 보정)에 세로로 맞춘다
  const sideArrowClass = `absolute top-[calc(50%-4px)] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-widget transition-colors hover:bg-gray-50 hover:text-gray-900 md:flex ${focusRingClass}`;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 pb-6 md:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">단과대학 둘러보기</h2>
          <p className="mt-1 text-xs break-keep text-gray-400">
            세종대학교 {colleges.length}개 단과대학 · 전체 연구실 탐색
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? "자동 넘김 일시정지" : "자동 넘김 재생"}
            className={pauseButtonClass}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <Link
            to="/colleges"
            className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[13px] font-bold text-gray-700 transition-colors hover:border-brand-200 hover:text-brand-600"
          >
            전체보기
          </Link>
        </div>
      </div>

      {status === "loading" && (
        <p className="mt-6 text-sm text-gray-400">불러오는 중이에요…</p>
      )}

      {status === "error" && (
        <p className="mt-6 text-sm text-gray-400">
          단과대학 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {status === "success" && colleges.length === 0 && (
        <p className="mt-6 text-sm text-gray-400">
          아직 등록된 단과대학이 없어요.
        </p>
      )}

      {hasColleges && (
        <div
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onFocus={(e) => {
            // 마우스로 버튼을 클릭해 생긴 포커스는 무시한다 (키보드 포커스일 때만 멈춤)
            if (e.target.matches(":focus-visible")) setIsInteracting(true);
          }}
          onBlur={() => setIsInteracting(false)}
          className="relative mt-6"
        >
          {/* 이전/다음 화살표는 카드 양옆 가장자리에 겹쳐 놓는다 */}
          <button
            type="button"
            onClick={() => slide(-1)}
            aria-label="이전 단과대학 보기"
            className={`${sideArrowClass} left-0 -translate-x-1/2`}
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            aria-label="다음 단과대학 보기"
            className={`${sideArrowClass} right-0 translate-x-1/2`}
          >
            <ChevronIcon direction="right" />
          </button>

          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
            {canLoop &&
              colleges.map((college) => (
                <CollegeCard
                  key={`clone-${college.id}`}
                  college={college}
                  isClone
                />
              ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default CollegeSection;
