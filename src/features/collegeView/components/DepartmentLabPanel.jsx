// features/collegeView/components/DepartmentLabPanel.jsx
function DepartmentLabPanel({ department }) {
  return (
    <div>
      <h4 className="font-bold text-sm mb-3">{department} 연구실</h4>
      <div className="flex flex-col gap-2">
        <div className="h-16 bg-gray-100 rounded" />
        <div className="h-16 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export default DepartmentLabPanel;
