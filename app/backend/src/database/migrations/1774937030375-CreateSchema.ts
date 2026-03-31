import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchema1774937030375 implements MigrationInterface {
  name = 'CreateSchema1774937030375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── ROLE ──────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "role" (
        "id_role"    SERIAL PRIMARY KEY,
        "code_role"  VARCHAR(30)  NOT NULL UNIQUE,
        "label_role" VARCHAR(100) NOT NULL
      )
    `);

    // ── CLUB ──────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "club" (
        "id_club"        SERIAL PRIMARY KEY,
        "name"           VARCHAR(150) NOT NULL,
        "description"    TEXT,
        "email_contact"  VARCHAR(255) NOT NULL,
        "address"        VARCHAR(255),
        "postal_code"    VARCHAR(10),
        "city"           VARCHAR(100) NOT NULL,
        "club_status"    VARCHAR(20)  NOT NULL DEFAULT 'pending'
                         CHECK (club_status IN ('pending', 'active', 'archived')),
        "structure_type" VARCHAR(20)  NOT NULL DEFAULT 'club'
                         CHECK (structure_type IN ('club', 'departmental', 'regional', 'national')),
        "created_at"     DATE         NOT NULL DEFAULT CURRENT_DATE
      )
    `);

    // ── APP_USER ──────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "app_user" (
        "id_user"               SERIAL PRIMARY KEY,
        "email"                 VARCHAR(255) NOT NULL UNIQUE,
        "password_hash"         VARCHAR(255) NOT NULL,
        "last_name"             VARCHAR(100) NOT NULL,
        "first_name"            VARCHAR(100) NOT NULL,
        "birth_date"            DATE         NOT NULL,
        "ffessm_license_number" VARCHAR(30)  UNIQUE,
        "technical_level"       VARCHAR(50)
                                CHECK (technical_level IN (
                                    'PE12', 'PE20', 'PE40', 'PE60',
                                    'N1', 'N2', 'N3', 'N4',
                                    'MF1', 'MF2',
                                    'BEES1', 'BEES2',
                                    'initiateur'
                                )),
        "phone"                 VARCHAR(20),
        "profile_picture_url"   VARCHAR(255),
        "created_at"            TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `);

    // ── MEMBERSHIP ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "membership" (
        "id_membership"   SERIAL PRIMARY KEY,
        "id_user"         INT         NOT NULL REFERENCES app_user(id_user),
        "id_club"         INT         NOT NULL REFERENCES club(id_club),
        "id_role"         INT         NOT NULL REFERENCES role(id_role),
        "season"          VARCHAR(9)  NOT NULL,
        "membership_date" DATE        NOT NULL DEFAULT CURRENT_DATE,
        "decision_date"   DATE,
        "status"          VARCHAR(20) NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'active', 'suspended', 'archived')),
        UNIQUE (id_user, id_club, season)
      )
    `);

    // ── EVENT ─────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "event" (
        "id_event"       SERIAL PRIMARY KEY,
        "id_club"        INT          NOT NULL REFERENCES club(id_club),
        "id_creator"     INT          NOT NULL REFERENCES app_user(id_user),
        "title"          VARCHAR(150) NOT NULL,
        "description"    TEXT,
        "event_type"     VARCHAR(50)  NOT NULL
                         CHECK (event_type IN (
                             'dive_trip', 'training', 'meeting', 'initiation',
                             'competition', 'pool_session', 'exam', 'social', 'other'
                         )),
        "start_datetime" TIMESTAMP    NOT NULL,
        "end_datetime"   TIMESTAMP    NOT NULL,
        "location"       VARCHAR(150),
        "minimum_level"  VARCHAR(50)
                         CHECK (minimum_level IN (
                             'PE12', 'PE20', 'PE40', 'PE60',
                             'N1', 'N2', 'N3', 'N4',
                             'MF1', 'MF2', 'BEES1', 'BEES2',
                             'initiateur', 'all'
                         )),
        "max_capacity"   INT,
        "is_paid"        BOOLEAN      NOT NULL DEFAULT FALSE,
        "price"          NUMERIC(10,2),
        "status"         VARCHAR(20)  NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'cancelled', 'archived')),
        "cancel_reason"  TEXT,
        "created_at"     TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order to respect foreign key constraints
    await queryRunner.query(`DROP TABLE IF EXISTS "event"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "membership"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "app_user"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "club"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role"`);
  }
}
