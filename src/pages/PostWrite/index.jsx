import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import PostForm from "../../features/community/components/PostForm";
import { createPost } from "../../features/community/api/communityApi";
import { toPostErrorMessage } from "../../features/community/utils/postError";
import { useAuthStore } from "../../store/authStore";

/** 글 작성은 로그인 필수라, 비로그인이면 폼 대신 이 화면을 보여줍니다. */
function LoginPrompt() {
  return (
    <div className="mt-4 rounded-card border border-gray-200 bg-white px-5 py-24 text-center">
      <p className="text-sm font-bold text-gray-900">로그인이 필요해요</p>
      <p className="mt-1.5 text-sm text-gray-400">
        로그인하고 나만의 경험을 나눠보세요.
      </p>
      <Link
        to="/login"
        className="mt-5 inline-flex h-10 items-center rounded-full bg-brand-500 px-5 text-sm font-bold text-white transition-all hover:brightness-95"
      >
        로그인하기
      </Link>
    </div>
  );
}

function PostWritePage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  /** 성공하면 응답으로 받은 postId의 상세로 이동합니다. (명세 §4) */
  const handleCreate = async (body) => {
    try {
      const { ok, result } = await createPost(body, accessToken);

      if (!ok || !result.success) {
        return { ok: false, message: toPostErrorMessage(result.error?.code) };
      }

      navigate(`/community/${result.data.postId}`);
      return { ok: true };
    } catch {
      return { ok: false, message: toPostErrorMessage("NETWORK_ERROR") };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/community"
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <span aria-hidden="true">‹</span> 목록으로 돌아가기
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">글 작성</h1>

        {accessToken ? (
          <PostForm
            submitLabel="등록"
            onSubmit={handleCreate}
            onCancel={() => navigate("/community")}
          />
        ) : (
          <LoginPrompt />
        )}
      </div>
    </div>
  );
}

export default PostWritePage;
