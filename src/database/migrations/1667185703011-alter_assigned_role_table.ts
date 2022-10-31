import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterAssignedRoleTable1667185703011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE assigned_role DROP CONSTRAINT "FK_ccb27e21e98c6d84dd5ee45a335"`,
    );
    await queryRunner.query(
      `ALTER TABLE assigned_role ADD CONSTRAINT "FK_ccb27e21e98c6d84dd5ee45a335" FOREIGN KEY (user_id) REFERENCES "user" ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE assigned_role DROP CONSTRAINT "FK_ccb27e21e98c6d84dd5ee45a335"`,
    );
    await queryRunner.query(
      `ALTER TABLE assigned_role ADD CONSTRAINT "FK_ccb27e21e98c6d84dd5ee45a335" FOREIGN KEY (user_id) REFERENCES "user"`,
    );
  }
}
