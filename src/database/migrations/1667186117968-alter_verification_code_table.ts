import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterVerificationCodeTable1667186117968
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE verification_code DROP CONSTRAINT "FK_20dc9f8d86616620881be140833"`,
    );
    await queryRunner.query(
      `ALTER TABLE verification_code ADD CONSTRAINT "FK_20dc9f8d86616620881be140833" FOREIGN KEY (user_id) REFERENCES "user" ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE verification_code DROP CONSTRAINT "FK_20dc9f8d86616620881be140833"`,
    );
    await queryRunner.query(
      `ALTER TABLE verification_code ADD CONSTRAINT "FK_20dc9f8d86616620881be140833" FOREIGN KEY (user_id) REFERENCES "user" ON DELETE NO ACTION`,
    );
  }
}
