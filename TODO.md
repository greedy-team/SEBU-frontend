# TODO — API 연동

`API_INTEGRATION.md`(대조 근거)와 `TODO_API.md`(할 일 목록)를 한 파일로 합쳤어요.
마지막 업데이트: 2026-08-22

---

## 0. 확정된 결정

명세와 코드가 다르지만 **의도된 것으로 확정**된 항목이에요. 명세와 어긋나 보여도 고치지 않습니다.

| 항목 | 명세 | 우리 결정 | 이유 |
|---|---|---|---|
| 모집 상태 필터 `"OPEN"` | `RECRUITING` / `ALWAYS_OPEN` / `CLOSED` 세 값만 정의 | **`"OPEN"` 유지** (모집중 + 상시모집 묶음) | 지원할 수 있는 연구실을 한 번에 보는 게 사용자 관점에 맞음. 서버로 보내는 값이 아니라 프론트 필터 내부 값이라 명세와 충돌하지 않음 |
| 더보기 (프론트 페이지네이션) | 최초 N개 → 더보기마다 +N → 조건 변경 시 초기화 | **구현하지 않음** | 전체 목록을 한 번에 렌더링 |
| 정렬 초기값 `"RECENT"` | 기본순 / 인기순 / 이름↑ / 이름↓ | **`"RECENT"` 유지** | 화면 표기도 "최신순"으로 그대로 감 |

> `"OPEN"`은 **프론트 전용 값**이라는 점만 기억해 주세요. 나중에 필터 조건을 쿼리 파라미터로
> 서버에 보내는 방식으로 바뀌면, 그때는 `RECRUITING`·`ALWAYS_OPEN` 두 값으로 풀어서 보내야 합니다.

---

## 1. 인기 연구실 연동 — ✅ 완료

### `useLabFilter.js`가 관리하는 것

검색 페이지의 데이터는 전부 이 훅 하나가 들고 있어요.

| 이름 | 정체 | 비고 |
|---|---|---|
| `rawLabs` | `fetchLaboratories()` 응답 원본 배열 | 마운트 시 **1회만** 호출. 필터와 무관한 전체 목록 |
| `searchInput` | 입력창에 타이핑 중인 값 | |
| `searchTerm` | 검색 버튼을 눌러 확정된 값 | |
| `sortType` | 정렬 기준 | 초기값 `"RECENT"` |
| `filters` | `{ colleges: [], recruitmentStatus: null }` | |
| `colleges` | `rawLabs`에서 뽑아낸 단과대 목록 | 파생값. 필터 칩에 사용 |
| `finalFilteredLabs`(= `filteredLabs`) | `rawLabs` → 필터 → 검색 → 정렬 | 파생값 |

### 뭘 고쳤나

| 파일 | 변경 |
|---|---|
| `hooks/useLabFilter.js` | `return`에 `rawLabs` 추가 (기존 `filteredLabs`만 노출되던 걸 원본도 같이 노출) |
| `pages/Search/index.jsx` | `rawLabs`를 꺼내 `<RecommendedLabs labs={rawLabs} />`로 전달 |
| `components/RecommendedLabs.jsx` | `labs` prop을 받게 수정, `mockLabs` import 삭제 |

이제 위젯도 `GET /api/v1/laboratories` 응답을 씁니다. MSW를 켜면 MSW 데이터를,
백엔드가 붙으면 백엔드 데이터를 자동으로 따라가요. `labs`가 아직 비어 있는 동안(API 응답 대기)에는
위젯을 렌더링하지 않고 자동 롤링도 시작하지 않습니다 — 예전엔 목데이터가 항상 채워져 있어서 필요 없던 처리예요.
확인하려면 `.env`의 `VITE_USE_MSW=true`로 두고 개발 서버를 재시작하세요.

### 왜 `filteredLabs`가 아니라 `rawLabs`인가

`filteredLabs`를 내리면 "전자정보공학대학" 필터를 걸었을 때 인기 순위도 그 안에서만 뽑힙니다.
검색어를 쳐도 바뀌고요. 옆의 목록과 사실상 같은 내용을 두 번 보여주는 꼴이라, "전체에서 인기 있는
연구실"이라는 위젯의 의미가 사라져요. 명세도 호출 시점을 "검색 화면 최초 진입" 1회로 못박고, 검색·필터·
정렬·개수·더보기 전부 프론트 처리(API 재호출 안 함)를 요구하고 있어서, "한 번 받아서 저장해두고 전부
거기서 파생시킨다"가 명세의 설계예요.

