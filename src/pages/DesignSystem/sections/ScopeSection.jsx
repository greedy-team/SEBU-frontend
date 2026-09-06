import { SCOPE_RULES } from "../../../constants/designTokens";
import { Section } from "../components/Primitives";

const DECISION_STYLE = {
  adopt: { label: "스타일 반영", cls: "bg-brand-50 text-brand-500" },
  partial: { label: "일부만", cls: "bg-rank-second-bg text-rank-second" },
  skip: { label: "제외", cls: "bg-gray-100 text-gray-500" },
};

export default function ScopeSection() {
  return (
    <Section
      title="0. Figma ↔ 코드 적용 범위"
      description="Figma가 코드보다 앞서 있어서 둘이 다릅니다. 무엇을 가져오고 무엇을 두고 갈지에 대한 기준이에요."
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-card border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs font-bold text-gray-900">범위는 코드 기준</p>
          <p className="mt-1 text-[11px] leading-relaxed text-gray-600">
            Figma에 있어도 아직 구현되지 않은 기능은 가져오지 않아요. 검색 필터에 '연구 분야',
            '지원 자격' 탭이 그려져 있지만 코드에는 '단과대/학과'만 있으니, 나머지 탭은
            그 기능이 생길 때 추가합니다.
          </p>
        </div>
        <div className="rounded-card border border-brand-200 bg-brand-50 p-4">
          <p className="text-xs font-bold text-brand-500">스타일은 Figma 기준</p>
          <p className="mt-1 text-[11px] leading-relaxed text-gray-700">
            이미 구현된 기능은 Figma의 디자인과 인터랙션을 그대로 따라갑니다. 내비게이션이
            코드에선 클릭 드롭다운이지만 Figma에선 hover 메가메뉴니까, 그 동작을 Figma대로
            바꿉니다.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="bg-gray-50 text-[11px] font-semibold text-gray-500">
              <th className="px-3 py-2 font-semibold">영역</th>
              <th className="px-3 py-2 font-semibold">Figma</th>
              <th className="px-3 py-2 font-semibold">현재 코드</th>
              <th className="px-3 py-2 font-semibold">판단</th>
            </tr>
          </thead>
          <tbody>
            {SCOPE_RULES.map((r) => {
              const d = DECISION_STYLE[r.decision];
              return (
                <tr key={r.area} className="border-t border-gray-100 align-top">
                  <td className="px-3 py-3 text-xs font-semibold text-gray-900 whitespace-nowrap">
                    {r.area}
                  </td>
                  <td className="px-3 py-3 text-[11px] leading-relaxed text-gray-600">
                    {r.figma}
                  </td>
                  <td className="px-3 py-3 text-[11px] leading-relaxed text-gray-600">
                    {r.code}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-[10px] font-bold whitespace-nowrap ${d.cls}`}
                    >
                      {d.label}
                    </span>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500">
                      {r.note}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
