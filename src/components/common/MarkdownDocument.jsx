import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 마크다운 문서를 SEBU 스타일로 보여주는 컴포넌트 (개인정보 처리방침 등).
 *
 * - 페이지 제목이 h1이므로 문서의 `#`는 h2, `##`는 h3으로 내려서 그린다.
 * - 표는 모바일에서 칸 안의 글이 줄바꿈되며, 그래도 넘치면 표 안에서만 가로 스크롤된다.
 */
const components = {
  h1: ({ children }) => (
    <h2 className="text-xl font-black tracking-tight text-gray-900">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h3 className="mt-10 mb-3 text-base font-bold text-gray-900 md:text-[17px]">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-3 text-[14px] leading-7 break-keep text-gray-600">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-7 break-keep text-gray-600">
      {children}
    </ul>
  ),
  // 웹 주소만 새 탭으로 열고, mailto(이메일) 링크는 그대로 둔다
  a: ({ href, children }) => {
    const isWebLink = /^https?:/.test(href ?? "");
    return (
      <a
        href={href}
        target={isWebLink ? "_blank" : undefined}
        rel={isWebLink ? "noopener noreferrer" : undefined}
        className="font-medium break-all text-brand-600 underline underline-offset-2 hover:text-brand-700"
      >
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full border-collapse text-left text-[13px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
  th: ({ children }) => (
    <th className="px-3 py-2.5 align-top font-bold break-keep text-gray-900">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-t border-gray-200 px-3 py-2.5 align-top leading-6 break-keep text-gray-600 first:font-semibold first:text-gray-900">
      {children}
    </td>
  ),
};

function MarkdownDocument({ children }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </Markdown>
  );
}

export default MarkdownDocument;
