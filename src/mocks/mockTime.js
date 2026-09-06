/**
 * mock 데이터의 시각 생성기.
 *
 * 명세의 시간 형식은 offset이 없는 ISO-8601이라(2026-08-21T13:30:00)
 * toISOString()을 쓰면 안 됩니다. 그건 UTC 기준 Z가 붙어요.
 */
const pad = (value) => String(value).padStart(2, "0");

/** Date → "2026-08-21T13:30:00" */
export const toApiDateTime = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
  `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

/** n시간 전 */
export const hoursAgo = (n) =>
  toApiDateTime(new Date(Date.now() - n * 60 * 60 * 1000));
