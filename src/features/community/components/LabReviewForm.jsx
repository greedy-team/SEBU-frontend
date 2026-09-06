import { useState } from "react";
import {
  REVIEW_CATEGORY,
  PARTICIPATION_TERM,
  REVIEW_EVALUATIONS,
  REVIEW_TAG,
} from "../../../constants/labReview";

// 명세 §6.6 — 본문은 공백 제거 후 20자 이상이어야 합니다.
const CONTENT_MIN_LENGTH = 20;
const CONTENT_MAX_LENGTH = 2000;

// 카테고리만 { label, badge } 형태라 라벨만 뽑아 씁니다.
const CATEGORY_LABELS = Object.fromEntries(
  Object.entries(REVIEW_CATEGORY).map(([key, { label }]) => [key, label]),
);

/** 참여 연도. 2000년까지 나열할 필요는 없어서 최근 6년만 보여줍니다. */
const YEAR_OPTIONS = Array.from(
  { length: 6 },
  (_, index) => new Date().getFullYear() - index,
);

const chipClass = (isSelected) =>
  [
    "h-9 rounded-full px-4 text-sm transition-colors",
    isSelected
      ? "bg-brand-500 font-bold text-white"
      : "bg-gray-100 font-medium text-gray-600 hover:bg-gray-200",
  ].join(" ");

/**
 * 칩 묶음. multiple이면 여러 개를 고를 수 있습니다.
 * options는 { 값: 라벨 } 형태입니다.
 */
function ChipGroup({ legend, options, value, onChange, multiple = false }) {
  const isSelected = (key) => (multiple ? value.includes(key) : value === key);

  const handleClick = (key) => {
    if (!multiple) return onChange(key);
    onChange(
      value.includes(key)
        ? value.filter((item) => item !== key)
        : [...value, key],
    );
  };

  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-bold text-gray-900">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(options).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleClick(key)}
            aria-pressed={isSelected(key)}
            className={chipClass(isSelected(key))}
          >
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * 랩실 후기 작성 폼.
 *
 * 후기는 등록 후 수정·삭제가 불가능해서(명세 §6.7) 작성 전용입니다.
 * PostForm과 같이, 서버 요청은 하지 않고 onSubmit으로 값을 넘기기만 합니다.
 */
function LabReviewForm({ onSubmit, onCancel }) {
  const [category, setCategory] = useState("");
  const [participationYear, setParticipationYear] = useState(YEAR_OPTIONS[0]);
  const [participationTerm, setParticipationTerm] = useState("");
  // 연구 강도·인건비·분위기를 한 객체로 모아 REVIEW_EVALUATIONS로 한 번에 그립니다.
  const [evaluations, setEvaluations] = useState({});
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const trimmedContent = content.trim();
  const remaining = CONTENT_MIN_LENGTH - trimmedContent.length;

  const canSubmit =
    Boolean(category && participationTerm) &&
    REVIEW_EVALUATIONS.every(({ field }) => evaluations[field]) &&
    remaining <= 0 &&
    !isSubmitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setMessage("");

    const { ok, message: failMessage } = await onSubmit({
      category,
      participationYear,
      participationTerm,
      ...evaluations,
      tags,
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
      <ChipGroup
        legend="어떤 후기인가요?"
        options={CATEGORY_LABELS}
        value={category}
        onChange={setCategory}
      />

      <div className="mt-6">
        <label
          htmlFor="participation-year"
          className="text-sm font-bold text-gray-900"
        >
          참여 연도
        </label>
        <select
          id="participation-year"
          value={participationYear}
          onChange={(event) => setParticipationYear(Number(event.target.value))}
          className="mt-3 block h-10 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-brand-500"
        >
          {YEAR_OPTIONS.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>
      </div>

      <ChipGroup
        legend="참여 학기"
        options={PARTICIPATION_TERM}
        value={participationTerm}
        onChange={setParticipationTerm}
      />

      {/* 평가 3항목은 상수 하나로 그립니다. (읽기 화면과 같은 구조) */}
      {REVIEW_EVALUATIONS.map(({ field, label, options }) => (
        <ChipGroup
          key={field}
          legend={label}
          options={options}
          value={evaluations[field] ?? ""}
          onChange={(next) =>
            setEvaluations((prev) => ({ ...prev, [field]: next }))
          }
        />
      ))}

      <ChipGroup
        legend="좋았던 점 (선택)"
        options={REVIEW_TAG}
        value={tags}
        onChange={setTags}
        multiple
      />

      <div className="mt-6">
        <label
          htmlFor="review-content"
          className="text-sm font-bold text-gray-900"
        >
          후기
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={CONTENT_MAX_LENGTH}
          rows={10}
          placeholder="연구실 분위기, 하는 일, 배운 점을 자유롭게 적어주세요."
          className="mt-3 w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm leading-relaxed outline-none focus:border-brand-500"
        />
        <p className="mt-1.5 text-right text-xs text-gray-300">
          {remaining > 0
            ? `${remaining}자 더 입력해주세요`
            : `${content.length} / ${CONTENT_MAX_LENGTH}`}
        </p>
      </div>

      {/* 명세 §6.7이 요구하는 안내입니다. */}
      <p className="mt-6 rounded-xl bg-orange-50 px-4 py-3 text-xs leading-relaxed text-orange-600">
        수정 및 삭제가 불가능하므로 신중히 작성해주세요.
      </p>

      <div className="mt-4 flex justify-end gap-2">
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
          {isSubmitting ? "등록 중…" : "등록"}
        </button>
      </div>

      {message && (
        <p className="mt-3 text-right text-xs text-gray-400">{message}</p>
      )}
    </form>
  );
}

export default LabReviewForm;
