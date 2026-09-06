import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/format";

const MAX_LENGTH = 500;

function Avatar({ nickname, tone = "brand" }) {
  const bg = tone === "brand" ? "bg-brand-500" : "bg-gray-400";
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${bg}`}
      aria-hidden="true"
    >
      {nickname.slice(0, 1)}
    </span>
  );
}

/** 댓글 한 건. 수정 중일 때는 입력창으로 바뀝니다. */
function CommentItem({ comment, isPostAuthor, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    const { ok, message: failMessage } = await onEdit(comment.id, trimmed);
    setIsSubmitting(false);

    if (!ok) {
      setMessage(failMessage);
      return;
    }
    setIsEditing(false);
    setMessage("");
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    const { ok, message: failMessage } = await onDelete(comment.id);
    setIsSubmitting(false);
    if (!ok) {
      setIsConfirmingDelete(false);
      setMessage(failMessage);
    }
  };

  return (
    <li className="px-5 py-4">
      <div className="flex items-center gap-2 text-xs">
        <Avatar nickname={comment.author.nickname} tone="gray" />
        <span className="font-medium text-gray-700">
          {comment.author.nickname}
        </span>
        {isPostAuthor && (
          <span className="rounded-field bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600">
            작성자
          </span>
        )}
        <span className="ml-auto text-gray-300">
          {formatDate(comment.createdAt)}
        </span>
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            aria-label="댓글 수정"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={MAX_LENGTH}
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
          <div className="mt-1.5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setDraft(comment.content);
                setMessage("");
              }}
              className="rounded-full px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!draft.trim() || isSubmitting}
              className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-bold text-white hover:brightness-95 disabled:opacity-40"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-gray-800">
          {comment.content}
        </p>
      )}

      {/* 내 댓글에만 수정·삭제를 보여줍니다. (명세 §3.4) */}
      {comment.mine && !isEditing && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {isConfirmingDelete ? (
            <>
              <span className="text-gray-500">정말 삭제할까요?</span>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="font-bold text-red-500 disabled:opacity-40"
              >
                삭제
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-gray-700"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-gray-400 hover:text-gray-700"
              >
                삭제
              </button>
            </>
          )}
        </div>
      )}

      {message && <p className="mt-2 text-xs text-gray-400">{message}</p>}
    </li>
  );
}

/** 댓글 작성 폼. 비로그인이면 로그인 유도로 대체됩니다. */
function CommentForm({ isLoggedIn, onSubmit }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  if (!isLoggedIn) {
    return (
      <div className="border-t border-gray-100 px-5 py-6 text-center">
        <p className="text-sm text-gray-500">로그인하고 댓글을 남겨보세요.</p>
        <Link
          to="/login"
          className="mt-3 inline-flex h-10 items-center rounded-full bg-brand-500 px-5 text-sm font-bold text-white transition-all hover:brightness-95"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");

    const { ok, message: failMessage } = await onSubmit(trimmed);
    setIsSubmitting(false);

    if (!ok) {
      setMessage(failMessage);
      return;
    }
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-100 p-5">
      <textarea
        aria-label="댓글 입력창"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={MAX_LENGTH}
        rows={3}
        placeholder="따뜻한 댓글을 남겨주세요..."
        className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
      <div className="mt-2 flex items-center">
        <span className="text-xs text-gray-300">
          {content.length} / {MAX_LENGTH}
        </span>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="ml-auto h-9 rounded-full bg-brand-500 px-5 text-sm font-bold text-white transition-all hover:brightness-95 disabled:opacity-40"
        >
          {isSubmitting ? "등록 중…" : "등록"}
        </button>
      </div>
      {message && <p className="mt-2 text-xs text-gray-400">{message}</p>}
    </form>
  );
}

function CommentSection({
  comments,
  totalElements,
  hasNext,
  isLoading,
  error,
  isLoggedIn,
  postAuthorId,
  onSubmit,
  onEdit,
  onDelete,
  onLoadMore,
}) {
  return (
    <section className="mt-4 rounded-card border border-gray-200 bg-white">
      <h2 className="px-5 py-4 text-sm font-bold text-gray-900">
        댓글 <span className="text-brand-500">{totalElements}개</span>
      </h2>

      {isLoading && (
        <p className="px-5 py-12 text-center text-sm text-gray-400">
          불러오는 중이에요…
        </p>
      )}

      {!isLoading && error && (
        <p className="px-5 py-12 text-center text-sm text-gray-500">{error}</p>
      )}

      {!isLoading && !error && comments.length === 0 && (
        <p className="px-5 py-12 text-center text-sm text-gray-400">
          첫 번째 댓글을 남겨보세요!
        </p>
      )}

      {!isLoading && !error && comments.length > 0 && (
        <>
          <ul className="divide-y divide-gray-100 border-t border-gray-100">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isPostAuthor={comment.author.id === postAuthorId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>

          {hasNext && (
            <button
              type="button"
              onClick={onLoadMore}
              className="w-full border-t border-gray-100 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              댓글 더 보기
            </button>
          )}
        </>
      )}

      <CommentForm isLoggedIn={isLoggedIn} onSubmit={onSubmit} />
    </section>
  );
}

export default CommentSection;
