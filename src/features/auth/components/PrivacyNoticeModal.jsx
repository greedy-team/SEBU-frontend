import { useEffect } from "react";
import MarkdownDocument from "../../../components/common/MarkdownDocument";
import { CURRENT_PRIVACY_DOCUMENTS } from "../../../content/privacy";

/**
 * 로그인 화면의 "자세히 보기"로 여는 개인정보 수집·이용 안내 창.
 *
 * 입력 중인 학번·비밀번호가 사라지지 않도록 페이지를 이동하지 않고 같은 화면에서 띄운다.
 * 이 창을 여는 것만으로 동의하거나 로그인 요청을 보내지 않는다.
 * 마크다운 렌더러가 무거워서 LoginForm에서 열 때만 불러온다(lazy).
 */
function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function PrivacyNoticeModal({ onClose }) {
  // 창이 열려 있는 동안 뒤 화면 스크롤을 막고 Esc로 닫는다
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="개인정보 수집·이용 안내"
        className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-end px-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-6 md:px-8">
          <MarkdownDocument>
            {CURRENT_PRIVACY_DOCUMENTS.consentNotice}
          </MarkdownDocument>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 md:px-8">
          <a
            href="/privacy#privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700"
          >
            개인정보 처리방침 전문 보기
          </a>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-control bg-gray-100 px-5 text-[14px] font-bold text-gray-700 transition-colors hover:bg-gray-200"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyNoticeModal;
