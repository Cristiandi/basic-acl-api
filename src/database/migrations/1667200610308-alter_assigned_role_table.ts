import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterAssignedRoleTable1667200610308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE assigned_role DROP CONSTRAINT uk_assigned_role`,
    );
    await queryRunner.query(
      `ALTER TABLE assigned_role ADD CONSTRAINT uk_assigned_role UNIQUE (role_id, user_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE assigned_role DROP CONSTRAINT uk_assigned_role`,
    );
    await queryRunner.query(
      `ALTER TABLE assigned_role ADD CONSTRAINT uk_assigned_role UNIQUE (role_id, user_id, deleted_at)`,
    );
  }
}
