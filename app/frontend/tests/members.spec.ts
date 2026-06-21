import { test, expect, type Page, type BrowserContext } from '@playwright/test';

// Self-contained suite: it registers its own throwaway member, makes them join
// the club, then exercises the admin actions (role change + expulsion). Nothing
// from the seed is mutated, so the suite is safe to re-run.
//
// Prerequisites: the dev server running and the seeded test database
// (admin@test.com must be admin of Aquaclub21). The admin password matches the
// SEED_PASSWORD used to seed the test DB (123 in the existing auth e2e).

const SUFFIX = Date.now();
const MEMBER_EMAIL = `members-e2e-${SUFFIX}@e2e-test.com`;
const MEMBER_PASSWORD = 'Test1234!';

const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = process.env.SEED_PASSWORD || 'LocalDev_2026!';

const CLUB_SLUG = 'aquaclub21';

async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('vous@exemple.fr').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: /se connecter/i }).click();
  await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
}

test.describe.serial('Gestion des membres (e2e)', () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let memberContext: BrowserContext;
  let memberPage: Page;

  test.beforeAll(async ({ browser }) => {
    adminContext = await browser.newContext();
    adminPage = await adminContext.newPage();
    memberContext = await browser.newContext();
    memberPage = await memberContext.newPage();
  });

  test.afterAll(async () => {
    await adminContext.close();
    await memberContext.close();
  });

  test('un nouveau membre s’inscrit et demande à rejoindre le club', async () => {
    // Register the throwaway member.
    await memberPage.goto('/register');
    await memberPage.getByPlaceholder('Kevin').fill('Playwright');
    await memberPage.getByPlaceholder('Dupont').fill('Member');
    await memberPage.getByPlaceholder('vous@exemple.fr').fill(MEMBER_EMAIL);
    await memberPage.getByPlaceholder('••••••••').fill(MEMBER_PASSWORD);
    await memberPage.getByRole('button', { name: /créer mon compte/i }).click();
    await expect(memberPage.getByText('Compte créé avec succès')).toBeVisible({
      timeout: 5000,
    });

    // Log in, then request to join the club.
    await login(memberPage, MEMBER_EMAIL, MEMBER_PASSWORD);
    await memberPage.goto(`/clubs/${CLUB_SLUG}`);
    await memberPage
      .getByRole('button', { name: /demander à rejoindre/i })
      .click();
    await expect(
      memberPage.getByText(/demande en attente de validation/i),
    ).toBeVisible({ timeout: 5000 });
  });

  test('l’admin accepte la demande d’adhésion', async () => {
    await login(adminPage, ADMIN_EMAIL, ADMIN_PASSWORD);
    await adminPage.goto('/dashboard/members');

    // Accept the pending request for the throwaway member.
    const requestRow = adminPage
      .locator('div.justify-between')
      .filter({ hasText: MEMBER_EMAIL });
    await requestRow.getByRole('button', { name: /accepter/i }).click();

    // The member now appears in the active members table.
    await expect(
      adminPage.getByRole('row', { name: MEMBER_EMAIL }),
    ).toBeVisible({ timeout: 5000 });
  });

  test('l’admin change le rôle du membre via le menu + bouton Valider', async () => {
    const row = adminPage.getByRole('row', { name: MEMBER_EMAIL });

    // The dropdown shows the current role; Valider is disabled until it changes.
    await row.getByRole('button', { name: 'Adhérent' }).click();
    await row.getByRole('button', { name: 'Moniteur', exact: true }).click();

    await row.getByRole('button', { name: 'Valider' }).click();
    await expect(adminPage.getByText('Rôle mis à jour')).toBeVisible({
      timeout: 5000,
    });
    // The dropdown now reflects the new role.
    await expect(row.getByRole('button', { name: 'Moniteur' })).toBeVisible();
  });

  test('un non-admin voit la liste en lecture seule', async () => {
    await memberPage.goto('/dashboard/members');

    // The members list is visible...
    await expect(
      memberPage.getByRole('row', { name: MEMBER_EMAIL }),
    ).toBeVisible({ timeout: 5000 });
    // ...but no management controls are rendered.
    await expect(memberPage.getByRole('button', { name: 'Valider' })).toHaveCount(
      0,
    );
    await expect(
      memberPage.getByRole('button', { name: 'Expulser' }),
    ).toHaveCount(0);
  });

  test('l’admin expulse le membre après confirmation', async () => {
    await adminPage.goto('/dashboard/members');
    const row = adminPage.getByRole('row', { name: MEMBER_EMAIL });

    await row.getByRole('button', { name: 'Expulser' }).click();

    // Confirm in the modal.
    await expect(adminPage.getByText('Expulser ce membre ?')).toBeVisible();
    await adminPage
      .locator('.fixed.inset-0')
      .getByRole('button', { name: 'Expulser' })
      .click();

    await expect(adminPage.getByText('Membre expulsé')).toBeVisible({
      timeout: 5000,
    });
    // The member is gone from the list.
    await expect(
      adminPage.getByRole('row', { name: MEMBER_EMAIL }),
    ).toHaveCount(0);
  });
});
