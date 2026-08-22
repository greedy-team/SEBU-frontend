import { useNavigate } from "react-router-dom";

function BookmarkedPosts() {
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <p className="font-bold mb-1">북마크 게시글</p>
      <p className="text-xs text-gray-400 mb-3">저장한 커뮤니티 글 목록</p>

      <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
        {/* 북마크 아이콘 */}
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-xl">🔖</span>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            아직 저장한 게시글이 없어요
          </p>
          <p className="text-xs text-gray-400 mt-1">
            커뮤니티 게시글에서 북마크 버튼을 눌러보세요
          </p>
        </div>

        <button
          onClick={() => navigate("/community")}
          className="px-6 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 transition-colors"
        >
          커뮤니티 바로가기
        </button>
      </div>
    </div>
  );
}

export default BookmarkedPosts;
