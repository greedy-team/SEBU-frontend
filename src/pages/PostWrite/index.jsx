import Header from "../../components/layout/Header";

function PostWritePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">글 작성</h1>
        <p className="mt-2 text-sm text-gray-500">
          카테고리 선택·제목·본문 입력은 후속 이슈에서 구현합니다.
        </p>
      </div>
    </div>
  );
}

export default PostWritePage;
