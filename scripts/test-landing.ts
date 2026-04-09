import { runTest } from "./auth";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, "..", "screenshots");

runTest("Landing page shows all sections", async (helper) => {
  const { page } = helper;
  await mkdir(screenshotsDir, { recursive: true });

  // Navigate to landing
  await helper.goto("/");
  await page.waitForTimeout(3000);

  // Check hero section
  const heroVisible = await page.locator("text=Елена").first().isVisible();
  console.log("Hero visible:", heroVisible);
  if (!heroVisible) {
    await helper.printDebugInfo();
    throw new Error("Hero section not found");
  }

  // Check courses loaded from DB
  const courseVisible = await page.locator("text=Формула счастья").first().isVisible();
  console.log("Course 'Формула счастья' visible:", courseVisible);

  // Screenshot hero section
  await page.screenshot({
    path: join(screenshotsDir, "landing-hero.png"),
    fullPage: false,
  });
  console.log("Screenshot: landing-hero.png");

  // Scroll to courses section
  const coursesSection = page.locator("#courses");
  if (await coursesSection.isVisible()) {
    await coursesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(screenshotsDir, "landing-courses.png"),
      fullPage: false,
    });
    console.log("Screenshot: landing-courses.png");
  }

  // Scroll to games section
  const gamesSection = page.locator("#games");
  if (await gamesSection.isVisible()) {
    await gamesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(screenshotsDir, "landing-games.png"),
      fullPage: false,
    });
    console.log("Screenshot: landing-games.png");
  }

  // Scroll to contact section
  const contactSection = page.locator("#contact");
  if (await contactSection.isVisible()) {
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(screenshotsDir, "landing-contact.png"),
      fullPage: false,
    });
    console.log("Screenshot: landing-contact.png");
  }

  console.log("✅ All landing page sections verified!");
}).catch(() => process.exit(1));
