import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test("글을 쓰고, 수정하고, 지울 수 있다", async ({ page }) => {
  // 매번 다른 제목을 씁니다. 목 데이터의 기존 글과 겹치지 않게요.
  const title = `E2E 테스트 글 ${Date.now()}`;
  const editedTitle = `${title} (수정됨)`;

  await login(page);

  /* ── 작성 ── */
  await page.getByRole("link", { name: "커뮤니티", exact: true }).click();
  await page.getByRole("link", { name: "글쓰기" }).click();

  await page.getByRole("button", { name: "자유 게시판" }).click();
  await page.getByLabel("제목").fill(title);
  await page.getByLabel("내용").fill("E2E 스모크 테스트가 작성한 글입니다.");
  await page.getByRole("button", { name: "등록" }).click();

  // 등록에 성공하면 새 글 상세로 이동합니다.
  await expect(page.getByRole("heading", { name: title })).toBeVisible();

  /* ── 수정 ── */
  await page.getByRole("link", { name: "수정" }).click();
  await page.getByLabel("제목").fill(editedTitle);
  await page.getByRole("button", { name: "수정" }).click();

  await expect(page.getByRole("heading", { name: editedTitle })).toBeVisible();

  /* ── 삭제 ── */
  await page.getByRole("button", { name: "삭제" }).click();
  await expect(page.getByText("정말 삭제할까요?")).toBeVisible();
  await page.getByRole("button", { name: "삭제" }).click();

  /* ── 목록에서 사라졌는지 ── */
  await expect(page).toHaveURL(/\/community$/);

  // 목록이 다 그려진 걸 먼저 확인하고 나서 없는지를 봅니다.
  // 이 줄이 없으면 "아직 안 그려진 상태"를 "없다"로 착각할 수 있어요.
  await expect(page.getByText("인건비 평균").first()).toBeVisible();
  await expect(page.getByText(editedTitle)).toHaveCount(0);
});
