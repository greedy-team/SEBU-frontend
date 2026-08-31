/**
 * 커뮤니티 게시글 mock 데이터.
 *
 * 주의: 여기 있는 필드가 곧 API 응답은 아닙니다.
 *  - `bookmarkCount`는 인기순 정렬 기준이지만 응답에는 포함되지 않습니다.
 *  - `author.nickname`이 null이면 응답에서 "익명"으로 변환합니다.
 *  - `content`는 목록 응답에는 없고 상세 응답에만 들어갑니다.
 * 변환은 communityHandlers.js가 담당합니다. (COMMUNITY_API.md §1, §2 참고)
 */

/** n시간 전 시각을 명세 형식(offset 없는 ISO-8601)으로 만듭니다. */
const hoursAgo = (n) => {
  const d = new Date(Date.now() - n * 60 * 60 * 1000);
  const p = (v) => String(v).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

export const mockPosts = [
  {
    id: 101,
    category: "FREE",
    title: "[합격] 소프트웨어융합대학 AI연구실 학부연구생 후기 (6개월 차)",
    content:
      "지난 학기부터 AI연구실에서 학부연구생으로 지내고 있어요. 컨택부터 면접, 실제로 하는 일까지 정리해봤습니다.\n\n처음엔 논문을 읽는 것조차 버거웠는데, 매주 세미나를 하면서 조금씩 익숙해졌어요. 궁금한 점 있으면 댓글 남겨주세요!",
    author: { id: 7, nickname: "세종이공계" },
    likeCount: 147,
    commentCount: 62,
    viewCount: 3821,
    bookmarkCount: 210,
    createdAt: hoursAgo(3),
  },
  {
    id: 102,
    category: "FREE",
    title: "NLP 연구실 컨택부터 합격까지 전 과정 공유합니다",
    content:
      "메일 초안을 다섯 번 넘게 고쳤어요. 어떤 부분을 신경 썼는지 순서대로 적어봅니다.",
    author: { id: 12, nickname: "언어의신" },
    likeCount: 203,
    commentCount: 87,
    viewCount: 4513,
    bookmarkCount: 265,
    createdAt: hoursAgo(9),
  },
  {
    id: 103,
    category: "QUESTION",
    title: "학부연구생 하면서 받는 인건비 평균이 어느 정도인가요?",
    content:
      "연구실마다 차이가 크다고 들었는데, 실제로 어느 정도 받으시는지 궁금합니다.",
    author: { id: 21, nickname: "현실적" },
    likeCount: 112,
    commentCount: 95,
    viewCount: 4102,
    bookmarkCount: 188,
    createdAt: hoursAgo(20),
  },
  {
    id: 104,
    category: "QUESTION",
    title: "스펙이 별로인데 컨택해도 되나요? GPA 3.2 정도",
    content:
      "학점이 높지 않아서 망설여집니다. 이 정도로도 받아주시는 교수님이 계실까요?",
    author: { id: 33, nickname: "걱정많음" },
    likeCount: 88,
    commentCount: 72,
    viewCount: 3201,
    bookmarkCount: 141,
    createdAt: hoursAgo(30),
  },
  {
    id: 105,
    category: "FREE",
    title: "데이터사이언스랩 1년 후기 — 논문 공동저자가 됐습니다",
    content:
      "1년 동안 무슨 일이 있었는지 담담하게 적어봅니다. 학부생도 논문에 이름을 올릴 수 있어요.",
    author: { id: 45, nickname: "DS연구생" },
    likeCount: 284,
    commentCount: 118,
    viewCount: 5102,
    bookmarkCount: 312,
    createdAt: hoursAgo(38),
  },
  {
    id: 106,
    category: "FREE",
    title: "교수님께 처음 컨택 메일 보낼 때 어떻게 작성하셨나요?",
    content:
      "안녕하세요. 현재 3학년 학생인데, 지금 있는 랩실 연구 분야가 저랑 안 맞는 것 같아서 글을 올립니다.\n\n처음엔 재밌을 것 같아서 들어갔는데, 막상 해보니 다른 분야에 훨씬 더 흥미를 느끼더라고요.",
    author: { id: 51, nickname: null },
    likeCount: 38,
    commentCount: 29,
    viewCount: 1432,
    bookmarkCount: 64,
    createdAt: hoursAgo(46),
  },
  {
    id: 107,
    category: "QUESTION",
    title: "학부 3학년 미국 박사 준비 현실적일까요?",
    content:
      "지금부터 준비하면 늦지 않을지, 무엇부터 시작해야 할지 조언 구합니다.",
    author: { id: 51, nickname: null },
    likeCount: 0,
    commentCount: 5,
    viewCount: 110,
    bookmarkCount: 3,
    createdAt: hoursAgo(52),
  },
  {
    id: 108,
    category: "FREE",
    title: "대학원 진학 vs 취업, 학부연구생 경험이 도움이 되나요?",
    content: "둘 다 고민 중인데 경험자분들 이야기가 듣고 싶어요.",
    author: { id: 58, nickname: "진로고민" },
    likeCount: 67,
    commentCount: 53,
    viewCount: 2341,
    bookmarkCount: 97,
    createdAt: hoursAgo(60),
  },
  {
    id: 109,
    category: "QUESTION",
    title: '면접에서 "왜 이 연구실이냐"는 질문 어떻게 대답하셨나요?',
    content:
      "솔직하게 말해도 되는지, 아니면 준비된 답이 있어야 하는지 궁금합니다.",
    author: { id: 62, nickname: "면접준비" },
    likeCount: 41,
    commentCount: 36,
    viewCount: 1323,
    bookmarkCount: 52,
    createdAt: hoursAgo(74),
  },
  {
    id: 110,
    category: "QUESTION",
    title: "전자정보공학대학 신호처리랩 지원 전 궁금한 점 있어요",
    content:
      "주로 어떤 툴을 쓰는지, 학부생이 따라갈 수 있는 수준인지 알고 싶습니다.",
    author: { id: 70, nickname: "전자과25" },
    likeCount: 91,
    commentCount: 44,
    viewCount: 2109,
    bookmarkCount: 120,
    createdAt: hoursAgo(88),
  },
  {
    id: 111,
    category: "FREE",
    title: "학부연구생 하면서 들으면 좋은 강의 추천해드립니다",
    content: "선형대수와 확률론은 진짜 다시 듣길 잘했다고 생각해요.",
    author: { id: 7, nickname: "세종이공계" },
    likeCount: 88,
    commentCount: 23,
    viewCount: 1204,
    bookmarkCount: 76,
    createdAt: hoursAgo(120),
  },
  {
    id: 112,
    category: "FREE",
    title: "AI연구실 면접 준비 어떻게 했는지 공유합니다",
    content: "예상 질문 20개를 뽑아서 답을 적어봤어요. 목록 공유합니다.",
    author: { id: 7, nickname: "세종이공계" },
    likeCount: 102,
    commentCount: 34,
    viewCount: 2310,
    bookmarkCount: 133,
    createdAt: hoursAgo(150),
  },
  {
    id: 113,
    category: "QUESTION",
    title: "방학 중에만 학부연구생 하는 것도 가능한가요?",
    content: "학기 중엔 시간이 안 될 것 같아서 여쭤봅니다.",
    author: { id: 33, nickname: "걱정많음" },
    likeCount: 25,
    commentCount: 18,
    viewCount: 894,
    bookmarkCount: 31,
    createdAt: hoursAgo(180),
  },
  {
    id: 114,
    category: "FREE",
    title: "연구실 세미나에서 처음 발표했던 날 이야기",
    content:
      "손이 떨려서 슬라이드를 못 넘겼어요. 지금은 웃으면서 말할 수 있네요.",
    author: { id: 45, nickname: "DS연구생" },
    likeCount: 59,
    commentCount: 27,
    viewCount: 1105,
    bookmarkCount: 44,
    createdAt: hoursAgo(210),
  },
  {
    id: 115,
    category: "QUESTION",
    title: "학부연구생 중간에 그만두면 불이익이 있을까요?",
    content: "생각했던 것과 많이 달라서 고민입니다. 조심스럽게 여쭤봐요.",
    author: { id: 62, nickname: "면접준비" },
    likeCount: 47,
    commentCount: 61,
    viewCount: 1876,
    bookmarkCount: 88,
    createdAt: hoursAgo(240),
  },
  {
    id: 116,
    category: "FREE",
    title: "컨택 메일 답장이 안 와도 너무 낙심하지 마세요",
    content:
      "저는 일곱 곳에 보내서 두 곳에서 답을 받았어요. 원래 그런 거더라고요.",
    author: { id: 12, nickname: "언어의신" },
    likeCount: 156,
    commentCount: 40,
    viewCount: 2688,
    bookmarkCount: 174,
    createdAt: hoursAgo(300),
  },
];
