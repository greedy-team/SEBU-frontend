import { useState, useEffect, useRef } from "react";
import DepartmentList from "./DepartmentList";

function CollegeAccordionItem({ college, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const itemRef = useRef(null);
  const { name, totalLabs, departments } = college;

  // 메인에서 단과대를 눌러 들어오면 해당 단과대가 위로 부드럽게 올라오게 함
  useEffect(() => {
    if (!defaultOpen) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    itemRef.current?.scrollIntoView({
      block: "start",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [defaultOpen]);

  return (
    <div
      ref={itemRef}
      className="scroll-mt-20 bg-white border border-gray-200 rounded-lg overflow-hidden"
    >
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
