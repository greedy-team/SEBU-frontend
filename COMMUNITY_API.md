# SEBU 커뮤니티 API 명세 (프론트 작업용 정리본)

커뮤니티 화면을 만들 때 참고하는 문서예요. 원본은 노션에 있고, 이 문서는
**프론트가 실제로 필요한 것만** 추려서 한 곳에 모아둔 사본입니다.

| 무엇                         | 어디                                      |
| ---------------------------- | ----------------------------------------- |
| 원본 명세 (진실의 원천)      | 노션 `Community` DB                       |
| 프론트 작업용 요약 (이 문서) | `COMMUNITY_API.md`                        |
| 디자인 토큰·UX 규칙          | `DESIGN_SYSTEM.md`                        |
| MSW mock 구현                | `src/mocks/handlers/communityHandlers.js` |

> 원본이 바뀌면 이 문서도 같이 고쳐주세요. 한쪽만 고치면 금방 어긋납니다.

**정리일**: 2026-08-30
**명세 우선순위**: 백엔드 구현 요청서 > 분할 API 명세 > 원본 명세 > Figma 문구
**랩실 평가는 v2가 v1을 폐기함** (§6 참조)

---

## 1. 공통 계약

### 응답 형식 (`ApiResponse<T>`)

성공:

```json
{ "success": true, "data": {}, "error": null }
```

