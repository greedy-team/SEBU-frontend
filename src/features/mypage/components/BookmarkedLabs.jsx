import { useNavigate } from "react-router-dom";
import LabCard from "../../../components/common/LabCard";

function BookmarkedLabs({ items = [], hasNext = false }) {
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <p className="font-bold mb-1">관심 랩실</p>
      <p className="text-xs text-gray-400 mb-3">북마크한 연구실 목록</p>

      {items.length === 0 ? (
        // 빈 화면
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
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            연구실 탐색하기
          </button>
        </div>
      ) : (
        // 랩실 목록
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <LabCard key={item.laboratory.id} lab={item.laboratory} />
          ))}
          {hasNext && (
            <button className="w-full py-3 text-sm text-blue-600 font-medium bg-white rounded-xl border border-gray-200 hover:bg-blue-50 transition-colors">
              더보기
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default BookmarkedLabs;
