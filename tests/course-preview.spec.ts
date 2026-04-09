import { test } from "./helpers";

test("course page enriched preview", async ({ page, runTest }) => {
  await runTest(async () => {
    await page.goto("/course/formula-schastya");
    await page.waitForSelector("text=Формула счастья предпринимателя", { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({
      path: "screenshots/course-hero.png",
      fullPage: false,
    });
    
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: "screenshots/course-learn.png",
      fullPage: false,
    });
    
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: "screenshots/course-program.png",
      fullPage: false,
    });
  });
});
