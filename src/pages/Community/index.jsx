import Header from "../../components/layout/Header";

function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">커뮤니티</h1>
        <p className="mt-2 text-sm text-gray-500">
          게시글 목록·카테고리 탭·검색·인기글은 후속 이슈에서 구현합니다.
        </p>
      </div>
    </div>
  );
}

export default CommunityPage;
