/**
 * 디자인 토큰 "메타데이터".
 *
 * 실제 값(HEX 등)은 src/index.css의 @theme 블록이 정의합니다.
 * 이 파일은 /design-system 쇼케이스 페이지가 렌더링할 목록·설명만 담아요.
 * 값 자체를 여기 두면 CSS와 두 벌 관리가 되므로, HEX는 "표시용 라벨"로만 씁니다.
 *
 * 값의 출처: Figma Make 내보내기 "세부 와이어프레임 (Community)"
 * 토큰 추가 순서: index.css(@theme) → 이 파일 → 해당 section → DESIGN_SYSTEM.md
 */

/* ────────────────────────────────────────────────────────────
   적용 원칙 — Figma와 코드가 다를 때
   ────────────────────────────────────────────────────────────
   범위(무엇을 만들지)는 **코드 기준**: Figma에 있어도 아직 구현 안 된 기능은
                                      가져오지 않습니다.
   스타일(어떻게 보일지)은 **Figma 기준**: 이미 구현된 기능은 Figma의 디자인과
                                      인터랙션을 그대로 따릅니다.
   ──────────────────────────────────────────────────────────── */
export const SCOPE_RULES = [
  {
    area: "상단 내비게이션",
    figma: "3개 항목(단과대별 보기 · 커뮤니티 · 튜토리얼), hover 시 메가메뉴가 전체 폭으로 펼쳐짐 + 딤 오버레이",
    code: "'탐색' 드롭다운 안에 단과대별 보기 1개, 클릭으로 열림",
    decision: "adopt",
    note: "hover 방식 · 150ms 트랜지션 · 딤 오버레이 · 메가 패널은 Figma대로. 단 항목은 구현된 것만 넣습니다.",
  },
  {
    area: "검색 필터 탭",
    figma: "단과대/학과 · 연구 분야 · 지원 자격 · 모집 상태 (4개)",
    code: "단과대/학과 (1개). 모집 상태는 주석 처리됨",
    decision: "partial",
    note: "탭 하나의 생김새(활성 밑줄 · 카운트 배지)만 Figma대로. 나머지 3개 탭은 해당 기능이 생길 때 추가합니다.",
  },
  {
    area: "단과대 칩",
    figma: "pill, 선택 시 연한 파랑 배경 + 체크 + 파란 테두리",
    code: "이미 동일한 구조로 구현됨",
    decision: "adopt",
    note: "미선택 칩에도 border-blue-200이 들어가 있는 버그가 있어요. 미선택은 투명 테두리가 맞습니다.",
  },
  {
    area: "실시간 인기 연구실",
    figma: "축소(티커 pill, 40px radius) ↔ 펼침(카드, 16px radius) 토글 + 2.8초 자동 롤링",
    code: "RecommendedLabs로 자리만 있음",
    decision: "adopt",
    note: "기능명세서에 잡힌 항목이라 토큰·모션값을 전부 준비해뒀습니다.",
  },
  {
    area: "모집 상태 배지",
    figma: "상시모집(파랑 + 점) / 마감(회색)",
    code: "RECRUITMENT_STATUS import가 주석 처리되어 화면에 안 나옴",
    decision: "partial",
    note: "토큰(status-*)만 미리 정의. 주석을 풀 때 이 토큰을 쓰면 됩니다.",
  },
  {
    area: "커뮤니티 · 튜토리얼 하위 페이지",
    figma: "연구실 후기 · 인기글 · Q&A · 자기소개서 · 컨택 메일 등",
    code: "라우트 없음",
    decision: "skip",
    note: "페이지 자체가 없으므로 메가메뉴 항목도 만들지 않습니다.",
  },
  {
    area: "마이페이지 · 메일함 · 가이드",
    figma: "전용 페이지 존재",
    code: "MyPageSetup만 최소 구현",
    decision: "skip",
    note: "해당 화면을 만들 때 다시 Figma를 참고합니다.",
  },
];

