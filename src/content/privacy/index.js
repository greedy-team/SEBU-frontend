// 개인정보 관련 공개 문서 (마크다운 원문).
// 방침을 개정할 때는 새 시행일의 .md 파일을 추가하고 이 목록의 맨 앞에 새 버전을 넣는다.
// 이전 방침도 확인할 수 있어야 하므로 지난 버전 파일은 지우지 않고 목록에 남긴다.
import consentNotice20261007 from "./consent-notice-2026-10-07.md?raw";
import privacyPolicy20261007 from "./privacy-policy-2026-10-07.md?raw";

export const PRIVACY_DOCUMENT_VERSIONS = [
  {
    effectiveDate: "2026-10-07",
    effectiveLabel: "2026년 10월 7일",
    consentNotice: consentNotice20261007,
    privacyPolicy: privacyPolicy20261007,
  },
];

// 현재 시행 중인 버전 (목록의 첫 번째)
export const CURRENT_PRIVACY_DOCUMENTS = PRIVACY_DOCUMENT_VERSIONS[0];
