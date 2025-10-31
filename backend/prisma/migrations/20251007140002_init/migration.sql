-- CreateTable
CREATE TABLE "persona" (
    "id_persona" SERIAL NOT NULL,
    "ci" VARCHAR(100) NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(100),
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id_persona")
);

-- CreateTable
CREATE TABLE "rol_usuario" (
    "id_rol" SERIAL NOT NULL,
    "id_persona" INTEGER NOT NULL,

    CONSTRAINT "rol_usuario_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "privilegio_usuario" (
    "id_rol" INTEGER NOT NULL,
    "nombre_privilegio" VARCHAR(100) NOT NULL,

    CONSTRAINT "privilegio_usuario_pkey" PRIMARY KEY ("id_rol")
);

-- AddForeignKey
ALTER TABLE "rol_usuario" ADD CONSTRAINT "rol_usuario_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privilegio_usuario" ADD CONSTRAINT "privilegio_usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol_usuario"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;
