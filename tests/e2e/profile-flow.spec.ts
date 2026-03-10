import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/');
});

test('can create two extra profiles and switch between them', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Lær med lek og små seiere' })).toBeVisible();
  await page.getByRole('button', { name: 'Legg til profil' }).click();
  await page.getByLabel('Navn').fill('Mia');
  await page.getByLabel('Alder').fill('6');
  await page.getByLabel('Nivå').fill('Nysgjerrig');
  await page.getByRole('button', { name: 'Enhjørningen' }).click();
  await page.getByRole('button', { name: 'Lagre ny profil' }).click();
  await expect(page.getByText('Mia')).toBeVisible();
  await page.getByRole('button', { name: 'Legg til profil' }).click();
  await page.getByLabel('Navn').fill('Ola');
  await page.getByRole('button', { name: 'Pingvinen' }).click();
  await page.getByRole('button', { name: 'Lagre ny profil' }).click();
  await page.getByRole('button', { name: /Ada/ }).click();
  await expect(page.getByText('Aktiv profil: Ada')).toBeVisible();
  await page.getByRole('button', { name: /Ola/ }).click();
  await expect(page.getByText('Aktiv profil: Ola')).toBeVisible();
});

test('keeps progress after refresh', async ({ page }) => {
  await page.getByRole('button', { name: 'Test belønning' }).first().click();
  await expect(page.getByText('1 / 12 stjerner').first()).toBeVisible();
  await page.reload();
  await expect(page.getByText('1 / 12 stjerner').first()).toBeVisible();
});
