import FilterChip from "./FilterChip";
import ScrollableRow from "./ScrollableRow";

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
      {/* 카테고리가 24개라 줄바꿈하면 화면을 6줄이나 차지해서 한 줄 캐러셀로 둡니다. */}
      <ScrollableRow>
        {categories.map((category) => (
          <FilterChip
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
              <FilterChip
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
