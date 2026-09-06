import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import PostForm from "../../features/community/components/PostForm";
import { usePostDetail } from "../../features/community/hooks/usePostDetail";
import {
  createPost,
  updatePost,
} from "../../features/community/api/communityApi";
import { toPostErrorMessage } from "../../features/community/utils/postError";
import { useAuthStore } from "../../store/authStore";

/** 작성·수정이 공유하는 화면 껍데기. */
function WriteLayout({ title, children }) {
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

        <h1 className="mt-4 text-2xl font-bold text-gray-900">{title}</h1>
        {children}
      </div>
    </div>
  );
}

function Notice({ heading, description }) {
  return (
    <div className="mt-4 rounded-card border border-gray-200 bg-white px-5 py-24 text-center">
      <p className="text-sm font-bold text-gray-900">{heading}</p>
      <p className="mt-1.5 text-sm text-gray-400">{description}</p>
    </div>
  );
}

/** 작성·수정 모두 로그인 필수라, 비로그인이면 폼 대신 이 화면을 보여줍니다. */
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

function CreateView({ accessToken }) {
  const navigate = useNavigate();

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
    <WriteLayout title="글 작성">
      <PostForm
        submitLabel="등록"
        onSubmit={handleCreate}
        onCancel={() => navigate("/community")}
      />
    </WriteLayout>
  );
}

function EditView({ postId, accessToken }) {
  const navigate = useNavigate();

  // 기존 값을 채우려면 글을 먼저 불러와야 합니다.
  // 상세 조회라 조회수가 1 올라가는 부수효과가 있어요 (명세 §3.1).
  const { post, isLoading, errorCode } = usePostDetail(postId, accessToken);

  /** 수정은 PUT이고 세 필드를 전부 보냅니다. (명세 §3.6) */
  const handleUpdate = async (body) => {
    try {
      const { ok, result } = await updatePost(postId, body, accessToken);

      if (!ok || !result.success) {
        return { ok: false, message: toPostErrorMessage(result.error?.code) };
      }

      navigate(`/community/${postId}`);
      return { ok: true };
    } catch {
      return { ok: false, message: toPostErrorMessage("NETWORK_ERROR") };
    }
  };

  return (
    <WriteLayout title="글 수정">
      {isLoading && (
        <p className="py-24 text-center text-sm text-gray-400">
          불러오는 중이에요…
        </p>
      )}

      {!isLoading && errorCode && (
        <Notice
          heading="글을 불러올 수 없어요"
          description={toPostErrorMessage(errorCode)}
        />
      )}

      {/* 서버도 403으로 막지만, 화면에서 먼저 알려줍니다. */}
      {!isLoading && post && !post.mine && (
        <Notice
          heading="수정할 수 없는 글이에요"
          description="본인이 작성한 글만 수정할 수 있어요."
        />
      )}

      {!isLoading && post?.mine && (
        <PostForm
          initialValues={post}
          submitLabel="수정"
          onSubmit={handleUpdate}
          onCancel={() => navigate(`/community/${postId}`)}
        />
      )}
    </WriteLayout>
  );
}

/**
 * /community/write 는 작성, /community/:postId/edit 는 수정으로 동작합니다.
 * 수정일 때만 글을 불러오면 되니, 훅을 조건부로 부르는 대신 화면을 나눴어요.
 */
function PostWritePage() {
  const { postId } = useParams();
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return (
      <WriteLayout title={postId ? "글 수정" : "글 작성"}>
        <LoginPrompt />
      </WriteLayout>
    );
  }

  return postId ? (
    <EditView postId={postId} accessToken={accessToken} />
  ) : (
    <CreateView accessToken={accessToken} />
  );
}

export default PostWritePage;
