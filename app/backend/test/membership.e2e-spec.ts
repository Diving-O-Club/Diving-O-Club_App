import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import cookieParser from 'cookie-parser';

describe('Membership (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let memberCookie: string;
  let adminCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  beforeEach(async () => {
    // Clean test data
    await dataSource.query(`
      DELETE FROM membership WHERE id_user IN (
        SELECT id_user FROM app_user WHERE email LIKE '%@membership-test.com'
      )
    `);
    await dataSource.query(
      `DELETE FROM app_user WHERE email LIKE '%@membership-test.com'`,
    );

    // Create member user
    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'member@membership-test.com',
      password: 'Test1234!',
      firstName: 'Test',
      lastName: 'Member',
    });

    const memberLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'member@membership-test.com', password: 'Test1234!' });
    memberCookie = memberLogin.headers['set-cookie'];

    // Login as existing admin (admin@test.com from seed)
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: '123' });
    adminCookie = adminLogin.headers['set-cookie'];
  });

  afterAll(async () => {
    await dataSource.query(`
      DELETE FROM membership WHERE id_user IN (
        SELECT id_user FROM app_user WHERE email LIKE '%@membership-test.com'
      )
    `);
    await dataSource.query(
      `DELETE FROM app_user WHERE email LIKE '%@membership-test.com'`,
    );
    await dataSource.destroy();
    await app.close();
  });

  // ── POST /membership/request/:clubId ─────────────────────────────────────
  describe('POST /membership/request/:clubId', () => {
    it('should create a pending membership successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/membership/request/1')
        .set('Cookie', memberCookie);

      expect(res.status).toBe(201);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.status).toBe('pending');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app.getHttpServer()).post(
        '/membership/request/1',
      );

      expect(res.status).toBe(401);
    });

    it('should return 409 when request already exists for this club', async () => {
      await request(app.getHttpServer())
        .post('/membership/request/1')
        .set('Cookie', memberCookie);

      const res = await request(app.getHttpServer())
        .post('/membership/request/1')
        .set('Cookie', memberCookie);

      expect(res.status).toBe(409);
    });

    it('should return 409 when user already has a membership elsewhere', async () => {
      await request(app.getHttpServer())
        .post('/membership/request/1')
        .set('Cookie', memberCookie);

      const res = await request(app.getHttpServer())
        .post('/membership/request/2')
        .set('Cookie', memberCookie);

      expect(res.status).toBe(409);
    });
  });

  // ── DELETE /membership/request/:clubId ───────────────────────────────────
  describe('DELETE /membership/request/:clubId', () => {
    it('should cancel a pending request successfully', async () => {
      await request(app.getHttpServer())
        .post('/membership/request/1')
        .set('Cookie', memberCookie);

      const res = await request(app.getHttpServer())
        .delete('/membership/request/1')
        .set('Cookie', memberCookie);

      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.status).toBeNull();
    });

    it('should return 404 when no pending request exists', async () => {
      const res = await request(app.getHttpServer())
        .delete('/membership/request/1')
        .set('Cookie', memberCookie);

      expect(res.status).toBe(404);
    });
  });

  // ── GET /membership/status/:clubId ───────────────────────────────────────
  describe('GET /membership/status/:clubId', () => {
    it('should return null when no membership exists', async () => {
      const res = await request(app.getHttpServer())
        .get('/membership/status/1')
        .set('Cookie', memberCookie);

      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.status).toBeNull();
    });

    it('should return pending after requesting to join', async () => {
      await request(app.getHttpServer())
        .post('/membership/request/1')
        .set('Cookie', memberCookie);

      const res = await request(app.getHttpServer())
        .get('/membership/status/1')
        .set('Cookie', memberCookie);

      expect(res.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.status).toBe('pending');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app.getHttpServer()).get(
        '/membership/status/1',
      );

      expect(res.status).toBe(401);
    });
  });

  // ── GET /membership/pending ──────────────────────────────────────────────
  describe('GET /membership/pending', () => {
    it('should return pending requests for admin', async () => {
      await request(app.getHttpServer())
        .post('/membership/request/1')
        .set('Cookie', memberCookie);

      const res = await request(app.getHttpServer())
        .get('/membership/pending')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 403 when user is not an admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/membership/pending')
        .set('Cookie', memberCookie);

      expect(res.status).toBe(403);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app.getHttpServer()).get('/membership/pending');

      expect(res.status).toBe(401);
    });
  });
});
