import { test, expect } from '@playwright/test';

const TIMESTAMP = Date.now();
const TEST_EMAIL = `playwright-${TIMESTAMP}@e2e-test.com`;
const TEST_PASSWORD = 'Test1234!';

test.describe('Authentication', () => {

  test('should redirect to /login when accessing /dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should register a new user successfully', async ({ page }) => {
    await page.goto('/register');

    await page.getByPlaceholder('Kevin').fill('Playwright');
    await page.getByPlaceholder('Dupont').fill('Test');
    await page.getByPlaceholder('vous@exemple.fr').fill(TEST_EMAIL);
    await page.getByPlaceholder('••••••••').fill(TEST_PASSWORD);

    await page.getByRole('button', { name: /créer mon compte/i }).click();

    await expect(page.getByText('Compte créé avec succès')).toBeVisible({ timeout: 5000 });
  });

  test('should login successfully and access dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('vous@exemple.fr').fill('adherent@test.com');
    await page.getByPlaceholder('••••••••').fill('123');

    await page.getByRole('button', { name: /se connecter/i }).click();

    await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
  });

  test('should show error with wrong password', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('vous@exemple.fr').fill('adherent@test.com');
    await page.getByPlaceholder('••••••••').fill('wrongpassword');

    await page.getByRole('button', { name: /se connecter/i }).click();

    await expect(page.getByText(/identifiants incorrects/i)).toBeVisible({ timeout: 3000 });
  });
});