북마크 기능이 붙으면 더 분명해집니다. 마이페이지 명세에 북마크 저장/삭제 API가 있고
(`PUT/DELETE /api/v1/laboratories/{laboratoryId}/bookmark`), 사용자가 북마크를 누르면
`bookmarkCount`가 바뀌어 인기 순위도 따라 바뀌어야 해요. `rawLabs` 하나를 단일 출처로 두면
그 배열만 갱신하면 목록과 위젯이 같이 반영됩니다. 따로 관리하면 두 화면이 어긋나요.

※ A-3의 결론에 따라 위젯 문구("실시간 인기", "오늘 14:00 기준")는 아직 정리 전입니다.

---

## A. 백엔드에 요청·확인할 것

### A-1. 연구실 ID 타입을 통일해 주세요 ⚠️ 가장 급함

| 명세 | 표기 |
|---|---|
| 전체 연구실 조회 | `"id": 1001` — 숫자 |
| 마이페이지 | *"DB의 `BIGINT` ID는 FE에 문자열로 전달한다"*, 예시 `"id": "42"` — 문자열 |

같은 연구실인데 API마다 타입이 다르면 `1001 === "1001"`이 `false`가 돼서, 검색 목록의 연구실과
내가 북마크한 연구실을 대조할 때 "이 연구실은 내가 북마크했나?"를 판별할 수 없어요. 프론트에서
매번 `String()`/`Number()` 변환할 수는 있지만 한 군데라도 빠뜨리면 조용히 틀린 화면이 나옵니다.

**요청**: 모든 API에서 통일해주세요. **전부 문자열**이 안전합니다 — JS 숫자는 큰 정수를 정확히
표현 못 해서 `BIGINT`가 커지면 값이 깨질 수 있어요.
적용 대상: `laboratory.id`, `college.id`, `department.id`, `professor.id`, `major.id`, `user.id`

### A-2. 응답 봉투(envelope)를 통일해 주세요

```json
// 전체 연구실 조회, 로그인
{ "success": true, "data": { ... }, "error": null }

// 마이페이지
{ "data": { ... } }
{ "error": { "code": "...", "message": "...", "fieldErrors": [], "traceId": "..." } }
```

마이페이지에는 `success`가 없고, 다른 API에는 `fieldErrors`·`traceId`가 없어요. 응답 처리 공통 함수를
하나로 못 만들고, 호출부마다 분기를 따로 써야 합니다.

**요청**: `fieldErrors`·`traceId`가 있는 마이페이지 쪽이 더 완성도가 높으니 거기에 `success`를
더하는 방향을 제안합니다.
```json
{ "success": true,  "data": { ... }, "error": null }
{ "success": false, "data": null,    "error": { "code", "message", "fieldErrors", "traceId" } }
```

### A-3. "실시간 인기 연구실"의 기준을 정해 주세요

명세엔 집계 전용 엔드포인트가 없고 "인기순 = `bookmarkCount` 높은 순"만 정의돼 있는데, 화면(Figma)엔
"🔥 실시간 인기 연구실" + "오늘 14:00 기준"이 붙어 있어요. `bookmarkCount`는 서비스 시작부터 쌓인
누적값이라 순위가 사실상 안 바뀌는데, 위젯은 2.8초마다 롤링하며 "실시간"이라고 말합니다.

| 선택 | 내용 | 비용 |
|---|---|---|
| ① 문구 수정 | "인기 연구실"로 바꾸고 기준시각 표기 제거 | 프론트 문구만 |
| ② 집계 API 추가 | 최근 N시간 조회수 기반 `/laboratories/trending` 신설 | 백엔드 작업 + 조회 로그 적재 |
| ③ 단계적 | 지금은 `bookmarkCount`로 가되 문구는 ①. 나중에 ②로 교체 | 없음 |

**③을 권합니다.** ②는 조회 로그 인프라가 먼저 필요해서 지금 붙이기엔 큽니다. 다만 ①의 문구 정리는
지금 하는 게 맞아요 — 없는 기능을 있는 것처럼 보여주는 상태는 남겨두지 않는 게 좋습니다.

### A-4. 연구실 조회의 인증 규칙을 명확히 해 주세요

명세: *"인증이 필요한 경우 Access Token을 전달한다"* — "필요한 경우"가 언제인지 안 적혀 있는데,
응답엔 사용자별 값인 `bookmarked`가 들어 있어요.

1. 비로그인 상태에서도 조회할 수 있나요?
2. 비로그인이면 `bookmarked`는 항상 `false`로 오나요?
3. 로그인 상태면 헤더를 **반드시** 붙여야 하나요? 안 붙이면 `bookmarked`가 전부 `false`인가요?
4. 토큰이 만료된 채로 호출하면 `401 INVALID_TOKEN`인가요, 비로그인 취급인가요?

