/*
  Warnings:

  - You are about to drop the column `ci` on the `persona` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."persona_ci_key";

-- AlterTable
ALTER TABLE "persona" DROP COLUMN "ci";
