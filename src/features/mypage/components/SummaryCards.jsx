function SummaryCards({ summary }) {
  const {
    bookmarkedLaboratoryCount = 0,
    bookmarkedPostCount = 0,
    receivedRecommendationCount = 0,
  } = summary || {};

  const cards = [
    { label: "관심 랩실", count: bookmarkedLaboratoryCount },
    { label: "북마크 게시글", count: bookmarkedPostCount },
    { label: "받은 추천", count: receivedRecommendationCount },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl p-4 flex flex-col items-center gap-1"
        >
          <p className="text-2xl font-bold">{card.count}</p>
          <p className="text-xs text-gray-400">{card.label}</p>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
