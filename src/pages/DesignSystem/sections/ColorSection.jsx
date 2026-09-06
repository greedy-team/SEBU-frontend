import {
  BRAND_COLORS,
  NEUTRAL_COLORS,
  FEATURE_COLORS,
  STATUS_COLORS,
} from "../../../constants/designTokens";
import { Section, Swatch } from "../components/Primitives";

export default function ColorSection() {
  return (
    <>
      <Section
        title="1. Brand"
        description="Figma 원본이 이 값을 'toss-blue'라는 이름으로 쓰고 있었어요. 토큰 이름은 역할 기반으로 바꿨지만 HEX는 그대로입니다 — DESIGN_SYSTEM.md §0의 주의사항을 꼭 읽어주세요."
      >
        <div className="flex flex-wrap gap-4">
          {BRAND_COLORS.map((c) => (
            <Swatch key={c.token} {...c} />
          ))}
        </div>
      </Section>

      <Section
        title="2. Neutral"
        description="Tailwind 기본 회색 대신 Figma의 회색 스케일로 덮어썼습니다. 기존 컴포넌트가 쓰던 gray-* 클래스가 그대로 새 팔레트를 따라가요."
      >
        <div className="flex flex-wrap gap-4">
          {NEUTRAL_COLORS.map((c) => (
            <Swatch key={c.token} {...c} />
          ))}
        </div>
      </Section>

      <Section
        title="3. Feature — 실시간 인기 연구실"
        description="1·2·3위만 색을 갖고 4위 이하는 중립이에요. 다섯 줄이 전부 색을 갖고 있으면 순위 자체가 눈에 안 들어옵니다."
      >
        <div className="flex flex-wrap gap-4">
          {FEATURE_COLORS.map((c) => (
            <Swatch key={c.token} {...c} />
          ))}
        </div>
      </Section>

      <Section
        title="4. Status — 모집 상태"
        description="코드에서는 아직 주석 처리된 기능이라 토큰만 준비해뒀어요. 주석을 풀 때 이 값을 쓰면 됩니다."
      >
        <div className="flex flex-wrap gap-4">
          {STATUS_COLORS.map((c) => (
            <Swatch key={c.token} {...c} />
          ))}
        </div>
      </Section>
    </>
  );
}
