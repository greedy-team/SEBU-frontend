function PageHeader({ totalColleges, totalLabs, totalRecruiting }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-2xl font-bold">단과대 전체보기</h1>
        <p className="text-sm text-gray-500 mt-1">
          전체 단과대학의 연구실을 한눈에 살펴보세요.
        </p>
      </div>

      <div className="flex gap-6 text-sm text-gray-600">
        <span>
          <b className="text-lg text-black">{totalColleges}</b>개 단과대
        </span>
        <span>
          <b className="text-lg text-black">{totalLabs}</b>개 전체 연구실
        </span>
        <span>
          <b className="text-lg text-green-600">{totalRecruiting}</b>개 모집중
        </span>
      </div>
    </div>
  );
}

export default PageHeader;
