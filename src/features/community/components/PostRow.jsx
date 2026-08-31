import { Link } from "react-router-dom";
import { POST_CATEGORY, POST_BADGE } from "../../../constants/postCategory";
import { formatDate, formatCount } from "../utils/format";

function PostRow({ post }) {
  const {
    id,
    category,
    title,
    author,
    badges,
    likeCount,
    commentCount,
    viewCount,
    createdAt,
  } = post;

  return (
    <Link
      to={`/community/${id}`}
      className="block px-5 py-4 transition-colors hover:bg-gray-50"
    >
      {/* 1행: 카테고리 배지 + HOT/NEW */}
      <div className="flex items-center gap-2">
        <span
          className={`rounded-field px-2 py-0.5 text-xs font-bold ${POST_CATEGORY[category].badge}`}
        >
          {POST_CATEGORY[category].label}
        </span>
        {badges.map((badge) => (
          <span
            key={badge}
            className={`text-xs font-bold ${POST_BADGE[badge].color}`}
          >
            {POST_BADGE[badge].label}
          </span>
        ))}
      </div>

      {/* 2행: 제목 */}
      <h3 className="mt-2 font-bold text-gray-900">{title}</h3>

      {/* 3행: 작성자 · 통계 · 날짜 */}
      <div className="mt-2 flex items-center text-xs text-gray-400">
        <span className="text-gray-500">{author.nickname}</span>
        <span className="ml-auto flex items-center gap-3">
          <span>👍 {formatCount(likeCount)}</span>
          <span>💬 {formatCount(commentCount)}</span>
          <span>👁 {formatCount(viewCount)}</span>
          <span>{formatDate(createdAt)}</span>
        </span>
      </div>
    </Link>
  );
}

export default PostRow;
