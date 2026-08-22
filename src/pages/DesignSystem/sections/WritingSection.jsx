import { WRITING_RULES } from "../../../constants/designTokens";
import { Section } from "../components/Primitives";

export default function WritingSection() {
  return (
    <Section
      title="10. UX 라이팅"
      description="토스가 공개한 UX 라이팅 원칙 중 한국어 서비스라면 어디서나 통하는 규칙만 골랐어요. 화면 문구를 새로 쓸 때 이 표를 기준으로 검토합니다."
    >
      <div className="border border-gray-200 rounded-card overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr] bg-gray-50 text-[11px] font-semibold text-gray-500 px-4 py-2">
          <span>원칙</span>
          <span className="text-green-600">권장</span>
          <span className="text-gray-400">지양</span>
        </div>
        {WRITING_RULES.map((w) => (
          <div
            key={w.rule}
            className="grid grid-cols-[1fr_1fr_1fr] px-4 py-3 border-t border-gray-100 text-xs items-start gap-2"
          >
            <span className="text-gray-900 font-medium leading-snug">{w.rule}</span>
            <span className="text-gray-700 leading-snug">{w.good}</span>
            <span className="text-gray-400 line-through leading-snug">{w.bad}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
