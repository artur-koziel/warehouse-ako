import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1720000000000 implements MigrationInterface {
  name = 'Initial1720000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(
      `CREATE TYPE "public"."products_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`
    );
    await queryRunner.query(`CREATE TABLE "products" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "deletedAt" TIMESTAMPTZ,
      "sku" character varying(64) NOT NULL,
      "name" character varying(255) NOT NULL,
      "description" text,
      "price" numeric(12,2) NOT NULL DEFAULT '0',
      "currency" character varying(3) NOT NULL DEFAULT 'PLN',
      "quantity" integer NOT NULL DEFAULT 0,
      "status" "public"."products_status_enum" NOT NULL DEFAULT 'ACTIVE',
      CONSTRAINT "PK_products_id" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_products_sku" UNIQUE ("sku")
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_products_sku" ON "products" ("sku")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
  }
}
