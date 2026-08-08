import LabCard from "../../search/components/LabCard";

function DepartmentLabPanel({ department }) {
  return (
    <div>
      <h4 className="font-bold text-sm mb-3">
        {department.name}
        <span className="font-normal text-gray-400 ml-2">
          연구실 {department.labs.length}개
        </span>
      </h4>
      <div className="flex flex-col gap-2">
        {department.labs.map((lab) => (
          <LabCard key={lab.id} lab={lab} />
        ))}
      </div>
    </div>
  );
}

export default DepartmentLabPanel;
