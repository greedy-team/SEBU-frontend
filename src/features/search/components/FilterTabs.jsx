// FilterTabs.jsx
function FilterTabs() {
  return (
    <div className="mt-3 flex gap-2 text-sm">
      <button className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium">
        단과대/학과
      </button>
      <button className="px-3 py-1.5 rounded-full text-gray-500">
        연구 분야
      </button>
    </div>
  );
}
export default FilterTabs;
