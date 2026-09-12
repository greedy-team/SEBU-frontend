import { useRef } from "react";

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronIcon({ direction }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

function Chip({ label, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 ${
        isSelected
          ? "border-brand-500 bg-brand-50 font-bold text-brand-600 shadow-card"
          : "border-gray-200 bg-white font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {isSelected && <CheckIcon />}
      {label}
    </button>
  );
}

// 카테고리가 24개라 줄바꿈하면 화면을 6줄이나 차지합니다.
// 한 줄로 두고 좌우 화살표로 넘겨봅니다.
function ScrollableRow({ children }) {
  const trackRef = useRef(null);
  const scrollBy = (amount) =>
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });

  const arrowClass =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => scrollBy(-320)}
        aria-label="이전 목록 보기"
        className={arrowClass}
      >
        <ChevronIcon direction="left" />
      </button>

      {/* 스크롤바는 숨기고 화살표로만 넘기게 합니다. */}
      <div
        ref={trackRef}
        className="flex gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(320)}
        aria-label="다음 목록 보기"
        className={arrowClass}
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  );
}

function ResearchFieldChips({
  categories,
  fields,
  selectedCategoryIds,
  selectedFieldIds,
  onSelectCategory,
  onSelectField,
}) {
  if (categories.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-400">
        연구 분야 정보를 불러오지 못했습니다.
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <ScrollableRow>
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            isSelected={selectedCategoryIds.includes(category.id)}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}
      </ScrollableRow>

      {/* researchFieldDetails가 내려올 때만 2단계가 나타납니다. */}
      {fields.length > 0 && (
        <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-4">
          <span className="text-xs font-semibold text-gray-400">
            세부 연구 분야
          </span>
          <ScrollableRow>
            {fields.map((field) => (
              <Chip
                key={field.researchFieldId}
                label={field.name}
                isSelected={selectedFieldIds.includes(field.researchFieldId)}
                onClick={() => onSelectField(field.researchFieldId)}
              />
            ))}
          </ScrollableRow>
        </div>
      )}
    </div>
  );
}

export default ResearchFieldChips;
