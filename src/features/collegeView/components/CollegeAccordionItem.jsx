import { useState } from "react";
import DepartmentList from "./DepartmentList";

function CollegeAccordionItem({ college }) {
  const [isOpen, setIsOpen] = useState(false);
  const { name, totalLabs, recruitingCount, departments } = college;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={`${name} ${isOpen ? "접기" : "펼치기"}`}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-bold">{name}</h3>
            <span className="text-xs text-gray-500">
              학과 {departments.length}개 · 연구실 {totalLabs}개
            </span>
            <span className="text-xs text-green-600 font-medium">
              ● 모집중 {recruitingCount}개
            </span>
          </div>
        </div>
        <span className="text-gray-400 text-xs" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 p-4">
          <DepartmentList departments={departments} />
        </div>
      )}
    </div>
  );
}

export default CollegeAccordionItem;
