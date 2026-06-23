import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Single squashed schema migration.
 *
 * Replaces the previous chain of migrations after the Merise-driven schema
 * redesign. Creates the PostgreSQL ENUM types, then the 8 tables in FK
 * dependency order. ENUM type names follow TypeORM's convention
 * ("<table>_<column>_enum") so future `migration:generate` stays quiet.
 */
export class CreateSchema1774937030375 implements MigrationInterface {
  name = 'CreateSchema1774937030375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── ENUM TYPES ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "users_diving_level_enum" AS ENUM (
        'BRONZE', 'ARGENT', 'OR_12', 'OR_20',
        'PE_12', 'N1', 'PA_12', 'PA_20', 'PE_40', 'N2', 'PE_60', 'PA_40', 'N3'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "users_instructor_level_enum" AS ENUM (
        'N4', 'E1', 'E2', 'MF1', 'MF2', 'N5'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "clubs_structure_type_enum" AS ENUM (
        'club', 'departmental', 'regional', 'national'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "clubs_status_enum" AS ENUM ('pending', 'active', 'archived')
    `);
    await queryRunner.query(`
      CREATE TYPE "events_event_type_enum" AS ENUM (
        'dive_trip', 'training', 'meeting', 'initiation',
        'competition', 'pool_session', 'exam', 'social', 'other'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "events_minimum_level_enum" AS ENUM (
        'PE_12', 'PE_20', 'PE_40', 'PE_60', 'N1', 'N2', 'N3', 'N4', 'N5',
        'initiateur', 'MF1', 'MF2', 'BEES1', 'BEES2', 'all'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "events_status_enum" AS ENUM ('active', 'cancelled', 'archived')
    `);
    await queryRunner.query(`
      CREATE TYPE "memberships_status_enum" AS ENUM (
        'pending', 'active', 'suspended', 'archived'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "registrations_status_enum" AS ENUM (
        'registered', 'cancelled', 'waitlist'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "certificates_status_enum" AS ENUM (
        'pending', 'validated', 'refused'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "payments_status_enum" AS ENUM ('pending', 'validated', 'failed')
    `);

    // ── ROLES ─────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id_role"   SERIAL PRIMARY KEY,
        "code_role" VARCHAR(30) NOT NULL UNIQUE
      )
    `);

    // ── USERS ─────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id_user"               SERIAL PRIMARY KEY,
        "email"                 VARCHAR(255) NOT NULL UNIQUE,
        "password_hash"         VARCHAR(255) NOT NULL,
        "last_name"             VARCHAR(100) NOT NULL,
        "first_name"            VARCHAR(100) NOT NULL,
        "birth_date"            DATE,
        "phone"                 VARCHAR(20),
        "street"                VARCHAR(255),
        "postal_code"           VARCHAR(10),
        "city"                  VARCHAR(100),
        "diving_level"          "users_diving_level_enum",
        "instructor_level"      "users_instructor_level_enum",
        "ffessm_license_number" VARCHAR(12) UNIQUE,
        "profile_picture_url"   VARCHAR(255),
        "created_at"            TIMESTAMP NOT NULL DEFAULT NOW(),
        "deleted_at"            TIMESTAMP
      )
    `);

    // ── CLUBS ─────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "clubs" (
        "id_club"        SERIAL PRIMARY KEY,
        "name"           VARCHAR(150) NOT NULL,
        "slug"           VARCHAR(100) NOT NULL UNIQUE,
        "description"    TEXT,
        "email_contact"  VARCHAR(255) NOT NULL,
        "street"         VARCHAR(255),
        "postal_code"    VARCHAR(10),
        "city"           VARCHAR(100),
        "structure_type" "clubs_structure_type_enum" NOT NULL DEFAULT 'club',
        "status"         "clubs_status_enum"         NOT NULL DEFAULT 'pending',
        "created_at"     TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // ── CERTIFICATES ──────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "certificates" (
        "id_certificate"  SERIAL PRIMARY KEY,
        "id_user"         INT NOT NULL REFERENCES "users"("id_user") ON DELETE CASCADE,
        "file"            VARCHAR(255) NOT NULL,
        "deposit_at"      TIMESTAMP NOT NULL DEFAULT NOW(),
        "issue_date"      DATE NOT NULL,
        "expiration_date" DATE NOT NULL,
        "status"          "certificates_status_enum" NOT NULL DEFAULT 'pending'
      )
    `);

    // ── MEMBERSHIPS ───────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "memberships" (
        "id_membership" SERIAL PRIMARY KEY,
        "id_user"       INT NOT NULL REFERENCES "users"("id_user") ON DELETE RESTRICT,
        "id_club"       INT NOT NULL REFERENCES "clubs"("id_club") ON DELETE RESTRICT,
        "id_role"       INT NOT NULL REFERENCES "roles"("id_role") ON DELETE RESTRICT,
        "season"        VARCHAR(9) NOT NULL,
        "membership_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "decision_at"   TIMESTAMP,
        "status"        "memberships_status_enum" NOT NULL DEFAULT 'pending',
        UNIQUE ("id_user", "id_club", "season")
      )
    `);

    // ── EVENTS ────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "events" (
        "id_event"      SERIAL PRIMARY KEY,
        "id_club"       INT NOT NULL REFERENCES "clubs"("id_club") ON DELETE RESTRICT,
        "id_creator"    INT NOT NULL REFERENCES "users"("id_user") ON DELETE RESTRICT,
        "title"         VARCHAR(150) NOT NULL,
        "description"   TEXT,
        "event_type"    "events_event_type_enum"    NOT NULL DEFAULT 'other',
        "start_at"      TIMESTAMP NOT NULL,
        "end_at"        TIMESTAMP,
        "location"      VARCHAR(150),
        "minimum_level" "events_minimum_level_enum" NOT NULL DEFAULT 'all',
        "max_capacity"  INT,
        "is_paid"       BOOLEAN NOT NULL DEFAULT FALSE,
        "price"         NUMERIC(10,2),
        "status"        "events_status_enum"        NOT NULL DEFAULT 'active',
        "cancel_reason" TEXT,
        "created_at"    TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // ── REGISTRATIONS ─────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "registrations" (
        "id_registration" SERIAL PRIMARY KEY,
        "id_user"         INT NOT NULL REFERENCES "users"("id_user") ON DELETE RESTRICT,
        "id_event"        INT NOT NULL REFERENCES "events"("id_event") ON DELETE RESTRICT,
        "registration_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "status"          "registrations_status_enum" NOT NULL DEFAULT 'registered',
        UNIQUE ("id_user", "id_event")
      )
    `);

    // ── PAYMENTS ──────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id_payment"  SERIAL PRIMARY KEY,
        "id_user"     INT NOT NULL REFERENCES "users"("id_user") ON DELETE RESTRICT,
        "id_event"    INT NOT NULL REFERENCES "events"("id_event") ON DELETE RESTRICT,
        "reference"   VARCHAR(255) NOT NULL UNIQUE,
        "amount"      NUMERIC(10,2) NOT NULL,
        "status"      "payments_status_enum" NOT NULL DEFAULT 'pending',
        "payment_at"  TIMESTAMP
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse FK dependency order.
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "registrations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "events"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "memberships"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "certificates"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "clubs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);

    // Drop ENUM types.
    await queryRunner.query(`DROP TYPE IF EXISTS "payments_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "certificates_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "registrations_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "memberships_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "events_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "events_minimum_level_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "events_event_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "clubs_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "clubs_structure_type_enum"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "users_instructor_level_enum"`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS "users_diving_level_enum"`);
  }
}
