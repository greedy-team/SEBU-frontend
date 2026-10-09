// 서비스 이용약관 (마크다운 원문).
// 약관을 개정할 때는 새 시행일의 .md 파일을 추가하고 이 목록의 맨 앞에 새 버전을 넣는다.
// 지난 약관도 확인할 수 있어야 하므로 이전 버전 파일은 지우지 않고 목록에 남긴다.
import terms20261009 from "./terms-2026-10-09.md?raw";

export const TERMS_VERSIONS = [
  {
    effectiveDate: "2026-10-09",
    effectiveLabel: "2026년 10월 9일",
    document: terms20261009,
  },
];

// 현재 시행 중인 약관 (목록의 첫 번째)
export const CURRENT_TERMS = TERMS_VERSIONS[0];
