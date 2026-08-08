// LabList.jsx
function LabList() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="h-24 bg-white border border-gray-200 rounded-lg"
        />
      ))}
    </div>
  );
}
export default LabList;
