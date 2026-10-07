import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/layout/Header";
import MarkdownDocument from "../../components/common/MarkdownDocument";
import { CURRENT_PRIVACY_DOCUMENTS } from "../../content/privacy";

/**
 * 개인정보 처리방침 페이지 (로그인 없이 열람).
 *
 * 맨 위에 '개인정보 수집·이용 안내'(로그인 화면의 "자세히 보기"가 연결되는 곳),
 * 그 아래에 '개인정보 처리방침' 전문을 보여준다.
 * 문서 본문은 src/content/privacy 의 마크다운 파일이다.
 */
const sectionClass =
  "scroll-mt-20 rounded-2xl border border-gray-200 bg-white p-5 md:p-8";

const jumpLinkClass =
  "rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-bold text-gray-700 transition-colors hover:border-brand-200 hover:text-brand-600";

function PrivacyPage() {
  const { hash } = useLocation();
  const { consentNotice, privacyPolicy, effectiveLabel } =
    CURRENT_PRIVACY_DOCUMENTS;

  // 주소 뒤의 #login-consent 같은 앵커 위치로 이동한다 (라우터는 자동으로 스크롤하지 않는다)
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [hash]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-black tracking-tight text-gray-900">
          개인정보 처리방침
        </h1>
        <p className="mt-2 text-[13px] text-gray-400">
          SEBU 서비스의 개인정보 처리에 관한 안내입니다. 시행일 {effectiveLabel}
        </p>

        <nav aria-label="문서 바로가기" className="mt-5 flex flex-wrap gap-2">
          <a href="#login-consent" className={jumpLinkClass}>
            개인정보 수집·이용 안내
          </a>
          <a href="#privacy-policy" className={jumpLinkClass}>
            개인정보 처리방침 전문
          </a>
        </nav>

        <section id="login-consent" className={`mt-6 ${sectionClass}`}>
          <MarkdownDocument>{consentNotice}</MarkdownDocument>
        </section>

        <section id="privacy-policy" className={`mt-6 ${sectionClass}`}>
          <MarkdownDocument>{privacyPolicy}</MarkdownDocument>
        </section>
      </main>
    </div>
  );
}

export default PrivacyPage;
