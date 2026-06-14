import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { Server } from 'http';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import cookieParser from 'cookie-parser';

// Self-contained suite: it creates its own admin and member accounts so it does
// not depend on the seed passwords. Only reference data (roles, clubs) is
// expected to exist in the test database.
const EMAIL_SUFFIX = '@membership-e2e.com';
const ADMIN_EMAIL = `admin${EMAIL_SUFFIX}`;
const MEMBER_EMAIL = `member${EMAIL_SUFFIX}`;
const PASSWORD = 'Test1234!';

describe('Membership (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let dataSource: DataSource;
  let adminCookie: string;
  let memberCookie: string;
  let memberId: number;
  let firstClubId: number; // the admin manages this club
  let secondClubId: number; // used to test "already a member elsewhere"

  async function login(email: string): Promise<string> {
    const res = await request(httpServer)
      .post('/auth/login')
      .send({ email, password: PASSWORD });
    return res.headers['set-cookie'] as unknown as string;
  }

  async function cleanAll() {
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

    const clubs: { id_club: number }[] = await dataSource.query(
      `SELECT id_club FROM club ORDER BY id_club LIMIT 2`,
    );
    firstClubId = clubs[0].id_club;
    secondClubId = clubs[1].id_club;

    const roles: { id_role: number }[] = await dataSource.query(
      `SELECT id_role FROM role WHERE code_role = 'admin'`,
    );
    const adminRoleId = roles[0].id_role;

    // The admin manages the first club.
    await dataSource.query(
      `INSERT INTO membership (id_user, id_club, id_role, season, status, membership_date, decision_date)
       SELECT id_user, $1, $2, '2025-2026', 'active', CURRENT_DATE, CURRENT_DATE
       FROM app_user WHERE email = $3`,
      [firstClubId, adminRoleId, ADMIN_EMAIL],
    );

    const member: { id_user: number }[] = await dataSource.query(
      `SELECT id_user FROM app_user WHERE email = $1`,
      [MEMBER_EMAIL],
    );
    memberId = member[0].id_user;

    adminCookie = await login(ADMIN_EMAIL);
    memberCookie = await login(MEMBER_EMAIL);
  }, 30000);

  beforeEach(async () => {
    // Reset the member's requests between tests (keep the admin membership).
    await dataSource.query(`DELETE FROM membership WHERE id_user = $1`, [
      memberId,
    ]);
  });

  afterAll(async () => {
    await cleanAll();
    await dataSource.destroy();
    await app.close();
  }, 30000);

  // ── POST /membership/request/:clubId ─────────────────────────────────────
  describe('POST /membership/request/:clubId', () => {
    it('should create a pending membership successfully', async () => {
      const res = await request(httpServer)
        .post(`/membership/request/${firstClubId}`)
        .set('Cookie', memberCookie);

      expect(res.status).toBe(201);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.status).toBe('pending');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(httpServer).post(
        `/membership/request/${firstClubId}`,
      );

      expect(res.status).toBe(401);
    });

    it('should return 409 when request already exists for this club', async () => {
      await request(httpServer)
        .post(`/membership/request/${firstClubId}`)
        .set('Cookie', memberCookie);

      const res = await request(httpServer)
        .post(`/membership/request/${firstClubId}`)
        .set('Cookie', memberCookie);

      expect(res.status).toBe(409);
    });

    it('should return 409 when user already has a membership elsewhere', async () => {
      await request(httpServer)
        .post(`/membership/request/${firstClubId}`)
        .set('Cookie', memberCookie);

      const res = await request(httpServer)
        .post(`/membership/request/${secondClubId}`)
        .set('Cookie', memberCookie);

      expect(res.status).toBe(409);
    });
  });

  // ── DELETE /membership/request/:clubId ───────────────────────────────────
  describe('DELETE /membership/request/:clubId', () => {
    it('should cancel a pending request successfully', async () => {
      await request(httpServer)
        .post(`/membership/request/${firstClubId}`)
        .set('Cookie', memberCookie);

      const res = await request(httpServer)
        .delete(`/membership/request/${firstClubId}`)
        .set('Cookie', memberCookie);

      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.status).toBeNull();
    });

    it('should return 404 when no pending request exists', async () => {
      const res = await request(httpServer)
        .delete(`/membership/request/${firstClubId}`)
        .set('Cookie', memberCookie);

      expect(res.status).toBe(404);
    });
  });

  // ── GET /membership/status/:clubId ───────────────────────────────────────
  describe('GET /membership/status/:clubId', () => {
    it('should return null when no membership exists', async () => {
      const res = await request(httpServer)
        .get(`/membership/status/${firstClubId}`)
        .set('Cookie', memberCookie);

      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.status).toBeNull();
    });

    it('should return pending after requesting to join', async () => {
      await request(httpServer)
        .post(`/membership/request/${firstClubId}`)
        .set('Cookie', memberCookie);

      const res = await request(httpServer)
        .get(`/membership/status/${firstClubId}`)
        .set('Cookie', memberCookie);

      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.status).toBe('pending');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(httpServer).get(
        `/membership/status/${firstClubId}`,
      );

      expect(res.status).toBe(401);
    });
  });

  // ── GET /membership/pending ──────────────────────────────────────────────
  describe('GET /membership/pending', () => {
    it('should return pending requests for admin', async () => {
      await request(httpServer)
        .post(`/membership/request/${firstClubId}`)
        .set('Cookie', memberCookie);

      const res = await request(httpServer)
        .get('/membership/pending')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 403 when user is not an admin', async () => {
      const res = await request(httpServer)
        .get('/membership/pending')
        .set('Cookie', memberCookie);

      expect(res.status).toBe(403);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(httpServer).get('/membership/pending');

      expect(res.status).toBe(401);
    });
  });
});
