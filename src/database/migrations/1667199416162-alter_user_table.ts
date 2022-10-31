import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterUserTable1667199416162 implements MigrationInterface {
  name = 'alterUserTable1667199416162';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "uk_user_auth_uid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_33782a29fb9eb54429bc986061c" UNIQUE ("auth_uid")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_33782a29fb9eb54429bc986061c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "uk_user_auth_uid" UNIQUE ("auth_uid", "deleted_at")`,
    );
  }
}
