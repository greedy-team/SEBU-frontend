import { useState } from "react";
import { POST_CATEGORY } from "../../../constants/postCategory";

// 명세 §4 — 공백을 제거한 길이가 기준입니다.
const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 2000;

const CATEGORY_OPTIONS = Object.entries(POST_CATEGORY);

const categoryChipClass = (isSelected) =>
  [
    "h-9 rounded-full px-4 text-sm transition-colors",
    isSelected
      ? "bg-brand-500 font-bold text-white"
      : "bg-gray-100 font-medium text-gray-600 hover:bg-gray-200",
  ].join(" ");

/**
 * 게시글 작성·수정 폼.
 *
 * 서버에 보내는 일은 하지 않고, 다듬은 입력을 onSubmit으로 넘기기만 합니다.
 * 작성이냐 수정이냐는 페이지가 정해서 onSubmit으로 주입해요.
 *
 * initialValues는 첫 렌더에만 반영되므로, 수정 화면은 글을 다 불러온 뒤에
 * 이 컴포넌트를 마운트해야 합니다.
 */
function PostForm({ initialValues, submitLabel = "등록", onSubmit, onCancel }) {
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const canSubmit =
    Boolean(category && trimmedTitle && trimmedContent) && !isSubmitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setMessage("");

    const { ok, message: failMessage } = await onSubmit({
      category,
      title: trimmedTitle,
      content: trimmedContent,
    });

    // 성공하면 페이지가 이동하므로 상태를 되돌리지 않습니다.
    if (!ok) {
      setIsSubmitting(false);
      setMessage(failMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-card border border-gray-200 bg-white p-6"
    >
      <fieldset>
        <legend className="text-sm font-bold text-gray-900">게시판</legend>
        <div className="mt-3 flex gap-2">
          {CATEGORY_OPTIONS.map(([value, { label }]) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              aria-pressed={category === value}
              className={categoryChipClass(category === value)}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 block">
        <span className="text-sm font-bold text-gray-900">제목</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="제목을 입력해주세요"
          className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <span className="mt-1.5 block text-right text-xs text-gray-300">
          {title.length} / {TITLE_MAX_LENGTH}
        </span>
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-bold text-gray-900">내용</span>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={CONTENT_MAX_LENGTH}
          rows={12}
          placeholder="연구실 경험이나 궁금한 점을 자유롭게 나눠주세요."
          className="mt-3 w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm leading-relaxed outline-none focus:border-brand-500"
        />
        <span className="mt-1.5 block text-right text-xs text-gray-300">
          {content.length} / {CONTENT_MAX_LENGTH}
        </span>
      </label>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-full px-5 text-sm text-gray-500 transition-colors hover:bg-gray-100"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-10 rounded-full bg-brand-500 px-6 text-sm font-bold text-white transition-all hover:brightness-95 disabled:opacity-40"
        >
          {isSubmitting ? "저장 중…" : submitLabel}
        </button>
      </div>

      {message && (
        <p className="mt-3 text-right text-xs text-gray-400">{message}</p>
      )}
    </form>
  );
}

export default PostForm;