실패:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "POST_NOT_FOUND",
    "message": "게시글을 찾을 수 없습니다.",
    "fieldErrors": [],
    "traceId": null
  }
}
```

### 규칙

- ID: JSON `number` (Long)
- 시간: **offset 없는 ISO-8601** — `"2026-08-21T14:30:00"` (Z 없음!)
- JSON 필드: `camelCase`
- Enum: 영문 대문자 문자열
- 페이지 번호: `page=0` 부터 시작
- 빈 조회 결과: `200 OK` + 빈 배열
- 인증: 기존 JWT. 작성자 ID는 FE가 보내지 않음
- 공개 GET: 토큰 있으면 내 좋아요·북마크 상태 계산, 없으면 `false`
- 공개 작성자명: `nickname`이 NULL이면 `"익명"`, 설정돼 있으면 그 값
- 비공개 마이페이지: `nickname: null` 그대로 반환 (미설정 구분용)
- `mine`: 인증 사용자가 작성자면 `true`, 비로그인/타인이면 `false`
- FE 오류 분기는 `error.message`가 아니라 **`error.code`** 사용

### 페이지 응답 필드

```json
{ "page": 0, "size": 20, "totalElements": 42, "hasNext": true }
```

### 게시글 카테고리

| API 값     | FE 표시     |
| ---------- | ----------- |
| `FREE`     | 자유 게시판 |
| `QUESTION` | Q&A 게시판  |

- `ALL`, `POPULAR`, `LAB_REVIEW`는 **DB에 저장하지 않음**
- `전체글` = 카테고리 조건 생략
- `인기글` = 정렬 결과 (`sort=POPULAR`)
- `랩실 평가` = 별도 도메인 (`laboratory_review`)

### 오류 코드 표

| HTTP | code                               | 상황                           | FE 처리           |
| ---- | ---------------------------------- | ------------------------------ | ----------------- |
| 400  | `INVALID_QUERY_PARAMETER`          | 잘못된 검색·필터·페이지 값     | 조건 확인         |
| 400  | `VALIDATION_ERROR`                 | 입력 규칙 위반                 | 입력값 안내       |
| 401  | `ACCESS_TOKEN_INVALID`             | 토큰 없음/무효                 | 로그인 안내       |
| 401  | `ACCESS_TOKEN_EXPIRED`             | 토큰 만료                      | 갱신 후 재요청    |
| 403  | `POST_FORBIDDEN`                   | 타인 게시글 수정·삭제          | 권한 없음         |
| 403  | `COMMENT_FORBIDDEN`                | 타인 댓글 수정·삭제            | 권한 없음         |
| 404  | `POST_NOT_FOUND`                   | 게시글 없음·삭제됨             | 없음 표시         |
| 404  | `COMMENT_NOT_FOUND`                | 댓글 없음·삭제됨·게시글 불일치 | 댓글 제거 후 안내 |
| 404  | `USER_NOT_FOUND`                   | 사용자 없음·탈퇴               | 없음 표시         |
| 404  | `LABORATORY_NOT_FOUND`             | 랩실 없음·삭제됨               | 없음 표시         |
| 409  | `PROFILE_INCOMPLETE`               | 필수 프로필 미완료             | 프로필 설정 이동  |
| 409  | `NICKNAME_ALREADY_EXISTS`          | 정규화 닉네임 중복             | 중복 안내         |
| 409  | `PROFILE_UPDATE_CONFLICT`          | 동시 프로필 변경               | 재조회 후 재시도  |
| 409  | `LABORATORY_REVIEW_ALREADY_EXISTS` | 동일 랩실 중복 후기            | 이미 작성함 안내  |
| 422  | `CONTENT_POLICY_VIOLATION`         | 욕설·비방                      | 정책 위반 안내    |
| 500  | `INTERNAL_SERVER_ERROR`            | 서버 오류                      | 공통 오류 안내    |

삭제된 자원의 상세·수정·삭제, 두 번째 DELETE → 모두 `404 *_NOT_FOUND`

---

## 2. HOME — 게시글 목록

```
GET /api/v1/posts?keyword=인건비&category=QUESTION&sort=LATEST&page=0&size=6
```

| Query      | 필수 | 규칙                                     |
| ---------- | ---- | ---------------------------------------- |
| `keyword`  | X    | **제목 포함 검색**, 공백 제거 후 1~100자 |
| `category` | X    | `FREE` / `QUESTION`, 생략 시 전체글      |
| `sort`     | X    | `LATEST` / `POPULAR`, 기본 `LATEST`      |
| `page`     | X    | 기본 `0`                                 |
| `size`     | X    | 기본 `20`, 1~50                          |

응답 `data`:

```json
{
  "posts": [
    {
      "id": 103,
      "category": "QUESTION",
      "title": "학부연구생 인건비 평균이 궁금합니다.",
      "author": { "id": 21, "nickname": "현실적" },
      "badges": ["HOT", "NEW"],
      "likeCount": 112,
      "commentCount": 95,
      "viewCount": 4102,
      "createdAt": "2026-08-21T13:30:00"
    }
  ],
  "page": 0,
  "size": 6,
  "totalElements": 23,
  "hasNext": true
}
```

**주의: 목록 응답에 `content`(본문 미리보기)가 없다.** 카드에 본문 미리보기를 넣으려면 BE에 요청 필요.

FE 연결:

- `posts[].id` → POST 상세 이동
- `posts[].author.id` → PROFILE 이동
- `badges` → `HOT`, `NEW` 표시
- `totalElements` → 전체 게시글 수 표시
- `hasNext` → 더 보기 노출

BE 처리 기준:

- keyword + category 동시 적용
- `LATEST`: `createdAt DESC, id DESC`
- `POPULAR`: **북마크 수 DESC**, 동률이면 `createdAt DESC, id DESC`
- `HOT` = 현재 인기 TOP 4 / `NEW` = 생성 후 24시간 이내. 저장하지 않고 BE가 계산
- 결과 없으면 `posts: []`, `totalElements: 0`, `hasNext: false`

### 인기 TOP 4 규칙

- 요청: `GET /api/v1/posts?sort=POPULAR&page=0&size=4` (**별도 요청**)
- 모든 탭(전체글/자유/Q&A/랩실평가)에서 계속 노출, 탭 전환 중 유지
- 대상은 `FREE`·`QUESTION` 일반 게시글만 (랩실 후기 제외)
- 각 카테고리 목록 응답에 TOP 4를 중복 포함하지 않음
- 북마크 등록·해제, 게시글 수정·삭제, 새로고침 후 TOP 4 재요청
- v1 인기 기준은 **북마크 수만** (조회수 가중치 없음)

### HOME 랩실 평가 탭

```
GET /api/v1/laboratories?sort=REVIEW_COUNT_DESC&page=0&size=20
```

### HOME 진입 시

최신글 + 인기글을 **병렬 요청**한다.

---

## 3. POST — 상세 / 댓글 / 반응

### 3.1 상세 조회

```
GET /api/v1/posts/103
```

```json
{
  "post": {
    "id": 103,
    "category": "QUESTION",
    "title": "학부연구생 인건비 평균이 궁금합니다.",
    "content": "게시글 본문입니다.",
    "author": { "id": 21, "nickname": "현실적" },
    "badges": ["HOT"],
    "viewCount": 4103,
    "likeCount": 112,
    "commentCount": 95,
    "liked": false,
    "bookmarked": true,
    "mine": false,
    "createdAt": "2026-08-21T13:30:00",
    "updatedAt": "2026-08-21T13:30:00"
  }
}
```

- `liked`, `bookmarked` → 버튼 상태 그대로 반영
- `mine=true`일 때만 수정·삭제 버튼 표시
- **조회수는 BE가 상세 조회에서 증가**시키고 증가된 값 반환. FE는 별도 요청 안 보냄

### 3.2 댓글 목록

```
GET /api/v1/posts/103/comments?page=0&size=20
```

```json
{
  "comments": [
    {
      "id": 301,
      "author": { "id": 45, "nickname": "연구꿈나무" },
      "content": "좋은 정보 감사합니다.",
      "mine": false,
      "createdAt": "2026-08-21T14:10:00",
      "updatedAt": "2026-08-21T14:10:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 95,
  "hasNext": true
}
```

**v1은 대댓글 미지원.**

### 3.3 댓글 등록 — `201 Created`

```
POST /api/v1/posts/103/comments
{ "content": "좋은 정보 감사합니다." }
```

- `content`: 공백 제거 후 **1~500자**

```json
{
  "comment": {
    "id": 302,
    "author": { "id": 7, "nickname": "세부러" },
    "content": "좋은 정보 감사합니다.",
    "mine": true,
    "createdAt": "2026-08-21T14:20:00",
    "updatedAt": "2026-08-21T14:20:00"
  },
  "commentCount": 96
}
```

### 3.4 댓글 수정 / 삭제

```
PATCH  /api/v1/posts/103/comments/302   { "content": "수정된 댓글 내용입니다." }
→ { "commentId": 302, "content": "...", "updatedAt": "2026-08-22T15:10:00" }

DELETE /api/v1/posts/103/comments/302
→ { "postId": 103, "commentId": 302, "commentCount": 95 }
```

- `content` 규칙은 작성과 동일 (1~500자, 정책 검사)
- `mine=true`인 댓글에만 수정·삭제 버튼 표시

### 3.5 좋아요 · 북마크 (요청 본문 없음, 멱등)

```
PUT    /api/v1/posts/103/likes        → { "liked": true, "likeCount": 113 }
DELETE /api/v1/posts/103/likes

PUT    /api/v1/posts/103/bookmarks    → { "bookmarked": true }
DELETE /api/v1/posts/103/bookmarks
```

좋아요와 북마크는 **별도 기능·별도 테이블**. 북마크가 인기순 기준.

### 3.6 게시글 수정 / 삭제

```
PUT /api/v1/posts/103
{ "category": "QUESTION", "title": "...", "content": "..." }
→ { "postId": 103, "updatedAt": "2026-08-22T15:00:00" }

DELETE /api/v1/posts/103
→ { "postId": 103 }
```

- 수정은 3개 필드 **전체**를 보냄 (PUT)
- 삭제는 소프트 삭제. FE는 HOME 이동 후 목록 + TOP 4 재조회

---

## 4. WRITE — 글 작성

```
POST /api/v1/posts
{
  "category": "QUESTION",
  "title": "학부연구생 지원 전에 준비할 것이 궁금합니다.",
  "content": "지원 경험이 있는 분들의 조언을 듣고 싶습니다."
}
```

| 필드       | 규칙                            |
| ---------- | ------------------------------- |
| `category` | 필수, `FREE` / `QUESTION`       |
| `title`    | 필수, 공백 제거 후 **1~100자**  |
| `content`  | 필수, 공백 제거 후 **1~2000자** |

`authorId`·작성 시각·조회수·좋아요 수·댓글 수는 FE가 보내지 않음.

응답 `201 Created`:

```json
{ "postId": 501 }
```

→ 반환된 `postId`의 상세 화면으로 이동

---

## 5. PROFILE

### 5.1 닉네임 정책 (핵심)

- `app_user.name` = 세종 학사정보 **실명** → 마이페이지 본인 응답에서만 사용, 공개 커뮤니티에 노출 금지
- 닉네임 미설정 = DB `NULL` → **공개 응답에서만** `"익명"` 으로 변환
- 여러 사용자가 `익명`으로 보일 수 있음 (저장값이 아니라 fallback)
- 설정한 닉네임은 **정규화 결과 기준 전역 유일**
- `익명`은 시스템 예약어 → 닉네임으로 설정 불가
- 랩실 후기는 닉네임 설정 여부와 무관하게 **항상 익명**
- 정규화: Unicode NFKC + 앞뒤 공백 제거, 대소문자 구분 없음 (`Researcher` == `researcher`)
- 제어문자·zero-width 문자 불가

### 5.2 내 프로필 조회

```
GET /api/v1/users/me/mypage
```

```json
{
  "profile": {
    "name": "홍길동",
    "nickname": null,
    "grade": 3,
    "department": { "id": "7", "name": "컴퓨터공학과" },
    "gpaBand": "GTE_3_5",
    "introduction": "컴퓨터비전에 관심이 있습니다.",
    "profileCompleted": true,
    "profileUpdatedAt": "2026-08-28T14:30:00"
  }
}
```

응답 헤더 `Cache-Control: private, no-store`

### 5.3 닉네임 설정·변경

```
PUT /api/v1/users/me/profile
{
  "nickname": "연구꿈나무",
  "grade": 3,
  "gpaBand": "GTE_3_5",
  "introduction": "컴퓨터비전에 관심이 있습니다."
}
```

| 필드           | 필수 | 규칙                                       |
| -------------- | ---- | ------------------------------------------ |
| `nickname`     | O    | `null` 또는 정규화 후 1~30자               |
| `grade`        | O    | 1~4                                        |
| `gpaBand`      | O    | `null` / `GTE_3_0` / `GTE_3_5` / `GTE_4_0` |
| `introduction` | O    | 빈 문자열 허용, 최대 500자                 |

- **전체 수정 방식** — 네 필드 모두 보냄
- 실명·학번·학과는 FE가 보내거나 수정하지 않음
- `PATCH /api/v1/me/profile` 은 학년 온보딩 전용 (닉네임 수정에 쓰지 않음)

응답:

```json
{
  "name": "홍길동",
  "nickname": "연구꿈나무",
  "grade": 3,
  "department": { "id": "7", "name": "컴퓨터공학과" },
  "gpaBand": "GTE_3_5",
  "introduction": "...",
  "profileCompleted": true,
  "profileUpdatedAt": "2026-08-28T14:35:00"
}
```

중복 시 `409`:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NICKNAME_ALREADY_EXISTS",
    "message": "이미 사용 중인 닉네임입니다.",
    "fieldErrors": [
      {
        "field": "nickname",
        "reason": "DUPLICATE",
        "message": "다른 닉네임을 입력해 주세요."
      }
    ],
    "traceId": null
  }
}
```

형식 오류·예약어 `익명` → `400 VALIDATION_ERROR` 의 `fieldErrors`

### 5.4 공개 커뮤니티 프로필

```
GET /api/v1/users/21/community-profile?page=0&size=10
```

```json
{
  "profile": {
    "userId": 21,
    "nickname": "현실적",
    "grade": 4,
    "majorDepartment": {
      "id": 7,
      "name": "컴퓨터공학과",
      "college": { "id": 3, "name": "소프트웨어융합대학" }
    },
    "joinedAt": "2025-03-02T09:00:00",
    "introduction": "컴퓨터비전과 딥러닝을 공부하고 있습니다.",
    "badges": [{ "code": "POPULAR_POST_AUTHOR", "label": "인기글 달성" }]
  },
  "stats": {
    "writtenPostCount": 12,
    "receivedLikeCount": 524,
    "writtenCommentCount": 47
  },
  "posts": {
    "items": [
      {
        "id": 103,
        "category": "QUESTION",
        "title": "학부연구생 인건비 평균이 궁금합니다.",
        "likeCount": 112,
        "commentCount": 95,
        "viewCount": 4102,
        "createdAt": "2026-08-21T13:30:00"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 12,
    "hasNext": true
  }
}
```

- 공개 응답에 실명 `name` 없음
- `receivedLikeCount` = 그 사용자 글들이 받은 좋아요 총합
- 배지는 BE 계산 (작성 글 수 + 받은 북마크 수 기준)

---

## 6. 랩실 평가 — **v2 기준 (v1 폐기)**

### 6.1 v2가 폐기한 것

```
overallRating, paperOpportunity, averageRating, ratingDistribution, RATING_DESC
GET    /api/v1/laboratories/{id}/reviews/me
PUT    /api/v1/laboratories/{id}/reviews/{reviewId}
DELETE /api/v1/laboratories/{id}/reviews/{reviewId}
```

**최종: category O / goodTags O / 별점 X / 논문기회 X / 수정 X / 삭제 X / 정렬 `REVIEW_COUNT_DESC`**

### 6.2 API 목록

| Method | URL                                                          | 인증 |
| ------ | ------------------------------------------------------------ | ---- |
| GET    | `/api/v1/laboratories?sort=REVIEW_COUNT_DESC&page=0&size=20` | 선택 |
| GET    | `/api/v1/laboratories/{laboratoryId}/reviews?page=0&size=20` | 선택 |
| POST   | `/api/v1/laboratories/{laboratoryId}/reviews`                | 필수 |

### 6.3 Enum

**후기 카테고리** (필수, 1개만)

| API 값                 | FE 표시       |
| ---------------------- | ------------- |
| `ACCEPTANCE`           | 합격 후기     |
| `RESEARCH_ENVIRONMENT` | 연구 환경     |
| `PROFESSOR_STYLE`      | 교수님 스타일 |
| `COMPENSATION_WELFARE` | 인건비·복지   |
| `OTHER`                | 기타          |

**참여 학기**

| API 값            | FE 표시  |
| ----------------- | -------- |
| `FIRST_SEMESTER`  | 1학기    |
| `SUMMER_BREAK`    | 여름방학 |
| `SECOND_SEMESTER` | 2학기    |
| `WINTER_BREAK`    | 겨울방학 |

**연구 강도** `researchIntensity`: `LOW` 낮음 / `MEDIUM` 보통 / `HIGH` 높음

**인건비** `compensation`: `NONE` 없음 / `SMALL_AMOUNT` 소액 / `SUFFICIENT` 충분

**연구실 분위기** `atmosphere`: `COMPETITIVE` 경쟁적 / `NORMAL` 보통 / **`COOPERATIVE`** 협력적

> v1·DB명세는 `COLLABORATIVE` 였음 → v2에서 `COOPERATIVE` 로 변경됨. 충돌 항목.

**좋은 점 태그** (복수 선택 가능, 선택 안 해도 됨, 중복 불가) — 10종

| API 값                         | FE 표시             |
| ------------------------------ | ------------------- |
| `RESEARCH_IMMERSION`           | 연구 몰입 환경      |
| `STUDY_RESEARCH_BALANCE`       | 학업·연구 병행 가능 |
| `FREE_ATMOSPHERE`              | 자유로운 분위기     |
| `STRUCTURED_RESEARCH_GUIDANCE` | 체계적인 연구 지도  |
| `PROFESSOR_COMMUNICATION`      | 교수님과 소통 원활  |
| `ACTIVE_FEEDBACK`              | 피드백이 활발함     |
| `PROJECT_OPPORTUNITY`          | 프로젝트 참여 기회  |
| `DIVERSE_RESEARCH_EXPERIENCE`  | 다양한 연구 경험    |
| `INTEREST_FIELD_RESEARCH`      | 관심 분야 연구 가능 |
| `CAREER_CONNECTION`            | 진로·진학·취업 연계 |

### 6.4 HOME 랩실 평가 목록

```
GET /api/v1/laboratories?sort=REVIEW_COUNT_DESC&page=0&size=20
```

```json
{
  "laboratories": [
    {
      "id": 31,
      "name": "Intelligent Media Lab",
      "professor": { "id": 8, "name": "김교수" },
      "department": { "id": 7, "name": "컴퓨터공학과" },
      "reviewCount": 32
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 18,
  "hasNext": false
}
```

정렬 `reviewCount DESC, id DESC`. 후기 없으면 `reviewCount: 0`.
`sort`/`page`/`size` 없는 기존 호출은 **현재 전체 목록 동작 유지** (하위 호환).

### 6.5 특정 랩실 후기 목록

```
GET /api/v1/laboratories/31/reviews?page=0&size=20
```

```json
{
  "laboratory": {
    "id": 31,
    "name": "스마트시티연구실",
    "professor": { "id": 8, "name": "유나연" },
    "college": { "id": 2, "name": "건축도시부동산대학" },
    "department": { "id": 7, "name": "도시공학과" }
  },
  "reviewedByMe": false,
  "reviews": [
    {
      "id": 701,
      "category": "RESEARCH_ENVIRONMENT",
      "participationYear": 2026,
      "participationTerm": "FIRST_SEMESTER",
      "researchIntensity": "HIGH",
      "compensation": "SUFFICIENT",
      "atmosphere": "COOPERATIVE",
      "tags": ["RESEARCH_IMMERSION", "PROJECT_OPPORTUNITY"],
      "content": "프로젝트 참여 기회가 많고 다양한 연구를 경험할 수 있었습니다.",
      "createdAt": "2026-08-20T12:00:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "hasNext": false
}
```

- 최신순 `createdAt DESC, id DESC`
- 작성자 개인정보(`authorId`·이름·닉네임·이메일·학번) 미노출 → FE는 `익명` 표시
- 로그인 사용자가 이미 작성했으면 `reviewedByMe: true`, 비로그인이면 `false`
- **`mine` 필드 없음** (수정·삭제를 제공하지 않으므로)

### 6.6 후기 작성

```
POST /api/v1/laboratories/31/reviews
{
  "category": "RESEARCH_ENVIRONMENT",
  "participationYear": 2026,
  "participationTerm": "FIRST_SEMESTER",
  "researchIntensity": "HIGH",
  "compensation": "SUFFICIENT",
  "atmosphere": "COOPERATIVE",
  "tags": ["RESEARCH_IMMERSION", "STRUCTURED_RESEARCH_GUIDANCE", "PROJECT_OPPORTUNITY"],
  "content": "프로젝트에 직접 참여할 기회가 많았고 ..."
}
```

| 필드                | 필수 | 규칙                                        |
| ------------------- | ---- | ------------------------------------------- |
| `category`          | O    | 허용 Enum                                   |
| `participationYear` | O    | 참여 연도 (2000~현재 연도)                  |
| `participationTerm` | O    | 허용 Enum                                   |
| `researchIntensity` | O    | 허용 Enum                                   |
| `compensation`      | O    | 허용 Enum                                   |
| `atmosphere`        | O    | 허용 Enum                                   |
| `tags`              | X    | 복수, 중복 불가                             |
| `content`           | O    | 공백 제거 후 **최소 20자** (BE 상한 2000자) |

응답 `201 Created`: `{ "reviewId": 702 }` → 후기 목록 재조회

### 6.7 정책

- 사용자당 동일 연구실 후기 **1개** → 중복 시 `409 LABORATORY_REVIEW_ALREADY_EXISTS`
- **등록 후 수정·삭제 불가** → 작성 화면에 안내 문구 필요:
  > 수정 및 삭제가 불가능하므로 신중히 작성해주세요.
- 후기 작성은 로그인 필수, 조회는 비로그인 가능

---

## 7. DB 요약 (FE가 알아야 할 부분만)

신규 테이블: `community_post`, `community_comment`, `community_post_like`,
`community_post_bookmark`, `laboratory_review`, `laboratory_review_tag`

- `community_post`: `title VARCHAR(100)`, `content VARCHAR(2000)`, `category FREE/QUESTION`, `view_count`, 소프트 삭제(`deleted_at`)
- `community_comment`: `content VARCHAR(500)`, 소프트 삭제
- 좋아요·북마크: 복합 PK `(user_id, post_id)`
- 기존 `bookmark` 테이블은 **랩실 북마크 전용** — 게시글 북마크에 재사용 안 함
- `laboratory_review`: UNIQUE `(author_id, laboratory_id)`
- `laboratory_review_tag`: 복합 PK `(review_id, tag)`
- `app_user.nickname` + 신규 `nickname_normalized` (전역 UNIQUE, NULL 다수 허용)
- `likeCount`/`commentCount`/`bookmarkCount`/TOP 4/`HOT`/`NEW`/프로필 통계·배지 → **저장 안 하고 조회 시 계산**

### v1 제외 범위

대댓글 · 신고 · 차단 · 수정 이력 · 삭제 복구 · 조회수 가중 인기 점수 ·
랩실 후기 별점/분포 · 사용자용 후기 수정·삭제 · 전문 검색 엔진

---

## 8. 명세 간 충돌 (BE에 확인 필요)

| #   | 항목                                   | DB 및 적용 명세 / v1                                                                                                                                                                                       | 랩실평가 v2 (최신)               |
| --- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 1   | 후기 카테고리 첫 값                    | `ACCEPTANCE_REVIEW`                                                                                                                                                                                        | **`ACCEPTANCE`**                 |
| 2   | 분위기 '협력적'                        | `COLLABORATIVE`                                                                                                                                                                                            | **`COOPERATIVE`**                |
| 3   | 좋은 점 태그                           | 8종 (`PAPER_AUTHORSHIP_AVAILABLE`, `FRIENDLY_PROFESSOR`, `CONSIDERATE_OF_UNDERGRADUATES`, `FLEXIBLE_ATMOSPHERE`, `STRUCTURED_MENTORING`, `MODERN_EQUIPMENT`, `ACTIVE_COMMUNICATION`, `CAREER_CONNECTIONS`) | **10종 (§6.3)** — 값이 전부 다름 |
| 4   | `laboratory_review.deleted_at`         | 있음 (관리자 비공개용)                                                                                                                                                                                     | **없음** (§13 제외 컬럼)         |
| 5   | 후기 수정·삭제                         | v1에 PUT/DELETE 있음                                                                                                                                                                                       | **제공 안 함**                   |
| 6   | `paper_opportunity` / `overall_rating` | v1에 있음                                                                                                                                                                                                  | **제외**                         |
| 7   | 태그 개수                              | DB 명세 "0~8개"                                                                                                                                                                                            | v2는 10종이므로 상한 재정의 필요 |
| 8   | 랩실 목록 `averageRating`              | v1에 있음                                                                                                                                                                                                  | **제외** (별점 없음)             |

→ v2가 최신이므로 v2 기준으로 가되, **BE가 DB 명세를 v2에 맞춰 갱신했는지 확인 필요.**

---

## 9. FE 작업 시 주의점 (내가 정리)

1. **목록 응답에 본문(`content`)이 없다.** 카드에 미리보기를 넣으려면 BE 요청 필요.
2. **시간에 offset이 없다** (`2026-08-21T13:30:00`). `new Date(...)` 파싱 시 로컬 시각으로 해석됨.
3. **`viewCount` 증가는 상세 조회의 부수효과.** StrictMode 이중 호출 시 조회수가 2번 오를 수 있음 → 실서버 연동 때 확인.
4. **인기 TOP 4는 별도 요청**이고 목록과 중복 표시하지 않음.
5. **좋아요 = 하트, 북마크 = 인기순 기준** — 서로 다른 기능. 헷갈리지 말 것.
6. 북마크 응답에는 `bookmarkCount`가 없고 `bookmarked`만 온다.
7. `keyword`는 **제목만** 검색한다 (본문 검색 아님).
8. 랩실 후기 목록에는 `mine`이 없다 → 수정·삭제 버튼 자체를 만들지 않는다.

---

## 10. 피그마 vs 명세 대조 (2026-08-31, 스크린샷 9장 기준)

> **원칙: 명세가 우선.** 피그마에 있어도 명세에 없으면 만들지 않는다.
> (`DESIGN_SYSTEM.md` §1 "범위는 코드 기준, 스타일은 Figma 기준"과 같은 원칙)

| #   | 항목                    | 피그마                                                                                                                                            | 명세                                               | 결정                                                                                            |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | 카테고리 탭             | 버전A: `전체글 / 자유 게시판 / Q&A 게시판 / 랩실 평가`<br>버전B: `전체글 보기 / 베스트 인기글 / 자유 게시판 / 학부 인턴 게시판 / 합격 후기 / Q&A` | `FREE`, `QUESTION` 2개뿐                           | **버전A 채택** — 전체글·자유·Q&A·랩실평가 4탭. 학부인턴/합격후기/베스트인기글 탭은 만들지 않음  |
| 2   | 랩실 목록 별점          | ★★★★★ 4.5 표시, "평점 높은 순"                                                                                                                    | v2에서 별점 전면 폐기                              | **별점 제거.** `후기 N개`만 표시, 정렬 라벨은 **"후기 많은 순"** (`REVIEW_COUNT_DESC`)          |
| 3   | 랩실 평가 개요 페이지   | 5.00 + 별점 분포 막대 + 연구강도/인건비/논문기회/분위기 비율 막대                                                                                 | `review-summary` API 폐기, `paperOpportunity` 폐기 | **개요 페이지 삭제.** 랩실 클릭 → 후기 목록으로 바로 이동                                       |
| 4   | 랩실 후기 태그          | 개요 하단에 `연구 강도 낮음` `인건비 충분` 칩                                                                                                     | v2에 좋은 점 태그 10종 있음                        | **태그 기반 요약으로 대체** (네이버 리뷰 스타일). 단 **집계 API가 명세에 없음 → BE 요청 필요**  |
| 5   | 댓글 답글쓰기           | "답글 쓰기" 버튼 + 대댓글 들여쓰기                                                                                                                | v1 대댓글 미지원                                   | **답글 기능 제외.** 평면 댓글만                                                                 |
| 6   | 댓글 `작성자` 배지      | 있음                                                                                                                                              | 필드 없음                                          | FE에서 `comment.author.id === post.author.id` 로 계산                                           |
| 7   | 목록 카드 본문 미리보기 | 없음 (제목만)                                                                                                                                     | 목록 응답에 `content` 없음                         | **일치** ✅                                                                                     |
| 8   | 목록 카드 구성          | 카테고리 배지 + HOT/NEW + 제목 + 닉네임 + 👍좋아요 💬댓글 👁조회수 + 날짜                                                                         | 전부 응답에 있음                                   | **일치** ✅                                                                                     |
| 9   | 정렬 토글               | `최신순 \| 인기순`                                                                                                                                | `sort=LATEST/POPULAR`                              | **일치** ✅                                                                                     |
| 10  | 인기글 TOP 4 카드       | 순위 숫자 + 제목 + 👁조회수 · 💬댓글수                                                                                                            | 응답에 있음                                        | **일치** ✅ (좋아요 수는 표시 안 함)                                                            |
| 11  | 글쓰기 게시판 선택      | 자유/학부인턴/합격후기/Q&A 4개                                                                                                                    | 2개                                                | **자유 게시판 / Q&A 게시판 2개만**                                                              |
| 12  | 글쓰기 글자수           | 제목 `0/100`, 내용 `0/2000`                                                                                                                       | 동일                                               | **일치** ✅                                                                                     |
| 13  | 랩실 후기 작성 화면     | **피그마에 없음**                                                                                                                                 | POST API는 있음                                    | **새로 설계 필요** (카테고리·참여시기·연구강도·인건비·분위기·태그·본문 + "수정·삭제 불가" 안내) |
| 14  | 프로필 페이지           | 닉네임·단과대·학년·가입일·소개·뱃지·12/524/47·작성한 글                                                                                           | §5.4와 동일                                        | **일치** ✅                                                                                     |
| 15  | Footer                  | 4열 링크 + SNS + 문의                                                                                                                             | —                                                  | 현재 코드에 **없음** → 별도 이슈                                                                |
| 16  | Header 메가메뉴         | 탐색▾ 커뮤니티▾ 튜토리얼▾                                                                                                                         | —                                                  | `DESIGN_SYSTEM.md` §8대로 기능 생길 때. 지금은 제외                                             |
| 17  | 사이드바                | 글쓰기 CTA 카드 + 인기글 TOP 4 카드                                                                                                               | —                                                  | **채택** (스타일은 피그마대로)                                                                  |

### 화면 구성 확정 (커뮤니티 HOME)

```
커뮤니티 홈
├─ 제목 "커뮤니티 홈"
├─ 검색바 (풀폭, 우측 파란 원형 돋보기 버튼)
├─ 카테고리 탭 (pill 4개): 전체글 / 자유 게시판 / Q&A 게시판 / 랩실 평가
└─ 2열 레이아웃
   ├─ 좌 (main)
   │   ├─ 리스트 헤더: "전체 게시글 N개"  ·······  최신순 | 인기순
   │   ├─ 게시글 행 × N
   │   │   ├─ 1행: [카테고리 배지] [🔥HOT / NEW]
   │   │   ├─ 2행: 제목 (bold)
   │   │   └─ 3행: 닉네임 ······· 👍147 💬62 👁3,821 2026.08.01
   │   └─ "게시글 더 보기"
   └─ 우 (사이드바, sticky)
       ├─ 글쓰기 카드: ✏️ 아이콘 / "나만의 꿀팁이 있나요?" / "로그인하고 직접 참여해보세요!" / [✍️ 글쓰기]
       └─ 인기글 TOP 4 카드: "🔥 인기글 TOP 4" + 1~4 순위 + 제목 + 👁조회수 · 💬댓글수
```

랩실 평가 탭을 누르면 같은 좌측 영역이 랩실 목록으로 바뀜:

```
랩실 평가  6개 연구실  ·······  후기 많은 순
├─ 랩실명 (bold)
├─ 교수명 · 학과
└─ 후기 N개                                        >
```

### BE에 요청해야 할 것

1. **랩실 후기 태그 집계** — 후기 목록 응답만으로는 현재 페이지의 태그밖에 못 셈.
   랩실별 태그 상위 N개 + 개수를 내려주는 필드/엔드포인트 필요.
   (네이버 리뷰처럼 "체계적인 연구 지도 12" 형태로 표시하려면 필수)
2. (선택) 목록 응답에 본문 미리보기 — 현재 피그마는 제목만 쓰므로 **불필요**

### 참고

- 피그마 원본: https://www.figma.com/design/lr3krGwjGfSPBHb6qzB0Yn/세부_기능명세서

---

## 11. 지금은 이렇게 하고, 나중에 요청할 것

### 이번 구현 범위에서 하기로 한 것

랩실 후기의 좋은 점 태그 요약(네이버 리뷰 스타일)은 **후기 목록 응답에 들어있는
태그만 세어서** 화면에 표시합니다.

```js
// 현재 페이지에 실린 후기들의 태그만 집계
const tagSummary = reviews
  .flatMap((r) => r.tags)
  .reduce((acc, tag) => ({ ...acc, [tag]: (acc[tag] ?? 0) + 1 }), {});
```

### 왜 임시인가

`GET /api/v1/laboratories/{id}/reviews` 는 페이지 단위로 후기를 주기 때문에,
**현재 페이지에 실린 후기의 태그만** 셀 수 있어요. 후기가 50개인데 한 페이지에
20개만 오면 나머지 30개의 태그는 집계에서 빠집니다. 후기가 쌓일수록 실제
비율과 어긋나요.

### 나중에 백엔드에 요청할 것

후기 목록 응답에 **전체 후기 기준 태그 집계**를 추가해달라고 요청합니다.

```json
{
  "laboratory": { "...": "..." },
  "reviewedByMe": false,
  "tagSummary": [
    { "tag": "STRUCTURED_RESEARCH_GUIDANCE", "count": 12 },
    { "tag": "PROJECT_OPPORTUNITY", "count": 9 }
  ],
  "reviews": [],
  "page": 0,
  "size": 20,
  "totalElements": 50,
  "hasNext": true
}
```

- 정렬은 `count DESC`
- `count`가 0인 태그는 내려주지 않아도 됩니다
- 이 필드가 생기면 프론트의 클라이언트 집계 코드를 지우고 그대로 표시만 합니다

요청 시점은 **커뮤니티 랩실 평가 화면 작업을 시작할 때**가 적당해요. 백엔드가
아직 커뮤니티를 구현하는 중이라면 같이 넣기 쉽습니다.

---

## 12. 팀 논의가 필요한 안건

### 12.1 인기글 기준이 북마크 수인 것

**현재 명세**

```
POPULAR: 북마크 수 DESC, 동률이면 createdAt DESC, id DESC
v1 인기 기준은 북마크 수만 사용한다. 조회수 가중치는 후속 범위다.   — HOME 명세
게시글 인기 v1 기준은 북마크 수이며 조회수 가중치는 구현하지 않는다.  — 백엔드 구현 요청서 §6
```

게시판 종류와 무관하게 커뮤니티 게시글 전체가 하나의 인기 순위를 이룹니다.

**무엇이 걸리는가**

목록 카드와 인기글 TOP 4 카드 어디에도 **북마크 수가 표시되지 않습니다.**
화면에는 좋아요·댓글·조회수만 보여요. 그래서 사용자 입장에서는 정렬 근거가
화면에 없는 상태가 됩니다.

mock 데이터로 확인한 실제 사례:

| id | 북마크 | 좋아요 | 인기 순위 |
|---|---|---|---|
| 103 | 188 | 112 | **4위 (HOT)** |
| 116 | 174 | 156 | 5위 |

좋아요가 44개 더 많은 글이 아래에 있습니다. "인기순"을 눌렀는데 좋아요 순서와
어긋나 보이는 화면이 됩니다.

**선택지**

1. 명세 유지 — 북마크는 "다시 볼 만한 글"이라 정보성 글(합격 후기·인건비 정보)이
   올라옵니다. 커뮤니티 성격에는 오히려 맞을 수 있습니다.
2. 목록 카드에 북마크 수도 노출 — 정렬 근거가 보이게 합니다. 피그마 수정 필요.
3. 인기 기준을 좋아요나 조회수로 변경 — BE 수정 필요.

**현재 진행**: 1번(명세 유지)으로 구현합니다. 화면에서 이상하게 느껴지는지
붙여본 뒤 팀에서 한 번 이야기해 봅니다.
