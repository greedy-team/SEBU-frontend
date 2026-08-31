import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import { usePostDetail } from "../../features/community/hooks/usePostDetail";
import {
  toggleLike,
  toggleBookmark,
} from "../../features/community/api/communityApi";
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

const reactionButtonClass = (isActive) =>
  [
    "flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
    "disabled:opacity-50",
    isActive
      ? "bg-brand-50 font-bold text-brand-600"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
  ].join(" ");

function PostDetailPage() {
  const { postId } = useParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { post, setPost, isLoading, errorCode } = usePostDetail(
    postId,
    accessToken,
  );

  // 좋아요·북마크 요청이 겹치지 않게 막고, 실패 사유를 한 줄로 보여줍니다.
  const [isReacting, setIsReacting] = useState(false);
  const [reactionMessage, setReactionMessage] = useState("");

  /**
   * 좋아요·북마크는 요청/응답 처리가 같아서 한 함수로 묶었습니다.
   * apply는 응답 data로 post의 어떤 값을 갈아끼울지 정합니다.
   */
  const runReaction = async (requestFn, apply) => {
    if (!accessToken) {
      setReactionMessage("로그인하면 참여할 수 있어요.");
      return;
    }
    if (isReacting) return;

    setIsReacting(true);
    setReactionMessage("");

    try {
      const { ok, result } = await requestFn();
      if (!ok || !result.success) {
        setReactionMessage("잠시 후 다시 시도해주세요.");
        return;
      }
      // 상세를 통째로 다시 부르지 않고 바뀐 값만 갈아끼웁니다.
      setPost((prev) => ({ ...prev, ...apply(result.data) }));
    } catch {
      setReactionMessage("서버와 연결할 수 없어요.");
    } finally {
      setIsReacting(false);
    }
  };

  const handleLike = () =>
    runReaction(
      () => toggleLike(post.id, !post.liked, accessToken),
      (data) => ({ liked: data.liked, likeCount: data.likeCount }),
    );

  const handleBookmark = () =>
    runReaction(
      () => toggleBookmark(post.id, !post.bookmarked, accessToken),
      (data) => ({ bookmarked: data.bookmarked }),
    );

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

            {/* 좋아요 · 북마크 */}
            <div className="mt-8 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleLike}
                disabled={isReacting}
                aria-pressed={post.liked}
                className={reactionButtonClass(post.liked)}
              >
                👍 좋아요 {formatCount(post.likeCount)}
              </button>
              <button
                type="button"
                onClick={handleBookmark}
                disabled={isReacting}
                aria-pressed={post.bookmarked}
                className={reactionButtonClass(post.bookmarked)}
              >
                🔖 {post.bookmarked ? "북마크됨" : "북마크"}
              </button>
            </div>

            {reactionMessage && (
              <p className="mt-3 text-center text-xs text-gray-400">
                {reactionMessage}
              </p>
            )}
          </article>
        )}
      </div>
    </div>
  );
}

export default PostDetailPage;
