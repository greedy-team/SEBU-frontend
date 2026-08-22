import { useNavigate } from "react-router-dom";

function BookmarkedLabs() {
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <p className="font-bold mb-1">관심 랩실</p>
      <p className="text-xs text-gray-400 mb-3">북마크한 연구실 목록</p>

      <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
        {/* 북마크 아이콘 */}
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-xl">🔖</span>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            아직 관심 랩실이 없어요
          </p>
          <p className="text-xs text-gray-400 mt-1">
            연구실 탐색 페이지에서 북마크 버튼을 눌러보세요
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          연구실 탐색하기
        </button>
      </div>
    </div>
  );
}

export default BookmarkedLabs;
