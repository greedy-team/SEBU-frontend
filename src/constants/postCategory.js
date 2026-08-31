/**
 * 게시글 카테고리 표시 정보.
 *
 * 명세상 저장되는 카테고리는 FREE / QUESTION 두 개뿐입니다.
 * (전체글은 조건 생략, 인기글은 정렬 결과이므로 카테고리가 아닙니다)
 *
 * TODO: 배지 색은 아직 Tailwind 기본 팔레트를 쓰고 있어요.
 *       index.css @theme에 토큰으로 옮기는 게 맞습니다. (DESIGN_SYSTEM.md 규칙)
 */

export const POST_CATEGORY = {
  FREE: { label: "자유 게시판", badge: "bg-orange-50 text-orange-600" },
  QUESTION: { label: "Q&A 게시판", badge: "bg-emerald-50 text-emerald-600" },
};

// BE가 계산해서 내려주는 배지 (저장값 아님)
export const POST_BADGE = {
  HOT: { label: "🔥 HOT", color: "text-orange-500" },
  NEW: { label: "NEW", color: "text-emerald-500" },
};

/**
 * 커뮤니티 HOME 탭.
 * category가 null이면 조회 시 조건을 생략합니다 (= 전체글).
 * 랩실 평가는 게시글이 아니라 별도 도메인이라 후속 이슈에서 붙입니다.
 */
export const COMMUNITY_TABS = [
  { id: "ALL", label: "전체글", listTitle: "전체 게시글", category: null },
  {
    id: "FREE",
    label: "자유 게시판",
    listTitle: "자유 게시판",
    category: "FREE",
  },
  {
    id: "QUESTION",
    label: "Q&A 게시판",
    listTitle: "Q&A 게시판",
    category: "QUESTION",
  },
  {
    id: "LAB_REVIEW",
    label: "랩실 평가",
    listTitle: "랩실 평가",
    category: null,
  },
];

export const POST_SORT = [
  { value: "LATEST", label: "최신순" },
  { value: "POPULAR", label: "인기순" },
];
