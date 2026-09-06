import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import LabReviewForm from "../../features/community/components/LabReviewForm";
import { useLabReviews } from "../../features/community/hooks/useLabReviews";
import { createLabReview } from "../../features/community/api/communityApi";
import { toLabReviewErrorMessage } from "../../features/community/utils/reviewError";
import { useAuthStore } from "../../store/authStore";

function Notice({ heading, description, action }) {
  return (
    <div className="mt-4 rounded-card border border-gray-200 bg-white px-5 py-24 text-center">
      <p className="text-sm font-bold text-gray-900">{heading}</p>
      <p className="mt-1.5 text-sm text-gray-400">{description}</p>
      {action}
    </div>
  );
}

function LabReviewWritePage() {
  const { laboratoryId } = useParams();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 연구실 이름과 reviewedByMe가 필요해서 후기 목록 훅을 그대로 씁니다.
  const { laboratory, reviewedByMe, isLoading, errorCode } = useLabReviews(
    laboratoryId,
    accessToken,
  );

  const listPath = `/community/labs/${laboratoryId}`;

  /** 성공하면 후기 목록으로 돌아갑니다. 목록은 그때 다시 조회돼요. (명세 §6.6) */
  const handleCreate = async (body) => {
    try {
      const { ok, result } = await createLabReview(
        laboratoryId,
        body,
        accessToken,
      );

      if (!ok || !result.success) {
        return {
          ok: false,
          message: toLabReviewErrorMessage(result.error?.code),
        };
      }

      navigate(listPath);
      return { ok: true };
    } catch {
      return {
        ok: false,
        message: toLabReviewErrorMessage("NETWORK_ERROR"),
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to={listPath}
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <span aria-hidden="true">‹</span> 후기 목록으로 돌아가기
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">후기 작성</h1>
        {laboratory && (
          <p className="mt-1.5 text-sm text-gray-500">{laboratory.name}</p>
        )}

        {!accessToken && (
          <Notice
            heading="로그인이 필요해요"
            description="로그인하고 연구실 경험을 나눠보세요."
            action={
              <Link
                to="/login"
                className="mt-5 inline-flex h-10 items-center rounded-full bg-brand-500 px-5 text-sm font-bold text-white transition-all hover:brightness-95"
              >
                로그인하기
              </Link>
            }
          />
        )}

        {accessToken && isLoading && (
          <p className="py-24 text-center text-sm text-gray-400">
            불러오는 중이에요…
          </p>
        )}

        {accessToken && !isLoading && errorCode && (
          <Notice
            heading="연구실을 찾을 수 없어요"
            description="삭제되었거나 주소가 잘못되었어요."
          />
        )}

        {/* 서버도 409로 막지만, 화면에서 먼저 알려줍니다. (명세 §6.7) */}
        {accessToken && !isLoading && !errorCode && reviewedByMe && (
          <Notice
            heading="이미 후기를 남겼어요"
            description="한 연구실에는 후기를 하나만 작성할 수 있어요."
          />
        )}

        {accessToken && !isLoading && !errorCode && !reviewedByMe && (
          <LabReviewForm
            onSubmit={handleCreate}
            onCancel={() => navigate(listPath)}
          />
        )}
      </div>
    </div>
  );
}

export default LabReviewWritePage;
