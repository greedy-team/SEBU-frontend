import FilterChip from "./FilterChip";
import ScrollableRow from "./ScrollableRow";

function CollegeChips({ colleges, selectedColleges, onSelect }) {
  return (
    <div className="mt-4">
      <ScrollableRow wrapOnDesktop>
        {colleges.map((college) => (
          <FilterChip
            key={college.id}
            label={college.name}
            isSelected={selectedColleges.includes(college.id)}
            onClick={() => onSelect(college.id)}
          />
        ))}
      </ScrollableRow>
    </div>
  );
}

export default CollegeChips;
