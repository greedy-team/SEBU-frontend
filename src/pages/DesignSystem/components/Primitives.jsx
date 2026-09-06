/**
 * /design-system 페이지에서만 쓰는 표시용 조각들.
 *
 * 색/라운드 값을 클래스 문자열로 조립하지 않고 CSS 변수를 inline style로 참조합니다.
 * Tailwind는 빌드 시점에 클래스를 훑기 때문에 `bg-${token}` 같은 동적 클래스는
 * 생성되지 않아요. var(--color-…)로 읽으면 토큰이 늘어나도 그대로 동작합니다.
 */

export function Section({ title, description, children }) {
  return (
    <section className="mb-14">
      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-1">
        {title}
      </h2>
      {description && (
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">{description}</p>
      )}
      <div className={description ? "" : "mt-6"}>{children}</div>
    </section>
  );
}

export function Swatch({ token, hex, usage }) {
  return (
    <div className="w-28">
      <div
        className="h-16 w-full rounded-card border border-gray-200"
        style={{ backgroundColor: `var(--color-${token})` }}
      />
      <p className="mt-2 text-xs font-semibold text-gray-900">{token}</p>
      {hex && <p className="text-[11px] text-gray-400 font-mono">{hex}</p>}
      {usage && <p className="text-[11px] text-gray-500 leading-snug">{usage}</p>}
    </div>
  );
}

export function RadiusSample({ token, px, cls, usage }) {
  const radius = token === "(full)" ? "999px" : `var(--${token})`;
  return (
    <div className="w-28 text-center">
      <div
        className="h-16 w-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[11px] text-gray-500"
        style={{ borderRadius: radius }}
      >
        {px}
      </div>
      <p className="mt-2 text-xs font-semibold text-gray-900 font-mono">{cls}</p>
      <p className="text-[11px] text-gray-500 leading-snug">{usage}</p>
    </div>
  );
}

export function SpecRow({ label, sample, usage }) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-3">
      <div className="w-32 shrink-0 text-xs font-mono font-semibold text-gray-900">
        {label}
      </div>
      <div className="flex-1 min-w-0">{sample}</div>
      {usage && (
        <div className="w-48 shrink-0 text-[11px] text-gray-500 text-right">{usage}</div>
      )}
    </div>
  );
}
