import ScopeSection from "./sections/ScopeSection";
import ColorSection from "./sections/ColorSection";
import FoundationSection from "./sections/FoundationSection";
import MotionSection from "./sections/MotionSection";
import ComponentSection from "./sections/ComponentSection";
import WritingSection from "./sections/WritingSection";

/**
 * 개발용 디자인 토큰 레퍼런스 페이지 (/design-system).
 *
 * 이 파일은 "목차" 역할만 합니다. 내용은 sections/ 아래에 나뉘어 있고,
 * 토큰 목록 자체는 src/constants/designTokens.js가 갖고 있어요.
 * 토큰을 추가할 땐 index.css(@theme) → designTokens.js → 해당 section 순으로 손대면 됩니다.
 */
export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl rounded-card border border-gray-100 bg-white p-10">
        <header className="mb-10">
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            SEBU Design System
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            값의 출처는 Figma Make 내보내기(<span className="font-medium">세부 와이어프레임</span>)예요.
            실제 값은{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">src/index.css</code>
            의 <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">@theme</code> 블록
            한 곳에만 정의돼 있고, 이 페이지는 그 값을 읽어서 보여줍니다. 배경과 근거는
            저장소 루트의 DESIGN_SYSTEM.md를 봐주세요.
          </p>
          <p className="mt-3 rounded-card border border-rank-first-line bg-rank-first-bg px-4 py-3 text-xs leading-relaxed text-gray-700">
            ⚠️ <strong>브랜드 컬러 #3182F6은 토스의 브랜드 컬러입니다.</strong> Figma 원본이
            이 값을 <code className="rounded bg-white/60 px-1">toss-blue</code>라는 이름으로
            쓰고 있었어요. 토큰 이름은 역할 기반(brand-*)으로 바꿨지만 HEX는 그대로라,
            SEBU 고유 색으로 옮길지는 팀 결정이 필요합니다 — DESIGN_SYSTEM.md §0 참고.
          </p>
        </header>

        <ScopeSection />
        <ColorSection />
        <FoundationSection />
        <MotionSection />
        <ComponentSection />
        <WritingSection />
      </div>
    </div>
  );
}
