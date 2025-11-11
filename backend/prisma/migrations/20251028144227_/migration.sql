/*
  Warnings:

  - You are about to drop the `rol_usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."privilegio_usuario" DROP CONSTRAINT "privilegio_usuario_id_rol_fkey";

-- DropForeignKey
ALTER TABLE "public"."rol_usuario" DROP CONSTRAINT "rol_usuario_id_persona_fkey";

-- DropTable
DROP TABLE "public"."rol_usuario";

-- CreateTable
CREATE TABLE "_PersonaRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PersonaRoles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PersonaRoles_B_index" ON "_PersonaRoles"("B");

-- AddForeignKey
ALTER TABLE "_PersonaRoles" ADD CONSTRAINT "_PersonaRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "persona"("id_persona") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonaRoles" ADD CONSTRAINT "_PersonaRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "privilegio_usuario"("id_rol") ON DELETE CASCADE ON UPDATE CASCADE;
