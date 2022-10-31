import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1667185075392 implements MigrationInterface {
  name = 'initial1667185075392';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "allowed" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role_id" integer, "api_key_id" integer, CONSTRAINT "uk_permission" UNIQUE ("role_id", "api_key_id", "name"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "api_key" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying(16) NOT NULL, "alias" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "company_id" integer NOT NULL, CONSTRAINT "uk_api_key" UNIQUE ("value", "company_id"), CONSTRAINT "uk_api_key_uid" UNIQUE ("uid"), CONSTRAINT "PK_b1bd840641b8acbaad89c3d8d11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."verification_code_type_enum" AS ENUM('CONFIRM_EMAIL', 'RESET_PASSWORD')`,
    );
    await queryRunner.query(
      `CREATE TABLE "verification_code" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."verification_code_type_enum" NOT NULL DEFAULT 'CONFIRM_EMAIL', "code" character varying(20) NOT NULL, "expiration_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, CONSTRAINT "uk_verification_code_uid" UNIQUE ("uid"), CONSTRAINT "PK_d702c086da466e5d25974512d46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "auth_uid" character varying(100) NOT NULL, "email" character varying(100), "phone" character varying(13), "is_super_admin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "company_id" integer NOT NULL, CONSTRAINT "uk_user_auth_uid" UNIQUE ("auth_uid", "deleted_at"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "access_key" character varying(100) NOT NULL, "firebase_admin_config" json NOT NULL, "firebase_config" json NOT NULL, "website" character varying(160), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "uk_company_name" UNIQUE ("name"), CONSTRAINT "uk_company_access_key" UNIQUE ("access_key"), CONSTRAINT "uk_company_uid" UNIQUE ("uid"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(5) NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(160), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "company_id" integer NOT NULL, CONSTRAINT "uk_role" UNIQUE ("code", "company_id"), CONSTRAINT "uk_role_uid" UNIQUE ("uid"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assigned_role" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "role_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "uk_assigned_role" UNIQUE ("role_id", "user_id", "deleted_at"), CONSTRAINT "PK_e91ebdf42627e49535c5b915d72" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."email_template_type_enum" AS ENUM('WELCOME_EMAIL', 'CONFIRMATION_EMAIL', 'RESET_PASSWORD_EMAIL', 'PASSWORD_UPDATED_EMAIL', 'SUPER_ADMIN_CONFIRMATION_EMAIL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_template" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."email_template_type_enum" NOT NULL DEFAULT 'WELCOME_EMAIL', "file" bytea, "subject" character varying(160), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "company_id" integer, CONSTRAINT "uk_email_template" UNIQUE ("type", "company_id"), CONSTRAINT "uk_email_template_uid" UNIQUE ("uid"), CONSTRAINT "PK_c90815fd4ca9119f19462207710" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_383892d758d08d346f837d3d8b7" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_56ca38cd429053c5183744151f4" FOREIGN KEY ("api_key_id") REFERENCES "api_key"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key" ADD CONSTRAINT "FK_8a25938b0dcb626a75b68e5bee9" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_code" ADD CONSTRAINT "FK_20dc9f8d86616620881be140833" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9e70b5f9d7095018e86970c7874" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_6c1faaaceb897cf61c5c91dcebf" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigned_role" ADD CONSTRAINT "FK_38bf542d6283e1d17af5a8c62e4" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigned_role" ADD CONSTRAINT "FK_ccb27e21e98c6d84dd5ee45a335" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD CONSTRAINT "FK_8b5c91af2cc918c4cafa82fbafe" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "FK_8b5c91af2cc918c4cafa82fbafe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigned_role" DROP CONSTRAINT "FK_ccb27e21e98c6d84dd5ee45a335"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigned_role" DROP CONSTRAINT "FK_38bf542d6283e1d17af5a8c62e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "FK_6c1faaaceb897cf61c5c91dcebf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9e70b5f9d7095018e86970c7874"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_code" DROP CONSTRAINT "FK_20dc9f8d86616620881be140833"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key" DROP CONSTRAINT "FK_8a25938b0dcb626a75b68e5bee9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_56ca38cd429053c5183744151f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_383892d758d08d346f837d3d8b7"`,
    );
    await queryRunner.query(`DROP TABLE "email_template"`);
    await queryRunner.query(`DROP TYPE "public"."email_template_type_enum"`);
    await queryRunner.query(`DROP TABLE "assigned_role"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "verification_code"`);
    await queryRunner.query(`DROP TYPE "public"."verification_code_type_enum"`);
    await queryRunner.query(`DROP TABLE "api_key"`);
    await queryRunner.query(`DROP TABLE "permission"`);
  }
}
