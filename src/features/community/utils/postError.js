/**
 * 게시글 오류 코드 → 사용자에게 보여줄 문구. (명세 §1 오류 코드 표)
 *
 * 명세가 error.message가 아니라 error.code로 분기하라고 정하고 있어서
 * 문구를 한 곳에 모아둡니다. 작성·수정 화면과 상세의 삭제가 같이 씁니다.
 */
export const toPostErrorMessage = (code) => {
  switch (code) {
    case "VALIDATION_ERROR":
      return "입력한 내용을 다시 확인해주세요.";
    case "CONTENT_POLICY_VIOLATION":
      return "정책에 어긋나는 표현이 있어요.";
    case "ACCESS_TOKEN_INVALID":
    case "ACCESS_TOKEN_EXPIRED":
      return "로그인이 필요해요.";
    case "POST_FORBIDDEN":
      return "본인이 작성한 글만 수정하거나 삭제할 수 있어요.";
    case "POST_NOT_FOUND":
      return "이미 삭제되었거나 없는 글이에요.";
    case "NETWORK_ERROR":
      return "서버와 연결할 수 없어요.";
    default:
      return "잠시 후 다시 시도해주세요.";
  }
};
