import React from "react";

const LabListHeader = ({ totalCount, hasFilters, sortType, onSortChange }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      {/* 왼쪽 안내 문구 */}
      <div className="text-lg font-bold text-gray-900">
        {hasFilters ? (
          <>
            선택한 조건의 연구실{" "}
            <span className="text-blue-500">{totalCount}개</span>를 찾았어요 🎯
          </>
        ) : (
          <>
            전체 <span className="text-blue-500">{totalCount}개</span> 연구실
          </>
        )}
      </div>

      {/* 오른쪽 정렬 드롭다운 */}
      <div className="relative">
        <select
          value={sortType}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors"
        >
          <option value="RECENT">최신순</option>
          <option value="POPULAR">인기순</option>
          <option value="NAME_ASC">이름 오름차순</option>
          <option value="NAME_DESC">이름 내림차순</option>
        </select>
        {/* 화살표 아이콘 커스텀 */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LabListHeader;
