# Diving O Club — Backend

REST API for **Diving O Club**, a multi-tenant management application for FFESSM
diving clubs (memberships, events, registrations, medical certificates and
payments).

## Tech stack

- **NestJS** (TypeScript) — modular HTTP API
- **PostgreSQL** + **TypeORM** — relational domain data, managed by migrations
- **MongoDB** + **Mongoose** — audit logs (auth / membership / error), 30-day TTL
- **Passport JWT** — authentication via a JWT stored in an HttpOnly cookie
- **argon2** — password hashing

## Architecture

Each domain is a NestJS module (entity + DTOs + service + controller):

| Module | Responsibility |
|---|---|
| `auth` | Registration, login/logout (JWT cookie), self profile/password |
| `membership` | Join requests, status, admin review; member role/expulsion (`members`) |
| `event` | Club events + registrations with a FIFO waitlist |
| `club` | Public club lookup (by slug) and search |
| `log` | Cross-cutting audit logging to MongoDB (exported `LogService`) |

Standalone entities (reference / data tables): `user`, `role`, `certificate`,
`payment`.

Authorization is **club-scoped**: actions are checked against the caller's
active membership and role (`admin`, `super_admin`, `instructor`, `committee`,
`member`) in the relevant club. `code_role` values are the stable technical
identifiers; the French display labels live on the front-end.

## Getting started

```bash
npm install
```

Create a `.env` (see `.env.example`). Key variables:

| Variable | Purpose |
|---|---|
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | PostgreSQL connection |
| `DB_ENABLED` | Set to `true` to wire the database and run migrations on boot |
| `MONGO_URL` | MongoDB connection for audit logs |
| `JWT_SECRET` | Secret used to sign the JWT |
| `SEED_PASSWORD` | Password set on all seeded demo accounts (required to seed) |

Run the API:

```bash
npm run start:dev      # watch mode
npm run start:prod     # compiled (node dist/main)
```

## Database

The schema lives in a single squashed migration. With `DB_ENABLED=true`,
migrations run automatically on application boot.

```bash
npm run migration:run    # apply migrations (also runs automatically on boot)
npm run seed             # populate demo data — requires SEED_PASSWORD
```

> The migration creates the schema and therefore only runs on an **empty**
> database. To rebuild from scratch, reset the schema first
> (`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`) so the migrations
> tracking table is cleared, then run the migration + seed.

## Documentation

| Doc | Command | URL |
|---|---|---|
| **Swagger** (REST API) | `npm run start:dev` | `http://localhost:3001/docs` (local development only) |
| **Compodoc** (architecture) | `npm run doc:serve` | `http://localhost:8080` |

Swagger is exposed in **local development only**; it is disabled on staging and
production (which set `NODE_ENV` explicitly) so the API map is never published.

## Testing

```bash
npm run test           # unit tests (Jest, mocked repositories)
npm run test:e2e       # end-to-end tests (Supertest, real test database)
npm run test:cov       # coverage
```

## Useful scripts

| Script | Description |
|---|---|
| `start:dev` | Run the API in watch mode |
| `build` | Compile to `dist/` |
| `lint` | ESLint (with `--fix`) |
| `migration:run` / `migration:revert` | Apply / revert migrations |
| `seed` | Insert demo data (needs `SEED_PASSWORD`) |
| `doc:serve` / `doc:build` | Generate the Compodoc architecture docs |
