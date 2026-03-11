import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const outDir = path.resolve(process.cwd(), 'docs/qa/screenshots');

const viewports = [
  { name: 'mobil-390x844', width: 390, height: 844 },
  { name: 'ipad-768x1024', width: 768, height: 1024 },
  { name: 'ipad-1024x768', width: 1024, height: 768 },
];

async function clearAndOpen(page) {
  await page.goto(baseUrl);
  await page.evaluate(() => window.localStorage.clear());
  await page.goto(baseUrl);
}

async function captureViewport(browser, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await clearAndOpen(page);

  await page.screenshot({ path: path.join(outDir, `${viewport.name}-profilvelger.png`), fullPage: true });

  await page.getByRole('button', { name: 'Legg til profil' }).click();
  await page.getByLabel('Navn').fill('Mia');
  await page.getByLabel('Alder').fill('6');
  await page.getByLabel('Nivå').fill('Nysgjerrig');
  await page.getByRole('button', { name: 'Enhjørningen' }).click();
  await page.getByRole('button', { name: 'Lagre ny profil' }).click();

  await page.screenshot({ path: path.join(outDir, `${viewport.name}-modulvalg.png`), fullPage: true });

  await page.getByRole('link', { name: 'Åpne' }).first().click();
  await page.screenshot({ path: path.join(outDir, `${viewport.name}-letters.png`), fullPage: true });
  await page.getByRole('link', { name: 'Til hjem' }).click();

  await page.getByRole('link', { name: 'Åpne' }).nth(1).click();
  await page.screenshot({ path: path.join(outDir, `${viewport.name}-math.png`), fullPage: true });
  await page.getByRole('link', { name: 'Til hjem' }).click();

  await page.screenshot({ path: path.join(outDir, `${viewport.name}-progresjon.png`), fullPage: true });

  await context.close();
}

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    await captureViewport(browser, viewport);
  }
} finally {
  await browser.close();
}

console.log(`Lagret QA-skjermbilder i ${outDir}`);
