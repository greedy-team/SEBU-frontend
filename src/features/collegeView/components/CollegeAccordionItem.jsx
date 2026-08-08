// features/collegeView/components/CollegeAccordionItem.jsx
import { useState } from "react";
import DepartmentList from "./DepartmentList";

function CollegeAccordionItem({ name }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <h3 className="font-bold">{name}</h3>
          <p className="text-xs text-gray-400 mt-1">
            학과 n개 · 연구실 n개 · 모집중 n개
          </p>
        </div>
        <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 p-4">
          <DepartmentList />
        </div>
      )}
    </div>
  );
}

export default CollegeAccordionItem;
