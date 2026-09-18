import { useNavigate } from "react-router-dom";
import LabCard from "../../../components/common/LabCard";

function BookmarkedLabs({ items = [], onUnbookmark, undoTarget, onUndo }) {
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <p className="font-bold mb-1">관심 랩실</p>
      <p className="text-xs text-gray-400 mb-3">북마크한 연구실 목록</p>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
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
            onClick={() => navigate("/search")}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            연구실 탐색하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <LabCard
              key={item.laboratory.id}
              lab={item.laboratory}
              onUnbookmark={onUnbookmark}
            />
          ))}
        </div>
      )}

      {undoTarget && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg">
          <p className="text-sm">
            {undoTarget.item.laboratory.name}을(를) 북마크에서 해제했어요
          </p>
          <button
            onClick={onUndo}
            className="text-sm font-bold text-brand-300 hover:text-brand-200"
          >
            실행취소
          </button>
        </div>
      )}
    </div>
  );
}

export default BookmarkedLabs;
