// features/collegeView/components/DepartmentList.jsx
import { useState } from "react";
import DepartmentLabPanel from "./DepartmentLabPanel";

const departments = ["기계항공우주공학부", "로봇공학과", "건설환경공학과"]; // 자리만

function DepartmentList() {
  const [selectedDept, setSelectedDept] = useState(departments[0]);

  return (
    <div className="grid grid-cols-[200px_1fr] gap-4">
      <div className="flex flex-col gap-1">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`text-left px-3 py-2 rounded text-sm ${
              selectedDept === dept
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-600"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      <DepartmentLabPanel department={selectedDept} />
    </div>
  );
}

export default DepartmentList;
