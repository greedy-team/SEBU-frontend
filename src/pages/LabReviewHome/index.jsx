import Header from "../../components/layout/Header";
import LabReviewList from "../../features/community/components/LabReviewList";
import { useLabList } from "../../features/community/hooks/useLabList";

/**
 * 랩실 평가 홈 — 후기가 많은 순으로 연구실을 보여줍니다.
 *
 * 원래 커뮤니티 홈의 탭 하나였는데, 게시글과 성격이 달라
 * (검색·정렬·인기글이 모두 게시글 기준) 상단 내비게이션으로 분리했습니다.
 */
function LabReviewHomePage() {
  const { labs, totalElements, isLoading, error } = useLabList();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">랩실 평가</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          연구실별 학부연구생 후기를 확인해보세요.
        </p>

        <div className="mt-6">
          <LabReviewList
            labs={labs}
            totalElements={totalElements}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default LabReviewHomePage;
