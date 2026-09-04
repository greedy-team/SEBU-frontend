import { useState } from "react";
import DepartmentLabPanel from "./DepartmentLabPanel";

function DepartmentList({ departments }) {
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id);
  const selectedDept = departments.find((d) => d.id === selectedDeptId);

  return (
    <div className="grid grid-cols-[200px_1fr] gap-4">
      {/* 왼쪽 학과 리스트 */}
      <div className="flex flex-col gap-1">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedDeptId(dept.id)}
            aria-pressed={selectedDeptId === dept.id}
            className={`text-left px-3 py-2 rounded text-sm ${
              selectedDeptId === dept.id
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div>{dept.name}</div>
            <div className="text-xs text-gray-400">
              연구실 {dept.labs.length}개
            </div>
          </button>
        ))}
      </div>

      {/* 오른쪽 연구실 패널 */}
      {selectedDept && <DepartmentLabPanel department={selectedDept} />}
    </div>
  );
}

export default DepartmentList;
