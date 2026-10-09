import Header from "../../components/layout/Header";
import MarkdownDocument from "../../components/common/MarkdownDocument";
import { CURRENT_TERMS } from "../../content/terms";

/**
 * 서비스 이용약관 페이지 (로그인 없이 열람).
 * 본문은 src/content/terms 의 마크다운 파일이다.
 */
function TermsPage() {
  const { document: termsDocument, effectiveLabel } = CURRENT_TERMS;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-black tracking-tight text-gray-900">
          서비스 이용약관
        </h1>
        <p className="mt-2 text-[13px] text-gray-400">
          SEBU 서비스 이용에 관한 약관입니다. 시행일 {effectiveLabel}
        </p>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 md:p-8">
          <MarkdownDocument>{termsDocument}</MarkdownDocument>
        </section>
      </main>
    </div>
  );
}

export default TermsPage;
