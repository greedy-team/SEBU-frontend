import { Link } from "react-router-dom";
import { formatCount } from "../utils/format";

/** 1~3위만 색으로 강조하고 4위는 중립. (DESIGN_SYSTEM.md §0 "화면당 핵심 강조는 하나만") */
const rankColor = (index) => (index < 3 ? "text-brand-500" : "text-gray-300");

function PopularPostsCard({ posts, isLoading }) {
  return (
    <div className="rounded-card border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-bold text-gray-900">🔥 인기글 TOP 4</h3>

      {isLoading && (
        <p className="mt-4 text-xs text-gray-400">불러오는 중이에요…</p>
      )}

      {!isLoading && posts.length === 0 && (
        <p className="mt-4 text-xs text-gray-400">아직 인기글이 없어요.</p>
      )}

      {!isLoading && posts.length > 0 && (
        <ol className="mt-4 space-y-4">
          {posts.map((post, index) => (
            <li key={post.id}>
              <Link to={`/community/${post.id}`} className="group flex gap-3">
                <span
                  className={`w-3 shrink-0 text-sm font-bold ${rankColor(index)}`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] leading-snug font-medium text-gray-800 transition-colors group-hover:text-brand-600">
                    {post.title}
                  </span>
                  <span className="mt-1 block text-[11px] text-gray-400">
                    👁 {formatCount(post.viewCount)} · 💬{" "}
                    {formatCount(post.commentCount)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default PopularPostsCard;
