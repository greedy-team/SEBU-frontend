import { mockPosts } from "./mockPosts";
import { toApiDateTime } from "./mockTime";

/**
 * 댓글 mock 데이터.
 *
 * 개수는 mockPosts의 commentCount에서 그대로 가져옵니다.
 * 숫자를 두 곳에 적어두면 목록의 "💬 62"와 상세의 "댓글 62개"가 어긋나기 때문에,
 * commentCount를 유일한 출처로 두고 댓글을 그 수만큼 만들어 둡니다.
 */

/** MSW 로그인 사용자. 이 사람의 댓글에만 mine=true가 붙습니다. */
export const MOCK_USER = { id: 17, nickname: "세부러" };

const AUTHORS = [
  { id: 45, nickname: "연구꿈나무" },
  { id: 21, nickname: "현실적" },
  { id: 12, nickname: "언어의신" },
  { id: 70, nickname: "전자과25" },
  { id: 51, nickname: null }, // 닉네임 미설정 → 응답에서 "익명"
  { id: 58, nickname: "진로고민" },
];

const CONTENTS = [
  "좋은 정보 감사합니다.",
  "저도 같은 고민이었는데 많이 도움이 됐어요.",
  "혹시 컨택 메일은 언제쯤 보내는 게 좋을까요?",
  "글 정리 깔끔하네요. 저장해둘게요!",
  "저희 연구실도 비슷한 분위기예요.",
  "학점보다 관심 분야를 잘 설명하는 게 중요하더라고요.",
  "면담 때 이 부분 여쭤보면 좋을 것 같아요.",
  "경험 공유해주셔서 감사합니다.",
  "저는 방학 때 먼저 참여해보고 결정했어요.",
  "교수님마다 스타일이 많이 다른 것 같아요.",
];

/** 내가 쓴 댓글이 섞여 있는 게시글 (mine 동작 확인용) */
const MY_COMMENT_POST_IDS = [101, 104];

/** 게시글 작성 시각과 지금 사이에 댓글 시각을 고르게 배치합니다. */
const spreadAfter = (postCreatedAt, count) => {
  const start = new Date(postCreatedAt).getTime();
  const span = Date.now() - start;

  return Array.from({ length: count }, (_, index) =>
    toApiDateTime(new Date(start + (span * (index + 1)) / (count + 1))),
  );
};

let nextCommentId = 3001;

export const mockComments = mockPosts.flatMap((post) =>
  spreadAfter(post.createdAt, post.commentCount).map((createdAt, index) => ({
    id: nextCommentId++,
    postId: post.id,
    author:
      MY_COMMENT_POST_IDS.includes(post.id) && index === 1
        ? MOCK_USER
        : AUTHORS[index % AUTHORS.length],
    content: CONTENTS[index % CONTENTS.length],
    createdAt,
    updatedAt: createdAt,
  })),
);
