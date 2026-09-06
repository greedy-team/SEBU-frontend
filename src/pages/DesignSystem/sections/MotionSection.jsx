import { MOTION_TOKENS } from "../../../constants/designTokens";
import { Section, SpecRow } from "../components/Primitives";

export default function MotionSection() {
  return (
    <Section
      title="8. Motion"
      description="Figma가 쓰는 값 그대로예요. 실제로 움직이는 모습은 아래 9번 Components의 '실시간 인기 연구실' 위젯에서 확인할 수 있어요."
    >
      <div className="mb-6 rounded-card border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-bold text-gray-900">자동으로 움직이는 콘텐츠의 두 가지 필수 조건</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] leading-relaxed text-gray-600">
          <li>
            <strong>마우스를 올리면 멈춘다</strong> — 읽는 도중에 다음 항목으로 넘어가면 안 돼요.
          </li>
          <li>
            <strong>prefers-reduced-motion에서 정지</strong> — index.css에 전역으로 처리해뒀어요.
            자동 움직임은 전정기관이 예민한 사용자에게 실제로 어지럼증을 유발합니다.
          </li>
        </ol>
      </div>

      <div className="flex flex-col">
        {MOTION_TOKENS.map((m) => (
          <SpecRow
            key={m.token}
            label={m.token}
            usage={m.usage}
            sample={<span className="font-mono text-xs text-gray-500">{m.value}</span>}
          />
        ))}
      </div>
    </Section>
  );
}
