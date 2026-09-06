import { Link, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import ReviewCard from "../../features/community/components/ReviewCard";
import ReviewTagSummary from "../../features/community/components/ReviewTagSummary";
import { useLabReviews } from "../../features/community/hooks/useLabReviews";
import { useAuthStore } from "../../store/authStore";

function LabReviewPage() {
  const { laboratoryId } = useParams();
  const accessToken = useAuthStore((state) => state.accessToken);

  const {
    laboratory,
    reviews,
    reviewedByMe,
    totalElements,
    hasNext,
    isLoading,
    errorCode,
    loadMore,
  } = useLabReviews(laboratoryId, accessToken);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/community"
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <span aria-hidden="true">‹</span> 랩실 평가로 돌아가기
        </Link>

        {isLoading && (
          <p className="py-24 text-center text-sm text-gray-400">
            불러오는 중이에요…
          </p>
        )}

        {!isLoading && errorCode === "LABORATORY_NOT_FOUND" && (
          <div className="mt-4 rounded-card border border-gray-200 bg-white px-5 py-24 text-center">
            <p className="text-sm font-bold text-gray-900">
              연구실을 찾을 수 없어요
            </p>
            <p className="mt-1.5 text-sm text-gray-400">
              삭제되었거나 주소가 잘못되었어요.
            </p>
          </div>
        )}

        {!isLoading && errorCode && errorCode !== "LABORATORY_NOT_FOUND" && (
          <p className="py-24 text-center text-sm text-gray-500">
            후기를 불러오지 못했어요.
          </p>
        )}

        {!isLoading && laboratory && (
          <>
            {/* 연구실 정보 */}
            <section className="mt-4 rounded-card border border-gray-200 bg-white p-6">
              <h1 className="text-xl font-bold text-gray-900">
                {laboratory.name}
              </h1>
              <p className="mt-1.5 text-sm text-gray-500">
                {laboratory.professor.name} 교수 · {laboratory.department.name}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                {laboratory.college.name}
              </p>
            </section>

            <ReviewTagSummary reviews={reviews} />

            {/* 후기 목록 */}
            <section className="mt-4 rounded-card border border-gray-200 bg-white">
              <div className="flex items-center border-b border-gray-100 px-5 py-4">
                <h2 className="text-sm font-bold text-gray-900">
                  후기
                  <span className="ml-1.5 font-medium text-gray-400">
                    {totalElements}개
                  </span>
                </h2>
                <span className="ml-auto text-xs text-gray-300">최신순</span>
              </div>

              {reviews.length === 0 ? (
                <p className="px-5 py-16 text-center text-sm text-gray-400">
                  아직 후기가 없어요. 첫 후기를 남겨보세요!
                </p>
              ) : (
                <>
                  <ul className="divide-y divide-gray-100">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </ul>

                  {hasNext && (
                    <button
                      type="button"
                      onClick={loadMore}
                      className="w-full border-t border-gray-100 py-4 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
                    >
                      후기 더 보기
                    </button>
                  )}
                </>
              )}
            </section>

            {/* 후기 작성 — 화면은 후속 이슈에서 만듭니다 */}
            <div className="mt-4 text-center">
              {reviewedByMe ? (
                <p className="text-sm text-gray-400">
                  이미 이 연구실에 후기를 남겼어요.
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    disabled
                    className="h-11 rounded-full bg-gray-200 px-6 text-sm font-bold text-gray-400"
                  >
                    후기 작성
                  </button>
                  <p className="mt-2 text-xs text-gray-400">
                    후기 작성 화면은 준비 중이에요.
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LabReviewPage;
