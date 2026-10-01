import { useState } from "react";
import DepartmentLabPanel from "./DepartmentLabPanel";

function DepartmentList({ departments }) {
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id);
  const selectedDept = departments.find((d) => d.id === selectedDeptId);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
      {/* 학과 리스트: 모바일은 위쪽 가로 스크롤, 데스크톱은 왼쪽 세로 목록 */}
      <div className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-x-visible md:pb-0">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedDeptId(dept.id)}
            aria-pressed={selectedDeptId === dept.id}
            className={`shrink-0 text-left px-3 py-2 rounded text-sm whitespace-nowrap md:whitespace-normal ${
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
      {selectedDept && (
        <div className="min-w-0">
          <DepartmentLabPanel department={selectedDept} />
        </div>
      )}
    </div>
  );
}

export default DepartmentList;
