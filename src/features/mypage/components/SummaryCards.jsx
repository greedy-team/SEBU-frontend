function SummaryCards({ bookmarkedLaboratoryCount = 0 }) {
  return (
    <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-1 mt-4">
      <p className="text-2xl font-bold">{bookmarkedLaboratoryCount}</p>
      <p className="text-xs text-gray-400">관심 랩실</p>
    </div>
  );
}

export default SummaryCards;