4번이 특히 중요해요. `401`이면 프론트가 토큰 재발급 후 재시도해야 하고, 비로그인 취급이면 그냥
넘어가도 되거든요.

### A-5. 나머지 확인 사항

| 항목 | 확인할 것 |
|---|---|
| "기본순" 정의 | 무슨 순서인가요? 배열 순서 그대로면 백엔드가 어떤 기준으로 정렬해 주는지 |
| 더보기 N값 | 명세에 "N개"로만 되어 있어요. 예시는 5개인데 확정 필요 (다만 더보기 자체는 §0에서 미구현 확정) |
| '지원 자격' 필터 | Figma엔 탭이 있는데 응답 데이터에 대응 필드가 없어요. 어떤 필드로 거르나요? |
| "카테고리 필터링" | 명세의 이 표현이 Figma의 '연구 분야'를 말하는 건가요? |
| 마이페이지 미확정 5건 | 전공 선택 방식(기존 `DEPARTMENT` 선택식 vs 자유 입력) · "받은 추천"의 정의 · 인증 방식(Bearer vs 세션 쿠키) · 자기소개 문맥 판정(로컬 vs 외부 서비스) · 회원 탈퇴 시 삭제/익명화. 명세 스스로 *"현재 ERD에는 프로필, 게시글 북마크, 받은 추천 스키마가 없다"* 고 밝히고 있어요 |

---

## B. 프론트에서 고칠 것

### B-1. API 에러를 화면에 드러내기 ⚠️ 급함

```js
// api/labApi.js — 현재
if (!response.ok) {
  throw new Error("연구실 목록을 불러오는데 실패했습니다.");
}

// hooks/useLabFilter.js — 현재
fetchLaboratories().then(setRawLabs).catch(console.error);
```

에러가 콘솔로만 빠져서, API가 실패해도 화면엔 "조건에 맞는 연구실이 없어요"만 뜹니다. 진짜 0건인지
요청 실패인지 구분이 안 돼요 (지난번 MSW가 꺼져 있었을 때 정확히 이 상황이었음).

**할 일**
1. `labApi.js`가 상태 코드와 `error.code`를 함께 던지도록 수정
2. `useLabFilter`에 `error`·`isLoading` 상태 추가하고 반환
3. 화면에서 상태별로 분기

| 상황 | 화면 |
|---|---|
| 로딩 중 | 스켈레톤 또는 로딩 표시 |
| `200` + 빈 배열 | "조건에 맞는 연구실이 없어요" ← 이게 **진짜** 빈 상태 |
| `401 INVALID_TOKEN` | 토큰 재발급 1회 시도 → 실패하면 로그인 페이지로 |
| `429 RATE_LIMIT_EXCEEDED` | "요청이 많아요. 잠시 후 다시 시도해주세요" + `Retry-After` 동안 재요청 차단 |
| `500` | "일시적인 오류가 발생했어요" + 다시 시도 버튼 |
| 네트워크 실패 | "연결에 실패했어요" + 다시 시도 버튼 |

로그인 화면도 마찬가지예요. `useLogin`은 `SEJONG_AUTH_FAILED`만 분기합니다.

| code | 상태 | 화면 |
|---|---|---|
| `SEJONG_AUTH_FAILED` | 401 | 학번/비밀번호 오류 — ✅ 되어 있음 |
| `SEJONG_SYSTEM_UNAVAILABLE` | 502 | "세종대 시스템에 연결할 수 없어요. 잠시 후 다시 시도해주세요" |
| `INVALID_LOGIN_REQUEST` | 400 | "학번과 비밀번호를 모두 입력해주세요" |
| `LOGIN_RATE_LIMITED` | 429 | "로그인 요청이 많아요. 잠시 후 다시 시도해주세요" |

### B-2. 인증 헤더 붙이기

```js
const response = await fetch("/api/v1/laboratories"); // 현재 — 헤더 없음
```

`bookmarked`가 사용자별 값인데 로그인해도 내 북마크 상태를 못 받아옵니다.

**할 일**: `authStore`의 `accessToken`을 자동으로 붙이는 fetch 래퍼를 하나 만들고, 모든 API 호출이
그걸 거치게 하기.
```
api/client.js   ← Authorization 자동 첨부, 401이면 refresh 후 1회 재시도, 에러 정규화
  ├─ labApi.js
  ├─ authApi.js
  └─ (앞으로 추가될 것들)
```
※ A-4의 답을 받은 뒤에 만드는 게 좋아요. 비로그인 허용 여부에 따라 401 처리가 달라집니다.

### B-3. 자동 로그인 붙이기

