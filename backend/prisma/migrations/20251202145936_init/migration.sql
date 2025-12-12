-- CreateTable
CREATE TABLE "persona" (
    "id_persona" SERIAL NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(100),
    "password" VARCHAR(100),

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id_persona")
);

-- CreateTable
CREATE TABLE "privilegio_usuario" (
    "id_rol" SERIAL NOT NULL,
    "nombre_privilegio" VARCHAR(100) NOT NULL,

    CONSTRAINT "privilegio_usuario_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "_PersonaRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PersonaRoles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "persona_correo_key" ON "persona"("correo");

-- CreateIndex
CREATE INDEX "_PersonaRoles_B_index" ON "_PersonaRoles"("B");

-- AddForeignKey
ALTER TABLE "_PersonaRoles" ADD CONSTRAINT "_PersonaRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "persona"("id_persona") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonaRoles" ADD CONSTRAINT "_PersonaRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "privilegio_usuario"("id_rol") ON DELETE CASCADE ON UPDATE CASCADE;
