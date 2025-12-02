-- CreateTable
CREATE TABLE "topico" (
    "id_topico" SERIAL NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "id_persona" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topico_pkey" PRIMARY KEY ("id_topico")
);

-- CreateTable
CREATE TABLE "recurso" (
    "id_recurso" SERIAL NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "tipo" VARCHAR(50) NOT NULL,
    "url_archivo" TEXT,
    "nombreArchivo" VARCHAR(255),
    "tamanioArchivo" INTEGER,
    "id_topico" INTEGER NOT NULL,
    "tieneTranscripcion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurso_pkey" PRIMARY KEY ("id_recurso")
);

-- AddForeignKey
ALTER TABLE "topico" ADD CONSTRAINT "topico_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurso" ADD CONSTRAINT "recurso_id_topico_fkey" FOREIGN KEY ("id_topico") REFERENCES "topico"("id_topico") ON DELETE CASCADE ON UPDATE CASCADE;
