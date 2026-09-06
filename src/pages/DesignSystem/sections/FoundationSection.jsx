import {
  RADIUS_TOKENS,
  SPACING_TOKENS,
  TYPE_TOKENS,
} from "../../../constants/designTokens";
import { Section, RadiusSample, SpecRow } from "../components/Primitives";

export default function FoundationSection() {
  return (
    <>
      <Section
        title="5. Radius"
        description="Figma 기준입니다. 내비 항목·아이콘 버튼은 12px, 카드와 위젯은 16px, CTA·칩·배지는 pill, 축소된 티커만 40px이에요."
      >
        <div className="flex flex-wrap gap-4">
          {RADIUS_TOKENS.map((r) => (
            <RadiusSample key={r.token} {...r} />
          ))}
        </div>
      </Section>

      <Section
        title="6. Spacing"
        description="Tailwind 기본 4px 그리드를 그대로 씁니다. 별도 재정의 없음."
      >
        <div className="flex flex-col">
          {SPACING_TOKENS.map((s) => (
            <SpecRow
              key={s.cls}
              label={`p-${s.cls} / gap-${s.cls}`}
              usage={s.px}
              sample={
                <div className="h-2 rounded-sm bg-brand-500" style={{ width: s.px }} />
              }
            />
          ))}
        </div>
      </Section>

      <Section
        title="7. Typography"
        description="폰트는 Noto Sans KR이에요. Figma가 13.5px·10.5px 같은 소수점 크기를 쓰는데 Tailwind 기본 스케일에 없는 값이라 임의값 표기로 씁니다."
      >
        <div className="flex flex-col">
          {TYPE_TOKENS.map((t) => (
            <SpecRow
              key={t.cls}
              label={t.cls}
              usage={t.usage}
              sample={
                <span className="text-gray-900" style={{ fontSize: t.px }}>
                  인공지능연구실
                </span>
              }
            />
          ))}
        </div>
      </Section>
    </>
  );
}
