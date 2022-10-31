import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeDeleteAtColumn1667203636264 implements MigrationInterface {
  name = 'removeDeleteAtColumn1667203636264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verification_code" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "assigned_role" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(`ALTER TABLE "api_key" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP COLUMN "deleted_at"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "company" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "role" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "api_key" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "assigned_role" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "verification_code" ADD "deleted_at" TIMESTAMP`,
    );
  }
}
