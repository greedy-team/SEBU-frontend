/**
 * 랩실 후기 오류 코드 → 사용자에게 보여줄 문구. (명세 §1 오류 코드 표)
 *
 * 게시글(postError.js)과 겹치는 코드가 있지만 문구가 달라야 해서 분리했습니다.
 * 예를 들어 409는 후기에만 있는 "중복 작성"입니다.
 */
export const toLabReviewErrorMessage = (code) => {
  switch (code) {
    case "LABORATORY_REVIEW_ALREADY_EXISTS":
      return "이미 이 연구실에 후기를 남겼어요.";
    case "LABORATORY_NOT_FOUND":
      return "연구실을 찾을 수 없어요.";
    case "VALIDATION_ERROR":
      return "입력한 내용을 다시 확인해주세요.";
    case "CONTENT_POLICY_VIOLATION":
      return "정책에 어긋나는 표현이 있어요.";
    case "ACCESS_TOKEN_INVALID":
    case "ACCESS_TOKEN_EXPIRED":
      return "로그인이 필요해요.";
    case "NETWORK_ERROR":
      return "서버와 연결할 수 없어요.";
    default:
      return "잠시 후 다시 시도해주세요.";
  }
};
