import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import cookieParser = require('cookie-parser');

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = moduleFixture.get(DataSource);

    // Clean once before all tests
    await dataSource.query(
      `DELETE FROM app_user WHERE email LIKE '%@e2e-test.com'`,
    );
  });

  beforeEach(async () => {
    // Only clean between tests, don't reinit the app
    await dataSource.query(
      `DELETE FROM app_user WHERE email LIKE '%@e2e-test.com'`,
    );
  });

  afterAll(async () => {
    await dataSource.query(
      `DELETE FROM app_user WHERE email LIKE '%@e2e-test.com'`,
    );
    await dataSource.destroy();
    await app.close();
  });

  // ── POST /auth/register ──────────────────────────────────────────────────
  describe('POST /auth/register', () => {
    it('should register a new user and return 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'register@e2e-test.com',
          password: 'Test1234!',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 409 when email already exists', async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'duplicate@e2e-test.com',
        password: 'Test1234!',
        firstName: 'Test',
        lastName: 'User',
      });

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'duplicate@e2e-test.com',
          password: 'Test1234!',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.status).toBe(409);
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'incomplete@e2e-test.com' });

      expect(res.status).toBe(400);
    });
  });

  // ── POST /auth/login ─────────────────────────────────────────────────────
  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'login@e2e-test.com',
        password: 'Test1234!',
        firstName: 'Test',
        lastName: 'User',
      });
    });

    it('should login successfully and set JWT cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'login@e2e-test.com', password: 'Test1234!' });

      expect(res.status).toBe(201);
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('access_token');
    });

    it('should return 401 with wrong password', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'login@e2e-test.com', password: 'WrongPassword!' });

      expect(res.status).toBe(401);
    });

    it('should return 401 with unknown email', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'unknown@e2e-test.com', password: 'Test1234!' });

      expect(res.status).toBe(401);
    });
  });

  // ── GET /auth/me ─────────────────────────────────────────────────────────
  describe('GET /auth/me', () => {
    it('should return user info with valid JWT cookie', async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'me@e2e-test.com',
        password: 'Test1234!',
        firstName: 'Test',
        lastName: 'User',
      });

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'me@e2e-test.com', password: 'Test1234!' });

      const cookie = loginRes.headers['set-cookie'] as unknown as string[];

      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', cookie);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('me@e2e-test.com');
      expect(res.body).not.toHaveProperty('passwordHash');
    });
  });
});
