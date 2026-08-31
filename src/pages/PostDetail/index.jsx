import { useParams } from "react-router-dom";
import Header from "../../components/layout/Header";

function PostDetailPage() {
  const { postId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">게시글 상세</h1>
        <p className="mt-2 text-sm text-gray-500">postId: {postId}</p>
      </div>
    </div>
  );
}

export default PostDetailPage;
