import Header from "../../components/layout/Header";
import PostList from "../../features/community/components/PostList";
import { useCommunityPosts } from "../../features/community/hooks/useCommunityPosts";

function CommunityPage() {
  const { posts, totalElements, isLoading, error } = useCommunityPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">커뮤니티 홈</h1>

        <div className="mt-6">
          <PostList
            posts={posts}
            totalElements={totalElements}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
