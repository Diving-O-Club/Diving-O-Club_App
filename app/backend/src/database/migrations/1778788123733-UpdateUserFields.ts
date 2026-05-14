import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserFields1778788123733 implements MigrationInterface {
    name = 'UpdateUserFields1778788123733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "technical_level"`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD "address" character varying(255)`);
        await queryRunner.query(`CREATE TYPE "public"."app_user_diving_level_enum" AS ENUM('BRONZE', 'ARGENT', 'OR_12', 'OR_20', 'PE_12', 'N1', 'PA_12', 'PA_20', 'PE_40', 'N2', 'PE_60', 'PA_40', 'N3')`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD "diving_level" "public"."app_user_diving_level_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."app_user_instructor_level_enum" AS ENUM('N4', 'E1', 'E2', 'MF1', 'MF2', 'N5')`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD "instructor_level" "public"."app_user_instructor_level_enum"`);
        await queryRunner.query(`ALTER TABLE "app_user" DROP CONSTRAINT "app_user_ffessm_license_number_key"`);
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "ffessm_license_number"`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD "ffessm_license_number" character varying(12)`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD CONSTRAINT "UQ_5f5f67dd8c307a2cac2baad616c" UNIQUE ("ffessm_license_number")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" DROP CONSTRAINT "UQ_5f5f67dd8c307a2cac2baad616c"`);
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "ffessm_license_number"`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD "ffessm_license_number" character varying(30)`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD CONSTRAINT "app_user_ffessm_license_number_key" UNIQUE ("ffessm_license_number")`);
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "instructor_level"`);
        await queryRunner.query(`DROP TYPE "public"."app_user_instructor_level_enum"`);
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "diving_level"`);
        await queryRunner.query(`DROP TYPE "public"."app_user_diving_level_enum"`);
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD "technical_level" character varying(50)`);
    }

}
