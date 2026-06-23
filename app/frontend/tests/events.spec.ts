import { test, expect, type Page, type BrowserContext } from '@playwright/test';

// Self-contained suite for event registration. It creates its own capacity-1
// event (deleted at the end) and uses three seeded Aquaclub21 accounts:
// admin (manager), adherent (member A) and moniteur (member B).
//
// Prerequisites: dev server running and the seeded database. The shared
// password is the SEED_PASSWORD used to seed it (LocalDev_2026! by default).

const SUFFIX = Date.now();
const EVENT_TITLE = `E2E-EVENT-${SUFFIX}`;
const PASSWORD = process.env.SEED_PASSWORD || 'LocalDev_2026!';

const ADMIN_EMAIL = 'admin@test.com';
const MEMBER_A_EMAIL = 'adherent@test.com'; // Marc Dupont, member of Aquaclub21
const MEMBER_A_NAME = 'Marc Dupont';
const MEMBER_B_EMAIL = 'moniteur@test.com'; // Thomas Dubois, instructor of Aquaclub21

async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('vous@exemple.fr').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: /se connecter/i }).click();
  await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
}

test.describe.serial('Inscription aux événements (e2e)', () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let aContext: BrowserContext;
  let aPage: Page;
  let bContext: BrowserContext;
  let bPage: Page;
  let eventUrl: string;

  test.beforeAll(async ({ browser }) => {
    adminContext = await browser.newContext();
    adminPage = await adminContext.newPage();
    aContext = await browser.newContext();
    aPage = await aContext.newPage();
    bContext = await browser.newContext();
    bPage = await bContext.newPage();
  });

  test.afterAll(async () => {
    // Best-effort cleanup: delete the test event (cascades registrations).
    try {
      if (eventUrl) {
        await adminPage.goto(eventUrl);
        await adminPage.getByRole('button', { name: 'Supprimer' }).first().click();
        await adminPage
          .locator('.fixed.inset-0')
          .getByRole('button', { name: 'Supprimer' })
          .click();
      }
    } catch {
      // ignore cleanup failures
    }
    await adminContext.close();
    await aContext.close();
    await bContext.close();
  });

  test('un manager crée un événement à capacité 1', async () => {
    await login(adminPage, ADMIN_EMAIL, PASSWORD);
    await adminPage.goto('/dashboard/events/create');

    await adminPage
      .getByPlaceholder('Ex : Sortie lac de Nantua')
      .fill(EVENT_TITLE);
    await adminPage
      .locator('input[name="startDatetime"]')
      .fill('2027-01-10T10:00');
    await adminPage.locator('input[name="endDatetime"]').fill('2027-01-10T12:00');
    await adminPage.getByPlaceholder('Ex : 12').fill('1');
    await adminPage.getByRole('button', { name: "Créer l'événement" }).click();

    await expect(adminPage).toHaveURL('/dashboard/events', { timeout: 5000 });

    // Open the created event to capture its detail URL.
    await adminPage.getByText(EVENT_TITLE).click();
    await adminPage.waitForURL(/\/dashboard\/events\/\d+$/);
    eventUrl = adminPage.url();
  });

  test('le premier membre s’inscrit (place disponible)', async () => {
    await login(aPage, MEMBER_A_EMAIL, PASSWORD);
    await aPage.goto(eventUrl);

    await aPage.getByRole('button', { name: /^S.inscrire$/ }).click();
    await expect(aPage.getByText('Inscription réussie')).toBeVisible({
      timeout: 5000,
    });
    // Member A now shows as registered.
    await expect(aPage.getByText(/Vous êtes inscrit/)).toBeVisible();
    await expect(aPage.getByText(MEMBER_A_NAME)).toBeVisible();
  });

  test('le second membre passe en liste d’attente (événement complet)', async () => {
    await login(bPage, MEMBER_B_EMAIL, PASSWORD);
    await bPage.goto(eventUrl);

    await bPage.getByRole('button', { name: /^S.inscrire$/ }).click();
    // Target B's own waitlist status (the ⏳ marker is unique to it — avoids
    // matching the toast and the "Liste d’attente (n)" heading).
    await expect(bPage.getByText(/⏳ Vous êtes en liste d.attente/i)).toBeVisible(
      {
        timeout: 5000,
      },
    );
  });

  test('la désinscription promeut le premier en liste d’attente', async () => {
    // Member A unregisters, freeing the single spot.
    await aPage.getByRole('button', { name: /Me désinscrire/ }).click();
    await expect(aPage.getByText('Désinscription réussie')).toBeVisible({
      timeout: 5000,
    });

    // Member B reloads: promoted from waitlist to registered.
    await bPage.goto(eventUrl);
    await expect(bPage.getByText(/Vous êtes inscrit/)).toBeVisible({
      timeout: 5000,
    });
    await expect(
      bPage.getByRole('button', { name: /Me désinscrire/ }),
    ).toBeVisible();
  });
});