`accessToken`을 zustand 메모리에만 두는 건 명세대로 맞는 구현이에요 (*"Access Token은 FE 메모리에
저장한다. localStorage에는 저장하지 않는다"*). 문제는 **새로고침하면 메모리가 날아가서 로그인이
풀린다**는 것. 명세 §8이 이걸 위한 흐름을 정의해두고 있는데, 필요한 API 3개가 다 미구현이에요.

| API | 용도 | 상태 |
|---|---|---|
| `POST /api/v1/auth/refresh` | Refresh Token 쿠키로 Access Token 재발급 | ❌ 없음 |
| `GET /api/v1/me` | 현재 로그인 사용자 조회 | ❌ 없음 |
| `POST /api/v1/auth/logout` | 로그아웃 + 토큰 폐기 | ❌ 없음 |

**할 일**
1. 위 3개 API 함수 작성 (전부 `credentials: "include"` 필요)
2. 앱 시작 시 `refresh` → 성공하면 `me` 호출해서 상태 복원, 실패하면 비로그인으로 진행
3. 복원 중에는 헤더의 로그인/마이페이지 표시를 잠시 보류 (안 그러면 '로그인'이 깜빡이고 '마이페이지'로 바뀜)
4. MSW 핸들러 3개 추가 — 지금 `mocks/handlers.js`엔 `/laboratories`·`/auth/sejong/login` 2개뿐

**주의**: `localStorage`에 토큰을 넣으면 간단히 해결되지만 명세가 금지합니다. zustand `persist`
미들웨어도 같은 이유로 안 됩니다.

### B-4. 명세를 못 따라가고 있는 부분

`0. 확정된 결정`에 있는 항목(더보기·`RECENT`·`"OPEN"`)은 여기서 제외했어요.

| 항목 | 명세 | 현재 | 비고 |
|---|---|---|---|
| 검색 대상 | 연구실명·교수명·**학과명**·**연구분야** | 연구실명·교수명만 (`labFilterUtils.js`의 `matchSearchTerm`) | 2개 빠짐. "머신러닝"으로 검색해도 안 잡혀요 |
| 이름 내림차순 정렬 | 지원 기준에 포함 (`NAME_DESC`) | 드롭다운엔 있지만 `applySorting`에 case 없음 | 선택해도 동작 안 함. UI에 남길지부터 결정 필요 |
| 결과 개수 표시 | Figma에 "선택한 조건의 연구실 1개를 찾았어요" | `LabListHeader.jsx`로 구현됨 | ✅ 완료 (아직 dev에 병합 전 — 아래 참고) |

---

## 잘 맞는 부분 (참고용, 손댈 필요 없음)

- `RECRUITMENT_STATUS` 3개 코드(`RECRUITING`/`ALWAYS_OPEN`/`CLOSED`) — 명세와 일치
- `authApi.js`의 `credentials: "include"` — Refresh Token 쿠키 수신에 필요, 들어가 있음
- `authStore`가 `accessToken`을 zustand 메모리에만 보관 — 명세의 "localStorage 금지" 준수
- `useLogin`이 읽는 응답 구조(`result.data.accessToken`, `result.data.user.profileCompleted`) — 명세와 일치

---

## 권하는 순서

```
✅ B-4 이전 버전(인기 위젯 rawLabs 연결)  ← 완료
✅ 결과 개수 표시(LabListHeader)  ← 완료, dev 병합 대기 중

1. A-1 (ID 타입), A-2 (응답 봉투)   ← 나중에 고치면 전부 손봐야 함. 제일 먼저 합의
2. A-3 (인기 정의), A-4 (인증 규칙)  ← 구현 방향이 여기서 갈림
3. B-1 (에러 화면)                  ← 지금 디버깅이 안 되는 상태라 이것부터
4. B-4 나머지 (검색 대상 확장, 이름 내림차순)
5. B-2 (인증 헤더) → B-3 (자동 로그인)  ← A-4 답변 후
6. 마이페이지                        ← A-5의 미확정 5건 답변 후
```

---

## 참고: Git / 브랜치 (별도 트랙, 위 항목과 무관)

- 로컬 git lock 정리 필요: `.git/index.lock`, `.git/objects/*/tmp_obj_*` 삭제 (device bridge가 삭제 권한이 없어 제가 못 지웠어요)
- `5-feat다중-조건-필터링-및-정렬-로직-적용` → `dev` PR 병합 필요 (정렬/개수 UI인 `a4fae93`, `0a386bb`만 아직 dev에 없음)
- 병합 후 23번 브랜치 `pull` — `sortType` 기본값 충돌 시 `"RECENT"` 유지
- 지금 작업한 디자인 변경(LabCard, 필터 칩, LabListHeader 등)은 커밋 메시지 안내를 채팅으로 드렸어요 — 직접 커밋해주세요
