import { chromium } from "playwright";

const base = process.env.SCREENSHOT_BASE_URL || "http://127.0.0.1:3000";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.emulateMedia({ colorScheme: "dark" });

  await page.goto(`${base}/dashboard`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=Pipeline");
  await page.waitForTimeout(600);
  await page.screenshot({ path: "public/portfolio-screenshot.png" });

  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=Match sponsors");
  await page.waitForTimeout(400);
  await page.screenshot({ path: "public/portfolio-screenshot-landing.png" });

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
