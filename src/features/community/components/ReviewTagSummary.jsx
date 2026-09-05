import { REVIEW_TAG } from "../../../constants/labReview";

/**
 * 좋은 점 태그 요약.
 *
 * ⚠️ 임시 방식입니다. 응답에 태그 집계가 없어서 **불러온 후기의 태그만** 셉니다.
 * 후기가 많아 페이지가 나뉘면 실제 비율과 어긋납니다.
 * BE에 tagSummary 추가를 요청할 예정이에요. (COMMUNITY_API.md §11)
 */
function ReviewTagSummary({ reviews }) {
  const counts = reviews
    .flatMap((review) => review.tags)
    .reduce((acc, tag) => ({ ...acc, [tag]: (acc[tag] ?? 0) + 1 }), {});

  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (ranked.length === 0) return null;

  return (
    <section className="mt-4 rounded-card border border-gray-200 bg-white p-5">
      <h2 className="text-sm font-bold text-gray-900">🏷 이런 점이 좋았대요</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {ranked.map(([tag, count]) => (
          <li
            key={tag}
            className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600"
          >
            {REVIEW_TAG[tag]}
            <span className="font-bold">{count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ReviewTagSummary;
