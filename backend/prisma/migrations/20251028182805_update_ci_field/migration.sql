/*
  Warnings:

  - A unique constraint covering the columns `[ci]` on the table `persona` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "persona" ADD COLUMN     "ci" VARCHAR(100),
ADD COLUMN     "telefono" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "persona_ci_key" ON "persona"("ci");
