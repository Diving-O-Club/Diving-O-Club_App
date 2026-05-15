import { MigrationInterface, QueryRunner } from "typeorm";

export class SplitAddressFields1778860708767 implements MigrationInterface {
    name = 'SplitAddressFields1778860708767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD "street" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD "postal_code" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD "city" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "postal_code"`);
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "street"`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD "address" character varying(255)`);
    }

}
