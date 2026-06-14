import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { Server } from 'http';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import cookieParser from 'cookie-parser';

// Self-contained suite: it creates its own admin and member accounts so it does
// not depend on the seed state. Everything is tagged and cleaned up afterwards.
const TEST_PREFIX = 'E2E-EVENT-TEST';
const EMAIL_SUFFIX = '@event-e2e.com';
const ADMIN_EMAIL = `admin${EMAIL_SUFFIX}`;
const MEMBER_EMAIL = `member${EMAIL_SUFFIX}`;
const PASSWORD = 'Test1234!';

const validPayload = {
  title: `${TEST_PREFIX} — Sortie lac`,
  description: 'Event created by the e2e test',
  eventType: 'dive_trip',
  startDatetime: '2026-09-01T08:00:00.000Z',
  endDatetime: '2026-09-01T17:00:00.000Z',
  location: 'Lac de test',
  minimumLevel: 'N1',
  maxCapacity: 10,
  isPaid: true,
  price: 30,
};

describe('Event CRUD (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let dataSource: DataSource;
  let adminCookie: string;
  let memberCookie: string;
  let clubId: number;

  // Create an event as the admin and return its id.
  async function createEventAsAdmin(
    overrides: Partial<typeof validPayload> = {},
  ): Promise<number> {
    const res = await request(httpServer)
      .post(`/clubs/${clubId}/events`)
      .set('Cookie', adminCookie)
      .send({ ...validPayload, ...overrides });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return res.body.idEvent as number;
  }

  async function login(email: string): Promise<string> {
    const res = await request(httpServer)
      .post('/auth/login')
      .send({ email, password: PASSWORD });
    return res.headers['set-cookie'] as unknown as string;
  }

  // Remove test events first (they reference the test users as creator),
  // then the memberships, then the users themselves.
  async function cleanAll() {
    await dataSource.query(
      `DELETE FROM event WHERE title LIKE '${TEST_PREFIX}%'`,
    );
    await dataSource.query(
      `DELETE FROM membership WHERE id_user IN (
         SELECT id_user FROM app_user WHERE email LIKE '%${EMAIL_SUFFIX}'
       )`,
    );
    await dataSource.query(
      `DELETE FROM app_user WHERE email LIKE '%${EMAIL_SUFFIX}'`,
    );
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    httpServer = app.getHttpServer() as Server;

    dataSource = moduleFixture.get(DataSource);

    await cleanAll();

    // Register the two test accounts through the API (hashes the password).
    await request(httpServer).post('/auth/register').send({
      email: ADMIN_EMAIL,
      password: PASSWORD,
      firstName: 'Admin',
      lastName: 'E2E',
    });
    await request(httpServer).post('/auth/register').send({
      email: MEMBER_EMAIL,
      password: PASSWORD,
      firstName: 'Member',
      lastName: 'E2E',
    });

    // Grant memberships in the same club: one manager (admin), one member.
    const club: { id_club: number }[] = await dataSource.query(
      `SELECT id_club FROM club ORDER BY id_club LIMIT 1`,
    );
    clubId = club[0].id_club;

    const roles: { id_role: number; code_role: string }[] =
      await dataSource.query(
        `SELECT id_role, code_role FROM role WHERE code_role IN ('admin', 'member')`,
      );
    const adminRoleId = roles.find((r) => r.code_role === 'admin')!.id_role;
    const memberRoleId = roles.find((r) => r.code_role === 'member')!.id_role;

    await dataSource.query(
      `INSERT INTO membership (id_user, id_club, id_role, season, status, membership_date, decision_date)
       SELECT id_user, $1, $2, '2025-2026', 'active', CURRENT_DATE, CURRENT_DATE
       FROM app_user WHERE email = $3`,
      [clubId, adminRoleId, ADMIN_EMAIL],
    );
    await dataSource.query(
      `INSERT INTO membership (id_user, id_club, id_role, season, status, membership_date, decision_date)
       SELECT id_user, $1, $2, '2025-2026', 'active', CURRENT_DATE, CURRENT_DATE
       FROM app_user WHERE email = $3`,
      [clubId, memberRoleId, MEMBER_EMAIL],
    );

    adminCookie = await login(ADMIN_EMAIL);
    memberCookie = await login(MEMBER_EMAIL);
  }, 30000);

  beforeEach(async () => {
    await dataSource.query(
      `DELETE FROM event WHERE title LIKE '${TEST_PREFIX}%'`,
    );
  });

  afterAll(async () => {
    await cleanAll();
    await dataSource.destroy();
    await app.close();
  }, 30000);

  // ── Scenario 1: list the club events ─────────────────────────────────────
  describe('GET /clubs/:clubId/events (list)', () => {
    it('should include the created event in the club list', async () => {
      const id = await createEventAsAdmin();

      const res = await request(httpServer)
        .get(`/clubs/${clubId}/events`)
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const ids = (res.body as { idEvent: number }[]).map((e) => e.idEvent);
      expect(ids).toContain(id);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(httpServer).get(`/clubs/${clubId}/events`);

      expect(res.status).toBe(401);
    });
  });

  // ── Scenario 2: create an event ──────────────────────────────────────────
  describe('POST /clubs/:clubId/events (create)', () => {
    it('should create an event as admin and return it', async () => {
      const res = await request(httpServer)
        .post(`/clubs/${clubId}/events`)
        .set('Cookie', adminCookie)
        .send(validPayload);

      expect(res.status).toBe(201);
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      expect(res.body.idEvent).toBeDefined();
      expect(res.body.title).toBe(validPayload.title);
      expect(res.body.eventType).toBe('dive_trip');
      /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    });

    it('should return 400 when payload is invalid (missing title)', async () => {
      const { title: _title, ...invalid } = validPayload;

      const res = await request(httpServer)
        .post(`/clubs/${clubId}/events`)
        .set('Cookie', adminCookie)
        .send(invalid);

      expect(res.status).toBe(400);
    });
  });

  // ── Scenario 3: update an event ──────────────────────────────────────────
  describe('PUT /events/:id (update)', () => {
    it('should update an event as admin', async () => {
      const id = await createEventAsAdmin();

      const res = await request(httpServer)
        .put(`/events/${id}`)
        .set('Cookie', adminCookie)
        .send({ title: `${TEST_PREFIX} — titre modifié`, maxCapacity: 25 });

      expect(res.status).toBe(200);
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      expect(res.body.title).toBe(`${TEST_PREFIX} — titre modifié`);
      expect(res.body.maxCapacity).toBe(25);
      /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    });

    it('should return 404 when updating a non-existent event', async () => {
      const res = await request(httpServer)
        .put('/events/99999999')
        .set('Cookie', adminCookie)
        .send({ title: `${TEST_PREFIX} — fantôme` });

      expect(res.status).toBe(404);
    });
  });

  // ── Scenario 4: delete an event ──────────────────────────────────────────
  describe('DELETE /events/:id (delete)', () => {
    it('should delete an event as admin and make it unreachable', async () => {
      const id = await createEventAsAdmin();

      const del = await request(httpServer)
        .delete(`/events/${id}`)
        .set('Cookie', adminCookie);

      expect(del.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(del.body.success).toBe(true);

      const get = await request(httpServer)
        .get(`/events/${id}`)
        .set('Cookie', adminCookie);

      expect(get.status).toBe(404);
    });
  });

  // ── Scenario 5: access control is enforced server-side (assertManager) ────
  // The UI hides the buttons, but the API must reject writes from a member or
  // an anonymous caller regardless of the front-end.
  describe('Access control (assertManager)', () => {
    it('should return 401 when creating without auth', async () => {
      const res = await request(httpServer)
        .post(`/clubs/${clubId}/events`)
        .send(validPayload);

      expect(res.status).toBe(401);
    });

    it('should return 403 when a member tries to create', async () => {
      const res = await request(httpServer)
        .post(`/clubs/${clubId}/events`)
        .set('Cookie', memberCookie)
        .send(validPayload);

      expect(res.status).toBe(403);
    });

    it('should return 403 when a member tries to update', async () => {
      const id = await createEventAsAdmin();

      const res = await request(httpServer)
        .put(`/events/${id}`)
        .set('Cookie', memberCookie)
        .send({ title: `${TEST_PREFIX} — hack` });

      expect(res.status).toBe(403);
    });

    it('should return 403 when a member tries to delete', async () => {
      const id = await createEventAsAdmin();

      const res = await request(httpServer)
        .delete(`/events/${id}`)
        .set('Cookie', memberCookie);

      expect(res.status).toBe(403);
    });
  });
});
