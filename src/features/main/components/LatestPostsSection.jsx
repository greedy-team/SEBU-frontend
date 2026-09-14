import { Link } from "react-router-dom";

const CATEGORY_LABEL = {
  FREE: "자유",
  QUESTION: "질문",
};

const BADGE_STYLE = {
  NEW: "bg-brand-50 text-brand-600",
  HOT: "bg-red-50 text-red-500",
};

/** "2026-09-10T10:00:00" 처럼 시간대 표기가 없는 값이라 앞 10글자만 씁니다. */
function formatDate(createdAt) {
  if (!createdAt) return "";
  const [, month, day] = createdAt.slice(0, 10).split("-");
  return `${Number(month)}월 ${Number(day)}일`;
}

function PostRow({ post }) {
  return (
    <li>
      <Link
        to={`/community/${post.id}`}
        className="group flex items-center gap-3 py-3.5"
      >
        <span className="shrink-0 rounded-field bg-gray-50 px-2 py-1 text-[11px] font-bold text-gray-500">
          {CATEGORY_LABEL[post.category] ?? post.category}
        </span>

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800 transition-colors group-hover:text-brand-600">
          {post.title}
        </span>

        {(post.badges ?? []).map((badge) => (
          <span
            key={badge}
            className={`shrink-0 rounded-field px-1.5 py-0.5 text-[10px] font-bold ${
              BADGE_STYLE[badge] ?? "bg-gray-50 text-gray-500"
            }`}
          >
            {badge}
          </span>
        ))}

        <span className="shrink-0 text-xs text-gray-400">
          💬 {post.commentCount}
        </span>
        <span className="w-[60px] shrink-0 text-right text-xs text-gray-400">
          {formatDate(post.createdAt)}
        </span>
      </Link>
    </li>
  );
}

function LatestPostsSection({ posts, status }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">최신 글</h2>
          <p className="mt-1 text-xs text-gray-400">
            학부연구생을 준비하는 사람들의 이야기
          </p>
        </div>

        <Link
          to="/community"
          className="shrink-0 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[13px] font-bold text-gray-700 transition-colors hover:border-brand-200 hover:text-brand-600"
        >
          전체보기
        </Link>
      </div>

      {status === "loading" && (
        <p className="mt-6 text-sm text-gray-400">불러오는 중이에요…</p>
      )}

      {status === "error" && (
        <p className="mt-6 text-sm text-gray-400">
          글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {status === "success" && posts.length === 0 && (
        <p className="mt-6 text-sm text-gray-400">아직 올라온 글이 없어요.</p>
      )}

      {status === "success" && posts.length > 0 && (
        <ul className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default LatestPostsSection;
