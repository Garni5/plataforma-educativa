/*
  Warnings:

  - A unique constraint covering the columns `[ci]` on the table `persona` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[correo]` on the table `persona` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "persona_ci_key" ON "persona"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "persona_correo_key" ON "persona"("correo");
