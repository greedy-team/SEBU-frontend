import { COMMUNITY_TABS } from "../../../constants/postCategory";

function CategoryTabs({ activeTabId, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COMMUNITY_TABS.map((tab) => {
        const isActive = activeTabId === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-pressed={isActive}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              isActive
                ? "bg-gray-900 font-bold text-white"
                : "border border-gray-200 bg-white font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;
