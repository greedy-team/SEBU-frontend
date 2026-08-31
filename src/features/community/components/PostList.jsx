import PostRow from "./PostRow";
import { POST_SORT } from "../../../constants/postCategory";

function PostList({
  title,
  posts,
  totalElements,
  isLoading,
  error,
  sort,
  onSortChange,
}) {
  return (
    <div className="overflow-hidden rounded-card border border-gray-200 bg-white">
      {/* 리스트 헤더: 제목·개수 / 정렬 토글 */}
      <div className="flex items-center border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-bold text-gray-900">
          {title}
          <span className="ml-1.5 font-medium text-gray-400">
            {totalElements}개
          </span>
        </h2>

        <div className="ml-auto flex items-center gap-2 text-xs">
          {POST_SORT.map((option, index) => (
            <span key={option.value} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-200">|</span>}
              <button
                type="button"
                onClick={() => onSortChange(option.value)}
                aria-pressed={sort === option.value}
                className={
                  sort === option.value
                    ? "font-bold text-gray-900"
                    : "text-gray-400 transition-colors hover:text-gray-600"
                }
              >
                {option.label}
              </button>
            </span>
          ))}
        </div>
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
