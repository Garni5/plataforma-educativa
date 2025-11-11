-- AlterTable
CREATE SEQUENCE privilegio_usuario_id_rol_seq;
ALTER TABLE "privilegio_usuario" ALTER COLUMN "id_rol" SET DEFAULT nextval('privilegio_usuario_id_rol_seq');
ALTER SEQUENCE privilegio_usuario_id_rol_seq OWNED BY "privilegio_usuario"."id_rol";
