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
