import {
  REVIEW_CATEGORY,
  PARTICIPATION_TERM,
  REVIEW_EVALUATIONS,
  REVIEW_TAG,
} from "../../../constants/labReview";
import { formatDate } from "../utils/format";

/**
 * 후기 한 건.
 *
 * 작성자는 항상 익명입니다 — 응답에 작성자 정보가 아예 오지 않습니다. (명세 §6.5)
 * 별점은 v2에서 폐기되어 표시하지 않습니다.
 */
function ReviewCard({ review }) {
  const category = REVIEW_CATEGORY[review.category];

  return (
    <li className="px-5 py-5">
      {/* 카테고리 · 참여 시기 · 작성일 */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`rounded-field px-2 py-0.5 font-bold ${category.badge}`}
        >
          {category.label}
        </span>
        <span className="text-gray-400">
          {review.participationYear}년{" "}
          {PARTICIPATION_TERM[review.participationTerm]} 참여
        </span>
        <span className="ml-auto text-gray-300">
          {formatDate(review.createdAt)}
        </span>
      </div>

      {/* 평가 3항목 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {REVIEW_EVALUATIONS.map(({ field, label, options }) => (
          <span
            key={field}
            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
          >
            {label}{" "}
            <span className="font-bold text-gray-800">
              {options[review[field]]}
            </span>
          </span>
        ))}
      </div>

      {/* 좋은 점 태그 (선택 항목이라 없을 수 있습니다) */}
      {review.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {review.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600"
            >
              {REVIEW_TAG[tag]}
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-gray-800">
        {review.content}
      </p>

      <p className="mt-3 text-xs text-gray-400">익명</p>
    </li>
  );
}

export default ReviewCard;