export const BRAND_COLORS = [
  { token: "brand-50", hex: "#EBF3FF", usage: "활성 탭 · 선택 칩 · hover 배경" },
  { token: "brand-100", hex: "#DBEAFE", usage: "옅은 강조 배경" },
  { token: "brand-200", hex: "#BFDBFE", usage: "배지 테두리 · 포커스 링" },
  { token: "brand-500", hex: "#3182F6", usage: "Primary — CTA · 로고 · 활성 탭" },
  { token: "brand-600", hex: "#1D4ED8", usage: "Hover" },
  { token: "brand-700", hex: "#1E40AF", usage: "Active / Pressed" },
];

export const NEUTRAL_COLORS = [
  { token: "gray-50", hex: "#F9FAFB", usage: "행 hover 배경" },
  { token: "gray-100", hex: "#F2F4F6", usage: "구분선 · 아이콘 버튼 배경" },
  { token: "gray-200", hex: "#E5E8EB", usage: "테두리" },
  { token: "gray-300", hex: "#D1D6DB", usage: "비활성 테두리" },
  { token: "gray-400", hex: "#B0B8C1", usage: "placeholder" },
  { token: "gray-500", hex: "#8B95A1", usage: "아이콘" },
  { token: "gray-600", hex: "#6B7684", usage: "보조 텍스트" },
  { token: "gray-700", hex: "#4E5968", usage: "내비 항목 · 본문" },
  { token: "gray-800", hex: "#333D4B", usage: "강한 본문" },
  { token: "gray-900", hex: "#191F28", usage: "제목 · 연구실명" },
];

export const FEATURE_COLORS = [
  { token: "live", hex: "#3182F6", usage: "'실시간' 라벨 + 점 (축소)" },
  { token: "live-bg", hex: "#EBF3FF", usage: "'실시간' 라벨 배경" },
  { token: "live-dot", hex: "#EF4444", usage: "제목 옆 빨간 점 (펼침)" },
  { token: "rank-first", hex: "#E53935", usage: "1위 숫자" },
  { token: "rank-first-bg", hex: "#FFF1F0", usage: "1위 배경" },
  { token: "rank-second", hex: "#E07B00", usage: "2위 숫자" },
  { token: "rank-second-bg", hex: "#FFF8E6", usage: "2위 배경" },
  { token: "rank-third", hex: "#6B7280", usage: "3위 숫자" },
  { token: "rank-third-bg", hex: "#F3F4F6", usage: "3위 배경" },
  { token: "rank-rest", hex: "#9CA3AF", usage: "4위 이하 숫자" },
  { token: "rank-rest-bg", hex: "#F9FAFB", usage: "4위 이하 배경" },
];

export const STATUS_COLORS = [
  { token: "status-open", hex: "#3B82F6", usage: "상시모집 텍스트" },
  { token: "status-open-bg", hex: "#EFF6FF", usage: "상시모집 배경" },
  { token: "status-open-dot", hex: "#60A5FA", usage: "상시모집 점" },
  { token: "status-closed", hex: "#9CA3AF", usage: "마감 텍스트" },
  { token: "status-closed-bg", hex: "#F9FAFB", usage: "마감 배경" },
];

export const RADIUS_TOKENS = [
  { token: "radius-control", px: "12px", cls: "rounded-control", usage: "내비 항목 · 아이콘 버튼" },
  { token: "radius-card", px: "16px", cls: "rounded-card", usage: "카드 · 위젯(펼침)" },
  { token: "radius-ticker", px: "40px", cls: "rounded-ticker", usage: "위젯(축소)" },
  { token: "(full)", px: "999px", cls: "rounded-full", usage: "CTA · 칩 · 배지" },
];

export const SPACING_TOKENS = [
  { cls: "1", px: "4px" },
  { cls: "2", px: "8px" },
  { cls: "3", px: "12px" },
  { cls: "4", px: "16px" },
  { cls: "6", px: "24px" },
  { cls: "8", px: "32px" },
  { cls: "12", px: "48px" },
];

/**
 * Figma는 13.5px / 10.5px 같은 소수점 크기를 씁니다.
 * Tailwind 기본 스케일에 없는 값이라 임의값 표기(text-[13.5px])로 씁니다.
 */
