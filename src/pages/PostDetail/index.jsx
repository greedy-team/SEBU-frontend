import { Link, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import { usePostDetail } from "../../features/community/hooks/usePostDetail";
import { useAuthStore } from "../../store/authStore";
import { POST_CATEGORY, POST_BADGE } from "../../constants/postCategory";
import { formatDate, formatCount } from "../../features/community/utils/format";

function BackLink() {
  return (
    <Link
      to="/community"
      className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
    >
      <span aria-hidden="true">‹</span> 목록으로 돌아가기
    </Link>
  );
}

/** 닉네임 첫 글자를 딴 원형 아바타 */
function Avatar({ nickname }) {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white"
      aria-hidden="true"
    >
      {nickname.slice(0, 1)}
    </span>
  );
}

function PostDetailPage() {
  const { postId } = useParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { post, isLoading, errorCode } = usePostDetail(postId, accessToken);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <BackLink />

        {isLoading && (
          <p className="py-24 text-center text-sm text-gray-400">
            불러오는 중이에요…
          </p>
        )}

        {!isLoading && errorCode === "POST_NOT_FOUND" && (
          <div className="mt-4 rounded-card border border-gray-200 bg-white px-5 py-24 text-center">
            <p className="text-sm font-bold text-gray-900">
              게시글을 찾을 수 없어요
            </p>
            <p className="mt-1.5 text-sm text-gray-400">
              삭제되었거나 주소가 잘못되었어요.
            </p>
          </div>
        )}

        {!isLoading && errorCode && errorCode !== "POST_NOT_FOUND" && (
          <p className="py-24 text-center text-sm text-gray-500">
            게시글을 불러오지 못했어요.
          </p>
        )}

        {!isLoading && post && (
          <article className="mt-4 rounded-card border border-gray-200 bg-white p-6">
            {/* 카테고리 배지 + HOT/NEW */}
            <div className="flex items-center gap-2">
              <span
                className={`rounded-field px-2 py-0.5 text-xs font-bold ${POST_CATEGORY[post.category].badge}`}
              >
                {POST_CATEGORY[post.category].label}
              </span>
              {post.badges.map((badge) => (
                <span
                  key={badge}
                  className={`text-xs font-bold ${POST_BADGE[badge].color}`}
                >
                  {POST_BADGE[badge].label}
                </span>
              ))}
            </div>

            <h1 className="mt-3 text-xl font-bold text-gray-900">
              {post.title}
            </h1>

            {/* 작성자 · 날짜 / 조회수 · 좋아요 */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <Avatar nickname={post.author.nickname} />
              <span className="font-medium text-gray-700">
                {post.author.nickname}
              </span>
              <span>{formatDate(post.createdAt)}</span>
              <span className="ml-auto flex items-center gap-3">
                <span>👁 {formatCount(post.viewCount)}</span>
                <span>👍 {formatCount(post.likeCount)}</span>
              </span>
            </div>

            {/* 본문 — 줄바꿈 유지 */}
            <p className="mt-6 border-t border-gray-100 pt-6 text-sm leading-relaxed whitespace-pre-line text-gray-800">
              {post.content}
            </p>
          </article>
        )}
      </div>
    </div>
  );
}

export default PostDetailPage;
