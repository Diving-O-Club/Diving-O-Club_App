import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlugToClub1774993648885 implements MigrationInterface {
    name = 'AddSlugToClub1774993648885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "event_id_club_fkey"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "event_id_creator_fkey"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "membership_id_user_fkey"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "membership_id_club_fkey"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "membership_id_role_fkey"`);
        await queryRunner.query(`ALTER TABLE "club" DROP CONSTRAINT "club_club_status_check"`);
        await queryRunner.query(`ALTER TABLE "club" DROP CONSTRAINT "club_structure_type_check"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "event_event_type_check"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "event_minimum_level_check"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "event_status_check"`);
        await queryRunner.query(`ALTER TABLE "app_user" DROP CONSTRAINT "app_user_technical_level_check"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "membership_status_check"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "membership_id_user_id_club_season_key"`);
        await queryRunner.query(`ALTER TABLE "club" ADD "slug" character varying(100)`);
        await queryRunner.query(`UPDATE "club" SET "slug" = LOWER(REPLACE(name, ' ', '-')) WHERE "slug" IS NULL`);
        await queryRunner.query(`ALTER TABLE "club" ALTER COLUMN "slug" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "club" ADD CONSTRAINT "UQ_f8387c04fc077b826b2ad11825e" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "club" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "id_club" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "id_creator" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "membership_date" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "id_user" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "id_club" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "id_role" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "UQ_0ff87c46a76c7108ffc54a9d2dc" UNIQUE ("id_user", "id_club", "season")`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_e3ec3fb9f387aa6645fbe60dd9c" FOREIGN KEY ("id_club") REFERENCES "club"("id_club") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_ed500b613c1cdddc625a528fc70" FOREIGN KEY ("id_creator") REFERENCES "app_user"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_b8500fb2dd94bbb537414f956c6" FOREIGN KEY ("id_user") REFERENCES "app_user"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_7713257a843a3f1f6b18f608bd9" FOREIGN KEY ("id_club") REFERENCES "club"("id_club") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_ad291cb5222f0eb22a643d0f1a4" FOREIGN KEY ("id_role") REFERENCES "role"("id_role") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_ad291cb5222f0eb22a643d0f1a4"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_7713257a843a3f1f6b18f608bd9"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_b8500fb2dd94bbb537414f956c6"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_ed500b613c1cdddc625a528fc70"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_e3ec3fb9f387aa6645fbe60dd9c"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "UQ_0ff87c46a76c7108ffc54a9d2dc"`);
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "id_role" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "id_club" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "id_user" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "membership" ALTER COLUMN "membership_date" SET DEFAULT CURRENT_DATE`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "id_creator" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "id_club" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "club" ALTER COLUMN "created_at" SET DEFAULT CURRENT_DATE`);
        await queryRunner.query(`ALTER TABLE "club" DROP CONSTRAINT "UQ_f8387c04fc077b826b2ad11825e"`);
        await queryRunner.query(`ALTER TABLE "club" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "membership_id_user_id_club_season_key" UNIQUE ("id_user", "id_club", "season")`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "membership_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'active'::character varying, 'suspended'::character varying, 'archived'::character varying])::text[])))`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD CONSTRAINT "app_user_technical_level_check" CHECK (((technical_level)::text = ANY ((ARRAY['PE12'::character varying, 'PE20'::character varying, 'PE40'::character varying, 'PE60'::character varying, 'N1'::character varying, 'N2'::character varying, 'N3'::character varying, 'N4'::character varying, 'MF1'::character varying, 'MF2'::character varying, 'BEES1'::character varying, 'BEES2'::character varying, 'initiateur'::character varying])::text[])))`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "event_status_check" CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'cancelled'::character varying, 'archived'::character varying])::text[])))`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "event_minimum_level_check" CHECK (((minimum_level)::text = ANY ((ARRAY['PE12'::character varying, 'PE20'::character varying, 'PE40'::character varying, 'PE60'::character varying, 'N1'::character varying, 'N2'::character varying, 'N3'::character varying, 'N4'::character varying, 'MF1'::character varying, 'MF2'::character varying, 'BEES1'::character varying, 'BEES2'::character varying, 'initiateur'::character varying, 'all'::character varying])::text[])))`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "event_event_type_check" CHECK (((event_type)::text = ANY ((ARRAY['dive_trip'::character varying, 'training'::character varying, 'meeting'::character varying, 'initiation'::character varying, 'competition'::character varying, 'pool_session'::character varying, 'exam'::character varying, 'social'::character varying, 'other'::character varying])::text[])))`);
        await queryRunner.query(`ALTER TABLE "club" ADD CONSTRAINT "club_structure_type_check" CHECK (((structure_type)::text = ANY ((ARRAY['club'::character varying, 'departmental'::character varying, 'regional'::character varying, 'national'::character varying])::text[])))`);
        await queryRunner.query(`ALTER TABLE "club" ADD CONSTRAINT "club_club_status_check" CHECK (((club_status)::text = ANY ((ARRAY['pending'::character varying, 'active'::character varying, 'archived'::character varying])::text[])))`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "membership_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "role"("id_role") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "membership_id_club_fkey" FOREIGN KEY ("id_club") REFERENCES "club"("id_club") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "membership_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "app_user"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "event_id_creator_fkey" FOREIGN KEY ("id_creator") REFERENCES "app_user"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "event_id_club_fkey" FOREIGN KEY ("id_club") REFERENCES "club"("id_club") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
