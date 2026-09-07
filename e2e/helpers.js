import { expect } from "@playwright/test";

/**
 * 학번 9999로 로그인합니다.
 *
 * 자동 로그인이 없어서 주소로 바로 들어갈 수 없습니다.
 * 그래서 모든 테스트가 이 함수로 시작해요.
 */
export async function login(page) {
  await page.goto("/login");
  await page.getByLabel("포털 아이디 (학번)").fill("9999");
  await page.getByLabel("비밀번호", { exact: true }).fill("test1234");
  await page.getByRole("button", { name: "로그인", exact: true }).click();

  // 헤더가 바뀔 때까지 기다립니다. 이게 끝나야 로그인이 완료된 겁니다.
  await expect(page.getByRole("link", { name: "마이페이지" })).toBeVisible();
}
