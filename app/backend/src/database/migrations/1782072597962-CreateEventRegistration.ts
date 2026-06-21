import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventRegistration1782072597962
  implements MigrationInterface
{
  name = 'CreateEventRegistration1782072597962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "event_registration" (
        "id_registration" SERIAL NOT NULL,
        "status" character varying(20) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "id_event" integer,
        "id_user" integer,
        CONSTRAINT "UQ_event_registration_event_user" UNIQUE ("id_event", "id_user"),
        CONSTRAINT "PK_event_registration" PRIMARY KEY ("id_registration")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "event_registration"
      ADD CONSTRAINT "FK_event_registration_event"
      FOREIGN KEY ("id_event") REFERENCES "event"("id_event")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "event_registration"
      ADD CONSTRAINT "FK_event_registration_user"
      FOREIGN KEY ("id_user") REFERENCES "app_user"("id_user")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_registration" DROP CONSTRAINT "FK_event_registration_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_registration" DROP CONSTRAINT "FK_event_registration_event"`,
    );
    await queryRunner.query(`DROP TABLE "event_registration"`);
  }
}
