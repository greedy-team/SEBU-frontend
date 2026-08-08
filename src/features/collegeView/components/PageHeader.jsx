// features/collegeView/components/PageHeader.jsx
function PageHeader() {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-2xl font-bold">단과대 전체보기</h1>
        <p className="text-sm text-gray-500 mt-1">
          전체 단과대학의 연구실을 한눈에 살펴보세요.
        </p>
      </div>

      <div className="flex gap-4 text-sm text-gray-600">
        <span>
          <b className="text-lg">5</b>개 단과대
        </span>
        <span>
          <b className="text-lg">136</b>개 전체 연구실
        </span>
        <span>
          <b className="text-lg">35</b>개 현재 모집중
        </span>
      </div>
    </div>
  );
}

export default PageHeader;
