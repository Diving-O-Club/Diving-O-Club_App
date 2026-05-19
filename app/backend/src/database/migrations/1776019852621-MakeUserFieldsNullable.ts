import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUserFieldsNullable1776019852621 implements MigrationInterface {
  name = 'MakeUserFieldsNullable1776019852621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app_user" ALTER COLUMN "birth_date" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app_user" ALTER COLUMN "birth_date" SET NOT NULL`,
    );
  }
}
