import PostRow from "./PostRow";

function PostList({ posts, totalElements, isLoading, error }) {
  return (
    <div className="overflow-hidden rounded-card border border-gray-200 bg-white">
      {/* 리스트 헤더 */}
      <div className="flex items-center border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-bold text-gray-900">
          전체 게시글
          <span className="ml-1.5 font-medium text-gray-400">
            {totalElements}개
          </span>
        </h2>
      </div>

      {isLoading && (
        <p className="px-5 py-16 text-center text-sm text-gray-400">
          불러오는 중이에요…
        </p>
      )}

      {!isLoading && error && (
        <p className="px-5 py-16 text-center text-sm text-gray-500">{error}</p>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <p className="px-5 py-16 text-center text-sm text-gray-400">
          아직 글이 없어요.
        </p>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {posts.map((post) => (
            <li key={post.id}>
              <PostRow post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostList;
