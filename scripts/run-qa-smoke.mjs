import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const outFile = path.resolve(process.cwd(), 'docs/qa/qa-smoke-report-2026-03-11.md');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const consoleEvents = [];
const pageErrors = [];

page.on('console', (message) => {
  consoleEvents.push({ type: message.type(), text: message.text() });
});
page.on('pageerror', (error) => {
  pageErrors.push(String(error));
});

async function clearAndOpen() {
  await page.goto(baseUrl);
  await page.evaluate(() => window.localStorage.clear());
  await page.goto(baseUrl);
}

try {
  await clearAndOpen();

  await page.getByRole('link', { name: 'Åpne' }).first().click();
  const prompt = await page.locator('p').filter({ hasText: /^Finn bokstaven / }).textContent();
  const target = prompt?.match(/Finn bokstaven\s+(.+)$/)?.[1]?.trim();
  if (!target) throw new Error('Fant ikke target-bokstav i letters-flow');
  await page.getByRole('button', { name: target, exact: true }).click();
  await page.getByRole('link', { name: 'Til hjem' }).click();

  await page.getByRole('link', { name: 'Åpne' }).nth(1).click();
  await page.locator('button.min-h-24').last().click();
  await page.getByRole('link', { name: 'Til hjem' }).click();

  for (let i = 0; i < 20; i += 1) {
    await page.getByRole('button', { name: 'Test belønning' }).first().click();
  }

  const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  const errorConsole = consoleEvents.filter((entry) => entry.type === 'error');

  const report = `# QA smoke report\n\nDato: 2026-03-11\n\n## Kjøring\n- Base URL: ${baseUrl}\n- Viewport: 390x844\n\n## Verifisert\n- Standard flyt gjennom Letters\n- Standard flyt gjennom Math\n- 20 raske trykk på \"Test belønning\" i hjemskjermen\n- Sjekk for horisontal scroll\n- Sjekk for console errors og page errors\n\n## Resultat\n- Horisontal scroll: ${hasHorizontalScroll ? 'JA (feil)' : 'NEI'}\n- Console errors: ${errorConsole.length}\n- Page errors: ${pageErrors.length}\n\n## Console-logg (error)\n${errorConsole.length ? errorConsole.map((entry) => `- ${entry.text}`).join('\n') : '- Ingen'}\n\n## Page errors\n${pageErrors.length ? pageErrors.map((entry) => `- ${entry}`).join('\n') : '- Ingen'}\n`;

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, report);
  console.log(`Skrev QA smoke report til ${outFile}`);
} finally {
  await context.close();
  await browser.close();
}
