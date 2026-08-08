function FilterTabs({ activeTab, setActiveTab }) {
  const toggleTab = (tab) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <div className="mt-3 flex gap-2 text-sm">
      <button
        onClick={() => toggleTab("college")}
        className={`px-3 py-1.5 rounded-full font-medium ${
          activeTab === "college" ? "bg-blue-50 text-blue-600" : "text-gray-500"
        }`}
      >
        단과대/학과
      </button>
      <button
        onClick={() => toggleTab("field")}
        className={`px-3 py-1.5 rounded-full font-medium ${
          activeTab === "field" ? "bg-blue-50 text-blue-600" : "text-gray-500"
        }`}
      >
        연구 분야
      </button>
    </div>
  );
}

export default FilterTabs;
