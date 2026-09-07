import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test("학번 9999로 로그인하면 헤더가 마이페이지로 바뀐다", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("link", { name: "마이페이지" })).toBeVisible();
});