export const TYPE_TOKENS = [
  { cls: "text-[10px]", px: "10px", usage: "메가메뉴 섹션 라벨 (font-black, tracking-wide)" },
  { cls: "text-[10.5px]", px: "10.5px", usage: "티커 라벨 · 위젯 학과명" },
  { cls: "text-[11px]", px: "11px", usage: "'오늘 14:00 기준'" },
  { cls: "text-[12px]", px: "12px", usage: "티커 연구실명 · 순위 숫자" },
  { cls: "text-[13px]", px: "13px", usage: "위젯 연구실명 · 로그인 · CTA" },
  { cls: "text-[13.5px]", px: "13.5px", usage: "내비 항목 · 메가메뉴 항목" },
  { cls: "text-[14px]", px: "14px", usage: "위젯 제목" },
  { cls: "text-[20px]", px: "20px", usage: "로고 (font-black, -0.02em)" },
];

export const MOTION_TOKENS = [
  { token: "내비 항목 전환", value: "150ms", usage: "hover 시 배경·글자색" },
  { token: "chevron 회전", value: "150ms", usage: "메가메뉴 열림 표시 (180deg)" },
  { token: "위젯 radius 전환", value: "220ms ease", usage: "40px ↔ 16px 토글" },
  { token: "티커 페이드", value: "220ms ease", usage: "opacity + translateY(5px)" },
  { token: "티커 교체 딜레이", value: "240ms", usage: "사라진 뒤 다음 항목으로" },
  { token: "티커 주기", value: "2800ms", usage: "자동 롤링 간격" },
  { token: "animate-ping-slow", value: "1.4s infinite", usage: "라이브 점 확산" },
];

/** UX 라이팅 원칙 — 서비스 전체 문구가 따르는 규칙 */
export const WRITING_RULES = [
  {
    rule: "해요체로 통일",
    good: "선택한 조건의 연구실 1개를 찾았어요",
    bad: "선택한 조건의 연구실 1개가 검색되었습니다",
  },
  {
    rule: "능동형으로 — 수동형('~되었다') 피하기",
    good: "북마크에 담았어요",
    bad: "북마크에 담아졌어요",
  },
  {
    rule: "긍정형으로 — 부정형 최소화",
    good: "로그인하면 볼 수 있어요",
    bad: "로그인하지 않으면 볼 수 없어요",
  },
  {
    rule: "다이얼로그 왼쪽 버튼은 '닫기' ('취소'는 오해를 부름)",
    good: "닫기 / 확인",
    bad: "취소 / 확인",
  },
  {
    rule: "과한 경어 빼기 ('~시' 제거)",
    good: "연구실을 찾아볼까요?",
    bad: "연구실을 찾아보시겠어요?",
  },
  {
    rule: "'{명사}+{명사}' 나열 대신 풀어쓰기",
    good: "지원 자격을 확인해보세요",
    bad: "지원자격조건정보 확인",
  },
];

/** 쇼케이스·목업에서 공용으로 쓰는 예시 데이터 */
export const SAMPLE_RANKED_LABS = [
  { rank: 1, name: "인공지능연구실", department: "인공지능학과" },
  { rank: 2, name: "통신 및 신호처리랩", department: "전자공학과" },
  { rank: 3, name: "컴퓨터비전연구실", department: "컴퓨터공학과" },
  { rank: 4, name: "스마트기기공학랩", department: "지능기전공학부" },
  { rank: 5, name: "데이터사이언스랩", department: "소프트웨어학과" },
];

/** 티커 자동 롤링 주기 (ms) — Figma 기준 2800 */
export const TICKER_INTERVAL_MS = 2800;
/** 다음 항목으로 교체되기까지의 페이드아웃 시간 (ms) */
export const TICKER_FADE_MS = 240;

/** 순위 배지(펼친 상태) 색상 클래스 — 1·2위만 강조, 3위 이하 중립 */
export function rankBadgeClass(rank) {
  if (rank === 1) return "bg-rank-first-bg text-rank-first border-rank-first-line";
  if (rank === 2) return "bg-rank-second-bg text-rank-second border-rank-second-line";
  if (rank === 3) return "bg-rank-third-bg text-rank-third border-rank-third-line";
  return "bg-rank-rest-bg text-rank-rest border-transparent";
}

/** 티커(축소 상태) 순위 숫자 색상 — 배지 없이 숫자만 */
export function tickerRankClass(rank) {
  if (rank === 1) return "text-ticker-first";
  if (rank === 2) return "text-ticker-second";
  return "text-ticker-rest";
}
