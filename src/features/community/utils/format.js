/**
 * 2026-08-21T13:30:00 → 2026.08.21
 *
 * Date로 변환하지 않고 문자열을 그대로 자릅니다.
 * 명세의 시간 형식에는 offset이 없어서(2026-08-21T13:30:00),
 * new Date()로 파싱하면 브라우저 시간대에 따라 날짜가 하루 밀릴 수 있어요.
 */
export const formatDate = (isoString) =>
  isoString.slice(0, 10).replaceAll("-", ".");

/** 3821 → 3,821 */
export const formatCount = (n) => n.toLocaleString();
