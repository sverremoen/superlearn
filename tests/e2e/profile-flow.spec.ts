import { test, expect, type Page } from '@playwright/test';

async function clearAndOpen(page: Page) {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/');
}

async function expectStarProgress(page: Page, label: 'Bokstaver' | 'Matte', value: string) {
  const card = page.locator('div').filter({ has: page.getByRole('heading', { name: label }) }).first();
  await expect(card.getByText(value)).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await clearAndOpen(page);
});

test('kan opprette profil og velge avatar', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Lær med lek og små seiere' })).toBeVisible();
  await page.getByRole('button', { name: 'Legg til profil' }).click();
  await page.getByLabel('Navn').fill('Mia');
  await page.getByLabel('Alder').fill('6');
  await page.getByLabel('Nivå').fill('Nysgjerrig');
  await page.getByRole('button', { name: 'Enhjørningen' }).click();
  await page.getByRole('button', { name: 'Lagre ny profil' }).click();

  await expect(page.getByRole('button', { name: /Mia 6 år · Nysgjerrig/ })).toBeVisible();
  await expect(page.getByText('Aktiv profil: Mia')).toBeVisible();
  await expect(page.getByText('6 år · Nysgjerrig').first()).toBeVisible();
});

test('kan bytte profil', async ({ page }) => {
  await page.getByRole('button', { name: /Leo/ }).click();
  await expect(page.getByText('Aktiv profil: Leo')).toBeVisible();
  await page.getByRole('button', { name: /Ada/ }).click();
  await expect(page.getByText('Aktiv profil: Ada')).toBeVisible();
});

test('kan fullføre letters-øvelse og se progresjon oppdatert', async ({ page }) => {
  await page.getByRole('link', { name: 'Åpne' }).first().click();
  await expect(page.getByRole('heading', { name: /Hei, Ada!/ })).toBeVisible();
  await expect(page.getByText('0 / 12 stjerner')).toBeVisible();

  const prompt = await page.locator('p').filter({ hasText: /^Finn bokstaven / }).textContent();
  const target = prompt?.match(/Finn bokstaven\s+(.+)$/)?.[1]?.trim();
  expect(target).toBeTruthy();

  await page.getByRole('button', { name: target!, exact: true }).click();
  await expect(page.getByText('Riktig! Du fant riktig bokstav.')).toBeVisible();
  await expect(page.getByText('2 / 12 stjerner')).toBeVisible();

  await page.getByRole('link', { name: 'Til hjem' }).click();
  await expectStarProgress(page, 'Bokstaver', '2 / 12 stjerner');
});

test('kan fullføre math-øvelse og se progresjon oppdatert', async ({ page }) => {
  await page.getByRole('link', { name: 'Åpne' }).nth(1).click();
  await expect(page.getByRole('heading', { name: /Hei, Ada!/ })).toBeVisible();
  await expect(page.getByText('0 / 12 stjerner')).toBeVisible();

  const countAnswers = page.locator('button.min-h-24');
  await countAnswers.last().click();
  await expect(page.getByText('Riktig! Du telte helt riktig.')).toBeVisible();
  await expect(page.getByText('2 / 12 stjerner')).toBeVisible();

  await page.getByRole('button', { name: 'Multiplikasjon' }).click();
  const prompt = (await page.locator('p').filter({ hasText: /×/ }).first().textContent()) ?? '';
  const match = prompt.match(/(\d+)\s*×\s*(\d+)/);
  expect(match).toBeTruthy();
  const answer = Number(match![1]) * Number(match![2]);

  await page.getByRole('button', { name: String(answer), exact: true }).click();
  await expect(page.getByText('Riktig! Du løste gangestykket.')).toBeVisible();
  await expect(page.getByText('4 / 12 stjerner')).toBeVisible();

  await page.getByRole('link', { name: 'Til hjem' }).click();
  await expectStarProgress(page, 'Matte', '4 / 12 stjerner');
});

test('beholder progresjon etter refresh', async ({ page }) => {
  await page.getByRole('button', { name: 'Test belønning' }).first().click();
  await expectStarProgress(page, 'Bokstaver', '1 / 12 stjerner');

  await page.reload();
  await expectStarProgress(page, 'Bokstaver', '1 / 12 stjerner');
});

test('mobilvisning har ingen horisontal scroll og store trykkflater', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasHorizontalScroll).toBe(false);

  const metrics = await page.getByRole('button', { name: 'Legg til profil' }).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });

  expect(metrics.width).toBeGreaterThanOrEqual(44);
  expect(metrics.height).toBeGreaterThanOrEqual(44);
});
